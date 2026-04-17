import { NextResponse } from "next/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import { getOrCreateTelegramProfile } from "@/lib/telegram/profile-identity";
import { readTelegramInitData } from "@/lib/telegram/request-init-data";
import { validateTelegramInitData } from "@/lib/telegram/server";
import type { Database } from "@/shared/types/database";
import type { SleepLogResponse, SleepLogSummary, SleepTodaySummary } from "@/shared/types/game";
import type { TelegramAuthStatus } from "@/shared/types/telegram";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface SleepLogRequestBody {
  initData?: unknown;
  clientEventId?: unknown;
  sleepDurationMin?: unknown;
  sleepQuality?: unknown;
  morningEnergy?: unknown;
  note?: unknown;
}

type SleepLogRow = Database["public"]["Tables"]["sleep_logs"]["Row"];

const MAX_NOTE_LENGTH = 240;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLEEP_LOG_COLUMNS =
  "id, client_event_id, sleep_duration_min, sleep_quality, morning_energy, logged_at, logged_date, note, created_at";
const SLEEP_LOG_REQUEST_KEYS = new Set([
  "initData",
  "clientEventId",
  "sleepDurationMin",
  "sleepQuality",
  "morningEnergy",
  "note"
]);

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return sleepLogResponse("invalid_sleep_log_payload", 400);
  }

  if (!isObjectRecord(body)) {
    return sleepLogResponse("missing_init_data", 400);
  }

  const initData = readTelegramInitData(request, body);

  if (!initData) {
    return sleepLogResponse("missing_init_data", 400);
  }

  if (!hasOnlyAllowedRequestKeys(body, SLEEP_LOG_REQUEST_KEYS)) {
    return sleepLogResponse("invalid_sleep_log_payload", 400);
  }

  const requestBody = body as SleepLogRequestBody;
  const payload = parseSleepLogPayload(requestBody);

  if (!payload) {
    return sleepLogResponse("invalid_sleep_log_payload", 400);
  }

  const validation = validateTelegramInitData(initData);

  if (!validation.ok || !validation.user) {
    const validationStatus = validation.status === "valid" ? "invalid_init_data" : validation.status;

    return sleepLogResponse(validationStatus, getHttpStatus(validationStatus));
  }

  const supabase = createServiceRoleSupabaseClient();
  const profileResult = await getOrCreateTelegramProfile(validation.user, supabase);

  if (!profileResult.ok) {
    return sleepLogResponse(profileResult.status, getHttpStatus(profileResult.status));
  }

  if (!supabase) {
    return sleepLogResponse("missing_supabase_config", 503);
  }

  const supabaseClient = supabase;
  const profileId = profileResult.profile.id;
  const existingLog = await readSleepLogByClientEvent(profileId, payload.clientEventId);

  if (!existingLog.ok) {
    return sleepLogResponse("sleep_log_read_failed", 502, profileId);
  }

  if (existingLog.sleepLog) {
    const sleepToday = await readTodaySleepSummary(profileId, existingLog.sleepLog.logged_date);

    if (!sleepToday.ok) {
      return sleepLogResponse("sleep_log_read_failed", 502, profileId, existingLog.sleepLog);
    }

    return sleepLogResponse(
      "already_logged",
      200,
      profileId,
      toSleepLogSummary(existingLog.sleepLog),
      sleepToday.summary
    );
  }

  const inserted = await supabaseClient
    .from("sleep_logs")
    .insert({
      profile_id: profileId,
      client_event_id: payload.clientEventId,
      sleep_duration_min: payload.sleepDurationMin,
      sleep_quality: payload.sleepQuality,
      morning_energy: payload.morningEnergy,
      note: payload.note
    })
    .select(SLEEP_LOG_COLUMNS)
    .single();

  if (inserted.error || !inserted.data) {
    if (isUniqueConflict(inserted.error)) {
      const repeatedLog = await readSleepLogByClientEvent(profileId, payload.clientEventId);

      if (!repeatedLog.ok || !repeatedLog.sleepLog) {
        return sleepLogResponse("sleep_log_read_failed", 502, profileId);
      }

      const sleepToday = await readTodaySleepSummary(profileId, repeatedLog.sleepLog.logged_date);

      if (!sleepToday.ok) {
        return sleepLogResponse("sleep_log_read_failed", 502, profileId, repeatedLog.sleepLog);
      }

      return sleepLogResponse(
        "already_logged",
        200,
        profileId,
        toSleepLogSummary(repeatedLog.sleepLog),
        sleepToday.summary
      );
    }

    return sleepLogResponse("sleep_log_write_failed", 502, profileId);
  }

  const sleepLog = inserted.data as SleepLogRow;
  const sleepToday = await readTodaySleepSummary(profileId, sleepLog.logged_date);

  if (!sleepToday.ok) {
    return sleepLogResponse("sleep_log_read_failed", 502, profileId, sleepLog);
  }

  return sleepLogResponse("ready", 200, profileId, toSleepLogSummary(sleepLog), sleepToday.summary);

  async function readSleepLogByClientEvent(profileId: string, clientEventId: string) {
    const result = await supabaseClient
      .from("sleep_logs")
      .select(SLEEP_LOG_COLUMNS)
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
      sleepLog: result.data ? (result.data as SleepLogRow) : null
    } as const;
  }

  async function readTodaySleepSummary(profileId: string, loggedDate: string) {
    const result = await supabaseClient
      .from("sleep_logs")
      .select("id, sleep_duration_min")
      .eq("profile_id", profileId)
      .eq("logged_date", loggedDate);

    if (result.error || !result.data) {
      return {
        ok: false
      } as const;
    }

    return {
      ok: true,
      summary: {
        date: loggedDate,
        logCount: result.data.length,
        totalSleepDurationMinutes: result.data.reduce(
          (total, sleepLog) => total + sleepLog.sleep_duration_min,
          0
        )
      }
    } as const;
  }
}

