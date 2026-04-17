import type { WorkoutTodaySummary, WorkoutType } from "@/shared/types/game";

interface WorkoutQuickLogCardProps {
  disabled: boolean;
  isSubmitting: boolean;
  message: string;
  onLog: (workoutType: WorkoutType) => void;
  workoutToday: WorkoutTodaySummary | null;
}

const quickWorkouts: Array<{ type: WorkoutType; label: string }> = [
  {
    type: "strength",
    label: "Strength"
  },
  {
    type: "cardio",
    label: "Cardio"
  },
  {
    type: "mobility",
    label: "Mobility"
  },
  {
    type: "mixed",
    label: "Mixed"
  }
];

export function WorkoutQuickLogCard({
  disabled,
  isSubmitting,
  message,
  onLog,
  workoutToday
}: WorkoutQuickLogCardProps) {
  const sessionCount = workoutToday?.sessionCount ?? 0;
  const totalDurationMinutes = workoutToday?.totalDurationMinutes ?? 0;

  return (
    <section className="rounded-[8px] border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Workout</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {sessionCount > 0 ? `${sessionCount} session${sessionCount === 1 ? "" : "s"} logged today` : "No workout logged today."}
          </p>
        </div>
        <div className="rounded-[8px] bg-[var(--surface-strong)] px-3 py-2 text-right">
          <p className="text-xs text-[var(--muted)]">Today</p>
          <p className="text-sm font-semibold text-[var(--green)]">{formatTodayValue(sessionCount, totalDurationMinutes)}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 min-[360px]:grid-cols-4">
        {quickWorkouts.map((workout) => (
          <button
            className="focus-ring min-h-11 rounded-[8px] border border-[var(--line)] bg-[var(--surface-strong)] px-2 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-45"
            disabled={disabled || isSubmitting}
            key={workout.type}
            onClick={() => onLog(workout.type)}
            type="button"
          >
            {workout.label}
          </button>
        ))}
      </div>

      <p className="mt-3 min-h-5 text-xs text-[var(--muted)]">
        {isSubmitting ? "Saving workout log..." : message || "Quick log keeps body progress real."}
      </p>
    </section>
  );
}

function formatTodayValue(sessionCount: number, totalDurationMinutes: number) {
  if (sessionCount === 0) {
    return "0 sessions";
  }

  if (totalDurationMinutes > 0) {
    return `${totalDurationMinutes} min`;
  }

  return `${sessionCount} session${sessionCount === 1 ? "" : "s"}`;
}
