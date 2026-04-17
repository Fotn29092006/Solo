import { NextResponse } from "next/server";
import { syncWorkoutLogQuest } from "@/lib/quests/log-quest-sync";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import { getOrCreateTelegramProfile } from "@/lib/telegram/profile-identity";
import { readTelegramInitData } from "@/lib/telegram/request-init-data";
import { validateTelegramInitData } from "@/lib/telegram/server";
import type { Database } from "@/shared/types/database";
import type {
  LogQuestSyncSummary,
  WorkoutLogResponse,
  WorkoutLogSummary,
  WorkoutTodaySummary,
  WorkoutType
} from "@/shared/types/game";
import type { TelegramAuthStatus } from "@/shared/types/telegram";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface WorkoutLogRequestBody {
  initData?: unknown;
  clientEventId?: unknown;
  workoutType?: unknown;
  workoutName?: unknown;
  durationMin?: unknown;
  rpe?: unknown;
  note?: unknown;
}

type WorkoutLogRow = Database["public"]["Tables"]["workout_logs"]["Row"];

const MAX_NOTE_LENGTH = 240;
const MAX_WORKOUT_NAME_LENGTH = 120;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const WORKOUT_LOG_COLUMNS =
  "id, client_event_id, workout_type, workout_name, duration_min, rpe, logged_at, logged_date, note, created_at";
const WORKOUT_LOG_REQUEST_KEYS = new Set([
  "initData",
  "clientEventId",
  "workoutType",
  "workoutName",
  "durationMin",
  "rpe",
  "note"
]);

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return workoutLogResponse("invalid_workout_log_payload", 400);
  }

  if (!isObjectRecord(body)) {
    return workoutLogResponse("missing_init_data", 400);
  }

  const initData = readTelegramInitData(request, body);

  if (!initData) {
    return workoutLogResponse("missing_init_data", 400);
  }

  if (!hasOnlyAllowedRequestKeys(body, WORKOUT_LOG_REQUEST_KEYS)) {
    return workoutLogResponse("invalid_workout_log_payload", 400);
  }

  const requestBody = body as WorkoutLogRequestBody;
  const payload = parseWorkoutLogPayload(requestBody);

  if (!payload) {
    return workoutLogResponse("invalid_workout_log_payload", 400);
  }

  const validation = validateTelegramInitData(initData);

  if (!validation.ok || !validation.user) {
    const validationStatus = validation.status === "valid" ? "invalid_init_data" : validation.status;

    return workoutLogResponse(validationStatus, getHttpStatus(validationStatus));
  }

  const supabase = createServiceRoleSupabaseClient();
  const profileResult = await getOrCreateTelegramProfile(validation.user, supabase);

  if (!profileResult.ok) {
    return workoutLogResponse(profileResult.status, getHttpStatus(profileResult.status));
  }

  if (!supabase) {
    return workoutLogResponse("missing_supabase_config", 503);
  }

  const supabaseClient = supabase;
  const profileId = profileResult.profile.id;
  const existingLog = await readWorkoutLogByClientEvent(profileId, payload.clientEventId);

  if (!existingLog.ok) {
    return workoutLogResponse("workout_log_read_failed", 502, profileId);
  }

  if (existingLog.workoutLog) {
    const workoutToday = await readTodayWorkoutSummary(profileId, existingLog.workoutLog.logged_date);

    if (!workoutToday.ok) {
      return workoutLogResponse("workout_log_read_failed", 502, profileId, existingLog.workoutLog);
    }

    return workoutLogResponse(
      "already_logged",
      200,
      profileId,
      toWorkoutLogSummary(existingLog.workoutLog),
      workoutToday.summary,
      await syncWorkoutLogQuest({
        supabaseClient,
        profileId,
        questDate: existingLog.workoutLog.logged_date,
        sessionCount: workoutToday.summary.sessionCount,
        workoutType: existingLog.workoutLog.workout_type
      })
    );
  }

  const inserted = await supabaseClient
    .from("workout_logs")
    .insert({
      profile_id: profileId,
      client_event_id: payload.clientEventId,
      workout_type: payload.workoutType,
      workout_name: payload.workoutName,
      duration_min: payload.durationMin,
      rpe: payload.rpe,
      note: payload.note
    })
    .select(WORKOUT_LOG_COLUMNS)
    .single();

  if (inserted.error || !inserted.data) {
    if (isUniqueConflict(inserted.error)) {
      const repeatedLog = await readWorkoutLogByClientEvent(profileId, payload.clientEventId);

      if (!repeatedLog.ok || !repeatedLog.workoutLog) {
        return workoutLogResponse("workout_log_read_failed", 502, profileId);
      }

      const workoutToday = await readTodayWorkoutSummary(profileId, repeatedLog.workoutLog.logged_date);

      if (!workoutToday.ok) {
        return workoutLogResponse("workout_log_read_failed", 502, profileId, repeatedLog.workoutLog);
      }

      return workoutLogResponse(
        "already_logged",
        200,
        profileId,
        toWorkoutLogSummary(repeatedLog.workoutLog),
        workoutToday.summary,
        await syncWorkoutLogQuest({
          supabaseClient,
          profileId,
          questDate: repeatedLog.workoutLog.logged_date,
          sessionCount: workoutToday.summary.sessionCount,
          workoutType: repeatedLog.workoutLog.workout_type
        })
      );
    }

    return workoutLogResponse("workout_log_write_failed", 502, profileId);
  }

  const workoutLog = inserted.data as WorkoutLogRow;
  const workoutToday = await readTodayWorkoutSummary(profileId, workoutLog.logged_date);

  if (!workoutToday.ok) {
    return workoutLogResponse("workout_log_read_failed", 502, profileId, workoutLog);
  }

  return workoutLogResponse(
    "ready",
    200,
    profileId,
    toWorkoutLogSummary(workoutLog),
    workoutToday.summary,
    await syncWorkoutLogQuest({
      supabaseClient,
      profileId,
      questDate: workoutLog.logged_date,
      sessionCount: workoutToday.summary.sessionCount,
      workoutType: workoutLog.workout_type
    })
  );

  async function readWorkoutLogByClientEvent(profileId: string, clientEventId: string) {
    const result = await supabaseClient
      .from("workout_logs")
      .select(WORKOUT_LOG_COLUMNS)
      .eq("profile_id", profileId)
      .eq("client_event_id", clientEventId)
      .maybeSingle();

    if (result.error) {
      return {
        ok: false
      } as const;
    }

    return {
      ok: true,
      workoutLog: result.data ? (result.data as WorkoutLogRow) : null
    } as const;
  }

  async function readTodayWorkoutSummary(profileId: string, loggedDate: string) {
    const result = await supabaseClient
      .from("workout_logs")
      .select("id, duration_min")
      .eq("profile_id", profileId)
      .eq("logged_date", loggedDate);

    if (result.error || !result.data) {
      return {
        ok: false
      } as const;
    }

    const totalDurationMinutes = result.data.reduce(
      (total, workoutLog) => total + (workoutLog.duration_min ?? 0),
      0
    );

    return {
      ok: true,
      summary: {
        date: loggedDate,
        sessionCount: result.data.length,
        totalDurationMinutes
      }
    } as const;
  }
}

