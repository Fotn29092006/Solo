import { createHmac, timingSafeEqual } from "crypto";
import type {
  TelegramIdentityHint,
  TelegramInitDataValidationResult,
  TelegramValidatedUser
} from "@/shared/types/telegram";

const TELEGRAM_WEB_APP_SECRET_KEY = "WebAppData";
const DEFAULT_MAX_AUTH_AGE_SECONDS = 24 * 60 * 60;
const MAX_INIT_DATA_LENGTH = 4096;

interface ValidateTelegramInitDataOptions {
  botToken?: string;
  maxAuthAgeSeconds?: number;
  now?: Date;
}

export function validateTelegramInitData(
  initData: string,
  options: ValidateTelegramInitDataOptions = {}
): TelegramInitDataValidationResult {
  const botToken = options.botToken ?? process.env.TELEGRAM_BOT_TOKEN;
  const maxAuthAgeSeconds = options.maxAuthAgeSeconds ?? DEFAULT_MAX_AUTH_AGE_SECONDS;
  const now = options.now ?? new Date();

  if (!botToken) {
    return invalid("missing_bot_token");
  }

  if (!initData || initData.length > MAX_INIT_DATA_LENGTH) {
    return invalid(initData ? "invalid_init_data" : "missing_init_data");
  }

  const params = new URLSearchParams(initData);
  const receivedHash = params.get("hash");

  if (!receivedHash) {
    return invalid("missing_hash");
  }

  params.delete("hash");

  const dataCheckString = Array.from(params.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  if (!dataCheckString || !isValidHash(dataCheckString, botToken, receivedHash)) {
    return invalid("invalid_hash");
  }

  const authDate = parseAuthDate(params.get("auth_date"));

  if (!authDate) {
    return invalid("missing_auth_date");
  }

  if (isStaleAuthDate(authDate, now, maxAuthAgeSeconds)) {
    return invalid("stale_auth_date");
  }

  const user = parseTelegramUser(params.get("user"));

  if (!user) {
    return invalid("invalid_user");
  }

  const identity: TelegramIdentityHint = {
    provider: "telegram",
    telegramUserId: String(user.id)
  };

  return {
    ok: true,
    status: "valid",
    user,
    identity,
    authDate: authDate.toISOString()
  };
}

function isValidHash(dataCheckString: string, botToken: string, receivedHash: string) {
  if (!/^[a-f0-9]{64}$/i.test(receivedHash)) {
    return false;
  }

  const secretKey = createHmac("sha256", TELEGRAM_WEB_APP_SECRET_KEY).update(botToken).digest();
  const expectedHash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
  const expected = Buffer.from(expectedHash, "hex");
  const received = Buffer.from(receivedHash, "hex");

  return expected.length === received.length && timingSafeEqual(expected, received);
}

function parseAuthDate(value: string | null) {
  if (!value || !/^\d+$/.test(value)) {
    return null;
  }

  const timestampSeconds = Number(value);

  if (!Number.isSafeInteger(timestampSeconds) || timestampSeconds <= 0) {
    return null;
  }

  const authDate = new Date(timestampSeconds * 1000);

  return Number.isNaN(authDate.getTime()) ? null : authDate;
}

function isStaleAuthDate(authDate: Date, now: Date, maxAuthAgeSeconds: number) {
  const ageSeconds = Math.floor((now.getTime() - authDate.getTime()) / 1000);

  return ageSeconds < 0 || ageSeconds > maxAuthAgeSeconds;
}

function parseTelegramUser(value: string | null): TelegramValidatedUser | null {
  if (!value) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (!isTelegramUserRecord(parsed)) {
      return null;
    }

    return {
      id: parsed.id,
      firstName: optionalString(parsed.first_name),
      lastName: optionalString(parsed.last_name),
      username: optionalString(parsed.username),
      languageCode: optionalString(parsed.language_code),
      isPremium: parsed.is_premium === true ? true : undefined,
      photoUrl: optionalString(parsed.photo_url)
    };
  } catch {
    return null;
  }
}

function isTelegramUserRecord(value: unknown): value is {
  id: number;
  is_bot?: boolean;
  first_name?: unknown;
  last_name?: unknown;
  username?: unknown;
  language_code?: unknown;
  is_premium?: unknown;
  photo_url?: unknown;
} {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as { id?: unknown; is_bot?: unknown };

  return typeof record.id === "number" && Number.isSafeInteger(record.id) && record.id > 0 && record.is_bot !== true;
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function invalid(status: TelegramInitDataValidationResult["status"]): TelegramInitDataValidationResult {
  return {
    ok: false,
    status,
    user: null,
    identity: null,
    authDate: null
  };
}
