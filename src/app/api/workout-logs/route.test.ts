import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import { getOrCreateTelegramProfile } from "@/lib/telegram/profile-identity";
import { validateTelegramInitData } from "@/lib/telegram/server";
import type { WorkoutLogResponse } from "@/shared/types/game";
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

const clientEventId = "123e4567-e89b-42d3-a456-426614174000";
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
const workoutLogRow = {
  id: "workout-log-id",
  client_event_id: clientEventId,
  workout_type: "strength",
  workout_name: "Upper body",
  duration_min: 45,
  rpe: 7,
  logged_at: "2026-04-17T08:00:00.000Z",
  logged_date: "2026-04-17",
  note: null,
  created_at: "2026-04-17T08:00:00.000Z"
};

describe("POST /api/workout-logs", () => {
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
      authDate: "2026-04-17T00:00:00.000Z"
    });
    vi.mocked(getOrCreateTelegramProfile).mockResolvedValue({
      ok: true,
      status: "ready",
      profile
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects requests without raw Telegram init data", async () => {
    const response = await POST(jsonRequest({}));
    const body = (await response.json()) as WorkoutLogResponse;

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      ok: false,
      status: "missing_init_data",
      profileId: null,
      workoutLog: null,
      workoutToday: null
    });
    expect(createServiceRoleSupabaseClient).not.toHaveBeenCalled();
  });

  it("accepts development x-telegram-init-data header for smoke requests", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const supabase = createWorkoutSupabaseMock();

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(
      jsonRequest(
        {
          clientEventId,
          workoutType: "strength"
        },
        {
          "x-telegram-init-data": "valid-init-data"
        }
      )
    );
    const body = (await response.json()) as WorkoutLogResponse;

    expect(response.status).toBe(200);
    expect(body.status).toBe("ready");
    expect(validateTelegramInitData).toHaveBeenCalledWith("valid-init-data");
    expect(supabase.inserts).toEqual([
      expect.objectContaining({
        profile_id: "profile-id",
        client_event_id: clientEventId,
        workout_type: "strength"
      })
    ]);
  });

  it("rejects header-only init data outside development", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const response = await POST(
      jsonRequest(
        {
          clientEventId,
          workoutType: "strength"
        },
        {
          "x-telegram-init-data": "valid-init-data"
        }
      )
    );
    const body = (await response.json()) as WorkoutLogResponse;

    expect(response.status).toBe(400);
    expect(body.status).toBe("missing_init_data");
    expect(validateTelegramInitData).not.toHaveBeenCalled();
    expect(createServiceRoleSupabaseClient).not.toHaveBeenCalled();
  });

  it("rejects invalid workout payloads before validation or persistence", async () => {
    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        clientEventId,
        workoutType: "boss_raid",
        durationMin: 45
      })
    );
    const body = (await response.json()) as WorkoutLogResponse;

    expect(response.status).toBe(400);
    expect(body.status).toBe("invalid_workout_log_payload");
    expect(validateTelegramInitData).not.toHaveBeenCalled();
    expect(createServiceRoleSupabaseClient).not.toHaveBeenCalled();
  });

  it("rejects unknown client-owned workout fields before validation or persistence", async () => {
    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        clientEventId,
        workoutType: "strength",
        workoutName: "Upper body",
        durationMin: 45,
        rpe: 7,
        profileId: "attacker-profile-id",
        profile_id: "attacker-profile-id",
        telegramUserId: "4242424242",
        loggedAt: "2026-01-01T00:00:00.000Z",
        loggedDate: "2026-01-01",
        xpAwarded: 999,
        xp_awarded: 999,
        questId: "quest-id",
        streak: 99,
        rankKey: "s_rank"
      })
    );
    const body = (await response.json()) as WorkoutLogResponse;

    expect(response.status).toBe(400);
    expect(body.status).toBe("invalid_workout_log_payload");
    expect(validateTelegramInitData).not.toHaveBeenCalled();
    expect(createServiceRoleSupabaseClient).not.toHaveBeenCalled();
  });

  it("logs workouts with server-derived ownership and returns today's total", async () => {
    const supabase = createWorkoutSupabaseMock();

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        clientEventId,
        workoutType: "strength",
        workoutName: "Upper body",
        durationMin: 45,
        rpe: 7
      })
    );
    const body = (await response.json()) as WorkoutLogResponse;

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      status: "ready",
      profileId: "profile-id",
      workoutLog: {
        id: "workout-log-id",
        clientEventId,
        workoutType: "strength",
        workoutName: "Upper body",
        durationMin: 45,
        rpe: 7,
        loggedDate: "2026-04-17"
      },
      workoutToday: {
        date: "2026-04-17",
        sessionCount: 2,
        totalDurationMinutes: 75
      },
      questSync: {
        status: "not_matched",
        questCompletion: null
      },
      todaySessionCount: 2,
      todayTotalDurationMinutes: 75
    });
    expect(supabase.inserts).toEqual([
      expect.objectContaining({
        profile_id: "profile-id",
        client_event_id: clientEventId,
        workout_type: "strength",
        workout_name: "Upper body",
        duration_min: 45,
        rpe: 7
      })
    ]);
  });

  it("auto-completes the matching workout quest after the session threshold is reached", async () => {
    const supabase = createWorkoutSupabaseMock({
      matchingWorkoutQuest: true
    });

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        clientEventId,
        workoutType: "strength"
      })
    );
    const body = (await response.json()) as WorkoutLogResponse;

    expect(response.status).toBe(200);
    expect(body.questSync).toMatchObject({
      status: "completed",
      questCompletion: {
        ok: true,
        status: "ready",
        questId: "workout-quest-id",
        xpAwarded: 50,
        totalXp: 50,
        level: 1
      }
    });
    expect(supabase.completionInserts).toEqual([
      {
        quest_id: "workout-quest-id",
        profile_id: "profile-id",
        quality_score: null,
        xp_awarded: 50,
        note: "Auto-completed from workout log."
      }
    ]);
    expect(supabase.xpEventInserts).toEqual([
      {
        profile_id: "profile-id",
        source_type: "quest_completion",
        source_id: "workout-completion-id",
        amount: 50,
        reason: "Completed quest: Complete a focused body training session"
      }
    ]);
  });

  it("returns an existing log without inserting again for repeated client events", async () => {
    const supabase = createWorkoutSupabaseMock({
      existingLog: workoutLogRow
    });

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        clientEventId,
        workoutType: "strength"
      })
    );
    const body = (await response.json()) as WorkoutLogResponse;

    expect(response.status).toBe(200);
    expect(body.status).toBe("already_logged");
    expect(body.workoutLog?.id).toBe("workout-log-id");
    expect(supabase.inserts).toEqual([]);
  });
});

