export interface DailyQuestStreakSnapshot {
  currentCount: number;
  bestCount: number;
  lastActivityDate: string | null;
}

export interface DailyQuestStreakProgression {
  shouldWrite: boolean;
  advanced: boolean;
  currentCount: number;
  bestCount: number;
  lastActivityDate: string;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function getNextDailyQuestStreak(
  previous: DailyQuestStreakSnapshot | null,
  activityDate: string
): DailyQuestStreakProgression {
  if (!previous?.lastActivityDate) {
    return {
      shouldWrite: true,
      advanced: true,
      currentCount: 1,
      bestCount: Math.max(previous?.bestCount ?? 0, 1),
      lastActivityDate: activityDate
    };
  }

  if (previous.lastActivityDate === activityDate) {
    return {
      shouldWrite: false,
      advanced: false,
      currentCount: previous.currentCount,
      bestCount: previous.bestCount,
      lastActivityDate: previous.lastActivityDate
    };
  }

  const dayDelta = getUtcDayNumber(activityDate) - getUtcDayNumber(previous.lastActivityDate);

  if (dayDelta < 0) {
    return {
      shouldWrite: false,
      advanced: false,
      currentCount: previous.currentCount,
      bestCount: previous.bestCount,
      lastActivityDate: previous.lastActivityDate
    };
  }

  const currentCount = dayDelta === 1 ? previous.currentCount + 1 : 1;

  return {
    shouldWrite: true,
    advanced: true,
    currentCount,
    bestCount: Math.max(previous.bestCount, currentCount),
    lastActivityDate: activityDate
  };
}

function getUtcDayNumber(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return Math.floor(Date.UTC(year, month - 1, day) / MS_PER_DAY);
}
