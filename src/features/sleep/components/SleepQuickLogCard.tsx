import type { SleepTodaySummary } from "@/shared/types/game";

interface SleepQuickLogCardProps {
  disabled: boolean;
  isSubmitting: boolean;
  message: string;
  onLog: (sleepDurationMin: number) => void;
  sleepToday: SleepTodaySummary | null;
}

const quickSleepDurations = [
  {
    durationMin: 300,
    label: "4-5h"
  },
  {
    durationMin: 360,
    label: "5-6h"
  },
  {
    durationMin: 420,
    label: "6-7h"
  },
  {
    durationMin: 480,
    label: "7h+"
  }
];

export function SleepQuickLogCard({
  disabled,
  isSubmitting,
  message,
  onLog,
  sleepToday
}: SleepQuickLogCardProps) {
  const totalSleepDurationMinutes = sleepToday?.totalSleepDurationMinutes ?? 0;

  return (
    <section className="rounded-[8px] border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Sleep</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {totalSleepDurationMinutes > 0
              ? `${formatDuration(totalSleepDurationMinutes)} logged today`
              : "No sleep logged today."}
          </p>
        </div>
        <div className="rounded-[8px] bg-[var(--surface-strong)] px-3 py-2 text-right">
          <p className="text-xs text-[var(--muted)]">Today</p>
          <p className="text-sm font-semibold text-[var(--cyan)]">{formatDuration(totalSleepDurationMinutes)}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {quickSleepDurations.map((sleep) => (
          <button
            className="focus-ring min-h-11 rounded-[8px] border border-[var(--line)] bg-[var(--surface-strong)] px-2 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-45"
            disabled={disabled || isSubmitting}
            key={sleep.durationMin}
            onClick={() => onLog(sleep.durationMin)}
            type="button"
          >
            {sleep.label}
          </button>
        ))}
      </div>

      <p className="mt-3 min-h-5 text-xs text-[var(--muted)]">
        {isSubmitting ? "Saving sleep log..." : message || "Quick log keeps recovery visible."}
      </p>
    </section>
  );
}

function formatDuration(totalMinutes: number) {
  if (totalMinutes <= 0) {
    return "0h";
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}
