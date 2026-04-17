import { NextResponse } from "next/server";
import { getOrCreateTelegramProfile } from "@/lib/telegram/profile-identity";
import { validateTelegramInitData } from "@/lib/telegram/server";
import type { TelegramAuthResponse, TelegramAuthStatus } from "@/shared/types/telegram";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface TelegramAuthRequestBody {
  initData?: unknown;
}

export async function POST(request: Request) {
  let body: TelegramAuthRequestBody;

  try {
    body = (await request.json()) as TelegramAuthRequestBody;
  } catch {
    return NextResponse.json<TelegramAuthResponse>(
      {
        ok: false,
        status: "invalid_init_data",
        user: null,
        identity: null,
        authDate: null,
        profile: null
      },
      { status: 400 }
    );
  }

  if (typeof body.initData !== "string") {
    return NextResponse.json<TelegramAuthResponse>(
      {
        ok: false,
        status: "missing_init_data",
        user: null,
        identity: null,
        authDate: null,
        profile: null
      },
      { status: 400 }
    );
  }

  const result = validateTelegramInitData(body.initData);

  if (!result.ok || !result.user) {
    return NextResponse.json<TelegramAuthResponse>(
      {
        ...result,
        profile: null
      },
      { status: getHttpStatus(result.status) }
    );
  }

  const profileResult = await getOrCreateTelegramProfile(result.user);

  if (!profileResult.ok) {
    return NextResponse.json<TelegramAuthResponse>(
      {
        ...result,
        ok: false,
        status: profileResult.status,
        profile: null
      },
      { status: getHttpStatus(profileResult.status) }
    );
  }

  return NextResponse.json<TelegramAuthResponse>(
    {
      ...result,
      profile: profileResult.profile
    },
    { status: 200 }
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
