import { describe, expect, it } from "vitest";
import { getNextDailyQuestStreak } from "./daily-quest-streak";

describe("getNextDailyQuestStreak", () => {
  it("starts the streak when there is no previous activity", () => {
    expect(getNextDailyQuestStreak(null, "2026-04-16")).toEqual({
      shouldWrite: true,
      advanced: true,
      currentCount: 1,
      bestCount: 1,
      lastActivityDate: "2026-04-16"
    });
  });

  it("does not advance twice for the same date", () => {
    expect(
      getNextDailyQuestStreak(
        {
          currentCount: 3,
          bestCount: 5,
          lastActivityDate: "2026-04-16"
        },
        "2026-04-16"
      )
    ).toEqual({
      shouldWrite: false,
      advanced: false,
      currentCount: 3,
      bestCount: 5,
      lastActivityDate: "2026-04-16"
    });
  });

  it("continues the streak on the next day", () => {
    expect(
      getNextDailyQuestStreak(
        {
          currentCount: 3,
          bestCount: 3,
          lastActivityDate: "2026-04-16"
        },
        "2026-04-17"
      )
    ).toMatchObject({
      shouldWrite: true,
      advanced: true,
      currentCount: 4,
      bestCount: 4,
      lastActivityDate: "2026-04-17"
    });
  });

  it("resets the current count after a missed date while preserving best count", () => {
    expect(
      getNextDailyQuestStreak(
        {
          currentCount: 3,
          bestCount: 7,
          lastActivityDate: "2026-04-16"
        },
        "2026-04-19"
      )
    ).toMatchObject({
      shouldWrite: true,
      advanced: true,
      currentCount: 1,
      bestCount: 7,
      lastActivityDate: "2026-04-19"
    });
  });

  it("ignores older completion dates", () => {
    expect(
      getNextDailyQuestStreak(
        {
          currentCount: 3,
          bestCount: 5,
          lastActivityDate: "2026-04-16"
        },
        "2026-04-15"
      )
    ).toMatchObject({
      shouldWrite: false,
      advanced: false,
      currentCount: 3,
      bestCount: 5,
      lastActivityDate: "2026-04-16"
    });
  });
});
