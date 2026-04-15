---
name: solo-system-multi-agent
description: Use when coordinating multiple Codex sessions, sub-agents, or parallel workstreams for Solo System RPG.
---

# Multi-Agent Workflow Skill

## Principle

Multiple agents are a development workflow tool. The production app must not depend on running development agents.

## Recommended Roles

- Architect agent: architecture, boundaries, risk.
- Product agent: scope, loops, acceptance criteria.
- Frontend agent: Telegram Mini App UI and state.
- Backend agent: API boundaries and server logic.
- DB agent: Supabase schema, RLS, migrations.
- QA agent: tests, mobile behavior, regression risks.
- UI agent: visual quality, motion, Figma alignment.
- Prompt/docs agent: vault docs, session briefs, copy.

## Parallel Session Rules

- Each session gets one narrow goal and explicit file/module ownership.
- Avoid overlapping writes unless one session is review-only.
- Each session starts from `08_PROMPTS/Session_Brief_Template.md`.
- Each session follows `00_START_HERE/06_Graph_Memory_Protocol.md`.
- Each session uses `00_START_HERE/07_File_Roles_and_Status.md` to resolve authority.
- Each session records outcome in `10_LOGS/Session_Log.md`.
- Shared decisions go to `07_TASKS/Decisions_Log.md`.
- Open issues go to `07_TASKS/Open_Questions.md` or `07_TASKS/Bugs.md`.

## Built-In Agent Use

When the user explicitly asks for parallel agent work, use available sub-agents for bounded side tasks that do not block the main implementation path.
