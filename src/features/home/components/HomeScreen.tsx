import Link from "next/link";
import { StatusPill } from "@/components/ui/StatusPill";
import { SupabaseConnectionTest } from "@/features/system/components/SupabaseConnectionTest";
import { TelegramStatusCard } from "@/features/telegram/components/TelegramStatusCard";
import type { HomeQuestPreview } from "@/shared/types/game";

const questPlaceholders: HomeQuestPreview[] = [
  {
    id: "main",
    title: "Complete today's main discipline quest",
    domain: "mind",
    type: "main",
    xpReward: 50,
    status: "assigned"
  },
  {
    id: "water",
    title: "Log water intake",
    domain: "nutrition",
    type: "side",
    xpReward: 15,
    status: "assigned"
  },
  {
    id: "recovery",
    title: "Record recovery check",
    domain: "recovery",
    type: "recovery",
    xpReward: 20,
    status: "assigned"
  }
];

export function HomeScreen() {
  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-[8px] border border-[var(--line)] bg-[var(--surface)] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-[var(--muted)]">Current status</p>
            <h2 className="mt-1 text-3xl font-semibold">Level 1</h2>
          </div>
          <StatusPill label="Unranked" tone="cyan" />
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--muted)]">XP</span>
            <span className="font-semibold">0 / 100</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-[8px] bg-[var(--surface-strong)]">
            <div className="h-full w-[8%] bg-[var(--cyan)]" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[8px] bg-[var(--surface-strong)] p-3">
            <p className="text-xs text-[var(--muted)]">Daily streak</p>
            <p className="mt-1 text-lg font-semibold text-[var(--green)]">0 days</p>
          </div>
          <div className="rounded-[8px] bg-[var(--surface-strong)] p-3">
            <p className="text-xs text-[var(--muted)]">Quests today</p>
            <p className="mt-1 text-lg font-semibold text-[var(--amber)]">3 pending</p>
          </div>
        </div>
      </section>

      <section className="rounded-[8px] border border-[var(--line)] bg-[var(--surface)] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Daily quests</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Placeholders until quest generation is wired.</p>
          </div>
          <StatusPill label="Base" tone="amber" />
        </div>

        <ul className="mt-4 flex flex-col gap-3">
          {questPlaceholders.map((quest) => (
            <li
              className="rounded-[8px] border border-[var(--line)] bg-[var(--surface-strong)] p-3"
              key={quest.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{quest.title}</p>
                  <p className="mt-1 text-xs uppercase text-[var(--muted)]">
                    {quest.domain} / {quest.type}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-[var(--green)]">+{quest.xpReward} XP</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <TelegramStatusCard />
      <SupabaseConnectionTest />

      <Link
        className="focus-ring rounded-[8px] bg-[var(--cyan)] px-4 py-3 text-center text-sm font-semibold text-[#041014]"
        href="/onboarding"
      >
        Start onboarding structure
      </Link>
    </div>
  );
}
