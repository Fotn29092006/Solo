"use client";

import { useState } from "react";
import { StatusPill } from "@/components/ui/StatusPill";
import { MVP_GOAL_TYPES, MVP_PATH_KEYS, ONBOARDING_STEPS } from "@/config/app";
import { useTelegramWebApp } from "@/features/telegram/hooks/useTelegramWebApp";
import type {
  MvpGoalType,
  MvpPathKey,
  OnboardingPersistenceResponse,
  OnboardingStep
} from "@/shared/types/game";

const stepCopy: Record<OnboardingStep, { title: string; body: string; status: string }> = {
  welcome: {
    title: "Enter the system",
    body: "Introduce the Mini App, Telegram identity binding, and the daily progression loop.",
    status: "Welcome"
  },
  "basic-profile": {
    title: "Basic profile",
    body: "Collect display name, current baseline, and simple starting context.",
    status: "Profile"
  },
  "goal-selection": {
    title: "Goal selection",
    body: "Choose the first practical goal without opening the full analytics engine.",
    status: "Goal"
  },
  "path-selection": {
    title: "Path selection",
    body: "Pick an initial progression path. Final path names remain TBD in the vault.",
    status: "Path"
  }
};

const goalLabels: Record<MvpGoalType, string> = {
  fat_loss: "Fat loss",
  muscle_gain: "Muscle gain",
  recomposition: "Recomposition",
  discipline: "Discipline",
  learning: "Learning"
};

const pathLabels: Record<MvpPathKey, string> = {
  warrior: "Warrior",
  discipline: "Discipline",
  scholar: "Scholar",
  polyglot: "Polyglot",
  rebuild: "Rebuild",
  aesthetic: "Aesthetic",
  balance: "Balance"
};

export function OnboardingFlow() {
  const telegram = useTelegramWebApp();
  const [stepIndex, setStepIndex] = useState(0);
  const [goalType, setGoalType] = useState<MvpGoalType>("fat_loss");
  const [targetValue, setTargetValue] = useState("");
  const [pathKey, setPathKey] = useState<MvpPathKey>("warrior");
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const step = ONBOARDING_STEPS[stepIndex];
  const copy = stepCopy[step];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === ONBOARDING_STEPS.length - 1;
  const canSubmit = Boolean(telegram.initData) && submitState !== "submitting";

  async function submitOnboarding() {
    if (!canSubmit) {
      setSubmitState("error");
      setMessage("Open the Mini App from Telegram to bind identity.");
      return;
    }

    setSubmitState("submitting");
    setMessage("Saving system profile...");

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          initData: telegram.initData,
          goalType,
          targetValue,
          pathKey
        })
      });
      const result = (await response.json()) as OnboardingPersistenceResponse;

      if (!response.ok || !result.ok) {
        setSubmitState("error");
        setMessage(`Onboarding save failed: ${result.status}`);
        return;
      }

      setSubmitState("saved");
      setMessage("Profile, goal, and path linked.");
    } catch {
      setSubmitState("error");
      setMessage("Onboarding save failed. Check connection and try again.");
    }
  }

  return (
    <section className="rounded-[8px] border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--muted)]">
            Step {stepIndex + 1} of {ONBOARDING_STEPS.length}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{copy.title}</h2>
        </div>
        <StatusPill label={copy.status} tone={isLast ? "green" : "cyan"} />
      </div>

      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{copy.body}</p>

      <div className="mt-5 rounded-[8px] border border-[var(--line)] bg-[var(--surface-strong)] p-4">
        {step === "welcome" && (
          <div>
            <p className="text-sm font-semibold">Identity link</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {telegram.isTelegram
                ? "Telegram identity is available for profile binding."
                : "Browser preview is active. Saving unlocks inside Telegram."}
            </p>
          </div>
        )}

        {step === "basic-profile" && (
          <div>
            <p className="text-sm font-semibold">Starting target</p>
            <input
              className="focus-ring mt-3 w-full rounded-[8px] border border-[var(--line)] bg-[var(--surface)] px-3 py-3 text-sm outline-none"
              maxLength={160}
              onChange={(event) => setTargetValue(event.target.value)}
              placeholder="Example: 78 kg, stronger routine, 20 min daily study"
              type="text"
              value={targetValue}
            />
          </div>
        )}

        {step === "goal-selection" && (
          <div>
            <p className="text-sm font-semibold">Primary goal</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {MVP_GOAL_TYPES.map((goal) => (
                <button
                  className={`focus-ring min-h-12 rounded-[8px] border px-3 py-2 text-left text-sm font-semibold ${
                    goalType === goal
                      ? "border-[var(--cyan)] bg-[rgba(42,217,255,0.14)] text-[var(--cyan)]"
                      : "border-[var(--line)] bg-[var(--surface)] text-[var(--foreground)]"
                  }`}
                  key={goal}
                  onClick={() => setGoalType(goal)}
                  type="button"
                >
                  {goalLabels[goal]}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "path-selection" && (
          <div>
            <p className="text-sm font-semibold">Initial path</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {MVP_PATH_KEYS.map((path) => (
                <button
                  className={`focus-ring min-h-12 rounded-[8px] border px-3 py-2 text-left text-sm font-semibold ${
                    pathKey === path
                      ? "border-[var(--green)] bg-[rgba(89,240,177,0.12)] text-[var(--green)]"
                      : "border-[var(--line)] bg-[var(--surface)] text-[var(--foreground)]"
                  }`}
                  key={path}
                  onClick={() => setPathKey(path)}
                  type="button"
                >
                  {pathLabels[path]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {message ? (
        <p className={`mt-4 text-sm ${submitState === "saved" ? "text-[var(--green)]" : "text-[var(--amber)]"}`}>
          {message}
        </p>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          className="focus-ring rounded-[8px] border border-[var(--line)] px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-45"
          disabled={isFirst}
          onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
          type="button"
        >
          Back
        </button>
        <button
          className="focus-ring rounded-[8px] bg-[var(--cyan)] px-4 py-3 text-sm font-semibold text-[#041014] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={submitState === "submitting"}
          onClick={() => {
            if (isLast) {
              void submitOnboarding();
              return;
            }

            setStepIndex((current) => Math.min(ONBOARDING_STEPS.length - 1, current + 1));
          }}
          type="button"
        >
          {isLast ? "Save" : "Next"}
        </button>
      </div>
    </section>
  );
}
