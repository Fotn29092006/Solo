import { NextResponse } from "next/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import {
  getNextWeeklyReviewStreak,
  getUtcWeekStartDateKey
} from "@/lib/weekly-checkins/week-start";
import { getOrCreateTelegramProfile } from "@/lib/telegram/profile-identity";
import { validateTelegramInitData } from "@/lib/telegram/server";
import type { Database } from "@/shared/types/database";
import type { HomeStreakSummary, WeeklyCheckInResponse, WeeklyCheckInSummary } from "@/shared/types/game";
import type { TelegramAuthStatus } from "@/shared/types/telegram";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface WeeklyCheckInRequestBody {
  initData?: unknown;
  weightKg?: unknown;
  energyScore?: unknown;
  sleepScore?: unknown;
  stressScore?: unknown;
  adherenceScore?: unknown;
  reflection?: unknown;
}

type StreakRow = Database["public"]["Tables"]["streaks"]["Row"];
type WeeklyCheckInRow = Database["public"]["Tables"]["weekly_checkins"]["Row"];

const MAX_REFLECTION_LENGTH = 800;
const WEEKLY_CHECKIN_COLUMNS =
  "id, week_start_date, weight_kg, energy_score, sleep_score, stress_score, adherence_score, reflection, summary, created_at";

export async function POST(request: Request) {
  let body: WeeklyCheckInRequestBody;

  try {
    body = (await request.json()) as WeeklyCheckInRequestBody;
  } catch {
    return weeklyCheckInResponse("invalid_weekly_checkin_payload", 400);
  }

  if (typeof body.initData !== "string") {
    return weeklyCheckInResponse("missing_init_data", 400);
  }

  const payload = parseWeeklyCheckInPayload(body);

  if (!payload.ok) {
    return weeklyCheckInResponse("invalid_weekly_checkin_payload", 400);
  }

  const validation = validateTelegramInitData(body.initData);

  if (!validation.ok || !validation.user) {
    const validationStatus = validation.status === "valid" ? "invalid_init_data" : validation.status;

    return weeklyCheckInResponse(validationStatus, getHttpStatus(validationStatus));
  }

  const supabase = createServiceRoleSupabaseClient();
  const profileResult = await getOrCreateTelegramProfile(validation.user, supabase);

  if (!profileResult.ok) {
    return weeklyCheckInResponse(profileResult.status, getHttpStatus(profileResult.status));
  }

  if (!supabase) {
    return weeklyCheckInResponse("missing_supabase_config", 503);
  }

  const supabaseClient = supabase;
  const profileId = profileResult.profile.id;
  const weekStartDate = getUtcWeekStartDateKey();

  if (!payload.shouldWrite) {
    const [checkInResult, streakResult] = await Promise.all([
      readWeeklyCheckIn(profileId, weekStartDate),
      readWeeklyReviewStreak(profileId)
    ]);

    if (!checkInResult.ok || !streakResult.ok) {
      return weeklyCheckInResponse("weekly_checkin_read_failed", 502, profileId, weekStartDate);
    }

    return weeklyCheckInResponse(
      "ready",
      200,
      profileId,
      weekStartDate,
      checkInResult.checkIn,
      streakResult.streak,
      false
    );
  }

  const summary = buildWeeklySummary(payload.values);
  const writeResult = await supabaseClient
    .from("weekly_checkins")
    .upsert(
      {
        profile_id: profileId,
        week_start_date: weekStartDate,
        weight_kg: payload.values.weightKg,
        energy_score: payload.values.energyScore,
        sleep_score: payload.values.sleepScore,
        stress_score: payload.values.stressScore,
        adherence_score: payload.values.adherenceScore,
        reflection: payload.values.reflection,
        summary
      },
      { onConflict: "profile_id,week_start_date" }
    )
    .select(WEEKLY_CHECKIN_COLUMNS)
    .single();

  if (writeResult.error || !writeResult.data) {
    return weeklyCheckInResponse("weekly_checkin_write_failed", 502, profileId, weekStartDate);
  }

  const streakResult = await syncWeeklyReviewStreak(profileId, weekStartDate);

  if (!streakResult.ok) {
    return weeklyCheckInResponse(
      "streak_sync_failed",
      502,
      profileId,
      weekStartDate,
      toWeeklyCheckInSummary(writeResult.data as WeeklyCheckInRow)
    );
  }

  return weeklyCheckInResponse(
    "saved",
    200,
    profileId,
    weekStartDate,
    toWeeklyCheckInSummary(writeResult.data as WeeklyCheckInRow),
    streakResult.streak,
    streakResult.advanced
  );

  async function readWeeklyCheckIn(profileId: string, weekStartDate: string) {
    const result = await supabaseClient
      .from("weekly_checkins")
      .select(WEEKLY_CHECKIN_COLUMNS)
      .eq("profile_id", profileId)
      .eq("week_start_date", weekStartDate)
      .maybeSingle();

    if (result.error) {
      return {
        ok: false
      } as const;
    }

    return {
      ok: true,
      checkIn: result.data ? toWeeklyCheckInSummary(result.data as WeeklyCheckInRow) : null
    } as const;
  }

  async function readWeeklyReviewStreak(profileId: string) {
    const result = await supabaseClient
      .from("streaks")
      .select("id, streak_type, current_count, best_count, last_activity_date")
      .eq("profile_id", profileId)
      .eq("streak_type", "weekly_review")
      .maybeSingle();

    if (result.error) {
      return {
        ok: false
      } as const;
    }

    return {
      ok: true,
      streak: result.data ? toHomeStreak(result.data as StreakRow) : null
    } as const;
  }

  async function syncWeeklyReviewStreak(profileId: string, weekStartDate: string) {
    const existingStreak = await supabaseClient
      .from("streaks")
      .select("id, streak_type, current_count, best_count, last_activity_date")
      .eq("profile_id", profileId)
      .eq("streak_type", "weekly_review")
      .maybeSingle();

    if (existingStreak.error) {
      return {
        ok: false
      } as const;
    }

    const previous = existingStreak.data
      ? {
          currentCount: existingStreak.data.current_count,
          bestCount: existingStreak.data.best_count,
          lastActivityDate: existingStreak.data.last_activity_date
        }
      : null;
    const nextStreak = getNextWeeklyReviewStreak(previous, weekStartDate);

    if (!nextStreak.shouldWrite && existingStreak.data) {
      return {
        ok: true,
        streak: toHomeStreak(existingStreak.data as StreakRow),
        advanced: false
      } as const;
    }

    const streakPayload = {
      profile_id: profileId,
      streak_type: "weekly_review",
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
      } as const;
    }

    return {
      ok: true,
      streak: toHomeStreak(streakWrite.data as StreakRow),
      advanced: nextStreak.advanced
    } as const;
  }
}

