# Data Model Overview

## Purpose
High-level entities.

## Status
Draft

## Owner
Shared

## Last Updated
2026-04-17

## Related Files
- [[Database_Schema]]
- [[Domain_Score_Logic]]
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

Current logging entities:

- water_logs: append-only hydration events for the validated profile; migration `0002_water_logging.sql` is applied and the Mini App has a server route plus Home quick-log entry.
- workout_logs: append-only workout session events for the validated profile; migration `0003_workout_logging.sql` is applied and the Mini App has a server route plus Home quick-log entry.
- sleep_logs: append-only sleep duration events for the validated profile; migration `0004_sleep_logging.sql` is applied and the Mini App has a server route plus Home quick-log entry.
- meal_logs: append-only meal events for the validated profile; migration `0005_meal_logging.sql` is applied and the Mini App has a server route plus Home quick-log entry.
- Water, workout, sleep, and meal logs are real-behavior signals.
- Water logs can auto-complete only the assigned hydration quest through server-side aggregate matching.
- Workout, sleep, and meal logs do not award XP, update rank/streaks, or auto-complete quests until scoring and quest-to-log matching rules are defined.
- Meal logs are a Nutrition-domain behavior signal, not a calorie engine or ingredient-level food database.
- Meal logs must stay log-only until anti-spam scoring, deterministic quest matching metadata, and runtime allowlist validation are defined.
- Domain scoring guardrails are documented in [[Domain_Score_Logic]]; no runtime `domain_scores` table exists yet.

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
- ingredient-level food_logs
- learning_logs
- language_logs
- habits
- levels
- ranks
- achievements
- notifications
- system_messages

Event model should preserve why stats changed, not only the latest totals.
