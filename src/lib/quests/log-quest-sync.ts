import type { SupabaseClient } from "@supabase/supabase-js";
import { getNextDailyQuestStreak } from "@/lib/streaks/daily-quest-streak";
import type { Database, Json } from "@/shared/types/database";
import type { HomeStreakSummary, LogQuestSyncSummary, QuestCompletionResponse, WorkoutType } from "@/shared/types/game";

type DailyQuestRow = Database["public"]["Tables"]["daily_quests"]["Row"];
type QuestCompletionRow = Database["public"]["Tables"]["quest_completions"]["Row"];
type StreakRow = Database["public"]["Tables"]["streaks"]["Row"];
type SupabaseServiceClient = SupabaseClient<Database>;

export const WATER_AUTO_COMPLETE_KEY = "water_log";
export const WATER_AUTO_COMPLETE_TITLE = "Log water intake before the day ends";
export const WATER_AUTO_COMPLETE_THRESHOLD_ML = 1000;
export const WORKOUT_AUTO_COMPLETE_KEY = "workout_log";
export const WORKOUT_MIN_SESSIONS = 1;

export async function syncWaterLogQuest({
  supabaseClient,
  profileId,
  questDate,
  totalMl
}: {
  supabaseClient: SupabaseServiceClient;
  profileId: string;
  questDate: string;
  totalMl: number;
}): Promise<LogQuestSyncSummary> {
  if (totalMl < WATER_AUTO_COMPLETE_THRESHOLD_ML) {
    return createQuestSyncSummary("not_matched");
  }

  const questResult = await supabaseClient
    .from("daily_quests")
    .select("id, profile_id, quest_date, title, domain, quest_type, xp_reward, status, metadata")
    .eq("profile_id", profileId)
    .eq("quest_date", questDate)
    .eq("domain", "nutrition")
    .eq("quest_type", "side");

  if (questResult.error || !questResult.data) {
    return createQuestSyncSummary("failed");
  }

  const quest = (questResult.data as DailyQuestRow[]).find(isWaterAutoCompleteQuest);

  if (!quest) {
    return createQuestSyncSummary("not_matched");
  }

  const completion = await completeQuestForLog({
    supabaseClient,
    profileId,
    quest,
    note: "Auto-completed from hydration log."
  });

  if (!completion.ok) {
    return createQuestSyncSummary("failed");
  }

  return createQuestSyncSummary(
    completion.response.status === "already_completed" ? "already_completed" : "completed",
    completion.response
  );
}

export function isWaterAutoCompleteQuest(
  quest: Pick<DailyQuestRow, "title" | "domain" | "quest_type" | "metadata">
) {
  if (quest.domain !== "nutrition" || quest.quest_type !== "side") {
    return false;
  }

  const metadata = quest.metadata;

  if (isJsonObject(metadata) && metadata.autoCompleteKey === WATER_AUTO_COMPLETE_KEY) {
    return true;
  }

  return quest.title === WATER_AUTO_COMPLETE_TITLE;
}

export async function syncWorkoutLogQuest({
  supabaseClient,
  profileId,
  questDate,
  sessionCount,
  workoutType
}: {
  supabaseClient: SupabaseServiceClient;
  profileId: string;
  questDate: string;
  sessionCount: number;
  workoutType: WorkoutType | string;
}): Promise<LogQuestSyncSummary> {
  if (sessionCount < WORKOUT_MIN_SESSIONS) {
    return createQuestSyncSummary("not_matched");
  }

  const questResult = await supabaseClient
    .from("daily_quests")
    .select("id, profile_id, quest_date, title, domain, quest_type, xp_reward, status, metadata")
    .eq("profile_id", profileId)
    .eq("quest_date", questDate)
    .eq("domain", "body")
    .eq("quest_type", "main");

  if (questResult.error || !questResult.data) {
    return createQuestSyncSummary("failed");
  }

  const quest = (questResult.data as DailyQuestRow[]).find((dailyQuest) =>
    isWorkoutAutoCompleteQuest(dailyQuest, {
      sessionCount,
      workoutType
    })
  );

  if (!quest) {
    return createQuestSyncSummary("not_matched");
  }

  const completion = await completeQuestForLog({
    supabaseClient,
    profileId,
    quest,
    note: "Auto-completed from workout log."
  });

  if (!completion.ok) {
    return createQuestSyncSummary("failed");
  }

  return createQuestSyncSummary(
    completion.response.status === "already_completed" ? "already_completed" : "completed",
    completion.response
  );
}

