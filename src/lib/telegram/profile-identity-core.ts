import type { Database } from "@/shared/types/database";
import type { TelegramProfileIdentity, TelegramValidatedUser } from "@/shared/types/telegram";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

export function buildTelegramProfileUpsert(user: TelegramValidatedUser): ProfileInsert {
  return {
    telegram_user_id: user.id,
    telegram_username: user.username ?? null,
    display_name: buildTelegramDisplayName(user)
  };
}

export function buildTelegramDisplayName(user: TelegramValidatedUser) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();

  if (fullName) {
    return fullName;
  }

  return user.username ?? null;
}

export function toTelegramProfileIdentity(profile: Pick<
  ProfileRow,
  "id" | "telegram_user_id" | "telegram_username" | "display_name" | "level" | "total_xp" | "rank_key"
>): TelegramProfileIdentity {
  return {
    id: profile.id,
    telegramUserId: String(profile.telegram_user_id),
    telegramUsername: profile.telegram_username,
    displayName: profile.display_name,
    level: profile.level,
    totalXp: profile.total_xp,
    rankKey: profile.rank_key
  };
}
