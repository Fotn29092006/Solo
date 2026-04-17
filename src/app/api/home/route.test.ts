import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import { getOrCreateTelegramProfile } from "@/lib/telegram/profile-identity";
import { validateTelegramInitData } from "@/lib/telegram/server";
import type { HomeStateResponse } from "@/shared/types/game";
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
  level: 2,
  totalXp: 140,
  rankKey: "bronze"
};

describe("POST /api/home", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-16T12:00:00.000Z"));
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

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it("rejects requests without raw Telegram init data", async () => {
    const response = await POST(jsonRequest({}));
    const body = (await response.json()) as HomeStateResponse;

    expect(response.status).toBe(400);
    expect(body).toEqual({
      ok: false,
      status: "missing_init_data",
      profile: null,
      activeGoal: null,
      activePath: null,
      quests: [],
      streaks: [],
      weeklyCheckIn: null,
      waterToday: null,
      workoutToday: null,
      sleepToday: null,
      mealToday: null
    });
    expect(createServiceRoleSupabaseClient).not.toHaveBeenCalled();
  });

  it("returns profile-aware Home state with live quests and streaks", async () => {
    const supabase = createHomeSupabaseMock();

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(jsonRequest({ initData: "valid-init-data" }));
    const body = (await response.json()) as HomeStateResponse;

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      status: "ready",
      profile: {
        id: "profile-id",
        level: 2,
        totalXp: 140,
        rankKey: "bronze"
      },
      activeGoal: {
        id: "goal-id",
        goalType: "fat_loss",
        targetValue: "82 kg"
      },
      activePath: {
        id: "path-id",
        pathKey: "warrior"
      },
      streaks: [
        {
          type: "daily_quest",
          currentCount: 4,
          bestCount: 6,
          lastActivityDate: "2026-04-16"
        }
      ],
      weeklyCheckIn: {
        id: "weekly-checkin-id",
        weekStartDate: "2026-04-13",
        weightKg: 82.4,
        energyScore: 4,
        sleepScore: 3,
        stressScore: 2,
        adherenceScore: 4,
        reflection: "Stable week.",
        summary: "Weekly review completed.",
        createdAt: "2026-04-16T00:00:00.000Z"
      },
      waterToday: {
        date: "2026-04-16",
        totalMl: 750,
        logCount: 2
      },
      workoutToday: {
        date: "2026-04-16",
        sessionCount: 2,
        totalDurationMinutes: 75
      },
      sleepToday: {
        date: "2026-04-16",
        logCount: 2,
        totalSleepDurationMinutes: 840
      },
      mealToday: {
        date: "2026-04-16",
        mealCount: 2
      }
    });
    expect(body.quests).toEqual([
      {
        id: "quest-id",
        title: "Complete a focused body training session",
        domain: "body",
        type: "main",
        xpReward: 50,
        status: "assigned"
      }
    ]);
    expect(supabase.inserts).toEqual([]);
  });

  it("accepts development x-telegram-init-data header for smoke requests", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const supabase = createHomeSupabaseMock();

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(
      jsonRequest(
        {},
        {
          "x-telegram-init-data": "valid-init-data"
        }
      )
    );
    const body = (await response.json()) as HomeStateResponse;

    expect(response.status).toBe(200);
    expect(body.status).toBe("ready");
    expect(validateTelegramInitData).toHaveBeenCalledWith("valid-init-data");
  });

  it("rejects header-only init data outside development", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const response = await POST(
      jsonRequest(
        {},
        {
          "x-telegram-init-data": "valid-init-data"
        }
      )
    );
    const body = (await response.json()) as HomeStateResponse;

    expect(response.status).toBe(400);
    expect(body.status).toBe("missing_init_data");
    expect(validateTelegramInitData).not.toHaveBeenCalled();
    expect(createServiceRoleSupabaseClient).not.toHaveBeenCalled();
  });

  it("keeps Home ready when the optional sleep aggregate read fails", async () => {
    const supabase = createHomeSupabaseMock({
      sleepReadError: true
    });

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(jsonRequest({ initData: "valid-init-data" }));
    const body = (await response.json()) as HomeStateResponse;

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      status: "ready",
      waterToday: {
        totalMl: 750
      },
      workoutToday: {
        sessionCount: 2
      },
      sleepToday: null
    });
  });

  it("keeps Home ready when the optional meal aggregate read fails", async () => {
    const supabase = createHomeSupabaseMock({
      mealReadError: true
    });

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(jsonRequest({ initData: "valid-init-data" }));
    const body = (await response.json()) as HomeStateResponse;

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      status: "ready",
      waterToday: {
        totalMl: 750
      },
      workoutToday: {
        sessionCount: 2
      },
      sleepToday: {
        logCount: 2
      },
      mealToday: null
    });
  });
});

