# Weekly Review System

## Purpose
Weekly check-in inputs and outputs.

## Status
Draft

## Owner
Shared

## Last Updated
2026-04-15

## Related Files
- [[Adaptive_Mission_Engine]]
- [[../01_PRODUCT/Core_Loops]]

## Content
Inputs:

- Current weight.
- Optional body photo.
- Energy level.
- Sleep quality.
- Stress level.
- Adherence rating.
- Comment or reflection.
- Wins of the week.
- Hardest obstacle.

Outputs:

- Weekly score.
- Body trend analysis.
- Compliance analysis.
- Rank impact.
- Mission plan for next week.
- System narrative summary.

Current MVP behavior:

- `/api/weekly-checkin` reads or writes the current UTC week after Telegram init-data validation.
- `profile_id` is always derived from the validated Telegram user and never accepted from the client.
- Current week is represented by server-computed Monday `week_start_date`.
- A read request sends only raw `initData` and returns the current weekly check-in if one exists.
- A write request upserts one row per `profile_id + week_start_date`.
- MVP write inputs are `weightKg`, `energyScore`, `sleepScore`, `stressScore`, `adherenceScore`, and optional `reflection`.
- `summary` is generated server-side in the MVP.
- Body photos, AI coaching analysis, weekly score math, rank impact, and next-week mission planning are deferred.
- Successful write advances `weekly_review` streak once per week.
- Home shows a compact weekly review card before daily quests.
