"use client";

import { StatusPill } from "@/components/ui/StatusPill";
import { useTelegramWebApp } from "@/features/telegram/hooks/useTelegramWebApp";

export function TelegramStatusCard() {
  const telegram = useTelegramWebApp();
  const displayName =
    telegram.user?.username ??
    [telegram.user?.first_name, telegram.user?.last_name].filter(Boolean).join(" ") ??
    "";

  return (
    <section className="rounded-[8px] border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">Telegram runtime</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {telegram.isTelegram
              ? "Mini App bridge detected and initialized."
              : "Browser preview mode. Telegram user data is unavailable here."}
          </p>
        </div>
        <StatusPill label={telegram.isTelegram ? "Telegram" : "Preview"} tone={telegram.isTelegram ? "green" : "amber"} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-[8px] bg-[var(--surface-strong)] p-3">
          <dt className="text-[var(--muted)]">Platform</dt>
          <dd className="mt-1 font-semibold">{telegram.platform}</dd>
        </div>
        <div className="rounded-[8px] bg-[var(--surface-strong)] p-3">
          <dt className="text-[var(--muted)]">User</dt>
          <dd className="mt-1 truncate font-semibold">{displayName || "Not linked"}</dd>
        </div>
      </dl>
    </section>
  );
}
