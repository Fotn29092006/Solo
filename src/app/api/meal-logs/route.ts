import { NextResponse } from "next/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import { getOrCreateTelegramProfile } from "@/lib/telegram/profile-identity";
import { readTelegramInitData } from "@/lib/telegram/request-init-data";
import { validateTelegramInitData } from "@/lib/telegram/server";
import type { Database } from "@/shared/types/database";
import type { MealLogResponse, MealLogSummary, MealTodaySummary, MealType } from "@/shared/types/game";
import type { TelegramAuthStatus } from "@/shared/types/telegram";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface MealLogRequestBody {
  initData?: unknown;
  clientEventId?: unknown;
  mealType?: unknown;
  mealName?: unknown;
  calories?: unknown;
  proteinG?: unknown;
  note?: unknown;
}

type MealLogRow = Database["public"]["Tables"]["meal_logs"]["Row"];

const MAX_MEAL_NAME_LENGTH = 120;
const MAX_NOTE_LENGTH = 240;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MEAL_LOG_COLUMNS =
  "id, client_event_id, meal_type, meal_name, calories, protein_g, logged_at, logged_date, note, created_at";
const MEAL_LOG_REQUEST_KEYS = new Set([
  "initData",
  "clientEventId",
  "mealType",
  "mealName",
  "calories",
  "proteinG",
  "note"
]);

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return mealLogResponse("invalid_meal_log_payload", 400);
  }

  if (!isObjectRecord(body)) {
    return mealLogResponse("missing_init_data", 400);
  }

  const initData = readTelegramInitData(request, body);

  if (!initData) {
    return mealLogResponse("missing_init_data", 400);
  }

  if (!hasOnlyAllowedRequestKeys(body, MEAL_LOG_REQUEST_KEYS)) {
    return mealLogResponse("invalid_meal_log_payload", 400);
  }

  const requestBody = body as MealLogRequestBody;
  const payload = parseMealLogPayload(requestBody);

  if (!payload) {
    return mealLogResponse("invalid_meal_log_payload", 400);
  }

  const validation = validateTelegramInitData(initData);

  if (!validation.ok || !validation.user) {
    const validationStatus = validation.status === "valid" ? "invalid_init_data" : validation.status;

    return mealLogResponse(validationStatus, getHttpStatus(validationStatus));
  }

  const supabase = createServiceRoleSupabaseClient();
  const profileResult = await getOrCreateTelegramProfile(validation.user, supabase);

  if (!profileResult.ok) {
    return mealLogResponse(profileResult.status, getHttpStatus(profileResult.status));
  }

  if (!supabase) {
    return mealLogResponse("missing_supabase_config", 503);
  }

  const supabaseClient = supabase;
  const profileId = profileResult.profile.id;
  const existingLog = await readMealLogByClientEvent(profileId, payload.clientEventId);

  if (!existingLog.ok) {
    return mealLogResponse("meal_log_read_failed", 502, profileId);
  }

  if (existingLog.mealLog) {
    const mealToday = await readTodayMealSummary(profileId, existingLog.mealLog.logged_date);

    if (!mealToday.ok) {
      return mealLogResponse("meal_log_read_failed", 502, profileId, existingLog.mealLog);
    }

    return mealLogResponse(
      "already_logged",
      200,
      profileId,
      toMealLogSummary(existingLog.mealLog),
      mealToday.summary
    );
  }

  const inserted = await supabaseClient
    .from("meal_logs")
    .insert({
      profile_id: profileId,
      client_event_id: payload.clientEventId,
      meal_type: payload.mealType,
      meal_name: payload.mealName,
      calories: payload.calories,
      protein_g: payload.proteinG,
      note: payload.note
    })
    .select(MEAL_LOG_COLUMNS)
    .single();

  if (inserted.error || !inserted.data) {
    if (isUniqueConflict(inserted.error)) {
      const repeatedLog = await readMealLogByClientEvent(profileId, payload.clientEventId);

      if (!repeatedLog.ok || !repeatedLog.mealLog) {
        return mealLogResponse("meal_log_read_failed", 502, profileId);
      }

      const mealToday = await readTodayMealSummary(profileId, repeatedLog.mealLog.logged_date);

      if (!mealToday.ok) {
        return mealLogResponse("meal_log_read_failed", 502, profileId, repeatedLog.mealLog);
      }

      return mealLogResponse(
        "already_logged",
        200,
        profileId,
        toMealLogSummary(repeatedLog.mealLog),
        mealToday.summary
      );
    }

    return mealLogResponse("meal_log_write_failed", 502, profileId);
  }

  const mealLog = inserted.data as MealLogRow;
  const mealToday = await readTodayMealSummary(profileId, mealLog.logged_date);

  if (!mealToday.ok) {
    return mealLogResponse("meal_log_read_failed", 502, profileId, mealLog);
  }

  return mealLogResponse("ready", 200, profileId, toMealLogSummary(mealLog), mealToday.summary);

  async function readMealLogByClientEvent(profileId: string, clientEventId: string) {
    const result = await supabaseClient
      .from("meal_logs")
      .select(MEAL_LOG_COLUMNS)
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
      mealLog: result.data ? (result.data as MealLogRow) : null
    } as const;
  }

  async function readTodayMealSummary(profileId: string, loggedDate: string) {
    const result = await supabaseClient
      .from("meal_logs")
      .select("id")
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
        mealCount: result.data.length
      }
    } as const;
  }
}

