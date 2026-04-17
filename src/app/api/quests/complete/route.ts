import { NextResponse } from "next/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import { getNextDailyQuestStreak } from "@/lib/streaks/daily-quest-streak";
import { getOrCreateTelegramProfile } from "@/lib/telegram/profile-identity";
import { validateTelegramInitData } from "@/lib/telegram/server";
import type { Database } from "@/shared/types/database";
import type { HomeStreakSummary, QuestCompletionResponse } from "@/shared/types/game";
import type { TelegramAuthStatus } from "@/shared/types/telegram";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface CompleteQuestRequestBody {
  initData?: unknown;
  questId?: unknown;
  qualityScore?: unknown;
  note?: unknown;
}

type DailyQuestRow = Database["public"]["Tables"]["daily_quests"]["Row"];
type QuestCompletionRow = Database["public"]["Tables"]["quest_completions"]["Row"];
type StreakRow = Database["public"]["Tables"]["streaks"]["Row"];

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_NOTE_LENGTH = 240;

export async function POST(request: Request) {
  let body: CompleteQuestRequestBody;

  try {
    body = (await request.json()) as CompleteQuestRequestBody;
  } catch {
    return completionResponse("invalid_completion_payload", 400);
  }

  if (typeof body.initData !== "string") {
    return completionResponse("missing_init_data", 400);
  }

  const payload = parseCompletionPayload(body);

  if (!payload) {
    return completionResponse("invalid_completion_payload", 400);
  }

  const validation = validateTelegramInitData(body.initData);

  if (!validation.ok || !validation.user) {
    const validationStatus = validation.status === "valid" ? "invalid_init_data" : validation.status;

    return completionResponse(validationStatus, getHttpStatus(validationStatus), payload.questId);
  }

  const supabase = createServiceRoleSupabaseClient();
  const profileResult = await getOrCreateTelegramProfile(validation.user, supabase);

  if (!profileResult.ok) {
    return completionResponse(profileResult.status, getHttpStatus(profileResult.status), payload.questId);
  }

  if (!supabase) {
    return completionResponse("missing_supabase_config", 503, payload.questId);
  }

  const supabaseClient = supabase;
  const profileId = profileResult.profile.id;
  const questResult = await supabaseClient
    .from("daily_quests")
    .select("id, profile_id, quest_date, title, xp_reward, status")
    .eq("id", payload.questId)
    .eq("profile_id", profileId)
    .maybeSingle();

  if (questResult.error) {
    return completionResponse("quest_not_found", 404, payload.questId);
  }

  if (!questResult.data) {
    return completionResponse("quest_not_found", 404, payload.questId);
  }

  const quest = questResult.data as Pick<
    DailyQuestRow,
    "id" | "profile_id" | "quest_date" | "title" | "xp_reward" | "status"
  >;
  const completionResult = await ensureQuestCompletion({
    profileId,
    quest,
    qualityScore: payload.qualityScore,
    note: payload.note
  });

  if (!completionResult.ok) {
    return completionResponse(completionResult.status, completionResult.httpStatus, payload.questId);
  }

  const xpEventResult = await ensureQuestXpEvent({
    profileId,
    completionId: completionResult.completion.id,
    questTitle: quest.title,
    amount: completionResult.completion.xp_awarded
  });

  if (!xpEventResult.ok) {
    return completionResponse("xp_event_write_failed", 502, payload.questId);
  }

  const profileXp = await syncProfileXp(profileId);

  if (!profileXp.ok) {
    return completionResponse("profile_xp_sync_failed", 502, payload.questId);
  }

  const streakResult = await syncDailyQuestStreak({
    profileId,
    questDate: quest.quest_date
  });

  if (!streakResult.ok) {
    return completionResponse(
      "streak_sync_failed",
      502,
      payload.questId,
      completionResult.alreadyCompleted ? 0 : completionResult.completion.xp_awarded,
      profileXp.totalXp,
      profileXp.level
    );
  }

  return completionResponse(
    completionResult.alreadyCompleted ? "already_completed" : "ready",
    200,
    payload.questId,
    completionResult.alreadyCompleted ? 0 : completionResult.completion.xp_awarded,
    profileXp.totalXp,
    profileXp.level,
    streakResult.streak,
    streakResult.advanced
  );

  async function ensureQuestCompletion({
    profileId,
    quest,
    qualityScore,
    note
  }: {
    profileId: string;
    quest: Pick<DailyQuestRow, "id" | "profile_id" | "title" | "xp_reward" | "status">;
    qualityScore: number | null;
    note: string | null;
  }): Promise<
    | {
        ok: true;
        alreadyCompleted: boolean;
        completion: QuestCompletionRow;
      }
    | {
        ok: false;
        status: "invalid_quest_state" | "completion_write_failed";
        httpStatus: number;
      }
  > {
    const existingCompletion = await supabaseClient
      .from("quest_completions")
      .select("id, quest_id, profile_id, xp_awarded")
      .eq("quest_id", quest.id)
      .eq("profile_id", profileId)
      .maybeSingle();

    if (existingCompletion.error) {
      return {
        ok: false,
        status: "completion_write_failed",
        httpStatus: 502
      };
    }

    if (existingCompletion.data) {
      await supabaseClient
        .from("daily_quests")
        .update({ status: "completed" })
        .eq("id", quest.id)
        .eq("profile_id", profileId);

      return {
        ok: true,
        alreadyCompleted: true,
        completion: existingCompletion.data as QuestCompletionRow
      };
    }

    if (quest.status !== "assigned") {
      return {
        ok: false,
        status: "invalid_quest_state",
        httpStatus: 409
      };
    }

    const insertedCompletion = await supabaseClient
      .from("quest_completions")
      .insert({
        quest_id: quest.id,
        profile_id: profileId,
        quality_score: qualityScore,
        xp_awarded: quest.xp_reward,
        note
      })
      .select("id, quest_id, profile_id, xp_awarded")
      .single();

    if (insertedCompletion.error || !insertedCompletion.data) {
      return {
        ok: false,
        status: "completion_write_failed",
        httpStatus: 502
      };
    }

    const questUpdate = await supabaseClient
      .from("daily_quests")
      .update({ status: "completed" })
      .eq("id", quest.id)
      .eq("profile_id", profileId);

    if (questUpdate.error) {
      return {
        ok: false,
        status: "completion_write_failed",
        httpStatus: 502
      };
    }

    return {
      ok: true,
      alreadyCompleted: false,
      completion: insertedCompletion.data as QuestCompletionRow
    };
  }

  async function ensureQuestXpEvent({
    profileId,
    completionId,
    questTitle,
    amount
  }: {
    profileId: string;
    completionId: string;
    questTitle: string;
    amount: number;
  }) {
    const existingEvent = await supabaseClient
      .from("xp_events")
      .select("id")
      .eq("profile_id", profileId)
      .eq("source_type", "quest_completion")
      .eq("source_id", completionId)
      .maybeSingle();

    if (existingEvent.error) {
      return {
        ok: false
      };
    }

    if (existingEvent.data) {
      return {
        ok: true
      };
    }

    const insertedEvent = await supabaseClient.from("xp_events").insert({
      profile_id: profileId,
      source_type: "quest_completion",
      source_id: completionId,
      amount,
      reason: `Completed quest: ${questTitle}`
    });

    return {
      ok: !insertedEvent.error
    };
  }

  async function syncProfileXp(profileId: string) {
    const events = await supabaseClient.from("xp_events").select("amount").eq("profile_id", profileId);

    if (events.error || !events.data) {
      return {
        ok: false
      } as const;
    }

    const totalXp = events.data.reduce((total, event) => total + event.amount, 0);
    const level = Math.floor(Math.max(0, totalXp) / 100) + 1;
    const profileUpdate = await supabaseClient
      .from("profiles")
      .update({
        total_xp: totalXp,
        level
      })
      .eq("id", profileId)
      .select("total_xp, level")
      .single();

    if (profileUpdate.error || !profileUpdate.data) {
      return {
        ok: false
      } as const;
    }

    return {
      ok: true,
      totalXp: profileUpdate.data.total_xp,
      level: profileUpdate.data.level
    } as const;
  }

  async function syncDailyQuestStreak({
    profileId,
    questDate
  }: {
    profileId: string;
    questDate: string;
  }): Promise<
    | {
        ok: true;
        streak: HomeStreakSummary | null;
        advanced: boolean;
      }
    | {
        ok: false;
      }
  > {
    const questsForDate = await supabaseClient
      .from("daily_quests")
      .select("id, status")
      .eq("profile_id", profileId)
      .eq("quest_date", questDate);

    if (questsForDate.error || !questsForDate.data) {
      return {
        ok: false
      };
    }

    const isDailyPackageComplete =
      questsForDate.data.length > 0 && questsForDate.data.every((dailyQuest) => dailyQuest.status === "completed");

    if (!isDailyPackageComplete) {
      return {
        ok: true,
        streak: null,
        advanced: false
      };
    }

    const existingStreak = await supabaseClient
      .from("streaks")
      .select("id, streak_type, current_count, best_count, last_activity_date")
      .eq("profile_id", profileId)
      .eq("streak_type", "daily_quest")
      .maybeSingle();

    if (existingStreak.error) {
      return {
        ok: false
      };
    }

    const previous = existingStreak.data
      ? {
          currentCount: existingStreak.data.current_count,
          bestCount: existingStreak.data.best_count,
          lastActivityDate: existingStreak.data.last_activity_date
        }
      : null;
    const nextStreak = getNextDailyQuestStreak(previous, questDate);

    if (!nextStreak.shouldWrite && existingStreak.data) {
      return {
        ok: true,
        streak: toHomeStreak(existingStreak.data),
        advanced: false
      };
    }

    const streakPayload = {
      profile_id: profileId,
      streak_type: "daily_quest",
      current_count: nextStreak.currentCount,
      best_count: nextStreak.bestCount,
      last_activity_date: nextStreak.lastActivityDate,
      updated_at: new Date().toISOString()
    };
    const streakWrite = existingStreak.data
      ? await supabaseClient
          .from("streaks")
          .update(streakPayload)
          .eq("id", existingStreak.data.id)
          .select("id, streak_type, current_count, best_count, last_activity_date")
          .single()
      : await supabaseClient
          .from("streaks")
          .insert(streakPayload)
          .select("id, streak_type, current_count, best_count, last_activity_date")
          .single();

    if (streakWrite.error || !streakWrite.data) {
      return {
        ok: false
      };
    }

    return {
      ok: true,
      streak: toHomeStreak(streakWrite.data),
      advanced: nextStreak.advanced
    };
  }
}

