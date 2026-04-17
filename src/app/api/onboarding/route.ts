import { NextResponse } from "next/server";
import { MVP_GOAL_TYPES, MVP_PATH_KEYS } from "@/config/app";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import { getOrCreateTelegramProfile } from "@/lib/telegram/profile-identity";
import { validateTelegramInitData } from "@/lib/telegram/server";
import type {
  MvpGoalType,
  MvpPathKey,
  OnboardingPersistenceResponse
} from "@/shared/types/game";
import type { TelegramAuthStatus } from "@/shared/types/telegram";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface OnboardingRequestBody {
  initData?: unknown;
  goalType?: unknown;
  targetValue?: unknown;
  pathKey?: unknown;
}

const MAX_TARGET_VALUE_LENGTH = 160;

export async function POST(request: Request) {
  let body: OnboardingRequestBody;

  try {
    body = (await request.json()) as OnboardingRequestBody;
  } catch {
    return onboardingResponse("invalid_onboarding_payload", 400);
  }

  if (typeof body.initData !== "string") {
    return onboardingResponse("missing_init_data", 400);
  }

  const payload = parseOnboardingPayload(body);

  if (!payload) {
    return onboardingResponse("invalid_onboarding_payload", 400);
  }

  const validation = validateTelegramInitData(body.initData);

  if (!validation.ok || !validation.user) {
    const validationStatus = validation.status === "valid" ? "invalid_init_data" : validation.status;

    return onboardingResponse(validationStatus, getHttpStatus(validationStatus));
  }

  const supabase = createServiceRoleSupabaseClient();
  const profileResult = await getOrCreateTelegramProfile(validation.user, supabase);

  if (!profileResult.ok) {
    return onboardingResponse(profileResult.status, getHttpStatus(profileResult.status));
  }

  if (!supabase) {
    return onboardingResponse("missing_supabase_config", 503);
  }

  const profileId = profileResult.profile.id;
  const inactiveGoals = await supabase
    .from("goals")
    .update({ status: "inactive" })
    .eq("profile_id", profileId)
    .eq("status", "active");

  if (inactiveGoals.error) {
    return onboardingResponse("onboarding_write_failed", 502, profileId);
  }

  const goal = await supabase
    .from("goals")
    .insert({
      profile_id: profileId,
      goal_type: payload.goalType,
      target_value: payload.targetValue
    })
    .select("id")
    .single();

  if (goal.error || !goal.data) {
    return onboardingResponse("onboarding_write_failed", 502, profileId);
  }

  const inactivePaths = await supabase
    .from("user_paths")
    .update({ is_active: false })
    .eq("profile_id", profileId)
    .eq("is_active", true);

  if (inactivePaths.error) {
    return onboardingResponse("onboarding_write_failed", 502, profileId, goal.data.id);
  }

  const path = await supabase
    .from("user_paths")
    .insert({
      profile_id: profileId,
      path_key: payload.pathKey,
      is_active: true
    })
    .select("id")
    .single();

  if (path.error || !path.data) {
    return onboardingResponse("onboarding_write_failed", 502, profileId, goal.data.id);
  }

  return onboardingResponse("ready", 200, profileId, goal.data.id, path.data.id);
}

function parseOnboardingPayload(body: OnboardingRequestBody) {
  if (!isMvpGoalType(body.goalType) || !isMvpPathKey(body.pathKey)) {
    return null;
  }

  if (body.targetValue !== undefined && typeof body.targetValue !== "string") {
    return null;
  }

  const targetValue = body.targetValue?.trim();

  if (targetValue && targetValue.length > MAX_TARGET_VALUE_LENGTH) {
    return null;
  }

  return {
    goalType: body.goalType,
    pathKey: body.pathKey,
    targetValue: targetValue || null
  };
}

function isMvpGoalType(value: unknown): value is MvpGoalType {
  return typeof value === "string" && MVP_GOAL_TYPES.includes(value as MvpGoalType);
}

function isMvpPathKey(value: unknown): value is MvpPathKey {
  return typeof value === "string" && MVP_PATH_KEYS.includes(value as MvpPathKey);
}

function onboardingResponse(
  status: OnboardingPersistenceResponse["status"],
  httpStatus: number,
  profileId: string | null = null,
  goalId: string | null = null,
  pathId: string | null = null
) {
  return NextResponse.json<OnboardingPersistenceResponse>(
    {
      ok: status === "ready",
      status,
      profileId,
      goalId,
      pathId
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