function jsonRequest(body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/workout-logs", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      ...headers
    }
  });
}

function createWorkoutSupabaseMock(
  options: { existingLog?: typeof workoutLogRow | null; matchingWorkoutQuest?: boolean } = {}
) {
  const inserts: unknown[] = [];
  const completionInserts: unknown[] = [];
  const xpEventInserts: unknown[] = [];
  const existingLog = options.existingLog ?? null;
  const workoutQuest = {
    id: "workout-quest-id",
    profile_id: "profile-id",
    quest_date: "2026-04-17",
    title: "Complete a focused body training session",
    domain: "body",
    quest_type: "main",
    xp_reward: 50,
    status: "assigned",
    metadata: {
      autoCompleteKey: "workout_log",
      matchWindow: "quest_date",
      minWorkoutSessions: 1
    }
  };
  const client = {
    from: vi.fn((table: string) => {
      return {
        select: vi.fn((columns: string) => {
          if (table === "workout_logs" && columns.includes("client_event_id")) {
            return chainResult({ error: null, data: existingLog });
          }

          if (table === "workout_logs" && columns === "id, duration_min") {
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
          }

          if (table === "daily_quests" && columns.includes("metadata")) {
            return chainResult({
              error: null,
              data: options.matchingWorkoutQuest ? [workoutQuest] : []
            });
          }

          if (table === "daily_quests" && columns === "id, status") {
            return chainResult({
              error: null,
              data: [{ id: "workout-quest-id", status: "completed" }]
            });
          }

          if (table === "quest_completions") {
            return chainResult({ error: null, data: null });
          }

          if (table === "xp_events" && columns === "id") {
            return chainResult({ error: null, data: null });
          }

          if (table === "xp_events" && columns === "amount") {
            return chainResult({ error: null, data: [{ amount: 50 }] });
          }

          if (table === "streaks") {
            return chainResult({ error: null, data: null });
          }

          throw new Error(`Unexpected select: ${table} ${columns}`);
        }),
        insert: vi.fn((payload: unknown) => {
          if (table === "workout_logs") {
            inserts.push(payload);

            return {
              select: vi.fn(() => chainResult({ error: null, data: workoutLogRow }))
            };
          }

          if (table === "quest_completions") {
            completionInserts.push(payload);

            return chainResult({
              error: null,
              data: {
                id: "workout-completion-id",
                quest_id: "workout-quest-id",
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
            return chainResult({
              error: null,
              data: {
                id: "streak-id",
                streak_type: "daily_quest",
                current_count: 1,
                best_count: 1,
                last_activity_date: "2026-04-17"
              }
            });
          }

          throw new Error(`Unexpected insert: ${table}`);
        }),
        update: vi.fn(() => {
          if (table === "daily_quests") {
            return chainResult({ error: null });
          }

          if (table === "profiles") {
            return chainResult({
              error: null,
              data: {
                total_xp: 50,
                level: 1
              }
            });
          }

          return chainResult({ error: null });
        })
      };
    })
  };

  return {
    client: client as never,
    inserts,
    completionInserts,
    xpEventInserts
  };
}

function chainResult<T extends object>(terminal: T) {
  const chain = {
    ...terminal,
    eq: vi.fn(() => chain),
    select: vi.fn(() => chain),
    maybeSingle: vi.fn(() => terminal),
    single: vi.fn(() => terminal)
  };

  return chain;
}
