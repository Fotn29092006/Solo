# Quest System

## Purpose
Define daily and weekly quest behavior.

## Status
Draft

## Owner
Shared

## Last Updated
2026-04-17

## Related Files
- [[Adaptive_Mission_Engine]]
- [[XP_System]]
- [[../04_DATA/Domain_Score_Logic]]

## Content
Daily quest package:

- 1 main quest.
- 2 to 4 side quests.
- 1 discipline quest.
- 1 recovery quest.

Weekly quests can include workout count, weight trend, calorie compliance, language sessions, reflection, and streak survival.

Quest principles:

- Personalized.
- Achievable.
- Adaptive.
- Measurable.
- Relevant to user goals.

Completion must create meaningful XP, stat, streak, or rank effects.

Current MVP seed behavior:

- `/api/home` creates the first daily quest package when no quests exist for the validated profile and current date.
- The seed uses active goal and active path when available.
- The seed falls back to Discipline/Balanced behavior when onboarding context is missing.
- The package currently contains 1 main quest, 2 side quests, 1 discipline quest, and 1 recovery quest.
Current MVP completion behavior:

- `/api/quests/complete` completes an assigned daily quest only after Telegram validation and profile ownership checks.
- Completion writes one `quest_completions` row per quest.
- Repeated completion attempts are idempotent and do not award XP again.
- Completion checks whether the full daily quest package is complete for that date.
- When the full package is complete, completion updates the `daily_quest` streak.
- Home provides a one-tap complete action for assigned quests.
- Water logging can auto-complete only the seeded hydration quest when the validated profile's server-side daily water aggregate reaches at least 1000 ml for the quest date.
- Hydration auto-complete is limited to `Log water intake before the day ends`, uses the stable `autoCompleteKey = water_log` metadata when present, and falls back to the legacy seeded title only for existing quest rows.
- Workout logging can auto-complete only newly seeded Body main quests that include explicit `autoCompleteKey = workout_log`, `matchWindow = quest_date`, and `minWorkoutSessions` metadata.
- Workout quick-log still cannot complete strength progression, upper-body, duration, quality, or performance quests because the current payload is only a coarse session type.
- Sleep logging is currently a separate Recovery-domain behavior log; it does not automatically complete recovery quests until stable metadata and recovery matching rules are defined.
- Future recovery quest matching must not rely only on title text or broad `domain = recovery` checks.
- Meal logging is a separate Nutrition-domain behavior log; it does not automatically complete meal or protein quests yet.
- Future meal quest matching must use stable metadata keys and server-side aggregate rules, not title text or broad `domain = nutrition` checks.
- Rank effects are still next-step work.

Deterministic quest-to-log matching rules:

- Matching must use stable `daily_quests.metadata` keys, not translated titles or broad domain checks.
- A matcher must require the same server-derived `profile_id`.
- A matcher must require the same server-computed date window, currently `quest_date`.
- A matcher must require `status = assigned` before completion.
- A matcher must be idempotent through `quest_completions`.
- A matcher must write XP only through the normal quest completion path.
- A matcher must ignore client-owned reward, rank, streak, date, status, and profile fields.

Required metadata keys for future auto-complete quests:

```json
{
  "seedVersion": "mvp-1",
  "matchVersion": "mvp-1",
  "autoCompleteKey": "workout_log",
  "matchWindow": "quest_date"
}
```

Allowed `autoCompleteKey` values for the current logging slices:

- `water_log`
- `workout_log`
- `sleep_log`
- `meal_log`

Safe matching rules:

- Water can complete a hydration quest when `sum(amount_ml)` for the profile and quest date reaches `autoCompleteThresholdMl`.
- Workout can complete only simple session-count quests, such as one logged workout, when `minWorkoutSessions` is satisfied.
- Workout type matching is allowed only when `allowedWorkoutTypes` is present and the log type is captured.
- Sleep can complete sleep-log or sleep-duration quests when `minSleepLogs` or `minSleepDurationMin` is satisfied.
- Meal can complete meal-log or meal-type quests when `minMealLogs` or `allowedMealTypes` is satisfied.

Unsafe matching rules:

- Do not match by `title.includes(...)` except temporary legacy fallback for already-seeded hydration rows.
- Do not match only by `domain`.
- Do not complete strength progression, upper-body, steps, calorie, protein, planned meal, healthy meal, sleep-before-midnight, high-quality sleep, or recovery-quality quests unless the payload and metadata prove the requirement.
- Do not auto-complete workout, sleep, or meal quests from current quick-log buttons until those quests are seeded with explicit matching metadata.
