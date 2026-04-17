import { describe, expect, it } from "vitest";
import { getNextWeeklyReviewStreak, getUtcWeekStartDateKey } from "./week-start";

describe("getUtcWeekStartDateKey", () => {
  it("returns the UTC Monday for a mid-week date", () => {
    expect(getUtcWeekStartDateKey(new Date("2026-04-16T12:00:00.000Z"))).toBe("2026-04-13");
  });

  it("returns the previous Monday for Sunday", () => {
    expect(getUtcWeekStartDateKey(new Date("2026-04-19T12:00:00.000Z"))).toBe("2026-04-13");
  });
});

describe("getNextWeeklyReviewStreak", () => {
  it("starts a weekly review streak", () => {
    expect(getNextWeeklyReviewStreak(null, "2026-04-13")).toMatchObject({
      shouldWrite: true,
      advanced: true,
      currentCount: 1,
      bestCount: 1,
      lastActivityDate: "2026-04-13"
    });
  });

  it("does not advance twice for the same week", () => {
    expect(
      getNextWeeklyReviewStreak(
        {
          currentCount: 2,
          bestCount: 4,
          lastActivityDate: "2026-04-13"
        },
        "2026-04-13"
      )
    ).toMatchObject({
      shouldWrite: false,
      advanced: false,
      currentCount: 2,
      bestCount: 4,
      lastActivityDate: "2026-04-13"
    });
  });

  it("continues across consecutive weeks", () => {
    expect(
      getNextWeeklyReviewStreak(
        {
          currentCount: 2,
          bestCount: 2,
          lastActivityDate: "2026-04-13"
        },
        "2026-04-20"
      )
    ).toMatchObject({
      shouldWrite: true,
      advanced: true,
      currentCount: 3,
      bestCount: 3,
      lastActivityDate: "2026-04-20"
    });
  });

  it("resets after a missed week while preserving best count", () => {
    expect(
      getNextWeeklyReviewStreak(
        {
          currentCount: 2,
          bestCount: 5,
          lastActivityDate: "2026-04-13"
        },
        "2026-04-27"
      )
    ).toMatchObject({
      shouldWrite: true,
      advanced: true,
      currentCount: 1,
      bestCount: 5,
      lastActivityDate: "2026-04-27"
    });
  });
});
