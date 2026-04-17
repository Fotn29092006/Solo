import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import { getOrCreateTelegramProfile } from "@/lib/telegram/profile-identity";
import { validateTelegramInitData } from "@/lib/telegram/server";
import type { WaterLogResponse } from "@/shared/types/game";
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
const waterLogRow = {
  id: "water-log-id",
  client_event_id: clientEventId,
  amount_ml: 500,
  logged_at: "2026-04-17T08:00:00.000Z",
  logged_date: "2026-04-17",
  note: null,
  created_at: "2026-04-17T08:00:00.000Z"
};

describe("POST /api/water-logs", () => {
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
    const body = (await response.json()) as WaterLogResponse;

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      ok: false,
      status: "missing_init_data",
      profileId: null,
      waterLog: null,
      waterToday: null,
      questSync: {
        status: "not_matched",
        questCompletion: null
      }
    });
    expect(createServiceRoleSupabaseClient).not.toHaveBeenCalled();
  });

  it("accepts development x-telegram-init-data header for smoke requests", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const supabase = createWaterSupabaseMock();

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(
      jsonRequest(
        {
          amountMl: 500,
          clientEventId
        },
        {
          "x-telegram-init-data": "valid-init-data"
        }
      )
    );
    const body = (await response.json()) as WaterLogResponse;

    expect(response.status).toBe(200);
    expect(body.status).toBe("ready");
    expect(validateTelegramInitData).toHaveBeenCalledWith("valid-init-data");
    expect(supabase.inserts).toEqual([
      expect.objectContaining({
        profile_id: "profile-id",
        client_event_id: clientEventId
      })
    ]);
  });

  it("rejects header-only init data outside development", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const response = await POST(
      jsonRequest(
        {
          amountMl: 500,
          clientEventId
        },
        {
          "x-telegram-init-data": "valid-init-data"
        }
      )
    );
    const body = (await response.json()) as WaterLogResponse;

    expect(response.status).toBe(400);
    expect(body.status).toBe("missing_init_data");
    expect(validateTelegramInitData).not.toHaveBeenCalled();
    expect(createServiceRoleSupabaseClient).not.toHaveBeenCalled();
  });

  it("rejects invalid water payloads before validation or persistence", async () => {
    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        amountMl: 0,
        clientEventId
      })
    );
    const body = (await response.json()) as WaterLogResponse;

    expect(response.status).toBe(400);
    expect(body.status).toBe("invalid_water_log_payload");
    expect(validateTelegramInitData).not.toHaveBeenCalled();
    expect(createServiceRoleSupabaseClient).not.toHaveBeenCalled();
  });

  it("rejects unknown client-owned water fields before validation or persistence", async () => {
    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        amountMl: 500,
        clientEventId,
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
    const body = (await response.json()) as WaterLogResponse;

    expect(response.status).toBe(400);
    expect(body.status).toBe("invalid_water_log_payload");
    expect(validateTelegramInitData).not.toHaveBeenCalled();
    expect(createServiceRoleSupabaseClient).not.toHaveBeenCalled();
  });

  it("logs water with server-derived ownership and returns today's total", async () => {
    const supabase = createWaterSupabaseMock();

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        amountMl: 500,
        clientEventId
      })
    );
    const body = (await response.json()) as WaterLogResponse;

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      status: "ready",
      profileId: "profile-id",
      waterLog: {
        id: "water-log-id",
        amountMl: 500,
        clientEventId,
        loggedDate: "2026-04-17"
      },
      waterToday: {
        date: "2026-04-17",
        totalMl: 1000,
        logCount: 2
      },
      questSync: {
        status: "not_matched",
        questCompletion: null
      },
      todayTotalMl: 1000,
      todayLogCount: 2
    });
    expect(supabase.inserts).toEqual([
      expect.objectContaining({
        profile_id: "profile-id",
        client_event_id: clientEventId,
        amount_ml: 500
      })
    ]);
  });

  it("returns an existing log without inserting again for repeated client events", async () => {
    const supabase = createWaterSupabaseMock({
      existingLog: waterLogRow
    });

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        amountMl: 500,
        clientEventId
      })
    );
    const body = (await response.json()) as WaterLogResponse;

    expect(response.status).toBe(200);
    expect(body.status).toBe("already_logged");
    expect(body.waterLog?.id).toBe("water-log-id");
    expect(supabase.inserts).toEqual([]);
  });

  it("auto-completes the matching hydration quest after the daily threshold is reached", async () => {
    const supabase = createWaterSupabaseMock({
      matchingWaterQuest: true
    });

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        amountMl: 500,
        clientEventId
      })
    );
    const body = (await response.json()) as WaterLogResponse;

    expect(response.status).toBe(200);
    expect(body.questSync).toMatchObject({
      status: "completed",
      questCompletion: {
        ok: true,
        status: "ready",
        questId: "water-quest-id",
        xpAwarded: 15,
        totalXp: 15,
        level: 1
      }
    });
    expect(supabase.completionInserts).toEqual([
      {
        quest_id: "water-quest-id",
        profile_id: "profile-id",
        quality_score: null,
        xp_awarded: 15,
        note: "Auto-completed from hydration log."
      }
    ]);
    expect(supabase.xpEventInserts).toEqual([
      {
        profile_id: "profile-id",
        source_type: "quest_completion",
        source_id: "water-completion-id",
        amount: 15,
        reason: "Completed quest: Log water intake before the day ends"
      }
    ]);
  });

  it("does not auto-complete hydration quests below the daily threshold", async () => {
    const supabase = createWaterSupabaseMock({
      matchingWaterQuest: true,
      waterAmounts: [500]
    });

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        amountMl: 500,
        clientEventId
      })
    );
    const body = (await response.json()) as WaterLogResponse;

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      questSync: {
        status: "not_matched",
        questCompletion: null
      },
      todayTotalMl: 500
    });
    expect(supabase.completionInserts).toEqual([]);
    expect(supabase.xpEventInserts).toEqual([]);
  });
});

