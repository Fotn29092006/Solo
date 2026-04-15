# Data Model Overview

## Purpose
High-level entities.

## Status
Draft

## Owner
Shared

## Last Updated
2026-04-15

## Related Files
- [[Database_Schema]]
- [[../05_TECH/Supabase_Setup]]

## Content
Current runtime spine:

- profiles: internal profile UUID plus unique Telegram user ID binding
- goals
- user_paths
- daily_quests
- quest_completions
- weekly_checkins
- xp_events
- streaks

Current identity rule:

- Telegram is the external identity source for the MVP.
- Validated Telegram init data is the only trusted source for `telegram_user_id`.
- Server routes derive app `profile_id` from `telegram_user_id`; the client must not choose profile ownership.

Future entities from the broader product model:

- users
- domain_scores
- body_metrics
- workouts
- workout_exercises
- food_logs
- water_logs
- sleep_logs
- learning_logs
- language_logs
- habits
- levels
- ranks
- achievements
- notifications
- system_messages

Event model should preserve why stats changed, not only the latest totals.
