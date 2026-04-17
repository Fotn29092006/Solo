import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import { getOrCreateTelegramProfile } from "@/lib/telegram/profile-identity";
import { validateTelegramInitData } from "@/lib/telegram/server";
import type { WeeklyCheckInResponse } from "@/shared/types/game";
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
  level: 1,
  totalXp: 0,
  rankKey: "unranked"
};

describe("POST /api/weekly-checkin", () => {
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
  });

  it("rejects requests without raw Telegram init data", async () => {
    const response = await POST(jsonRequest({}));
    const body = (await response.json()) as WeeklyCheckInResponse;

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      ok: false,
      status: "missing_init_data",
      profileId: null,
      weekStartDate: null,
      checkIn: null
    });
    expect(createServiceRoleSupabaseClient).not.toHaveBeenCalled();
  });

  it("returns the current week state without writing when only initData is provided", async () => {
    const supabase = createWeeklySupabaseMock();

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(jsonRequest({ initData: "valid-init-data" }));
    const body = (await response.json()) as WeeklyCheckInResponse;

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      status: "ready",
      profileId: "profile-id",
      weekStartDate: "2026-04-13",
      checkIn: null,
      weeklyReviewStreak: null,
      weeklyReviewStreakAdvanced: false
    });
    expect(supabase.upserts).toEqual([]);
  });

  it("upserts the current week using server-derived profile id and advances weekly review streak", async () => {
    const supabase = createWeeklySupabaseMock();

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        profileId: "attacker-profile-id",
        weekStartDate: "1999-01-01",
        weightKg: 82.4,
        energyScore: 4,
        sleepScore: 3,
        stressScore: 2,
        adherenceScore: 5,
        reflection: "Strong week."
      })
    );
    const body = (await response.json()) as WeeklyCheckInResponse;

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      status: "saved",
      profileId: "profile-id",
      weekStartDate: "2026-04-13",
      checkIn: {
        id: "weekly-checkin-id",
        weekStartDate: "2026-04-13",
        weightKg: 82.4,
        energyScore: 4,
        sleepScore: 3,
        stressScore: 2,
        adherenceScore: 5,
        reflection: "Strong week."
      },
      weeklyReviewStreak: {
        type: "weekly_review",
        currentCount: 1,
        bestCount: 1,
        lastActivityDate: "2026-04-13"
      },
      weeklyReviewStreakAdvanced: true
    });
    expect(supabase.upserts).toEqual([
      expect.objectContaining({
        profile_id: "profile-id",
        week_start_date: "2026-04-13",
        weight_kg: 82.4,
        energy_score: 4,
        sleep_score: 3,
        stress_score: 2,
        adherence_score: 5,
        reflection: "Strong week."
      })
    ]);
    expect(supabase.streakInserts).toEqual([
      expect.objectContaining({
        profile_id: "profile-id",
        streak_type: "weekly_review",
        current_count: 1,
        best_count: 1,
        last_activity_date: "2026-04-13"
      })
    ]);
  });

  it("rejects incomplete score payloads before persistence", async () => {
    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        energyScore: 4
      })
    );
    const body = (await response.json()) as WeeklyCheckInResponse;

    expect(response.status).toBe(400);
    expect(body.status).toBe("invalid_weekly_checkin_payload");
    expect(validateTelegramInitData).not.toHaveBeenCalled();
    expect(createServiceRoleSupabaseClient).not.toHaveBeenCalled();
  });
});

function jsonRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/weekly-checkin", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json"
    }
  });
}

function createWeeklySupabaseMock() {
  const upserts: unknown[] = [];
  const streakInserts: unknown[] = [];
  const client = {
    from: vi.fn((table: string) => ({
      select: vi.fn((columns: string) => {
        if (table === "weekly_checkins") {
          return chainResult({ error: null, data: null });
        }

        if (table === "streaks" && columns.includes("current_count")) {
          return chainResult({ error: null, data: null });
        }

        throw new Error(`Unexpected select: ${table} ${columns}`);
      }),
      upsert: vi.fn((payload: unknown) => {
        upserts.push(payload);

        return chainResult({
          error: null,
          data: {
            id: "weekly-checkin-id",
            week_start_date: "2026-04-13",
            weight_kg: 82.4,
            energy_score: 4,
            sleep_score: 3,
            stress_score: 2,
            adherence_score: 5,
            reflection: "Strong week.",
            summary: "Weekly review completed. Weight 82.4 kg. Energy 4/5, sleep 3/5, stress 2/5, adherence 5/5.",
            created_at: "2026-04-16T00:00:00.000Z"
          }
        });
      }),
      insert: vi.fn((payload: unknown) => {
        streakInserts.push(payload);

        return chainResult({
          error: null,
          data: {
            id: "weekly-review-streak-id",
            streak_type: "weekly_review",
            current_count: 1,
            best_count: 1,
            last_activity_date: "2026-04-13"
          }
        });
      }),
      update: vi.fn(() => chainResult({ error: null, data: null }))
    }))
  };

  return {
    client: client as never,
    upserts,
    streakInserts
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
