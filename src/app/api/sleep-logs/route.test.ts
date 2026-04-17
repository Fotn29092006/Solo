import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import { getOrCreateTelegramProfile } from "@/lib/telegram/profile-identity";
import { validateTelegramInitData } from "@/lib/telegram/server";
import type { SleepLogResponse } from "@/shared/types/game";
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
const sleepLogRow = {
  id: "sleep-log-id",
  client_event_id: clientEventId,
  sleep_duration_min: 420,
  sleep_quality: 4,
  morning_energy: 3,
  logged_at: "2026-04-17T08:00:00.000Z",
  logged_date: "2026-04-17",
  note: null,
  created_at: "2026-04-17T08:00:00.000Z"
};

describe("POST /api/sleep-logs", () => {
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
    const body = (await response.json()) as SleepLogResponse;

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      ok: false,
      status: "missing_init_data",
      profileId: null,
      sleepLog: null,
      sleepToday: null
    });
    expect(createServiceRoleSupabaseClient).not.toHaveBeenCalled();
  });

  it("accepts development x-telegram-init-data header for smoke requests", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const supabase = createSleepSupabaseMock();

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(
      jsonRequest(
        {
          clientEventId,
          sleepDurationMin: 420
        },
        {
          "x-telegram-init-data": "valid-init-data"
        }
      )
    );
    const body = (await response.json()) as SleepLogResponse;

    expect(response.status).toBe(200);
    expect(body.status).toBe("ready");
    expect(validateTelegramInitData).toHaveBeenCalledWith("valid-init-data");
    expect(supabase.inserts).toEqual([
      expect.objectContaining({
        profile_id: "profile-id",
        client_event_id: clientEventId,
        sleep_duration_min: 420
      })
    ]);
  });

  it("rejects header-only init data outside development", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const response = await POST(
      jsonRequest(
        {
          clientEventId,
          sleepDurationMin: 420
        },
        {
          "x-telegram-init-data": "valid-init-data"
        }
      )
    );
    const body = (await response.json()) as SleepLogResponse;

    expect(response.status).toBe(400);
    expect(body.status).toBe("missing_init_data");
    expect(validateTelegramInitData).not.toHaveBeenCalled();
    expect(createServiceRoleSupabaseClient).not.toHaveBeenCalled();
  });

  it("rejects invalid sleep payloads before validation or persistence", async () => {
    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        clientEventId,
        sleepDurationMin: 0,
        sleepQuality: 6
      })
    );
    const body = (await response.json()) as SleepLogResponse;

    expect(response.status).toBe(400);
    expect(body.status).toBe("invalid_sleep_log_payload");
    expect(validateTelegramInitData).not.toHaveBeenCalled();
    expect(createServiceRoleSupabaseClient).not.toHaveBeenCalled();
  });

  it("rejects unknown client-owned sleep fields before validation or persistence", async () => {
    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        clientEventId,
        sleepDurationMin: 420,
        sleepQuality: 4,
        morningEnergy: 3,
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
    const body = (await response.json()) as SleepLogResponse;

    expect(response.status).toBe(400);
    expect(body.status).toBe("invalid_sleep_log_payload");
    expect(validateTelegramInitData).not.toHaveBeenCalled();
    expect(createServiceRoleSupabaseClient).not.toHaveBeenCalled();
  });

  it("logs sleep with server-derived ownership and returns today's total", async () => {
    const supabase = createSleepSupabaseMock();

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        clientEventId,
        sleepDurationMin: 420,
        sleepQuality: 4,
        morningEnergy: 3
      })
    );
    const body = (await response.json()) as SleepLogResponse;

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      status: "ready",
      profileId: "profile-id",
      sleepLog: {
        id: "sleep-log-id",
        clientEventId,
        sleepDurationMin: 420,
        sleepQuality: 4,
        morningEnergy: 3,
        loggedDate: "2026-04-17"
      },
      sleepToday: {
        date: "2026-04-17",
        logCount: 2,
        totalSleepDurationMinutes: 840
      },
      todayLogCount: 2,
      todayTotalSleepDurationMinutes: 840
    });
    expect(supabase.inserts).toEqual([
      expect.objectContaining({
        profile_id: "profile-id",
        client_event_id: clientEventId,
        sleep_duration_min: 420,
        sleep_quality: 4,
        morning_energy: 3
      })
    ]);
  });

  it("returns an existing log without inserting again for repeated client events", async () => {
    const supabase = createSleepSupabaseMock({
      existingLog: sleepLogRow
    });

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        clientEventId,
        sleepDurationMin: 420
      })
    );
    const body = (await response.json()) as SleepLogResponse;

    expect(response.status).toBe(200);
    expect(body.status).toBe("already_logged");
    expect(body.sleepLog?.id).toBe("sleep-log-id");
    expect(supabase.inserts).toEqual([]);
  });

  it("returns a write failure without progression side effects when insert fails", async () => {
    const supabase = createSleepSupabaseMock({
      insertError: {
        message: "insert failed"
      }
    });

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        clientEventId,
        sleepDurationMin: 420
      })
    );
    const body = (await response.json()) as SleepLogResponse;

    expect(response.status).toBe(502);
    expect(body.status).toBe("sleep_log_write_failed");
    expect(supabase.touchedTables).toEqual(["sleep_logs", "sleep_logs"]);
  });
});

function jsonRequest(body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/sleep-logs", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      ...headers
    }
  });
}

function createSleepSupabaseMock(
  options: { existingLog?: typeof sleepLogRow | null; insertError?: unknown } = {}
) {
  const inserts: unknown[] = [];
  const touchedTables: string[] = [];
  const existingLog = options.existingLog ?? null;
  const client = {
    from: vi.fn((table: string) => {
      touchedTables.push(table);

      if (table !== "sleep_logs") {
        throw new Error(`Unexpected table: ${table}`);
      }

      return {
        select: vi.fn((columns: string) => {
          if (columns.includes("client_event_id")) {
            return chainResult({ error: null, data: existingLog });
          }

          if (columns === "id, sleep_duration_min") {
            return chainResult({
              error: null,
              data: [
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
          }

          throw new Error(`Unexpected select: ${columns}`);
        }),
        insert: vi.fn((payload: unknown) => {
          inserts.push(payload);

          return {
            select: vi.fn(() =>
              chainResult({
                error: options.insertError ?? null,
                data: options.insertError ? null : sleepLogRow
              })
            )
          };
        })
      };
    })
  };

  return {
    client: client as never,
    inserts,
    touchedTables
  };
}

function chainResult<T extends object>(terminal: T) {
  const chain = {
    ...terminal,
    eq: vi.fn(() => chain),
    maybeSingle: vi.fn(() => terminal),
    single: vi.fn(() => terminal)
  };

  return chain;
}