function parseMealLogPayload(body: MealLogRequestBody) {
  if (typeof body.clientEventId !== "string" || !UUID_PATTERN.test(body.clientEventId)) {
    return null;
  }

  if (!isMealType(body.mealType)) {
    return null;
  }

  if (body.mealName !== undefined && typeof body.mealName !== "string") {
    return null;
  }

  if (body.calories !== undefined && !isCalories(body.calories)) {
    return null;
  }

  if (body.proteinG !== undefined && !isProteinG(body.proteinG)) {
    return null;
  }

  if (body.note !== undefined && typeof body.note !== "string") {
    return null;
  }

  const mealName = body.mealName?.trim();
  const note = body.note?.trim();

  if (mealName && mealName.length > MAX_MEAL_NAME_LENGTH) {
    return null;
  }

  if (note && note.length > MAX_NOTE_LENGTH) {
    return null;
  }

  return {
    clientEventId: body.clientEventId,
    mealType: body.mealType,
    mealName: mealName || null,
    calories: body.calories ?? null,
    proteinG: body.proteinG ?? null,
    note: note || null
  };
}

function isMealType(value: unknown): value is MealType {
  return (
    value === "breakfast" ||
    value === "lunch" ||
    value === "dinner" ||
    value === "snack" ||
    value === "other"
  );
}

function isCalories(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 10000;
}

function isProteinG(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 500;
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

function toMealLogSummary(mealLog: MealLogRow): MealLogSummary {
  return {
    id: mealLog.id,
    clientEventId: mealLog.client_event_id,
    mealType: mealLog.meal_type,
    mealName: mealLog.meal_name,
    calories: mealLog.calories,
    proteinG: mealLog.protein_g,
    loggedAt: mealLog.logged_at,
    loggedDate: mealLog.logged_date,
    note: mealLog.note,
    createdAt: mealLog.created_at
  };
}

function mealLogResponse(
  status: MealLogResponse["status"],
  httpStatus: number,
  profileId: string | null = null,
  mealLog: MealLogSummary | MealLogRow | null = null,
  mealToday: MealTodaySummary | null = null
) {
  const mealLogSummary = mealLog
    ? "client_event_id" in mealLog
      ? toMealLogSummary(mealLog)
      : mealLog
    : null;

  return NextResponse.json<MealLogResponse>(
    {
      ok: status === "ready" || status === "already_logged",
      status,
      profileId,
      mealLog: mealLogSummary,
      mealToday,
      todayMealCount: mealToday?.mealCount ?? 0
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