function parseSleepLogPayload(body: SleepLogRequestBody) {
  if (typeof body.clientEventId !== "string" || !UUID_PATTERN.test(body.clientEventId)) {
    return null;
  }

  if (!isSleepDurationMin(body.sleepDurationMin)) {
    return null;
  }

  if (body.sleepQuality !== undefined && !isScore(body.sleepQuality)) {
    return null;
  }

  if (body.morningEnergy !== undefined && !isScore(body.morningEnergy)) {
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
    clientEventId: body.clientEventId,
    sleepDurationMin: body.sleepDurationMin,
    sleepQuality: body.sleepQuality ?? null,
    morningEnergy: body.morningEnergy ?? null,
    note: note || null
  };
}

function isSleepDurationMin(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 1440;
}

function isScore(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
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

function toSleepLogSummary(sleepLog: SleepLogRow): SleepLogSummary {
  return {
    id: sleepLog.id,
    clientEventId: sleepLog.client_event_id,
    sleepDurationMin: sleepLog.sleep_duration_min,
    sleepQuality: sleepLog.sleep_quality,
    morningEnergy: sleepLog.morning_energy,
    loggedAt: sleepLog.logged_at,
    loggedDate: sleepLog.logged_date,
    note: sleepLog.note,
    createdAt: sleepLog.created_at
  };
}

function sleepLogResponse(
  status: SleepLogResponse["status"],
  httpStatus: number,
  profileId: string | null = null,
  sleepLog: SleepLogSummary | SleepLogRow | null = null,
  sleepToday: SleepTodaySummary | null = null
) {
  const sleepLogSummary = sleepLog
    ? "client_event_id" in sleepLog
      ? toSleepLogSummary(sleepLog)
      : sleepLog
    : null;

  return NextResponse.json<SleepLogResponse>(
    {
      ok: status === "ready" || status === "already_logged",
      status,
      profileId,
      sleepLog: sleepLogSummary,
      sleepToday,
      todayLogCount: sleepToday?.logCount ?? 0,
      todayTotalSleepDurationMinutes: sleepToday?.totalSleepDurationMinutes ?? 0
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
