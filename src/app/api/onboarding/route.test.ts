import { describe, expect, it, vi, beforeEach } from "vitest";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import { getOrCreateTelegramProfile } from "@/lib/telegram/profile-identity";
import { validateTelegramInitData } from "@/lib/telegram/server";
import type { OnboardingPersistenceResponse } from "@/shared/types/game";
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

describe("POST /api/onboarding", () => {
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

  it("rejects requests without raw Telegram init data", async () => {
    const response = await POST(jsonRequest({ goalType: "fat_loss", pathKey: "warrior" }));
    const body = (await response.json()) as OnboardingPersistenceResponse;

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      ok: false,
      status: "missing_init_data",
      profileId: null,
      goalId: null,
      pathId: null
    });
    expect(createServiceRoleSupabaseClient).not.toHaveBeenCalled();
    expect(getOrCreateTelegramProfile).not.toHaveBeenCalled();
  });

  it("persists goal and path using the server-derived profile id", async () => {
    const supabase = createOnboardingSupabaseMock();

    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue(supabase.client);

    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        goalType: "fat_loss",
        targetValue: "82 kg",
        pathKey: "warrior",
        profileId: "attacker-profile-id"
      })
    );
    const body = (await response.json()) as OnboardingPersistenceResponse;

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      status: "ready",
      profileId: "profile-id",
      goalId: "goal-id",
      pathId: "path-id"
    });
    expect(supabase.inserts).toEqual([
      {
        table: "goals",
        payload: {
          profile_id: "profile-id",
          goal_type: "fat_loss",
          target_value: "82 kg"
        }
      },
      {
        table: "user_paths",
        payload: {
          profile_id: "profile-id",
          path_key: "warrior",
          is_active: true
        }
      }
    ]);
  });

  it("rejects invalid MVP goal/path keys before persistence", async () => {
    const response = await POST(
      jsonRequest({
        initData: "valid-init-data",
        goalType: "fake_goal",
        pathKey: "warrior"
      })
    );
    const body = (await response.json()) as OnboardingPersistenceResponse;

    expect(response.status).toBe(400);
    expect(body.status).toBe("invalid_onboarding_payload");
    expect(validateTelegramInitData).not.toHaveBeenCalled();
    expect(createServiceRoleSupabaseClient).not.toHaveBeenCalled();
  });
});

function jsonRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/onboarding", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json"
    }
  });
}

function createOnboardingSupabaseMock() {
  const inserts: Array<{ table: string; payload: unknown }> = [];
  const client = {
    from: vi.fn((table: string) => ({
      update: vi.fn(() => chainResult({ error: null })),
      insert: vi.fn((payload: unknown) => {
        inserts.push({ table, payload });

        return chainResult({
          error: null,
          data: {
            id: table === "goals" ? "goal-id" : "path-id"
          }
        });
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
    select: vi.fn(() => chain),
    single: vi.fn(() => terminal)
  };

  return chain;
}
