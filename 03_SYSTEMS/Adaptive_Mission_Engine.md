# Adaptive Mission Engine

## Purpose
Inputs and outputs for adaptive quests.

## Status
Draft

## Owner
Shared

## Last Updated
2026-04-15

## Related Files
- [[Quest_System]]
- [[../04_DATA/Data_Model_Overview]]

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
