import { describe, expect, it } from "vitest";
import {
  isWaterAutoCompleteQuest,
  isWorkoutAutoCompleteQuest,
  WATER_AUTO_COMPLETE_KEY,
  WORKOUT_AUTO_COMPLETE_KEY
} from "./log-quest-sync";

describe("isWaterAutoCompleteQuest", () => {
  it("matches the stable water auto-complete metadata", () => {
    expect(
      isWaterAutoCompleteQuest({
        title: "Copy can change safely",
        domain: "nutrition",
        quest_type: "side",
        metadata: {
          autoCompleteKey: WATER_AUTO_COMPLETE_KEY
        }
      })
    ).toBe(true);
  });

  it("supports the legacy seeded water quest title", () => {
    expect(
      isWaterAutoCompleteQuest({
        title: "Log water intake before the day ends",
        domain: "nutrition",
        quest_type: "side",
        metadata: {}
      })
    ).toBe(true);
  });

  it("does not match non-water nutrition quests", () => {
    expect(
      isWaterAutoCompleteQuest({
        title: "Log one planned meal with protein",
        domain: "nutrition",
        quest_type: "side",
        metadata: {}
      })
    ).toBe(false);
  });

  it("does not match water metadata outside the nutrition side quest slot", () => {
    expect(
      isWaterAutoCompleteQuest({
        title: "Log water intake before the day ends",
        domain: "body",
        quest_type: "main",
        metadata: {
          autoCompleteKey: WATER_AUTO_COMPLETE_KEY
        }
      })
    ).toBe(false);
  });
});

describe("isWorkoutAutoCompleteQuest", () => {
  it("matches only stable workout auto-complete metadata", () => {
    expect(
      isWorkoutAutoCompleteQuest(
        {
          domain: "body",
          quest_type: "main",
          metadata: {
            autoCompleteKey: WORKOUT_AUTO_COMPLETE_KEY,
            matchWindow: "quest_date",
            minWorkoutSessions: 1
          }
        },
        {
          sessionCount: 1,
          workoutType: "strength"
        }
      )
    ).toBe(true);
  });

  it("does not match workout title-like quests without metadata", () => {
    expect(
      isWorkoutAutoCompleteQuest(
        {
          domain: "body",
          quest_type: "main",
          metadata: {}
        },
        {
          sessionCount: 1,
          workoutType: "strength"
        }
      )
    ).toBe(false);
  });

  it("respects the minimum workout session threshold", () => {
    expect(
      isWorkoutAutoCompleteQuest(
        {
          domain: "body",
          quest_type: "main",
          metadata: {
            autoCompleteKey: WORKOUT_AUTO_COMPLETE_KEY,
            minWorkoutSessions: 2
          }
        },
        {
          sessionCount: 1,
          workoutType: "strength"
        }
      )
    ).toBe(false);
  });

  it("does not match workout metadata outside the body main quest slot", () => {
    expect(
      isWorkoutAutoCompleteQuest(
        {
          domain: "mind",
          quest_type: "side",
          metadata: {
            autoCompleteKey: WORKOUT_AUTO_COMPLETE_KEY,
            minWorkoutSessions: 1
          }
        },
        {
          sessionCount: 1,
          workoutType: "strength"
        }
      )
    ).toBe(false);
  });
});