export function isWorkoutAutoCompleteQuest(
  quest: Pick<DailyQuestRow, "domain" | "quest_type" | "metadata">,
  context: {
    sessionCount: number;
    workoutType: WorkoutType | string | null;
  }
) {
  if (quest.domain !== "body" || quest.quest_type !== "main") {
    return false;
  }

  const metadata = quest.metadata;

  if (!isJsonObject(metadata) || metadata.autoCompleteKey !== WORKOUT_AUTO_COMPLETE_KEY) {
    return false;
  }

  if (metadata.matchWindow !== undefined && metadata.matchWindow !== "quest_date") {
    return false;
  }

  const minWorkoutSessions =
    typeof metadata.minWorkoutSessions === "number" ? metadata.minWorkoutSessions : WORKOUT_MIN_SESSIONS;

  if (context.sessionCount < minWorkoutSessions) {
    return false;
  }

  if (Array.isArray(metadata.allowedWorkoutTypes) && metadata.allowedWorkoutTypes.length > 0) {
    return Boolean(context.workoutType && metadata.allowedWorkoutTypes.includes(context.workoutType));
  }

  return true;
}

function createQuestSyncSummary(
  status: LogQuestSyncSummary["status"],
  questCompletion: QuestCompletionResponse | null = null
): LogQuestSyncSummary {
  return {
    status,
    questCompletion
  };
}

async function completeQuestForLog({
  supabaseClient,
  profileId,
  quest,
  note
}: {
  supabaseClient: SupabaseServiceClient;
  profileId: string;
  quest: Pick<DailyQuestRow, "id" | "profile_id" | "quest_date" | "title" | "xp_reward" | "status">;
  note: string;
}): Promise<
  | {
      ok: true;
      response: QuestCompletionResponse;
    }
  | {
      ok: false;
    }
> {
  const completionResult = await ensureQuestCompletion({
    supabaseClient,
    profileId,
    quest,
    note
  });

  if (!completionResult.ok) {
    return {
      ok: false
    };
  }

  const xpEventResult = await ensureQuestXpEvent({
    supabaseClient,
    profileId,
    completionId: completionResult.completion.id,
    questTitle: quest.title,
    amount: completionResult.completion.xp_awarded
  });

  if (!xpEventResult.ok) {
    return {
      ok: false
    };
  }

  const profileXp = await syncProfileXp(supabaseClient, profileId);

  if (!profileXp.ok) {
    return {
      ok: false
    };
  }

  const streakResult = await syncDailyQuestStreak({
    supabaseClient,
    profileId,
    questDate: quest.quest_date
  });

  if (!streakResult.ok) {
    return {
      ok: false
    };
  }

  return {
    ok: true,
    response: {
      ok: true,
      status: completionResult.alreadyCompleted ? "already_completed" : "ready",
      questId: quest.id,
      xpAwarded: completionResult.alreadyCompleted ? 0 : completionResult.completion.xp_awarded,
      totalXp: profileXp.totalXp,
      level: profileXp.level,
      dailyQuestStreak: streakResult.streak,
      dailyQuestStreakAdvanced: streakResult.advanced
    }
  };
}

async function ensureQuestCompletion({
  supabaseClient,
  profileId,
  quest,
  note
}: {
  supabaseClient: SupabaseServiceClient;
  profileId: string;
  quest: Pick<DailyQuestRow, "id" | "profile_id" | "title" | "xp_reward" | "status">;
  note: string;
}): Promise<
  | {
      ok: true;
      alreadyCompleted: boolean;
      completion: QuestCompletionRow;
    }
  | {
      ok: false;
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
      ok: false
    };
  }

  if (existingCompletion.data) {
    const questUpdate = await supabaseClient
      .from("daily_quests")
      .update({ status: "completed" })
      .eq("id", quest.id)
      .eq("profile_id", profileId);

    if (questUpdate.error) {
      return {
        ok: false
      };
    }

    return {
      ok: true,
      alreadyCompleted: true,
      completion: existingCompletion.data as QuestCompletionRow
    };
  }

  if (quest.status !== "assigned") {
    return {
      ok: false
    };
  }

  const insertedCompletion = await supabaseClient
    .from("quest_completions")
    .insert({
      quest_id: quest.id,
      profile_id: profileId,
      quality_score: null,
      xp_awarded: quest.xp_reward,
      note
    })
    .select("id, quest_id, profile_id, xp_awarded")
    .single();

  if (insertedCompletion.error || !insertedCompletion.data) {
    return {
      ok: false
    };
  }

  const questUpdate = await supabaseClient
    .from("daily_quests")
    .update({ status: "completed" })
    .eq("id", quest.id)
    .eq("profile_id", profileId);

  if (questUpdate.error) {
    return {
      ok: false
    };
  }

  return {
    ok: true,
    alreadyCompleted: false,
    completion: insertedCompletion.data as QuestCompletionRow
  };
}

async function ensureQuestXpEvent({
  supabaseClient,
  profileId,
  completionId,
  questTitle,
  amount
}: {
  supabaseClient: SupabaseServiceClient;
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

async function syncProfileXp(supabaseClient: SupabaseServiceClient, profileId: string) {
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
  supabaseClient,
  profileId,
  questDate
}: {
  supabaseClient: SupabaseServiceClient;
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

function isJsonObject(value: Json): value is { [key: string]: Json | undefined } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