function toHomeStreak(
  streak: Pick<StreakRow, "streak_type" | "current_count" | "best_count" | "last_activity_date">
): HomeStreakSummary {
  return {
    type: streak.streak_type as HomeStreakSummary["type"],
    currentCount: streak.current_count,
    bestCount: streak.best_count,
    lastActivityDate: streak.last_activity_date
  };
}

function parseCompletionPayload(body: CompleteQuestRequestBody) {
  if (typeof body.questId !== "string" || !UUID_PATTERN.test(body.questId)) {
    return null;
  }

  if (body.qualityScore !== undefined && !isQualityScore(body.qualityScore)) {
    return null;
  }

  if (body.note !== undefined && typeof body.note !== "string") {
    return null;
  }

  const note = body.note?.trim();

  if (note && note.length > MAX_NOTE_LENGTH) {
    return null;
  }

  return {
    questId: body.questId,
    qualityScore: typeof body.qualityScore === "number" ? body.qualityScore : null,
    note: note || null
  };
}

function isQualityScore(value: unknown) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 100;
}

function completionResponse(
  status: QuestCompletionResponse["status"],
  httpStatus: number,
  questId: string | null = null,
  xpAwarded = 0,
  totalXp: number | null = null,
  level: number | null = null,
  dailyQuestStreak: HomeStreakSummary | null = null,
  dailyQuestStreakAdvanced = false
) {
  return NextResponse.json<QuestCompletionResponse>(
    {
      ok: status === "ready" || status === "already_completed",
      status,
      questId,
      xpAwarded,
      totalXp,
      level,
      dailyQuestStreak,
      dailyQuestStreakAdvanced
    },
    { status: httpStatus }
  );
}

function getHttpStatus(status: TelegramAuthStatus) {
  switch (status) {
    case "valid":
      return 200;
    case "missing_bot_token":
    case "missing_supabase_config":
      return 503;
    case "profile_upsert_failed":
      return 502;
    case "missing_init_data":
    case "invalid_init_data":
    case "missing_hash":
    case "missing_auth_date":
    case "invalid_user":
      return 400;
    case "invalid_hash":
    case "stale_auth_date":
      return 401;
  }
}
