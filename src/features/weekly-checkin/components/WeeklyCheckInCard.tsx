"use client";

import { useEffect, useState, type FormEvent } from "react";
import { StatusPill } from "@/components/ui/StatusPill";
import type { HomeStreakSummary, WeeklyCheckInSummary } from "@/shared/types/game";

export interface WeeklyCheckInFormValues {
  weightKg: number | null;
  energyScore: number;
  sleepScore: number;
  stressScore: number;
  adherenceScore: number;
  reflection: string;
}

interface WeeklyCheckInCardProps {
  checkIn: WeeklyCheckInSummary | null;
  streak: HomeStreakSummary | null;
  disabled: boolean;
  isSubmitting: boolean;
  onSubmit: (values: WeeklyCheckInFormValues) => void;
}

export function WeeklyCheckInCard({
  checkIn,
  streak,
  disabled,
  isSubmitting,
  onSubmit
}: WeeklyCheckInCardProps) {
  const [weightKg, setWeightKg] = useState("");
  const [energyScore, setEnergyScore] = useState("3");
  const [sleepScore, setSleepScore] = useState("3");
  const [stressScore, setStressScore] = useState("3");
  const [adherenceScore, setAdherenceScore] = useState("3");
  const [reflection, setReflection] = useState("");
  const isCompleted = Boolean(checkIn);

  useEffect(() => {
    setWeightKg(checkIn?.weightKg ? String(checkIn.weightKg) : "");
    setEnergyScore(String(checkIn?.energyScore ?? 3));
    setSleepScore(String(checkIn?.sleepScore ?? 3));
    setStressScore(String(checkIn?.stressScore ?? 3));
    setAdherenceScore(String(checkIn?.adherenceScore ?? 3));
    setReflection(checkIn?.reflection ?? "");
  }, [checkIn]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      weightKg: weightKg ? Number(weightKg) : null,
      energyScore: Number(energyScore),
      sleepScore: Number(sleepScore),
      stressScore: Number(stressScore),
      adherenceScore: Number(adherenceScore),
      reflection
    });
  }

  return (
    <section className="rounded-[8px] border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Weekly review</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {isCompleted ? checkIn?.summary ?? "Review completed." : "One check-in keeps the system calibrated."}
          </p>
        </div>
        <StatusPill label={isCompleted ? "Completed" : "Due"} tone={isCompleted ? "green" : "amber"} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-[8px] bg-[var(--surface-strong)] p-3">
          <p className="text-xs text-[var(--muted)]">Week</p>
          <p className="mt-1 text-sm font-semibold">{checkIn?.weekStartDate ?? "Current"}</p>
        </div>
        <div className="rounded-[8px] bg-[var(--surface-strong)] p-3">
          <p className="text-xs text-[var(--muted)]">Review streak</p>
          <p className="mt-1 text-sm font-semibold text-[var(--green)]">{streak?.currentCount ?? 0} weeks</p>
        </div>
      </div>

      <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-xs text-[var(--muted)]">
            Weight kg
            <input
              className="focus-ring rounded-[8px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-sm text-[var(--text)]"
              inputMode="decimal"
              max="500"
              min="20"
              onChange={(event) => setWeightKg(event.target.value)}
              placeholder="Optional"
              step="0.1"
              type="number"
              value={weightKg}
            />
          </label>
          <ScoreSelect label="Energy" onChange={setEnergyScore} value={energyScore} />
          <ScoreSelect label="Sleep" onChange={setSleepScore} value={sleepScore} />
          <ScoreSelect label="Stress" onChange={setStressScore} value={stressScore} />
        </div>

        <ScoreSelect label="Adherence" onChange={setAdherenceScore} value={adherenceScore} />

        <label className="flex flex-col gap-1 text-xs text-[var(--muted)]">
          Reflection
          <textarea
            className="focus-ring min-h-20 resize-none rounded-[8px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-sm text-[var(--text)]"
            maxLength={800}
            onChange={(event) => setReflection(event.target.value)}
            placeholder="Win, obstacle, or adjustment."
            value={reflection}
          />
        </label>

        <button
          className="focus-ring rounded-[8px] bg-[var(--cyan)] px-4 py-3 text-sm font-semibold text-[#041014] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={disabled || isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Saving review" : isCompleted ? "Update weekly review" : "Submit weekly review"}
        </button>
      </form>
    </section>
  );
}

function ScoreSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-[var(--muted)]">
      {label}
      <select
        className="focus-ring rounded-[8px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-sm text-[var(--text)]"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <option value="1">1 / 5</option>
        <option value="2">2 / 5</option>
        <option value="3">3 / 5</option>
        <option value="4">4 / 5</option>
        <option value="5">5 / 5</option>
      </select>
    </label>
  );
}
