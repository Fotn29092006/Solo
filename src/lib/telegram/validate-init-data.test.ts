import { createHmac } from "crypto";
import { describe, expect, it } from "vitest";
import { validateTelegramInitData } from "./validate-init-data";

const BOT_TOKEN = "123456:unit-test-token";
const NOW = new Date("2026-04-15T12:00:00.000Z");
const AUTH_DATE = Math.floor(NOW.getTime() / 1000);

interface SignedInitDataOptions {
  authDate?: number;
  user?: string;
  queryId?: string;
}

describe("validateTelegramInitData", () => {
  it("accepts valid signed init data and returns a safe identity hint", () => {
    const result = validateTelegramInitData(createSignedInitData(), {
      botToken: BOT_TOKEN,
      now: NOW
    });

    expect(result).toMatchObject({
      ok: true,
      status: "valid",
      identity: {
        provider: "telegram",
        telegramUserId: "4242424242"
      },
      user: {
        id: 4242424242,
        firstName: "Solo",
        username: "solo_hunter",
        languageCode: "en"
      },
      authDate: NOW.toISOString()
    });
  });

  it("rejects tampered user data", () => {
    const initData = new URLSearchParams(createSignedInitData());

    initData.set(
      "user",
      JSON.stringify({
        id: 1000,
        first_name: "Attacker"
      })
    );

    const result = validateTelegramInitData(initData.toString(), {
      botToken: BOT_TOKEN,
      now: NOW
    });

    expect(result.status).toBe("invalid_hash");
    expect(result.ok).toBe(false);
  });

  it("rejects missing hash", () => {
    const initData = new URLSearchParams(createSignedInitData());
    initData.delete("hash");

    const result = validateTelegramInitData(initData.toString(), {
      botToken: BOT_TOKEN,
      now: NOW
    });

    expect(result.status).toBe("missing_hash");
  });

  it("rejects stale auth dates", () => {
    const staleAuthDate = AUTH_DATE - 24 * 60 * 60 - 1;

    const result = validateTelegramInitData(createSignedInitData({ authDate: staleAuthDate }), {
      botToken: BOT_TOKEN,
      now: NOW
    });

    expect(result.status).toBe("stale_auth_date");
  });

  it("rejects future auth dates", () => {
    const futureAuthDate = AUTH_DATE + 60;

    const result = validateTelegramInitData(createSignedInitData({ authDate: futureAuthDate }), {
      botToken: BOT_TOKEN,
      now: NOW
    });

    expect(result.status).toBe("stale_auth_date");
  });

  it("rejects missing bot tokens", () => {
    const result = validateTelegramInitData(createSignedInitData(), {
      botToken: "",
      now: NOW
    });

    expect(result.status).toBe("missing_bot_token");
  });

  it("rejects malformed signed user JSON", () => {
    const result = validateTelegramInitData(createSignedInitData({ user: "{not-json" }), {
      botToken: BOT_TOKEN,
      now: NOW
    });

    expect(result.status).toBe("invalid_user");
  });

  it("rejects bot users", () => {
    const result = validateTelegramInitData(
      createSignedInitData({
        user: JSON.stringify({
          id: 4242424242,
          is_bot: true,
          first_name: "Bot"
        })
      }),
      {
        botToken: BOT_TOKEN,
        now: NOW
      }
    );

    expect(result.status).toBe("invalid_user");
  });
});

function createSignedInitData(options: SignedInitDataOptions = {}) {
  const params = new URLSearchParams({
    auth_date: String(options.authDate ?? AUTH_DATE),
    query_id: options.queryId ?? "unit-test-query",
    user:
      options.user ??
      JSON.stringify({
        id: 4242424242,
        first_name: "Solo",
        username: "solo_hunter",
        language_code: "en"
      })
  });

  params.set("hash", createTelegramHash(params));

  return params.toString();
}

function createTelegramHash(params: URLSearchParams) {
  const dataCheckString = Array.from(params.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();

  return createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
}
