import { describe, expect, it } from "vitest";
import {
  buildTelegramDisplayName,
  buildTelegramProfileUpsert,
  toTelegramProfileIdentity
} from "./profile-identity-core";

describe("profile identity helpers", () => {
  it("builds a safe profile upsert from a validated Telegram user", () => {
    expect(
      buildTelegramProfileUpsert({
        id: 4242424242,
        firstName: "Solo",
        lastName: "Hunter",
        username: "solo_hunter"
      })
    ).toEqual({
      telegram_user_id: 4242424242,
      telegram_username: "solo_hunter",
      display_name: "Solo Hunter"
    });
  });

  it("falls back to username when the Telegram user has no display name", () => {
    expect(
      buildTelegramDisplayName({
        id: 4242424242,
        username: "solo_hunter"
      })
    ).toBe("solo_hunter");
  });

  it("maps database profile rows to the API identity shape", () => {
    expect(
      toTelegramProfileIdentity({
        id: "profile-id",
        telegram_user_id: 4242424242,
        telegram_username: "solo_hunter",
        display_name: "Solo Hunter",
        level: 1,
        total_xp: 0,
        rank_key: "unranked"
      })
    ).toEqual({
      id: "profile-id",
      telegramUserId: "4242424242",
      telegramUsername: "solo_hunter",
      displayName: "Solo Hunter",
      level: 1,
      totalXp: 0,
      rankKey: "unranked"
    });
  });
});
