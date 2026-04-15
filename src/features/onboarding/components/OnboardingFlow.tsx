"use client";

import { useState } from "react";
import { StatusPill } from "@/components/ui/StatusPill";
import { ONBOARDING_STEPS } from "@/config/app";
import type { OnboardingStep } from "@/shared/types/game";

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

export function OnboardingFlow() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = ONBOARDING_STEPS[stepIndex];
  const copy = stepCopy[step];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === ONBOARDING_STEPS.length - 1;

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
        <p className="text-sm font-semibold">Structure placeholder</p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Forms and persistence will be wired after Telegram auth and the profile schema are confirmed.
        </p>
      </div>

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
          disabled={isLast}
          onClick={() => setStepIndex((current) => Math.min(ONBOARDING_STEPS.length - 1, current + 1))}
          type="button"
        >
          Next
        </button>
      </div>
    </section>
  );
}
