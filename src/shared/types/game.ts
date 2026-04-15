import type { MVP_DOMAINS, ONBOARDING_STEPS } from "@/config/app";

export type MvpDomain = (typeof MVP_DOMAINS)[number];

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export type RankKey =
  | "unranked"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "master"
  | "legend";

export type QuestType = "main" | "side" | "discipline" | "recovery";

export type QuestStatus = "assigned" | "completed" | "missed" | "skipped";

export type StreakType =
  | "daily_login"
  | "daily_quest"
  | "workout"
  | "nutrition"
  | "weekly_review";

export interface HomeQuestPreview {
  id: string;
  title: string;
  domain: MvpDomain;
  type: QuestType;
  xpReward: number;
  status: QuestStatus;
}
