"use client";

import { useState } from "react";
import { StatusPill } from "@/components/ui/StatusPill";
import { useTelegramWebApp } from "@/features/telegram/hooks/useTelegramWebApp";

export function TelegramStatusCard() {
  const telegram = useTelegramWebApp();
  const [copyStatus, setCopyStatus] = useState("");
  const [initDataPreview, setInitDataPreview] = useState("");
  const isDevelopment = process.env.NODE_ENV === "development";
  const displayName =
    telegram.user?.username ??
    [telegram.user?.first_name, telegram.user?.last_name].filter(Boolean).join(" ") ??
    "";

  async function copyInitData() {
    const initData = window.Telegram?.WebApp?.initData ?? "";

    if (!initData) {
      setCopyStatus("No initData: open inside Telegram");
      setInitDataPreview("");
      return;
    }

    try {
      await copyText(initData);
      setInitDataPreview(createInitDataPreview(initData));
      setCopyStatus("initData copied. Paste it into local TELEGRAM_TEST_INIT_DATA.");
    } catch {
      setCopyStatus("Copy failed.");
    }
  }

  async function copyInitDataUnsafe() {
    const initDataUnsafe = window.Telegram?.WebApp?.initDataUnsafe;

    if (!initDataUnsafe) {
      setCopyStatus("No initDataUnsafe: open inside Telegram");
      setInitDataPreview("");
      return;
    }

    try {
      await copyText(JSON.stringify(initDataUnsafe));
      setCopyStatus("initDataUnsafe copied for development debugging only. Do not use it for auth.");
    } catch {
      setCopyStatus("Copy failed.");
    }
  }

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

      {isDevelopment ? (
        <div className="mt-3 rounded-[8px] border border-[var(--line)] bg-[var(--surface-strong)] p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[var(--foreground)]">Development-only Telegram debug</p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Copy real Mini App initData into local TELEGRAM_TEST_INIT_DATA. Raw values are never rendered here.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <button
                className="focus-ring rounded-[8px] border border-[var(--line)] px-3 py-2 text-xs font-semibold"
                onClick={() => void copyInitData()}
                type="button"
              >
                Copy initData
              </button>
              <button
                className="focus-ring rounded-[8px] border border-[var(--line)] px-3 py-2 text-xs font-semibold"
                onClick={() => void copyInitDataUnsafe()}
                type="button"
              >
                Copy initDataUnsafe
              </button>
            </div>
          </div>
          {initDataPreview ? (
            <p className="mt-2 break-words text-xs text-[var(--muted)]">{initDataPreview}</p>
          ) : null}
          {copyStatus ? <p className="mt-2 text-xs text-[var(--muted)]">{copyStatus}</p> : null}
        </div>
      ) : null}
    </section>
  );
}

function createInitDataPreview(value: string) {
  const params = new URLSearchParams(value);
  const flags = [
    `query_id:${flag(params.has("query_id"))}`,
    `auth_date:${flag(params.has("auth_date"))}`,
    `hash:${flag(params.has("hash"))}`,
    `user:${flag(params.has("user"))}`
  ].join(" ");

  return `Preview: ${value.slice(0, 80)}${value.length > 80 ? "..." : ""} | ${flags}`;
}

function flag(value: boolean) {
  return value ? "yes" : "no";
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const copied = document.execCommand("copy");

    if (!copied) {
      throw new Error("Copy command failed");
    }
  } finally {
    document.body.removeChild(textarea);
  }
}
