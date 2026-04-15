# Codex Master Instruction

## Purpose
Default instruction for Codex sessions on this project.

## Status
Active

## Owner
Shared

## Last Updated
2026-04-15

## Related Files
- [[Session_Brief_Template]]
- [[../00_START_HERE/00_Project_Index]]
- [[../00_START_HERE/06_Graph_Memory_Protocol]]
- [[../00_START_HERE/07_File_Roles_and_Status]]
- [[../07_TASKS/Agent_Workstreams]]
- [[../07_TASKS/Parallel_Workstreams]]
- [[Orchestrator_Agent_Prompt]]

## Content
You are working on Solo System RPG, a Telegram Mini App inspired by Solo Leveling.

Always preserve:

- Telegram-first UX.
- Mobile-first layout.
- Meaningful progression.
- Adaptive quest logic.
- Real stat relationships.
- Premium dark futuristic visual direction.
- Modular architecture.
- Low-friction daily interactions.

Before implementing:

1. Read the project index.
2. Read product blueprint.
3. Read non-negotiables.
4. Read roadmap.
5. Read current state.
6. Read next steps.
7. Read graph memory protocol.
8. Read file roles and status.
9. Read agent workstreams.
10. Read parallel workstreams when the task is Level 3.
11. Read relevant module docs.

Before editing:

1. Confirm the active task.
2. Classify the task as Level 0, Level 1, Level 2, or Level 3.
3. Run the mini-team pass for Level 2 and Level 3 work.
4. Select one primary role.
5. Select reviewer role or roles.
6. State scope boundaries.
7. List files allowed to change.
8. List files that must not change.
9. Identify required post-task updates.
10. Record or update the workstream.
11. Prepare `07_TASKS/Parallel_Workstreams.md` before Level 3 implementation.

Task levels:

- Level 0: tiny local or non-project action.
- Level 1: non-significant project change.
- Level 2: significant single-stream work.
- Level 3: large or cross-domain work that needs parallel workstream control.

Mini-team pass:

- Architect: architecture, boundaries, repo/workflow impact.
- Product/Analyst: MVP fit, scope, acceptance intent.
- Frontend: client/UI surface and ownership risks.
- Backend: server/API/auth boundary implications.
- DB: schema, RLS, migration, and data ownership implications.
- QA: acceptance checks, regression risks, verification plan.
- Telegram: Mini App, Bot, init-data, notification implications.
- Design: UX consistency, mobile-first constraints, visual-system risks.

Keep each role to 1-3 bullets. Select one primary role after the pass. Simulate role perspectives in one session unless the user explicitly asks for sub-agents or parallel agent work.

For Level 3 work:

1. Split the work in `07_TASKS/Parallel_Workstreams.md`.
2. Assign exact owned files and forbidden files.
3. Record dependencies, reviewers, merge order, and status.
4. Prevent overlapping ownership unless explicitly approved.
5. Use one integration owner for final merge review.
6. Do not create independent commits from each stream.

After significant work:

1. Update the session log.
2. Update current state when facts changed.
3. Update next steps when the plan changed.
4. Update decisions log when a durable decision was made.
5. Update open questions when ambiguity remains.
6. Update affected module docs when project rules, architecture, data, UX, or implementation behavior changed.
7. Update agent workstreams with Completed, Blocked, or Review.
8. Update parallel workstreams when Level 3 streams were used.

Do not introduce:

- Desktop-first complexity.
- Fake gamification.
- Bloated navigation.
- Decorative stats without logic.
- Inconsistent naming.
- Random one-off components.
- Weak progression math.
- Duplicate memory files for concepts already owned by the graph.
