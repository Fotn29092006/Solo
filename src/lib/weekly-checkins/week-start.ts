const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function getUtcWeekStartDateKey(date = new Date()) {
  const utcMidnight = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const day = date.getUTCDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;

  return new Date(utcMidnight - daysSinceMonday * MS_PER_DAY).toISOString().slice(0, 10);
}

export function getNextWeeklyReviewStreak(
  previous: {
    currentCount: number;
    bestCount: number;
    lastActivityDate: string | null;
  } | null,
  weekStartDate: string
) {
  if (!previous?.lastActivityDate) {
    return {
      shouldWrite: true,
      advanced: true,
      currentCount: 1,
      bestCount: Math.max(previous?.bestCount ?? 0, 1),
      lastActivityDate: weekStartDate
    };
  }

  if (previous.lastActivityDate === weekStartDate) {
    return {
      shouldWrite: false,
      advanced: false,
      currentCount: previous.currentCount,
      bestCount: previous.bestCount,
      lastActivityDate: previous.lastActivityDate
    };
  }

  const weekDelta = Math.floor((getUtcDayNumber(weekStartDate) - getUtcDayNumber(previous.lastActivityDate)) / 7);

  if (weekDelta < 0) {
    return {
      shouldWrite: false,
      advanced: false,
      currentCount: previous.currentCount,
      bestCount: previous.bestCount,
      lastActivityDate: previous.lastActivityDate
    };
  }

  const currentCount = weekDelta === 1 ? previous.currentCount + 1 : 1;

  return {
    shouldWrite: true,
    advanced: true,
    currentCount,
    bestCount: Math.max(previous.bestCount, currentCount),
    lastActivityDate: weekStartDate
  };
}

function getUtcDayNumber(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return Math.floor(Date.UTC(year, month - 1, day) / MS_PER_DAY);
}
