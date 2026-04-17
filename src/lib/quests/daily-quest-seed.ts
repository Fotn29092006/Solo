import type { Database, Json } from "@/shared/types/database";
import type { MvpGoalType, MvpPathKey } from "@/shared/types/game";

type DailyQuestInsert = Database["public"]["Tables"]["daily_quests"]["Insert"];

interface BuildDailyQuestSeedOptions {
  profileId: string;
  questDate: string;
  goalType: MvpGoalType | null;
  pathKey: MvpPathKey | null;
}

const SEED_VERSION = "mvp-1";
const WATER_AUTO_COMPLETE_THRESHOLD_ML = 1000;
const WORKOUT_MIN_SESSIONS = 1;

export function buildDailyQuestSeed({
  profileId,
  questDate,
  goalType,
  pathKey
}: BuildDailyQuestSeedOptions): DailyQuestInsert[] {
  const goal = goalType ?? "discipline";
  const path = pathKey ?? "balance";
  const metadata = {
    seedVersion: SEED_VERSION,
    goalType: goal,
    pathKey: path
  } satisfies Json;

  return [
    createQuest({
      profileId,
      questDate,
      title: getMainQuestTitle(path),
      domain: getMainQuestDomain(path),
      questType: "main",
      xpReward: 50,
      metadata: getMainQuestMetadata(path, metadata)
    }),
    createQuest({
      profileId,
      questDate,
      title: "Log water intake before the day ends",
      domain: "nutrition",
      questType: "side",
      xpReward: 15,
      metadata: {
        ...metadata,
        autoCompleteKey: "water_log",
        autoCompleteThresholdMl: WATER_AUTO_COMPLETE_THRESHOLD_ML
      } satisfies Json
    }),
    createQuest({
      profileId,
      questDate,
      title: getGoalSideQuestTitle(goal),
      domain: getGoalSideQuestDomain(goal),
      questType: "side",
      xpReward: 20,
      metadata
    }),
    createQuest({
      profileId,
      questDate,
      title: "Complete one planned task before distractions",
      domain: "mind",
      questType: "discipline",
      xpReward: 20,
      metadata
    }),
    createQuest({
      profileId,
      questDate,
      title: "Record recovery state and take a 10 minute walk",
      domain: "recovery",
      questType: "recovery",
      xpReward: 20,
      metadata
    })
  ];
}

function getMainQuestMetadata(pathKey: MvpPathKey, metadata: Json): Json {
  if (pathKey !== "warrior" && pathKey !== "aesthetic") {
    return metadata;
  }

  return {
    ...asJsonObject(metadata),
    matchVersion: SEED_VERSION,
    autoCompleteKey: "workout_log",
    matchWindow: "quest_date",
    minWorkoutSessions: WORKOUT_MIN_SESSIONS
  } satisfies Json;
}

function asJsonObject(value: Json) {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : {};
}

function createQuest({
  profileId,
  questDate,
  title,
  domain,
  questType,
  xpReward,
  metadata
}: {
  profileId: string;
  questDate: string;
  title: string;
  domain: DailyQuestInsert["domain"];
  questType: DailyQuestInsert["quest_type"];
  xpReward: number;
  metadata: Json;
}): DailyQuestInsert {
  return {
    profile_id: profileId,
    quest_date: questDate,
    title,
    domain,
    quest_type: questType,
    xp_reward: xpReward,
    status: "assigned",
    metadata
  };
}

function getMainQuestTitle(pathKey: MvpPathKey) {
  switch (pathKey) {
    case "warrior":
    case "aesthetic":
      return "Complete a focused body training session";
    case "scholar":
      return "Complete a focused study session";
    case "polyglot":
      return "Practice target language for 20 minutes";
    case "rebuild":
      return "Complete the minimum effective routine";
    case "discipline":
      return "Complete the highest priority mission first";
    case "balance":
      return "Complete one balanced body or mind session";
  }
}

function getMainQuestDomain(pathKey: MvpPathKey): DailyQuestInsert["domain"] {
  switch (pathKey) {
    case "warrior":
    case "aesthetic":
      return "body";
    case "scholar":
      return "mind";
    case "polyglot":
      return "language";
    case "rebuild":
    case "discipline":
    case "balance":
      return "mind";
  }
}

function getGoalSideQuestTitle(goalType: MvpGoalType) {
  switch (goalType) {
    case "fat_loss":
      return "Log one planned meal with protein";
    case "muscle_gain":
      return "Hit one protein anchor meal";
    case "recomposition":
      return "Keep one meal aligned with the plan";
    case "discipline":
      return "Protect one no-skip habit today";
    case "learning":
      return "Complete a 15 minute learning block";
  }
}

function getGoalSideQuestDomain(goalType: MvpGoalType): DailyQuestInsert["domain"] {
  switch (goalType) {
    case "fat_loss":
    case "muscle_gain":
    case "recomposition":
      return "nutrition";
    case "discipline":
    case "learning":
      return "mind";
  }
}
