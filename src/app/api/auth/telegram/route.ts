import { NextResponse } from "next/server";
import { validateTelegramInitData } from "@/lib/telegram/server";

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
    return NextResponse.json(
      {
        ok: false,
        status: "invalid_init_data",
        user: null,
        identity: null,
        authDate: null
      },
      { status: 400 }
    );
  }

  if (typeof body.initData !== "string") {
    return NextResponse.json(
      {
        ok: false,
        status: "missing_init_data",
        user: null,
        identity: null,
        authDate: null
      },
      { status: 400 }
    );
  }

  const result = validateTelegramInitData(body.initData);
  const status = getHttpStatus(result.status);

  return NextResponse.json(result, { status });
}

function getHttpStatus(status: ReturnType<typeof validateTelegramInitData>["status"]) {
  switch (status) {
    case "valid":
      return 200;
    case "missing_bot_token":
      return 503;
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
