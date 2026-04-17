import type { MVP_DOMAINS, MVP_GOAL_TYPES, MVP_PATH_KEYS, ONBOARDING_STEPS } from "@/config/app";

export type MvpDomain = (typeof MVP_DOMAINS)[number];

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export type MvpGoalType = (typeof MVP_GOAL_TYPES)[number];

export type MvpPathKey = (typeof MVP_PATH_KEYS)[number];

export type RankKey =
  | "unranked"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "master"
  | "legend";

export type QuestType = "main" | "side" | "discipline" | "recovery";

export type QuestStatus = "assigned" | "completed" | "missed" | "skipped";

export type StreakType =
  | "daily_login"
  | "daily_quest"
  | "workout"
  | "nutrition"
  | "weekly_review";

export type WorkoutType = "strength" | "cardio" | "mobility" | "mixed" | "other";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack" | "other";

export interface HomeQuestPreview {
  id: string;
  title: string;
  domain: MvpDomain;
  type: QuestType;
  xpReward: number;
  status: QuestStatus;
}

export interface HomeProfileSummary {
  id: string;
  displayName: string | null;
  level: number;
  totalXp: number;
  rankKey: RankKey | string;
}

export interface HomeGoalSummary {
  id: string;
  goalType: string;
  targetValue: string | null;
}

export interface HomePathSummary {
  id: string;
  pathKey: string;
}

export interface HomeStreakSummary {
  type: StreakType;
  currentCount: number;
  bestCount: number;
  lastActivityDate: string | null;
}

export interface WeeklyCheckInSummary {
  id: string;
  weekStartDate: string;
  weightKg: number | null;
  energyScore: number | null;
  sleepScore: number | null;
  stressScore: number | null;
  adherenceScore: number | null;
  reflection: string | null;
  summary: string | null;
  createdAt: string;
}

export interface WaterLogSummary {
  id: string;
  clientEventId: string;
  amountMl: number;
  loggedAt: string;
  loggedDate: string;
  note: string | null;
  createdAt: string;
}

export interface WaterTodaySummary {
  date: string;
  totalMl: number;
  logCount: number;
}

export interface WorkoutLogSummary {
  id: string;
  clientEventId: string;
  workoutType: WorkoutType | string;
  workoutName: string | null;
  durationMin: number | null;
  rpe: number | null;
  loggedAt: string;
  loggedDate: string;
  note: string | null;
  createdAt: string;
}

export interface WorkoutTodaySummary {
  date: string;
  sessionCount: number;
  totalDurationMinutes: number;
}

export interface SleepLogSummary {
  id: string;
  clientEventId: string;
  sleepDurationMin: number;
  sleepQuality: number | null;
  morningEnergy: number | null;
  loggedAt: string;
  loggedDate: string;
  note: string | null;
  createdAt: string;
}

export interface SleepTodaySummary {
  date: string;
  logCount: number;
  totalSleepDurationMinutes: number;
}

export interface MealLogSummary {
  id: string;
  clientEventId: string;
  mealType: MealType | string;
  mealName: string | null;
  calories: number | null;
  proteinG: number | null;
  loggedAt: string;
  loggedDate: string;
  note: string | null;
  createdAt: string;
}

export interface MealTodaySummary {
  date: string;
  mealCount: number;
}

export interface LogQuestSyncSummary {
  status: "not_matched" | "completed" | "already_completed" | "failed";
  questCompletion: QuestCompletionResponse | null;
}

export interface HomeStateResponse {
  ok: boolean;
  status:
    | "ready"
    | "missing_supabase_config"
    | "profile_upsert_failed"
    | "home_read_failed"
    | "quest_seed_failed"
    | "missing_bot_token"
    | "missing_init_data"
    | "invalid_init_data"
    | "missing_hash"
    | "invalid_hash"
    | "missing_auth_date"
    | "stale_auth_date"
    | "invalid_user";
  profile: HomeProfileSummary | null;
  activeGoal: HomeGoalSummary | null;
  activePath: HomePathSummary | null;
  quests: HomeQuestPreview[];
  streaks: HomeStreakSummary[];
  weeklyCheckIn: WeeklyCheckInSummary | null;
  waterToday: WaterTodaySummary | null;
  workoutToday: WorkoutTodaySummary | null;
  sleepToday: SleepTodaySummary | null;
  mealToday: MealTodaySummary | null;
}

export interface WeeklyCheckInRequest {
  initData: string;
  weightKg?: number | null;
  energyScore?: number;
  sleepScore?: number;
  stressScore?: number;
  adherenceScore?: number;
  reflection?: string;
}

export interface WeeklyCheckInResponse {
  ok: boolean;
  status:
    | "ready"
    | "saved"
    | "invalid_weekly_checkin_payload"
    | "weekly_checkin_read_failed"
    | "weekly_checkin_write_failed"
    | "streak_sync_failed"
    | "missing_supabase_config"
    | "profile_upsert_failed"
    | "missing_bot_token"
    | "missing_init_data"
    | "invalid_init_data"
    | "missing_hash"
    | "invalid_hash"
    | "missing_auth_date"
    | "stale_auth_date"
    | "invalid_user";
  profileId: string | null;
  weekStartDate: string | null;
  checkIn: WeeklyCheckInSummary | null;
  weeklyReviewStreak: HomeStreakSummary | null;
  weeklyReviewStreakAdvanced: boolean;
}

