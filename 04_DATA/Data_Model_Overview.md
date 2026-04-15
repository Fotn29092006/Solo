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

- profiles
- goals
- user_paths
- daily_quests
- quest_completions
- weekly_checkins
- xp_events
- streaks

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
