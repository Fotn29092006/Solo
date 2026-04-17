import { describe, expect, it } from "vitest";
import { buildDailyQuestSeed } from "./daily-quest-seed";

describe("buildDailyQuestSeed", () => {
  it("builds the MVP daily quest package", () => {
    const quests = buildDailyQuestSeed({
      profileId: "profile-id",
      questDate: "2026-04-16",
      goalType: "fat_loss",
      pathKey: "warrior"
    });

    expect(quests).toHaveLength(5);
    expect(quests.map((quest) => quest.quest_type)).toEqual([
      "main",
      "side",
      "side",
      "discipline",
      "recovery"
    ]);
    expect(quests[0]).toMatchObject({
      profile_id: "profile-id",
      quest_date: "2026-04-16",
      domain: "body",
      xp_reward: 50,
      status: "assigned"
    });
  });

  it("falls back to discipline and balance when onboarding context is missing", () => {
    const quests = buildDailyQuestSeed({
      profileId: "profile-id",
      questDate: "2026-04-16",
      goalType: null,
      pathKey: null
    });

    expect(quests[0].title).toBe("Complete one balanced body or mind session");
    expect(quests[2].title).toBe("Protect one no-skip habit today");
  });
});
