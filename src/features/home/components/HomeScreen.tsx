"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StatusPill } from "@/components/ui/StatusPill";
import { SupabaseConnectionTest } from "@/features/system/components/SupabaseConnectionTest";
import { MealQuickLogCard } from "@/features/meal/components/MealQuickLogCard";
import { TelegramStatusCard } from "@/features/telegram/components/TelegramStatusCard";
import { useTelegramWebApp } from "@/features/telegram/hooks/useTelegramWebApp";
import { SleepQuickLogCard } from "@/features/sleep/components/SleepQuickLogCard";
import { WaterQuickLogCard } from "@/features/water/components/WaterQuickLogCard";
import { WorkoutQuickLogCard } from "@/features/workout/components/WorkoutQuickLogCard";
import {
  WeeklyCheckInCard,
  type WeeklyCheckInFormValues
} from "@/features/weekly-checkin/components/WeeklyCheckInCard";
import type {
  HomeQuestPreview,
  HomeStateResponse,
  HomeStreakSummary,
  MealLogResponse,
  MealType,
  QuestCompletionResponse,
  SleepLogResponse,
  WaterLogResponse,
  WeeklyCheckInResponse,
  WorkoutLogResponse,
  WorkoutType
} from "@/shared/types/game";

const previewQuests: HomeQuestPreview[] = [
  {
    id: "main",
    title: "Complete one focused mission",
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
  const telegram = useTelegramWebApp();
  const [homeState, setHomeState] = useState<HomeStateResponse | null>(null);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [completingQuestId, setCompletingQuestId] = useState<string | null>(null);
  const [isWeeklyCheckInSubmitting, setIsWeeklyCheckInSubmitting] = useState(false);
  const [isWaterLogSubmitting, setIsWaterLogSubmitting] = useState(false);
  const [isWorkoutLogSubmitting, setIsWorkoutLogSubmitting] = useState(false);
  const [isSleepLogSubmitting, setIsSleepLogSubmitting] = useState(false);
  const [isMealLogSubmitting, setIsMealLogSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [waterMessage, setWaterMessage] = useState("");
  const [workoutMessage, setWorkoutMessage] = useState("");
  const [sleepMessage, setSleepMessage] = useState("");
  const [mealMessage, setMealMessage] = useState("");
  const profile = homeState?.profile ?? null;
  const quests = homeState?.quests.length ? homeState.quests : previewQuests;
  const pendingCount = quests.filter((quest) => quest.status === "assigned").length;
  const level = profile?.level ?? 1;
  const totalXp = profile?.totalXp ?? 0;
  const xpProgress = Math.min(100, totalXp % 100);
  const rankLabel = formatLabel(profile?.rankKey ?? "unranked");
  const dailyQuestStreak = homeState?.streaks.find((streak) => streak.type === "daily_quest") ?? null;
  const weeklyReviewStreak = homeState?.streaks.find((streak) => streak.type === "weekly_review") ?? null;
  const dailyQuestStreakCount = dailyQuestStreak?.currentCount ?? 0;
  const dailyQuestBestStreak = dailyQuestStreak?.bestCount ?? 0;

  useEffect(() => {
    if (!telegram.isReady) {
      return;
    }

    if (!telegram.initData) {
      setLoadState("idle");
      setMessage("Open in Telegram to load your system state.");
      return;
    }

    let isMounted = true;

    async function loadHomeState() {
      setLoadState("loading");
      setMessage("Loading system state...");

      try {
        const response = await fetch("/api/home", {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            initData: telegram.initData
          })
        });
        const result = (await response.json()) as HomeStateResponse;

        if (!isMounted) {
          return;
        }

        if (!response.ok || !result.ok) {
          setLoadState("error");
          setMessage(`System state unavailable: ${result.status}`);
          return;
        }

        setHomeState(result);
        setLoadState("ready");
        setMessage("Daily quest package generated.");
      } catch {
        if (!isMounted) {
          return;
        }

        setLoadState("error");
        setMessage("System state unavailable. Check connection and try again.");
      }
    }

    void loadHomeState();

    return () => {
      isMounted = false;
    };
  }, [telegram.initData, telegram.isReady]);

  async function completeQuest(quest: HomeQuestPreview) {
    if (!telegram.initData || !homeState || quest.status !== "assigned") {
      setMessage("Open in Telegram to complete live quests.");
      return;
    }

    setCompletingQuestId(quest.id);
    setMessage("Completing quest...");

    try {
      const response = await fetch("/api/quests/complete", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          initData: telegram.initData,
          questId: quest.id
        })
      });
      const result = (await response.json()) as QuestCompletionResponse;

      if (!response.ok || !result.ok) {
        setMessage(`Quest completion failed: ${result.status}`);
        return;
      }

      setHomeState((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          profile: current.profile
            ? {
                ...current.profile,
                totalXp: result.totalXp ?? current.profile.totalXp,
                level: result.level ?? current.profile.level
              }
            : current.profile,
          quests: current.quests.map((item) =>
            item.id === quest.id
              ? {
                  ...item,
                  status: "completed"
                }
              : item
          ),
          streaks: result.dailyQuestStreak
            ? mergeStreakSummary(current.streaks, result.dailyQuestStreak)
            : current.streaks
        };
      });

      if (result.dailyQuestStreakAdvanced && result.dailyQuestStreak) {
        setMessage(`Daily quest package complete. Streak ${result.dailyQuestStreak.currentCount} days.`);
      } else {
        setMessage(
          result.status === "already_completed" ? "Quest already completed." : `Quest completed. +${result.xpAwarded} XP`
        );
      }
    } catch {
      setMessage("Quest completion failed. Check connection and try again.");
    } finally {
      setCompletingQuestId(null);
    }
  }

  async function submitWeeklyCheckIn(values: WeeklyCheckInFormValues) {
    if (!telegram.initData || !homeState) {
      setMessage("Open in Telegram to submit weekly review.");
      return;
    }

    setIsWeeklyCheckInSubmitting(true);
    setMessage("Saving weekly review...");

    try {
      const response = await fetch("/api/weekly-checkin", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          initData: telegram.initData,
          ...values
        })
      });
      const result = (await response.json()) as WeeklyCheckInResponse;

      if (!response.ok || !result.ok) {
        setMessage(`Weekly review failed: ${result.status}`);
        return;
      }

      setHomeState((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          weeklyCheckIn: result.checkIn,
          streaks: result.weeklyReviewStreak
            ? mergeStreakSummary(current.streaks, result.weeklyReviewStreak)
            : current.streaks
        };
      });

      setMessage(
        result.weeklyReviewStreakAdvanced && result.weeklyReviewStreak
          ? `Weekly review saved. Streak ${result.weeklyReviewStreak.currentCount} weeks.`
          : "Weekly review saved."
      );
    } catch {
      setMessage("Weekly review failed. Check connection and try again.");
    } finally {
      setIsWeeklyCheckInSubmitting(false);
    }
  }

  async function logWater(amountMl: number) {
    if (!telegram.initData || !homeState) {
      setWaterMessage("Open in Telegram to log water.");
      return;
    }

    setIsWaterLogSubmitting(true);
    setWaterMessage("Saving hydration log...");

    try {
      const response = await fetch("/api/water-logs", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          initData: telegram.initData,
          amountMl,
          clientEventId: createClientEventId()
        })
      });
      const result = (await response.json()) as WaterLogResponse;

      if (!response.ok || !result.ok) {
        setWaterMessage(`Hydration log failed: ${result.status}`);
        return;
      }

      setHomeState((current) => {
        if (!current) {
          return current;
        }

        const nextState = {
          ...current,
          waterToday: result.waterToday ?? current.waterToday
        };

        return applyQuestCompletionToHome(nextState, result.questSync.questCompletion);
      });
      setWaterMessage(getWaterLogMessage(result));
    } catch {
      setWaterMessage("Hydration log failed. Check connection and try again.");
    } finally {
      setIsWaterLogSubmitting(false);
    }
  }

  async function logWorkout(workoutType: WorkoutType) {
    if (!telegram.initData || !homeState) {
      setWorkoutMessage("Open in Telegram to log workouts.");
      return;
    }

    setIsWorkoutLogSubmitting(true);
    setWorkoutMessage("Saving workout log...");

    try {
      const response = await fetch("/api/workout-logs", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          initData: telegram.initData,
          workoutType,
          clientEventId: createClientEventId()
        })
      });
      const result = (await response.json()) as WorkoutLogResponse;

      if (!response.ok || !result.ok) {
        setWorkoutMessage(`Workout log failed: ${result.status}`);
        return;
      }

      setHomeState((current) => {
        if (!current) {
          return current;
        }

        const nextState = {
          ...current,
          workoutToday: result.workoutToday ?? current.workoutToday
        };

        return applyQuestCompletionToHome(nextState, result.questSync.questCompletion);
      });
      setWorkoutMessage(getWorkoutLogMessage(result));
    } catch {
      setWorkoutMessage("Workout log failed. Check connection and try again.");
    } finally {
      setIsWorkoutLogSubmitting(false);
    }
  }

  async function logSleep(sleepDurationMin: number) {
    if (!telegram.initData || !homeState) {
      setSleepMessage("Open in Telegram to log sleep.");
      return;
    }

    setIsSleepLogSubmitting(true);
    setSleepMessage("Saving sleep log...");

    try {
      const response = await fetch("/api/sleep-logs", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          initData: telegram.initData,
          sleepDurationMin,
          clientEventId: createClientEventId()
        })
      });
      const result = (await response.json()) as SleepLogResponse;

      if (!response.ok || !result.ok) {
        setSleepMessage(`Sleep log failed: ${result.status}`);
        return;
      }

      setHomeState((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          sleepToday: result.sleepToday ?? current.sleepToday
        };
      });
      setSleepMessage(
        result.status === "already_logged"
          ? "Sleep already logged."
          : `Sleep logged. Today ${formatDuration(result.todayTotalSleepDurationMinutes)}.`
      );
    } catch {
      setSleepMessage("Sleep log failed. Check connection and try again.");
    } finally {
      setIsSleepLogSubmitting(false);
    }
  }

  async function logMeal(mealType: MealType) {
    if (!telegram.initData || !homeState) {
      setMealMessage("Open in Telegram to log meals.");
      return;
    }

    setIsMealLogSubmitting(true);
    setMealMessage("Saving nutrition log...");

    try {
      const response = await fetch("/api/meal-logs", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          initData: telegram.initData,
          mealType,
          clientEventId: createClientEventId()
        })
      });
      const result = (await response.json()) as MealLogResponse;

      if (!response.ok || !result.ok) {
        setMealMessage(`Nutrition log failed: ${result.status}`);
        return;
      }

      setHomeState((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          mealToday: result.mealToday ?? current.mealToday
        };
      });
      setMealMessage(
        result.status === "already_logged"
          ? "Meal already logged."
          : `Meal logged. Today ${result.todayMealCount} meal${result.todayMealCount === 1 ? "" : "s"}.`
      );
    } catch {
      setMealMessage("Nutrition log failed. Check connection and try again.");
    } finally {
      setIsMealLogSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-[8px] border border-[var(--line)] bg-[var(--surface)] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-[var(--muted)]">
              {profile?.displayName ? profile.displayName : "Current status"}
            </p>
            <h2 className="mt-1 text-3xl font-semibold">Level {level}</h2>
          </div>
          <StatusPill label={rankLabel} tone={loadState === "ready" ? "green" : "cyan"} />
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--muted)]">XP</span>
            <span className="font-semibold">{totalXp} total</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-[8px] bg-[var(--surface-strong)]">
            <div className="h-full bg-[var(--cyan)]" style={{ width: `${Math.max(8, xpProgress)}%` }} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[8px] bg-[var(--surface-strong)] p-3">
            <p className="text-xs text-[var(--muted)]">Daily streak</p>
            <p className="mt-1 text-lg font-semibold text-[var(--green)]">{dailyQuestStreakCount} days</p>
            <p className="mt-1 text-xs text-[var(--muted)]">Best {dailyQuestBestStreak}</p>
          </div>
          <div className="rounded-[8px] bg-[var(--surface-strong)] p-3">
            <p className="text-xs text-[var(--muted)]">Quests today</p>
            <p className="mt-1 text-lg font-semibold text-[var(--amber)]">{pendingCount} pending</p>
          </div>
        </div>

        {homeState?.activeGoal || homeState?.activePath ? (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-[8px] bg-[var(--surface-strong)] p-3">
              <p className="text-xs text-[var(--muted)]">Goal</p>
              <p className="mt-1 truncate text-sm font-semibold">
                {formatLabel(homeState.activeGoal?.goalType ?? "not set")}
              </p>
            </div>
            <div className="rounded-[8px] bg-[var(--surface-strong)] p-3">
              <p className="text-xs text-[var(--muted)]">Path</p>
              <p className="mt-1 truncate text-sm font-semibold">
                {formatLabel(homeState.activePath?.pathKey ?? "not set")}
              </p>
            </div>
          </div>
        ) : null}
      </section>

      <WaterQuickLogCard
        disabled={!homeState || !telegram.initData}
        isSubmitting={isWaterLogSubmitting}
        message={waterMessage}
        onLog={(amountMl) => void logWater(amountMl)}
        waterToday={homeState?.waterToday ?? null}
      />

      <MealQuickLogCard
        disabled={!homeState || !telegram.initData}
        isSubmitting={isMealLogSubmitting}
        mealToday={homeState?.mealToday ?? null}
        message={mealMessage}
        onLog={(mealType) => void logMeal(mealType)}
      />

      <WorkoutQuickLogCard
        disabled={!homeState || !telegram.initData}
        isSubmitting={isWorkoutLogSubmitting}
        message={workoutMessage}
        onLog={(workoutType) => void logWorkout(workoutType)}
        workoutToday={homeState?.workoutToday ?? null}
      />

      <SleepQuickLogCard
        disabled={!homeState || !telegram.initData}
        isSubmitting={isSleepLogSubmitting}
        message={sleepMessage}
        onLog={(sleepDurationMin) => void logSleep(sleepDurationMin)}
        sleepToday={homeState?.sleepToday ?? null}
      />

      <WeeklyCheckInCard
        checkIn={homeState?.weeklyCheckIn ?? null}
        disabled={!homeState || !telegram.initData}
        isSubmitting={isWeeklyCheckInSubmitting}
        onSubmit={(values) => void submitWeeklyCheckIn(values)}
        streak={weeklyReviewStreak}
      />

      <section className="rounded-[8px] border border-[var(--line)] bg-[var(--surface)] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Daily quests</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{message || "Quest package ready."}</p>
          </div>
          <StatusPill label={loadState === "ready" ? "Live" : "Preview"} tone={loadState === "ready" ? "green" : "amber"} />
        </div>

        <ul className="mt-4 flex flex-col gap-3">
          {quests.map((quest) => (
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
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <p className="text-sm font-semibold text-[var(--green)]">+{quest.xpReward} XP</p>
                  <button
                    className="focus-ring min-w-24 rounded-[8px] border border-[var(--line)] px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-45"
                    disabled={!homeState || quest.status !== "assigned" || completingQuestId === quest.id}
                    onClick={() => void completeQuest(quest)}
                    type="button"
                  >
                    {quest.status === "completed" ? "Completed" : completingQuestId === quest.id ? "Saving" : "Complete"}
                  </button>
                </div>
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
        Update onboarding
      </Link>
    </div>
  );
}

function formatLabel(value: string) {
  return value
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function mergeStreakSummary(streaks: HomeStreakSummary[], nextStreak: HomeStreakSummary) {
  const existingIndex = streaks.findIndex((streak) => streak.type === nextStreak.type);

  if (existingIndex === -1) {
    return [...streaks, nextStreak];
  }

  return streaks.map((streak, index) => (index === existingIndex ? nextStreak : streak));
}

function applyQuestCompletionToHome(
  state: HomeStateResponse,
  completion: QuestCompletionResponse | null
): HomeStateResponse {
  if (!completion?.ok || !completion.questId) {
    return state;
  }

  return {
    ...state,
    profile: state.profile
      ? {
          ...state.profile,
          totalXp: completion.totalXp ?? state.profile.totalXp,
          level: completion.level ?? state.profile.level
        }
      : state.profile,
    quests: state.quests.map((quest) =>
      quest.id === completion.questId
        ? {
            ...quest,
            status: "completed"
          }
        : quest
    ),
    streaks: completion.dailyQuestStreak
      ? mergeStreakSummary(state.streaks, completion.dailyQuestStreak)
      : state.streaks
  };
}

function getWaterLogMessage(result: WaterLogResponse) {
  if (result.questSync.status === "completed" && result.questSync.questCompletion) {
    return `Hydration logged. Quest completed. +${result.questSync.questCompletion.xpAwarded} XP`;
  }

  if (result.questSync.status === "already_completed") {
    return result.status === "already_logged"
      ? "Hydration already logged. Quest already completed."
      : "Hydration logged. Quest already completed.";
  }

  if (result.questSync.status === "failed") {
    return "Hydration logged. Quest sync pending.";
  }

  return result.status === "already_logged"
    ? "Hydration already logged."
    : `Hydration logged. Today ${result.todayTotalMl} ml.`;
}

function getWorkoutLogMessage(result: WorkoutLogResponse) {
  if (result.questSync.status === "completed" && result.questSync.questCompletion) {
    return `Workout logged. Quest completed. +${result.questSync.questCompletion.xpAwarded} XP`;
  }

  if (result.questSync.status === "already_completed") {
    return result.status === "already_logged"
      ? "Workout already logged. Quest already completed."
      : "Workout logged. Quest already completed.";
  }

  if (result.questSync.status === "failed") {
    return "Workout logged. Quest sync pending.";
  }

  return result.status === "already_logged"
    ? "Workout already logged."
    : `Workout logged. Today ${result.todaySessionCount} session${result.todaySessionCount === 1 ? "" : "s"}.`;
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

function createClientEventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (char) =>
    (
      Number(char) ^
      (Math.random() * 16) >>
        (Number(char) / 4)
    ).toString(16)
  );
}
