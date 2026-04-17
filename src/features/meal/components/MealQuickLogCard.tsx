import type { MealTodaySummary, MealType } from "@/shared/types/game";

interface MealQuickLogCardProps {
  disabled: boolean;
  isSubmitting: boolean;
  mealToday: MealTodaySummary | null;
  message: string;
  onLog: (mealType: MealType) => void;
}

const quickMeals: Array<{ type: MealType; label: string }> = [
  {
    type: "breakfast",
    label: "Breakfast"
  },
  {
    type: "lunch",
    label: "Lunch"
  },
  {
    type: "dinner",
    label: "Dinner"
  },
  {
    type: "snack",
    label: "Snack"
  }
];

export function MealQuickLogCard({
  disabled,
  isSubmitting,
  mealToday,
  message,
  onLog
}: MealQuickLogCardProps) {
  const mealCount = mealToday?.mealCount ?? 0;

  return (
    <section className="rounded-[8px] border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Nutrition</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {mealCount > 0 ? `${mealCount} meal${mealCount === 1 ? "" : "s"} logged today` : "No meal logged today."}
          </p>
        </div>
        <div className="rounded-[8px] bg-[var(--surface-strong)] px-3 py-2 text-right">
          <p className="text-xs text-[var(--muted)]">Today</p>
          <p className="text-sm font-semibold text-[var(--green)]">
            {mealCount} meal{mealCount === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 min-[360px]:grid-cols-4">
        {quickMeals.map((meal) => (
          <button
            className="focus-ring min-h-11 rounded-[8px] border border-[var(--line)] bg-[var(--surface-strong)] px-2 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-45"
            disabled={disabled || isSubmitting}
            key={meal.type}
            onClick={() => onLog(meal.type)}
            type="button"
          >
            {meal.label}
          </button>
        ))}
      </div>

      <p className="mt-3 min-h-5 text-xs text-[var(--muted)]">
        {isSubmitting ? "Saving nutrition log..." : message || "Quick log keeps nutrition visible."}
      </p>
    </section>
  );
}