function jsonRequest(body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/home", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      ...headers
    }
  });
}

function createHomeSupabaseMock(options: { mealReadError?: boolean; sleepReadError?: boolean } = {}) {
  const inserts: Array<{ table: string; payload: unknown }> = [];
  const client = {
    from: vi.fn((table: string) => ({
      select: vi.fn(() => {
        switch (table) {
          case "goals":
            return chainResult({
              error: null,
              data: {
                id: "goal-id",
                goal_type: "fat_loss",
                target_value: "82 kg"
              }
            });
          case "user_paths":
            return chainResult({
              error: null,
              data: {
                id: "path-id",
                path_key: "warrior"
              }
            });
          case "streaks":
            return chainResult({
              error: null,
              data: [
                {
                  id: "streak-id",
                  streak_type: "daily_quest",
                  current_count: 4,
                  best_count: 6,
                  last_activity_date: "2026-04-16"
                }
              ]
            });
          case "daily_quests":
            return chainResult({
              error: null,
              data: [
                {
                  id: "quest-id",
                  title: "Complete a focused body training session",
                  domain: "body",
                  quest_type: "main",
                  xp_reward: 50,
                  status: "assigned"
                }
              ]
            });
          case "weekly_checkins":
            return chainResult({
              error: null,
              data: {
                id: "weekly-checkin-id",
                week_start_date: "2026-04-13",
                weight_kg: 82.4,
                energy_score: 4,
                sleep_score: 3,
                stress_score: 2,
                adherence_score: 4,
                reflection: "Stable week.",
                summary: "Weekly review completed.",
                created_at: "2026-04-16T00:00:00.000Z"
              }
            });
          case "water_logs":
            return chainResult({
              error: null,
              data: [
                {
                  id: "water-log-id",
                  amount_ml: 500
                },
                {
                  id: "water-log-id-2",
                  amount_ml: 250
                }
              ]
            });
          case "workout_logs":
            return chainResult({
              error: null,
              data: [
                {
                  id: "workout-log-id",
                  duration_min: 45
                },
                {
                  id: "workout-log-id-2",
                  duration_min: 30
                }
              ]
            });
          case "sleep_logs":
            return chainResult({
              error: options.sleepReadError ? { message: "sleep unavailable" } : null,
              data: options.sleepReadError
                ? null
                : [
                    {
                      id: "sleep-log-id",
                      sleep_duration_min: 420
                    },
                    {
                      id: "sleep-log-id-2",
                      sleep_duration_min: 420
                    }
                  ]
            });
          case "meal_logs":
            return chainResult({
              error: options.mealReadError ? { message: "meal unavailable" } : null,
              data: options.mealReadError
                ? null
                : [
                    {
                      id: "meal-log-id"
                    },
                    {
                      id: "meal-log-id-2"
                    }
                  ]
            });
          default:
            throw new Error(`Unexpected table: ${table}`);
        }
      }),
      insert: vi.fn((payload: unknown) => {
        inserts.push({ table, payload });

        return chainResult({ error: null, data: [] });
      })
    }))
  };

  return {
    client: client as never,
    inserts
  };
}

function chainResult<T extends object>(terminal: T) {
  const chain = {
    ...terminal,
    eq: vi.fn(() => chain),
    order: vi.fn(() => chain),
    limit: vi.fn(() => chain),
    maybeSingle: vi.fn(() => terminal)
  };

  return chain;
}
