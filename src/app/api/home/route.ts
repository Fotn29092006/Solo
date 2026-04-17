import { NextResponse } from "next/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import { getOrCreateTelegramProfile } from "@/lib/telegram/profile-identity";
import { validateTelegramInitData } from "@/lib/telegram/server";
import { buildDailyQuestSeed } from "@/lib/quests/daily-quest-seed";
import { getUtcWeekStartDateKey } from "@/lib/weekly-checkins/week-start";
import { readTelegramInitData } from "@/lib/telegram/request-init-data";
import type {
  HomeGoalSummary,
  HomePathSummary,
  HomeProfileSummary,
  HomeQuestPreview,
  HomeStreakSummary,
  HomeStateResponse,
  MealTodaySummary,
  MvpGoalType,
  MvpPathKey,
  SleepTodaySummary,
  WaterTodaySummary,
  WeeklyCheckInSummary,
  WorkoutTodaySummary
} from "@/shared/types/game";
import type { Database } from "@/shared/types/database";
import type { TelegramAuthStatus } from "@/shared/types/telegram";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type DailyQuestRow = Database["public"]["Tables"]["daily_quests"]["Row"];
type GoalRow = Database["public"]["Tables"]["goals"]["Row"];
type MealLogRow = Database["public"]["Tables"]["meal_logs"]["Row"];
type StreakRow = Database["public"]["Tables"]["streaks"]["Row"];
type SleepLogRow = Database["public"]["Tables"]["sleep_logs"]["Row"];
type UserPathRow = Database["public"]["Tables"]["user_paths"]["Row"];
type WaterLogRow = Database["public"]["Tables"]["water_logs"]["Row"];
type WeeklyCheckInRow = Database["public"]["Tables"]["weekly_checkins"]["Row"];
type WorkoutLogRow = Database["public"]["Tables"]["workout_logs"]["Row"];

