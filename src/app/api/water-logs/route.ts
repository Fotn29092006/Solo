import { NextResponse } from "next/server";
import { syncWaterLogQuest } from "@/lib/quests/log-quest-sync";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import { getOrCreateTelegramProfile } from "@/lib/telegram/profile-identity";
import { readTelegramInitData } from "@/lib/telegram/request-init-data";
import { validateTelegramInitData } from "@/lib/telegram/server";
import type { Database } from "@/shared/types/database";
import type { LogQuestSyncSummary, WaterLogResponse, WaterLogSummary, WaterTodaySummary } from "@/shared/types/game";
import type { TelegramAuthStatus } from "@/shared/types/telegram";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface WaterLogRequestBody {
  initData?: unknown;
  amountMl?: unknown;
  clientEventId?: unknown;
  note?: unknown;
}

type WaterLogRow = Database["public"]["Tables"]["water_logs"]["Row"];

const MAX_NOTE_LENGTH = 240;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const WATER_LOG_COLUMNS = "id, client_event_id, amount_ml, logged_at, logged_date, note, created_at";
const WATER_LOG_REQUEST_KEYS = new Set(["initData", "amountMl", "clientEventId", "note"]);

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return waterLogResponse("invalid_water_log_payload", 400);
  }

  if (!isObjectRecord(body)) {
    return waterLogResponse("missing_init_data", 400);
  }

  const initData = readTelegramInitData(request, body);

  if (!initData) {
    return waterLogResponse("missing_init_data", 400);
  }

  if (!hasOnlyAllowedRequestKeys(body, WATER_LOG_REQUEST_KEYS)) {
    return waterLogResponse("invalid_water_log_payload", 400);
  }

  const requestBody = body as WaterLogRequestBody;
  const payload = parseWaterLogPayload(requestBody);

  if (!payload) {
    return waterLogResponse("invalid_water_log_payload", 400);
  }

  const validation = validateTelegramInitData(initData);

  if (!validation.ok || !validation.user) {
    const validationStatus = validation.status === "valid" ? "invalid_init_data" : validation.status;

    return waterLogResponse(validationStatus, getHttpStatus(validationStatus));
  }

  const supabase = createServiceRoleSupabaseClient();
  const profileResult = await getOrCreateTelegramProfile(validation.user, supabase);

  if (!profileResult.ok) {
    return waterLogResponse(profileResult.status, getHttpStatus(profileResult.status));
  }

  if (!supabase) {
    return waterLogResponse("missing_supabase_config", 503);
  }

  const supabaseClient = supabase;
  const profileId = profileResult.profile.id;
  const existingLog = await readWaterLogByClientEvent(profileId, payload.clientEventId);

  if (!existingLog.ok) {
    return waterLogResponse("water_log_read_failed", 502, profileId);
  }

  if (existingLog.waterLog) {
    const waterToday = await readTodayWaterSummary(profileId, existingLog.waterLog.logged_date);

    if (!waterToday.ok) {
      return waterLogResponse("water_log_read_failed", 502, profileId, existingLog.waterLog);
    }

    return waterLogResponse(
      "already_logged",
      200,
      profileId,
      toWaterLogSummary(existingLog.waterLog),
      waterToday.summary,
      await syncWaterLogQuest({
        supabaseClient,
        profileId,
        questDate: existingLog.waterLog.logged_date,
        totalMl: waterToday.summary.totalMl
      })
    );
  }

  const inserted = await supabaseClient
    .from("water_logs")
    .insert({
      profile_id: profileId,
      client_event_id: payload.clientEventId,
      amount_ml: payload.amountMl,
      note: payload.note
    })
    .select(WATER_LOG_COLUMNS)
    .single();

  if (inserted.error || !inserted.data) {
    if (isUniqueConflict(inserted.error)) {
      const repeatedLog = await readWaterLogByClientEvent(profileId, payload.clientEventId);

      if (!repeatedLog.ok || !repeatedLog.waterLog) {
        return waterLogResponse("water_log_read_failed", 502, profileId);
      }

      const waterToday = await readTodayWaterSummary(profileId, repeatedLog.waterLog.logged_date);

      if (!waterToday.ok) {
        return waterLogResponse("water_log_read_failed", 502, profileId, repeatedLog.waterLog);
      }

      return waterLogResponse(
        "already_logged",
        200,
        profileId,
        toWaterLogSummary(repeatedLog.waterLog),
        waterToday.summary,
        await syncWaterLogQuest({
          supabaseClient,
          profileId,
          questDate: repeatedLog.waterLog.logged_date,
          totalMl: waterToday.summary.totalMl
        })
      );
    }

    return waterLogResponse("water_log_write_failed", 502, profileId);
  }

  const waterLog = inserted.data as WaterLogRow;
  const waterToday = await readTodayWaterSummary(profileId, waterLog.logged_date);

  if (!waterToday.ok) {
    return waterLogResponse("water_log_read_failed", 502, profileId, waterLog);
  }

  const questSync = await syncWaterLogQuest({
    supabaseClient,
    profileId,
    questDate: waterLog.logged_date,
    totalMl: waterToday.summary.totalMl
  });

  return waterLogResponse("ready", 200, profileId, toWaterLogSummary(waterLog), waterToday.summary, questSync);

  async function readWaterLogByClientEvent(profileId: string, clientEventId: string) {
    const result = await supabaseClient
      .from("water_logs")
      .select(WATER_LOG_COLUMNS)
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
      waterLog: result.data ? (result.data as WaterLogRow) : null
    } as const;
  }

  async function readTodayWaterSummary(profileId: string, loggedDate: string) {
    const result = await supabaseClient
      .from("water_logs")
      .select("id, amount_ml")
      .eq("profile_id", profileId)
      .eq("logged_date", loggedDate);

    if (result.error || !result.data) {
      return {
        ok: false
      } as const;
    }

    const totalMl = result.data.reduce((total, waterLog) => total + waterLog.amount_ml, 0);

    return {
      ok: true,
      summary: {
        date: loggedDate,
        totalMl,
        logCount: result.data.length
      }
    } as const;
  }
}

