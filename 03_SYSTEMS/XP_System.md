# XP System

## Purpose
Define XP principles.

## Status
Draft

## Owner
Shared

## Last Updated
2026-04-17

## Related Files
- [[Quest_System]]
- [[Rank_System]]
- [[../04_DATA/Domain_Score_Logic]]

## Content
XP must be layered.

Action XP:

- Logging a workout.
- Logging meals or water.
- Completing a study session.
- Submitting weekly weigh-in.

Quality XP:

- Completing full workout.
- Hitting protein target.
- Sleeping above target.
- Staying within nutrition target.
- Completing a difficult quest.

Outcome XP:

- Weight trend moving toward goal.
- Strength improvement.
- Better streak consistency.
- Reduced missed tasks.
- Improved language performance.

Never reward meaningless tapping more than real progress.

Current MVP completion behavior:

- Quest completion XP is awarded from the stored `daily_quests.xp_reward`.
- The client cannot submit XP amounts.
- Completion writes an `xp_events` row with `source_type = quest_completion`.
- Profile `total_xp` and `level` are synchronized from XP events after completion.
- Repeated quest completion attempts do not award XP again.
- Water logging is tracked as a real behavior signal but does not award XP yet.
- Water logs do not award XP directly.
- Hydration can trigger XP only by auto-completing the assigned hydration daily quest after the server-side daily water aggregate reaches at least 1000 ml.
- Repeated water logs cannot award extra hydration quest XP because `quest_completions` remains one completion per quest.
- Workout logs do not award XP directly.
- A workout log can trigger XP only by auto-completing an explicitly metadata-seeded Body main quest after the server-side daily workout session threshold is reached.
- Repeated workout logs cannot award extra workout quest XP because `quest_completions` remains one completion per quest.
- Sleep logging is tracked as a real Recovery-domain behavior signal but does not award XP yet.
- Future sleep XP must be tied to reviewed recovery scoring or explicit quest completion rules, not raw repeated taps or duplicate nightly logs.
- Meal logging is tracked as a real Nutrition-domain behavior signal but does not award XP yet.
- Future nutrition XP must reward aggregate compliance, such as planned meal/protein adherence, not the raw count of meal taps.

Anti-spam scoring guardrails:

- XP must flow from server-validated behavior, explicit quest completion, or reviewed aggregate outcomes, never from raw UI taps.
- Direct log-based XP is disabled until each source type has a daily cap, idempotency tests, and a deterministic scoring rule.
- Quest XP can be triggered by logs only through a server-side matcher that checks same profile, same server date window, quest status, source type, threshold, and metadata key.
- Quality XP requires an objective threshold already captured by the product flow.
- Outcome XP requires a rolling trend or weekly review signal, not a single event.
- The client must never submit XP amounts, quality score, rank impact, streak impact, quest status, or scoring dates.
- Repeated `client_event_id` values must not repeat XP side effects.

Current safe effect levels:

- Water: hydration quest XP only after the assigned hydration quest is matched by daily water aggregate.
- Workout: evidence only until workout quest metadata and minimum session rules are added.
- Sleep: evidence only until recovery quest metadata and duration thresholds are added.
- Meal: evidence only until nutrition targets and meal/protein matching rules exist.

Deferred XP behavior:

- Workout quality XP.
- Sleep quality XP.
- Meal/protein/calorie XP.
- Domain score XP.
- Rank movement from logs.
- Penalties from quick-log behavior.