const WEEKLY_CHECKIN_COLUMNS =
  "id, week_start_date, weight_kg, energy_score, sleep_score, stress_score, adherence_score, reflection, summary, created_at";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return homeResponse("invalid_init_data", 400);
  }

  if (!isObjectRecord(body)) {
    return homeResponse("missing_init_data", 400);
  }

  const initData = readTelegramInitData(request, body);

  if (!initData) {
    return homeResponse("missing_init_data", 400);
  }

  const validation = validateTelegramInitData(initData);

  if (!validation.ok || !validation.user) {
    const validationStatus = validation.status === "valid" ? "invalid_init_data" : validation.status;

    return homeResponse(validationStatus, getHttpStatus(validationStatus));
  }

  const supabase = createServiceRoleSupabaseClient();
  const profileResult = await getOrCreateTelegramProfile(validation.user, supabase);

  if (!profileResult.ok) {
    return homeResponse(profileResult.status, getHttpStatus(profileResult.status));
  }

  if (!supabase) {
    return homeResponse("missing_supabase_config", 503);
  }

  const supabaseClient = supabase;
  const profileId = profileResult.profile.id;
  const weekStartDate = getUtcWeekStartDateKey();
  const todayDate = getTodayDateKey();
  const [
    goalResult,
    pathResult,
    streakResult,
    weeklyCheckInResult,
    waterTodayResult,
    workoutTodayResult,
    sleepTodayResult,
    mealTodayResult
  ] =
    await Promise.all([
      supabaseClient
        .from("goals")
        .select("id, goal_type, target_value, status")
        .eq("profile_id", profileId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabaseClient
        .from("user_paths")
        .select("id, path_key, is_active")
        .eq("profile_id", profileId)
        .eq("is_active", true)
        .order("selected_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabaseClient
        .from("streaks")
        .select("id, streak_type, current_count, best_count, last_activity_date")
        .eq("profile_id", profileId)
        .order("streak_type", { ascending: true }),
      supabaseClient
        .from("weekly_checkins")
        .select(WEEKLY_CHECKIN_COLUMNS)
        .eq("profile_id", profileId)
        .eq("week_start_date", weekStartDate)
        .maybeSingle(),
      supabaseClient
        .from("water_logs")
        .select("id, amount_ml")
        .eq("profile_id", profileId)
        .eq("logged_date", todayDate),
      supabaseClient
        .from("workout_logs")
        .select("id, duration_min")
        .eq("profile_id", profileId)
        .eq("logged_date", todayDate),
      supabaseClient
        .from("sleep_logs")
        .select("id, sleep_duration_min")
        .eq("profile_id", profileId)
        .eq("logged_date", todayDate),
      supabaseClient
        .from("meal_logs")
        .select("id")
        .eq("profile_id", profileId)
        .eq("logged_date", todayDate)
    ]);

  if (
    goalResult.error ||
    pathResult.error ||
    streakResult.error ||
    weeklyCheckInResult.error ||
    waterTodayResult.error ||
    workoutTodayResult.error
  ) {
    return homeResponse("home_read_failed", 502, toHomeProfile(profileResult.profile));
  }

  const activeGoal = goalResult.data ? toHomeGoal(goalResult.data) : null;
  const activePath = pathResult.data ? toHomePath(pathResult.data) : null;
  const streaks = streakResult.data ? streakResult.data.map(toHomeStreak) : [];
  const weeklyCheckIn = weeklyCheckInResult.data
    ? toWeeklyCheckInSummary(weeklyCheckInResult.data as WeeklyCheckInRow)
    : null;
  const waterToday = toWaterTodaySummary(todayDate, (waterTodayResult.data ?? []) as Pick<WaterLogRow, "amount_ml">[]);
  const workoutToday = toWorkoutTodaySummary(
    todayDate,
    (workoutTodayResult.data ?? []) as Pick<WorkoutLogRow, "duration_min">[]
  );
  const sleepToday = sleepTodayResult.error
    ? null
    : toSleepTodaySummary(todayDate, (sleepTodayResult.data ?? []) as Pick<SleepLogRow, "sleep_duration_min">[]);
  const mealToday = mealTodayResult.error
    ? null
    : toMealTodaySummary(todayDate, (mealTodayResult.data ?? []) as Pick<MealLogRow, "id">[]);
  const questDate = todayDate;
  const questsResult = await getOrSeedDailyQuests({
    profileId,
    questDate,
    goalType: activeGoal?.goalType ?? null,
    pathKey: activePath?.pathKey ?? null
  });

  if (!questsResult.ok) {
    return homeResponse(
      questsResult.status,
      502,
      toHomeProfile(profileResult.profile),
      activeGoal,
      activePath,
      [],
      streaks,
      weeklyCheckIn,
      waterToday,
      workoutToday,
      sleepToday,
      mealToday
    );
  }

  return homeResponse(
    "ready",
    200,
    toHomeProfile(profileResult.profile),
    activeGoal,
    activePath,
    questsResult.quests.map(toHomeQuest),
    streaks,
    weeklyCheckIn,
    waterToday,
    workoutToday,
    sleepToday,
    mealToday
  );

  async function getOrSeedDailyQuests({
    profileId,
    questDate,
    goalType,
    pathKey
  }: {
    profileId: string;
    questDate: string;
    goalType: string | null;
    pathKey: string | null;
  }): Promise<
    | {
        ok: true;
        quests: DailyQuestRow[];
      }
    | {
        ok: false;
        status: "home_read_failed" | "quest_seed_failed";
      }
  > {
    const existing = await supabaseClient
      .from("daily_quests")
      .select("id, title, domain, quest_type, xp_reward, status")
      .eq("profile_id", profileId)
      .eq("quest_date", questDate)
      .order("created_at", { ascending: true });

    if (existing.error) {
      return {
        ok: false,
        status: "home_read_failed"
      };
    }

    if (existing.data.length > 0) {
      return {
        ok: true,
        quests: existing.data as DailyQuestRow[]
      };
    }

    const seeded = await supabaseClient
      .from("daily_quests")
      .insert(
        buildDailyQuestSeed({
          profileId,
          questDate,
          goalType: isMvpGoalType(goalType) ? goalType : null,
          pathKey: isMvpPathKey(pathKey) ? pathKey : null
        })
      )
      .select("id, title, domain, quest_type, xp_reward, status")
      .order("created_at", { ascending: true });

    if (seeded.error || !seeded.data) {
      return {
        ok: false,
        status: "quest_seed_failed"
      };
    }

    return {
      ok: true,
      quests: seeded.data as DailyQuestRow[]
    };
  }
}

function toHomeProfile(profile: {
  id: string;
  displayName: string | null;
  level: number;
  totalXp: number;
  rankKey: string;
}): HomeProfileSummary {
  return {
    id: profile.id,
    displayName: profile.displayName,
    level: profile.level,
    totalXp: profile.totalXp,
    rankKey: profile.rankKey
  };
}

function toHomeGoal(goal: Pick<GoalRow, "id" | "goal_type" | "target_value">): HomeGoalSummary {
  return {
    id: goal.id,
    goalType: goal.goal_type,
    targetValue: goal.target_value
  };
}

function toHomePath(path: Pick<UserPathRow, "id" | "path_key">): HomePathSummary {
  return {
    id: path.id,
    pathKey: path.path_key
  };
}

function toHomeQuest(quest: Pick<
  DailyQuestRow,
  "id" | "title" | "domain" | "quest_type" | "xp_reward" | "status"
>): HomeQuestPreview {
  return {
    id: quest.id,
    title: quest.title,
    domain: quest.domain as HomeQuestPreview["domain"],
    type: quest.quest_type as HomeQuestPreview["type"],
    xpReward: quest.xp_reward,
    status: quest.status as HomeQuestPreview["status"]
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

function toWaterTodaySummary(
  date: string,
  waterLogs: Array<Pick<WaterLogRow, "amount_ml">>
): WaterTodaySummary {
  return {
    date,
    totalMl: waterLogs.reduce((total, waterLog) => total + waterLog.amount_ml, 0),
    logCount: waterLogs.length
  };
}

function toWorkoutTodaySummary(
  date: string,
  workoutLogs: Array<Pick<WorkoutLogRow, "duration_min">>
): WorkoutTodaySummary {
  return {
    date,
    sessionCount: workoutLogs.length,
    totalDurationMinutes: workoutLogs.reduce(
      (total, workoutLog) => total + (workoutLog.duration_min ?? 0),
      0
    )
  };
}

function toSleepTodaySummary(
  date: string,
  sleepLogs: Array<Pick<SleepLogRow, "sleep_duration_min">>
): SleepTodaySummary {
  return {
    date,
    logCount: sleepLogs.length,
    totalSleepDurationMinutes: sleepLogs.reduce(
      (total, sleepLog) => total + sleepLog.sleep_duration_min,
      0
    )
  };
}

function toMealTodaySummary(date: string, mealLogs: Array<Pick<MealLogRow, "id">>): MealTodaySummary {
  return {
    date,
    mealCount: mealLogs.length
  };
}

function homeResponse(
  status: HomeStateResponse["status"],
  httpStatus: number,
  profile: HomeStateResponse["profile"] = null,
  activeGoal: HomeStateResponse["activeGoal"] = null,
  activePath: HomeStateResponse["activePath"] = null,
  quests: HomeQuestPreview[] = [],
  streaks: HomeStreakSummary[] = [],
  weeklyCheckIn: WeeklyCheckInSummary | null = null,
  waterToday: WaterTodaySummary | null = null,
  workoutToday: WorkoutTodaySummary | null = null,
  sleepToday: SleepTodaySummary | null = null,
  mealToday: MealTodaySummary | null = null
) {
  return NextResponse.json<HomeStateResponse>(
    {
      ok: status === "ready",
      status,
      profile,
      activeGoal,
      activePath,
      quests,
      streaks,
      weeklyCheckIn,
      waterToday,
      workoutToday,
      sleepToday,
      mealToday
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

function getTodayDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMvpGoalType(value: string | null): value is MvpGoalType {
  return (
    value === "fat_loss" ||
    value === "muscle_gain" ||
    value === "recomposition" ||
    value === "discipline" ||
    value === "learning"
  );
}

function isMvpPathKey(value: string | null): value is MvpPathKey {
  return (
    value === "warrior" ||
    value === "discipline" ||
    value === "scholar" ||
    value === "polyglot" ||
    value === "rebuild" ||
    value === "aesthetic" ||
    value === "balance"
  );
}