export interface WaterLogRequest {
  initData: string;
  amountMl: number;
  clientEventId: string;
  note?: string;
}

export interface WaterLogResponse {
  ok: boolean;
  status:
    | "ready"
    | "already_logged"
    | "invalid_water_log_payload"
    | "water_log_write_failed"
    | "water_log_read_failed"
    | "missing_supabase_config"
    | "profile_upsert_failed"
    | "missing_bot_token"
    | "missing_init_data"
    | "invalid_init_data"
    | "missing_hash"
    | "invalid_hash"
    | "missing_auth_date"
    | "stale_auth_date"
    | "invalid_user";
  profileId: string | null;
  waterLog: WaterLogSummary | null;
  waterToday: WaterTodaySummary | null;
  questSync: LogQuestSyncSummary;
  todayTotalMl: number;
  todayLogCount: number;
}

export interface WorkoutLogRequest {
  initData: string;
  clientEventId: string;
  workoutType: WorkoutType;
  workoutName?: string;
  durationMin?: number;
  rpe?: number;
  note?: string;
}

export interface WorkoutLogResponse {
  ok: boolean;
  status:
    | "ready"
    | "already_logged"
    | "invalid_workout_log_payload"
    | "workout_log_write_failed"
    | "workout_log_read_failed"
    | "missing_supabase_config"
    | "profile_upsert_failed"
    | "missing_bot_token"
    | "missing_init_data"
    | "invalid_init_data"
    | "missing_hash"
    | "invalid_hash"
    | "missing_auth_date"
    | "stale_auth_date"
    | "invalid_user";
  profileId: string | null;
  workoutLog: WorkoutLogSummary | null;
  workoutToday: WorkoutTodaySummary | null;
  questSync: LogQuestSyncSummary;
  todaySessionCount: number;
  todayTotalDurationMinutes: number;
}

export interface SleepLogRequest {
  initData: string;
  clientEventId: string;
  sleepDurationMin: number;
  sleepQuality?: number;
  morningEnergy?: number;
  note?: string;
}

export interface SleepLogResponse {
  ok: boolean;
  status:
    | "ready"
    | "already_logged"
    | "invalid_sleep_log_payload"
    | "sleep_log_write_failed"
    | "sleep_log_read_failed"
    | "missing_supabase_config"
    | "profile_upsert_failed"
    | "missing_bot_token"
    | "missing_init_data"
    | "invalid_init_data"
    | "missing_hash"
    | "invalid_hash"
    | "missing_auth_date"
    | "stale_auth_date"
    | "invalid_user";
  profileId: string | null;
  sleepLog: SleepLogSummary | null;
  sleepToday: SleepTodaySummary | null;
  todayLogCount: number;
  todayTotalSleepDurationMinutes: number;
}

export interface MealLogRequest {
  initData: string;
  clientEventId: string;
  mealType: MealType;
  mealName?: string;
  calories?: number;
  proteinG?: number;
  note?: string;
}

export interface MealLogResponse {
  ok: boolean;
  status:
    | "ready"
    | "already_logged"
    | "invalid_meal_log_payload"
    | "meal_log_write_failed"
    | "meal_log_read_failed"
    | "missing_supabase_config"
    | "profile_upsert_failed"
    | "missing_bot_token"
    | "missing_init_data"
    | "invalid_init_data"
    | "missing_hash"
    | "invalid_hash"
    | "missing_auth_date"
    | "stale_auth_date"
    | "invalid_user";
  profileId: string | null;
  mealLog: MealLogSummary | null;
  mealToday: MealTodaySummary | null;
  todayMealCount: number;
}

export interface QuestCompletionResponse {
  ok: boolean;
  status:
    | "ready"
    | "already_completed"
    | "invalid_completion_payload"
    | "quest_not_found"
    | "invalid_quest_state"
    | "completion_write_failed"
    | "xp_event_write_failed"
    | "profile_xp_sync_failed"
    | "streak_sync_failed"
    | "missing_supabase_config"
    | "profile_upsert_failed"
    | "missing_bot_token"
    | "missing_init_data"
    | "invalid_init_data"
    | "missing_hash"
    | "invalid_hash"
    | "missing_auth_date"
    | "stale_auth_date"
    | "invalid_user";
  questId: string | null;
  xpAwarded: number;
  totalXp: number | null;
  level: number | null;
  dailyQuestStreak: HomeStreakSummary | null;
  dailyQuestStreakAdvanced: boolean;
}

export interface OnboardingPersistenceRequest {
  initData: string;
  goalType: MvpGoalType;
  targetValue?: string;
  pathKey: MvpPathKey;
}

export interface OnboardingPersistenceResponse {
  ok: boolean;
  status:
    | "ready"
    | "invalid_onboarding_payload"
    | "onboarding_write_failed"
    | "missing_supabase_config"
    | "profile_upsert_failed"
    | "missing_bot_token"
    | "missing_init_data"
    | "invalid_init_data"
    | "missing_hash"
    | "invalid_hash"
    | "missing_auth_date"
    | "stale_auth_date"
    | "invalid_user";
  profileId: string | null;
  goalId: string | null;
  pathId: string | null;
}
