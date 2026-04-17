# Adaptive Mission Engine

## Purpose
Inputs and outputs for adaptive quests.

## Status
Draft

## Owner
Shared

## Last Updated
2026-04-17

## Related Files
- [[Quest_System]]
- [[XP_System]]
- [[../04_DATA/Data_Model_Overview]]
- [[../04_DATA/Domain_Score_Logic]]

## Content
Inputs:

- User goal.
- Current weight and trend.
- Weekly check-in.
- Recent compliance.
- Preferred path.
- Available time.
- Sleep and fatigue condition.
- Missed tasks.
- Streak status.

Outputs:

- Daily quest package.
- Difficulty level.
- Reminder plan.
- Fallback missions.
- Weekly adjustments.

Behavior:

- If user misses many quests, reduce volume and prioritize minimum effective actions.
- If user performs well, increase mission complexity and rewards.
- If weight moves away from goal, increase nutrition focus and trigger analysis.

Current adaptation guardrails:

- The engine should adapt from aggregates and weekly review signals, not from a single quick-log tap.
- Mission difficulty should not increase because the user spammed repeated same-day logs.
- Mission difficulty should not decrease or penalize the user during a quick-log moment.
- Workout, sleep, and meal quick-logs are evidence signals until deterministic matching and scoring rules are implemented.
- Future generated quests that can auto-complete from logs must include explicit metadata: `matchVersion`, `autoCompleteKey`, `matchWindow`, and the required threshold fields.
- Telegram reminders should be capped and event-based; scoring rules must not create notification spam.