function parseWaterLogPayload(body: WaterLogRequestBody) {
  if (!isAmountMl(body.amountMl)) {
    return null;
  }

  if (typeof body.clientEventId !== "string" || !UUID_PATTERN.test(body.clientEventId)) {
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
    amountMl: body.amountMl,
    clientEventId: body.clientEventId,
    note: note || null
  };
}

function isAmountMl(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5000;
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

function toWaterLogSummary(waterLog: WaterLogRow): WaterLogSummary {
  return {
    id: waterLog.id,
    clientEventId: waterLog.client_event_id,
    amountMl: waterLog.amount_ml,
    loggedAt: waterLog.logged_at,
    loggedDate: waterLog.logged_date,
    note: waterLog.note,
    createdAt: waterLog.created_at
  };
}

function waterLogResponse(
  status: WaterLogResponse["status"],
  httpStatus: number,
  profileId: string | null = null,
  waterLog: WaterLogSummary | WaterLogRow | null = null,
  waterToday: WaterTodaySummary | null = null,
  questSync: LogQuestSyncSummary = {
    status: "not_matched",
    questCompletion: null
  }
) {
  const waterLogSummary = waterLog
    ? "client_event_id" in waterLog
      ? toWaterLogSummary(waterLog)
      : waterLog
    : null;

  return NextResponse.json<WaterLogResponse>(
    {
      ok: status === "ready" || status === "already_logged",
      status,
      profileId,
      waterLog: waterLogSummary,
      waterToday,
      questSync,
      todayTotalMl: waterToday?.totalMl ?? 0,
      todayLogCount: waterToday?.logCount ?? 0
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
