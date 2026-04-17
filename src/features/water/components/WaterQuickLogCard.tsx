import type { WaterTodaySummary } from "@/shared/types/game";

interface WaterQuickLogCardProps {
  disabled: boolean;
  isSubmitting: boolean;
  message: string;
  onLog: (amountMl: number) => void;
  waterToday: WaterTodaySummary | null;
}

const quickAmounts = [250, 500, 750, 1000];

export function WaterQuickLogCard({
  disabled,
  isSubmitting,
  message,
  onLog,
  waterToday
}: WaterQuickLogCardProps) {
  const totalMl = waterToday?.totalMl ?? 0;

  return (
    <section className="rounded-[8px] border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Hydration</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {totalMl > 0 ? `${formatLiters(totalMl)} logged today` : "No water logged today."}
          </p>
        </div>
        <div className="rounded-[8px] bg-[var(--surface-strong)] px-3 py-2 text-right">
          <p className="text-xs text-[var(--muted)]">Today</p>
          <p className="text-sm font-semibold text-[var(--cyan)]">{totalMl} ml</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {quickAmounts.map((amountMl) => (
          <button
            className="focus-ring min-h-11 rounded-[8px] border border-[var(--line)] bg-[var(--surface-strong)] px-2 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-45"
            disabled={disabled || isSubmitting}
            key={amountMl}
            onClick={() => onLog(amountMl)}
            type="button"
          >
            +{amountMl}
          </button>
        ))}
      </div>

      <p className="mt-3 min-h-5 text-xs text-[var(--muted)]">
        {isSubmitting ? "Saving hydration log..." : message || "Quick log keeps nutrition progress real."}
      </p>
    </section>
  );
}

function formatLiters(amountMl: number) {
  return `${(amountMl / 1000).toFixed(amountMl % 1000 === 0 ? 0 : 2)}L`;
}
