import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/shared/types/database";
import type { TelegramProfileIdentity, TelegramValidatedUser } from "@/shared/types/telegram";
import { buildTelegramProfileUpsert, toTelegramProfileIdentity } from "./profile-identity-core";

export type TelegramProfileIdentityStatus =
  | "ready"
  | "missing_supabase_config"
  | "profile_upsert_failed";

export type TelegramProfileIdentityResult =
  | {
      ok: true;
      status: "ready";
      profile: TelegramProfileIdentity;
    }
  | {
      ok: false;
      status: Exclude<TelegramProfileIdentityStatus, "ready">;
      profile: null;
    };

export async function getOrCreateTelegramProfile(
  user: TelegramValidatedUser,
  supabase: SupabaseClient<Database> | null = createServiceRoleSupabaseClient()
): Promise<TelegramProfileIdentityResult> {
  if (!supabase) {
    return {
      ok: false,
      status: "missing_supabase_config",
      profile: null
    };
  }

  const profile = buildTelegramProfileUpsert(user);
  const { data, error } = await supabase
    .from("profiles")
    .upsert(profile, { onConflict: "telegram_user_id" })
    .select("id, telegram_user_id, telegram_username, display_name, level, total_xp, rank_key")
    .single();

  if (error || !data) {
    return {
      ok: false,
      status: "profile_upsert_failed",
      profile: null
    };
  }

  return {
    ok: true,
    status: "ready",
    profile: toTelegramProfileIdentity(data)
  };
}