function parseWorkoutLogPayload(body: WorkoutLogRequestBody) {
  if (typeof body.clientEventId !== "string" || !UUID_PATTERN.test(body.clientEventId)) {
    return null;
  }

  if (!isWorkoutType(body.workoutType)) {
    return null;
  }

  if (body.workoutName !== undefined && typeof body.workoutName !== "string") {
    return null;
  }

  if (body.durationMin !== undefined && !isDurationMin(body.durationMin)) {
    return null;
  }

  if (body.rpe !== undefined && !isRpe(body.rpe)) {
    return null;
  }

  if (body.note !== undefined && typeof body.note !== "string") {
    return null;
  }

  const workoutName = body.workoutName?.trim();
  const note = body.note?.trim();

  if (workoutName && workoutName.length > MAX_WORKOUT_NAME_LENGTH) {
    return null;
  }

  if (note && note.length > MAX_NOTE_LENGTH) {
    return null;
  }

  return {
    clientEventId: body.clientEventId,
    workoutType: body.workoutType,
    workoutName: workoutName || null,
    durationMin: body.durationMin ?? null,
    rpe: body.rpe ?? null,
    note: note || null
  };
}

function isWorkoutType(value: unknown): value is WorkoutType {
  return (
    value === "strength" ||
    value === "cardio" ||
    value === "mobility" ||
    value === "mixed" ||
    value === "other"
  );
}

function isDurationMin(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 360;
}

function isRpe(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 10;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyAllowedRequestKeys(body: Record<string, unknown>, allowedKeys: ReadonlySet<string>) {
  return Object.keys(body).every((key) => allowedKeys.has(key));
}

function isUniqueConflict(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "23505"
  );
}

function toWorkoutLogSummary(workoutLog: WorkoutLogRow): WorkoutLogSummary {
  return {
    id: workoutLog.id,
    clientEventId: workoutLog.client_event_id,
    workoutType: workoutLog.workout_type,
    workoutName: workoutLog.workout_name,
    durationMin: workoutLog.duration_min,
    rpe: workoutLog.rpe,
    loggedAt: workoutLog.logged_at,
    loggedDate: workoutLog.logged_date,
    note: workoutLog.note,
    createdAt: workoutLog.created_at
  };
}

function workoutLogResponse(
  status: WorkoutLogResponse["status"],
  httpStatus: number,
  profileId: string | null = null,
  workoutLog: WorkoutLogSummary | WorkoutLogRow | null = null,
  workoutToday: WorkoutTodaySummary | null = null,
  questSync: LogQuestSyncSummary = {
    status: "not_matched",
    questCompletion: null
  }
) {
  const workoutLogSummary = workoutLog
    ? "client_event_id" in workoutLog
      ? toWorkoutLogSummary(workoutLog)
      : workoutLog
    : null;

  return NextResponse.json<WorkoutLogResponse>(
    {
      ok: status === "ready" || status === "already_logged",
      status,
      profileId,
      workoutLog: workoutLogSummary,
      workoutToday,
      questSync,
      todaySessionCount: workoutToday?.sessionCount ?? 0,
      todayTotalDurationMinutes: workoutToday?.totalDurationMinutes ?? 0
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