function parseWeeklyCheckInPayload(body: WeeklyCheckInRequestBody):
  | {
      ok: true;
      shouldWrite: false;
      values: null;
    }
  | {
      ok: true;
      shouldWrite: true;
      values: {
        weightKg: number | null;
        energyScore: number;
        sleepScore: number;
        stressScore: number;
        adherenceScore: number;
        reflection: string | null;
      };
    }
  | {
      ok: false;
    } {
  const hasWriteFields =
    body.weightKg !== undefined ||
    body.energyScore !== undefined ||
    body.sleepScore !== undefined ||
    body.stressScore !== undefined ||
    body.adherenceScore !== undefined ||
    body.reflection !== undefined;

  if (!hasWriteFields) {
    return {
      ok: true,
      shouldWrite: false,
      values: null
    };
  }

  if (
    !isScore(body.energyScore) ||
    !isScore(body.sleepScore) ||
    !isScore(body.stressScore) ||
    !isScore(body.adherenceScore)
  ) {
    return {
      ok: false
    };
  }

  if (body.weightKg !== undefined && body.weightKg !== null && !isWeightKg(body.weightKg)) {
    return {
      ok: false
    };
  }

  if (body.reflection !== undefined && typeof body.reflection !== "string") {
    return {
      ok: false
    };
  }

  const reflection = body.reflection?.trim();

  if (reflection && reflection.length > MAX_REFLECTION_LENGTH) {
    return {
      ok: false
    };
  }

  return {
    ok: true,
    shouldWrite: true,
    values: {
      weightKg: typeof body.weightKg === "number" ? body.weightKg : null,
      energyScore: body.energyScore,
      sleepScore: body.sleepScore,
      stressScore: body.stressScore,
      adherenceScore: body.adherenceScore,
      reflection: reflection || null
    }
  };
}

function isScore(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
}

function isWeightKg(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 20 && value <= 500;
}

function buildWeeklySummary(values: {
  weightKg: number | null;
  energyScore: number;
  sleepScore: number;
  stressScore: number;
  adherenceScore: number;
}) {
  const weightPart = values.weightKg ? `Weight ${values.weightKg} kg.` : "Weight not logged.";

  return `Weekly review completed. ${weightPart} Energy ${values.energyScore}/5, sleep ${values.sleepScore}/5, stress ${values.stressScore}/5, adherence ${values.adherenceScore}/5.`;
}

function toWeeklyCheckInSummary(checkIn: Pick<
  WeeklyCheckInRow,
  | "id"
  | "week_start_date"
  | "weight_kg"
  | "energy_score"
  | "sleep_score"
  | "stress_score"
  | "adherence_score"
  | "reflection"
  | "summary"
  | "created_at"
>): WeeklyCheckInSummary {
  return {
    id: checkIn.id,
    weekStartDate: checkIn.week_start_date,
    weightKg: checkIn.weight_kg,
    energyScore: checkIn.energy_score,
    sleepScore: checkIn.sleep_score,
    stressScore: checkIn.stress_score,
    adherenceScore: checkIn.adherence_score,
    reflection: checkIn.reflection,
    summary: checkIn.summary,
    createdAt: checkIn.created_at
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

function weeklyCheckInResponse(
  status: WeeklyCheckInResponse["status"],
  httpStatus: number,
  profileId: string | null = null,
  weekStartDate: string | null = null,
  checkIn: WeeklyCheckInSummary | null = null,
  weeklyReviewStreak: HomeStreakSummary | null = null,
  weeklyReviewStreakAdvanced = false
) {
  return NextResponse.json<WeeklyCheckInResponse>(
    {
      ok: status === "ready" || status === "saved",
      status,
      profileId,
      weekStartDate,
      checkIn,
      weeklyReviewStreak,
      weeklyReviewStreakAdvanced
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
