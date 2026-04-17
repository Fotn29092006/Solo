# Domain Score Logic

## Purpose
Define how behavior signals may become XP, streak, rank, and domain score inputs without fake progression.

## Status
Draft

## Owner
Shared

## Last Updated
2026-04-17

## Related Files
- [[Data_Model_Overview]]
- [[../03_SYSTEMS/XP_System]]
- [[../03_SYSTEMS/Quest_System]]
- [[../03_SYSTEMS/Rank_System]]
- [[../03_SYSTEMS/Streak_System]]

## Content
Current scope:

- This file defines scoring guardrails only.
- It does not introduce a runtime domain score table yet.
- It does not enable new XP, rank, streak, quest, or notification side effects by itself.
- Water, workout, sleep, and meal logs are evidence signals first.

Core scoring rule:

1. Accept only a validated real-behavior event through a server route.
2. Derive `profile_id`, `logged_date`, quest ownership, and reward effects on the server.
3. Aggregate behavior over the correct window.
4. Match only against explicit quest metadata or scoring rules.
5. Apply XP, streak, rank, or domain score effects once, with idempotency and caps.

Anti-spam guardrails:

- The client must never submit XP, rank, streak, quest status, quality score, `profile_id`, `telegram_user_id`, `logged_at`, or `logged_date`.
- Unknown top-level fields in log-write payloads must fail closed before Telegram validation or persistence.
- Repeated `client_event_id` values may return the existing log but must not repeat side effects.
- Raw log count must not raise rank.
- Domain scores must use aggregates, not single taps.
- Daily reward caps are required before direct log-based XP is enabled.
- Penalties should be evaluated in weekly review or after quest windows close, not during every quick-log action.

Current available signals:

- Quest behavior: daily quest status, completion rows, XP events, and `daily_quest` streak.
- Weekly review behavior: one weekly check-in per profile and server-computed week.
- Hydration behavior: daily `sum(water_logs.amount_ml)`.
- Workout behavior: daily workout session count, type, duration, and RPE when present.
- Recovery behavior: daily sleep log count, duration, quality, and morning energy when present.
- Nutrition behavior: daily meal count, meal type, calories, and protein when present.

Domain scoring gates:

- Body can use workout consistency and later duration/type trends. It must not claim strength progression until sets, reps, load, or equivalent performance data exist.
- Nutrition can use hydration target adherence and meal logging consistency. It must not award meal quality, calorie compliance, or protein compliance from quick meal buttons alone.
- Recovery can use sleep duration and, when collected, sleep quality. It must not punish honest low energy reports during quick logging.
- Discipline can use quest completion rate, full daily package completion, weekly review consistency, missed mission rate, and idempotent streak updates.
- Mind and Language remain deferred until dedicated logs exist.

Safe reward caps for future implementation:

- Water: no direct XP per log; quest XP only after the server-side daily target threshold is reached.
- Workout: at most one basic workout quest completion per day from metadata-seeded session-count evidence unless a detailed workout log proves more.
- Sleep: at most one sleep/recovery quest completion per day from sleep logging.
- Meal: meal logs may count as nutrition activity, but meal quality XP requires explicit user-specific targets and captured protein/calorie data.

Deferred entities:

- `domain_scores`
- `score_events`
- `quest_templates`
- `nutrition_targets`
- `body_metrics`
- `achievement_unlocks`
- `notification_events`

QA invariants:

- One real-world event cannot produce duplicate XP events, quest completions, streak increments, rank changes, or notifications.
- Matching must use same profile, same server date window, compatible status, and explicit metadata.
- Title text and broad domain checks are not valid matching rules.
- Spam logging many meals, water taps, or repeated client event IDs must not improve rank.
