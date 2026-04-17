# Rank System

## Purpose
Define rank ladder and rank logic.

## Status
Draft

## Owner
Shared

## Last Updated
2026-04-17

## Related Files
- [[XP_System]]
- [[Streak_System]]
- [[../04_DATA/Domain_Score_Logic]]

## Content
Rank ladder:

- Unranked.
- Bronze.
- Silver.
- Gold.
- Platinum.
- Diamond.
- Master.
- Legend.

Rank should consider:

- Total XP.
- Consistency.
- Quest completion quality.
- Weekly compliance.
- Body trend alignment with goal.
- Recovery stability.
- Discipline score.

Rank must not be based only on spam logging.

Current MVP guardrails:

- Rank is not updated from water, workout, sleep, or meal quick-logs.
- Rank must not move from raw log counts.
- Future rank movement must use rolling aggregate windows, such as 7, 14, or 28 days.
- Future rank inputs must include completion quality, consistency, missed missions, weekly review behavior, recovery stability, and goal alignment.
- Spam logging many meals, water taps, duplicate client events, or repeated quick actions must not improve rank.
- Rank changes should be reviewed and surfaced through system summaries or explicit rank events, not hidden inside every quick-log action.