function jsonRequest(body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/water-logs", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      ...headers
    }
  });
}

function createWaterSupabaseMock(
  options: { existingLog?: typeof waterLogRow | null; matchingWaterQuest?: boolean; waterAmounts?: number[] } = {}
) {
  const inserts: unknown[] = [];
  const completionInserts: unknown[] = [];
  const xpEventInserts: unknown[] = [];
  const existingLog = options.existingLog ?? null;
  const waterAmounts = options.waterAmounts ?? [500, 500];
  const waterQuest = {
    id: "water-quest-id",
    profile_id: "profile-id",
    quest_date: "2026-04-17",
    title: "Log water intake before the day ends",
    domain: "nutrition",
    quest_type: "side",
    xp_reward: 15,
    status: "assigned",
    metadata: {
      autoCompleteKey: "water_log"
    }
  };
  const client = {
    from: vi.fn((table: string) => {
      return {
        select: vi.fn((columns: string) => {
          if (table === "water_logs" && columns.includes("client_event_id")) {
            return chainResult({ error: null, data: existingLog });
          }

          if (table === "water_logs" && columns === "id, amount_ml") {
            return chainResult({
              error: null,
              data: waterAmounts.map((amountMl, index) => ({
                id: `water-log-id-${index}`,
                amount_ml: amountMl
              }))
            });
          }

          if (table === "daily_quests" && columns.includes("metadata")) {
            return chainResult({
              error: null,
              data: options.matchingWaterQuest ? [waterQuest] : []
            });
          }

          if (table === "daily_quests" && columns === "id, status") {
            return chainResult({
              error: null,
              data: [{ id: "water-quest-id", status: "completed" }]
            });
          }

          if (table === "quest_completions") {
            return chainResult({ error: null, data: null });
          }

          if (table === "xp_events" && columns === "id") {
            return chainResult({ error: null, data: null });
          }

          if (table === "xp_events" && columns === "amount") {
            return chainResult({ error: null, data: [{ amount: 15 }] });
          }

          if (table === "streaks") {
            return chainResult({ error: null, data: null });
          }

          throw new Error(`Unexpected select: ${table} ${columns}`);
        }),
        insert: vi.fn((payload: unknown) => {
          if (table === "water_logs") {
            inserts.push(payload);

            return {
              select: vi.fn(() => chainResult({ error: null, data: waterLogRow }))
            };
          }

          if (table === "quest_completions") {
            completionInserts.push(payload);

            return chainResult({
              error: null,
              data: {
                id: "water-completion-id",
                quest_id: "water-quest-id",
                profile_id: "profile-id",
                xp_awarded: 15
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
                total_xp: 15,
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
