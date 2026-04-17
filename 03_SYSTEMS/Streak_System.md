# Streak System

## Purpose
Define streak types and behavior.

## Status
Draft

## Owner
Shared

## Last Updated
2026-04-17

## Related Files
- [[Rank_System]]
- [[XP_System]]
- [[../04_DATA/Domain_Score_Logic]]

## Content
Streak types:

- Daily login.
- Daily quest.
- Workout.
- Nutrition.
- Language.
- Weekly review.

Streaks should improve discipline, reward consistency, and unlock titles. Breaking a streak can hurt, but must not destroy motivation.

Current MVP daily quest behavior:

- `daily_quest` streak advances only after all daily quests for the validated profile and quest date are completed.
- Partial quest completion awards quest XP but does not advance the daily quest streak.
- The same quest date cannot advance the streak more than once.
- Consecutive completed dates increase `current_count`.
- A gap between completed dates resets `current_count` to 1 while preserving `best_count`.
- Older completed dates do not rewrite a newer `last_activity_date`.
- Home reads the live `daily_quest` streak from the `streaks` table.

Future log-based streak guardrails:

- Streaks must advance only from meaningful thresholds, not raw taps.
- Water streaks require the daily hydration target, not one small water log.
- Workout streaks require a valid workout session threshold, not a zero-context quick action.
- Sleep streaks require a sleep duration threshold and may use quality only when it is captured in the flow.
- Nutrition streaks require defined nutrition targets before quality streaks are enabled.
- Repeated `client_event_id` values and repeated same-day logs must not advance a streak twice.
- Streak penalties should be applied after the relevant window closes, not during each quick-log.
