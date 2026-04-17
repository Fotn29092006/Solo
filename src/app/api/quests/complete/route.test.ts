import { beforeEach, describe, expect, it, vi } from "vitest";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import { getOrCreateTelegramProfile } from "@/lib/telegram/profile-identity";
import { validateTelegramInitData } from "@/lib/telegram/server";
import type { QuestCompletionResponse } from "@/shared/types/game";
import { POST } from "./route";

vi.mock("@/lib/supabase/server", () => ({
  createServiceRoleSupabaseClient: vi.fn()
}));

vi.mock("@/lib/telegram/profile-identity", () => ({
  getOrCreateTelegramProfile: vi.fn()
}));

vi.mock("@/lib/telegram/server", () => ({
  validateTelegramInitData: vi.fn()
}));

const QUEST_ID = "11111111-1111-4111-8111-111111111111";

const validatedUser = {
  id: 4242424242,
  firstName: "Solo",
  username: "solo_hunter"
};

const profile = {
  id: "profile-id",
  telegramUserId: "4242424242",
  telegramUsername: "solo_hunter",
  displayName: "Solo",
  level: 1,
  totalXp: 0,
  rankKey: "unranked"
};

describe("POST /api/quests/complete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(validateTelegramInitData).mockReturnValue({
      ok: true,
      status: "valid",
      user: validatedUser,
      identity: {
        provider: "telegram",
        telegramUserId: "4242424242"
      },
      authDate: "2026-04-16T00:00:00.000Z"
    });
    vi.mocked(getOrCreateTelegramProfile).mockResolvedValue({
      ok: true,
      status: "ready",
      profile
    });
  });

  it("rejects invalid quest ids before persistence", async () => {
    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        questId: "not-a-uuid"
      })
    );
    const body = (await response.json()) as QuestCompletionResponse;

    expect(response.status).toBe(400);
    expect(body.status).toBe("invalid_completion_payload");
    expect(validateTelegramInitData).not.toHaveBeenCalled();
    expect(createServiceRoleSupabaseClient).not.toHaveBeenCalled();
  });

  it("completes a quest, awards server-owned XP, and advances daily quest streak after full package completion", async () => {
    const supabase = createQuestCompletionSupabaseMock();

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        questId: QUEST_ID,
        profileId: "attacker-profile-id",
        xpAwarded: 9999
      })
    );
    const body = (await response.json()) as QuestCompletionResponse;

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      status: "ready",
      questId: QUEST_ID,
      xpAwarded: 50,
      totalXp: 120,
      level: 2,
      dailyQuestStreak: {
        type: "daily_quest",
        currentCount: 1,
        bestCount: 1,
        lastActivityDate: "2026-04-16"
      },
      dailyQuestStreakAdvanced: true
    });
    expect(supabase.completionInserts).toEqual([
      {
        quest_id: QUEST_ID,
        profile_id: "profile-id",
        quality_score: null,
        xp_awarded: 50,
        note: null
      }
    ]);
    expect(supabase.xpEventInserts).toEqual([
      {
        profile_id: "profile-id",
        source_type: "quest_completion",
        source_id: "completion-id",
        amount: 50,
        reason: "Completed quest: Complete a focused body training session"
      }
    ]);
    expect(supabase.streakInserts).toEqual([
      expect.objectContaining({
        profile_id: "profile-id",
        streak_type: "daily_quest",
        current_count: 1,
        best_count: 1,
        last_activity_date: "2026-04-16"
      })
    ]);
  });
});

function jsonRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/quests/complete", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json"
    }
  });
}

function createQuestCompletionSupabaseMock() {
  const completionInserts: unknown[] = [];
  const xpEventInserts: unknown[] = [];
  const streakInserts: unknown[] = [];
  const client = {
    from: vi.fn((table: string) => ({
      select: vi.fn((columns: string) => {
        if (table === "daily_quests" && columns.includes("quest_date")) {
          return chainResult({
            error: null,
            data: {
              id: QUEST_ID,
              profile_id: "profile-id",
              quest_date: "2026-04-16",
              title: "Complete a focused body training session",
              xp_reward: 50,
              status: "assigned"
            }
          });
        }

        if (table === "daily_quests" && columns === "id, status") {
          return chainResult({
            error: null,
            data: [
              { id: QUEST_ID, status: "completed" },
              { id: "22222222-2222-4222-8222-222222222222", status: "completed" }
            ]
          });
        }

        if (table === "quest_completions") {
          return chainResult({ error: null, data: null });
        }

        if (table === "xp_events" && columns === "id") {
          return chainResult({ error: null, data: null });
        }

        if (table === "xp_events" && columns === "amount") {
          return chainResult({ error: null, data: [{ amount: 120 }] });
        }

        if (table === "streaks") {
          return chainResult({ error: null, data: null });
        }

        throw new Error(`Unexpected select: ${table} ${columns}`);
      }),
      update: vi.fn(() => {
        if (table === "profiles") {
          return chainResult({
            error: null,
            data: {
              total_xp: 120,
              level: 2
            }
          });
        }

        return chainResult({ error: null });
      }),
      insert: vi.fn((payload: unknown) => {
        if (table === "quest_completions") {
          completionInserts.push(payload);

          return chainResult({
            error: null,
            data: {
              id: "completion-id",
              quest_id: QUEST_ID,
              profile_id: "profile-id",
              xp_awarded: 50
            }
          });
        }

        if (table === "xp_events") {
          xpEventInserts.push(payload);

          return chainResult({ error: null });
        }

        if (table === "streaks") {
          streakInserts.push(payload);

          return chainResult({
            error: null,
            data: {
              id: "streak-id",
              streak_type: "daily_quest",
              current_count: 1,
              best_count: 1,
              last_activity_date: "2026-04-16"
            }
          });
        }

        throw new Error(`Unexpected insert: ${table}`);
      })
    }))
  };

  return {
    client: client as never,
    completionInserts,
    xpEventInserts,
    streakInserts
  };
}

function chainResult<T extends object>(terminal: T) {
  const chain = {
    ...terminal,
    eq: vi.fn(() => chain),
    select: vi.fn(() => chain),
    single: vi.fn(() => terminal),
    maybeSingle: vi.fn(() => terminal)
  };

  return chain;
}
