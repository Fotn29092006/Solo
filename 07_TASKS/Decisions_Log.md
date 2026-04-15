# Decisions Log

## Purpose
Record important decisions and why they were made.

## Status
Active

## Owner
Shared

## Last Updated
2026-04-16

## Related Files
- [[Open_Questions]]
- [[../00_START_HERE/04_Current_State]]
- [[../00_START_HERE/06_Graph_Memory_Protocol]]
- [[../00_START_HERE/07_File_Roles_and_Status]]
- [[Canonical_Naming]]
- [[Agent_Workstreams]]
- [[Parallel_Workstreams]]

## Content
2026-04-15:

- Workspace root is treated as the Obsidian vault root.
- `main.md` remains the raw historical blueprint.
- `00_START_HERE` files are the session startup route.
- A local Codex plugin named `solo-system-rpg` was created for project-specific working rules.
- Figma/design skills were installed because this project requires strong UI/design work.
- Notion, Linear, Sora, and novelty skills were not installed because the project source of truth is Obsidian and no requirement currently depends on those tools.
- The repository should track Obsidian vault Markdown, `main.md`, root agent guidance files, stable Obsidian settings, `.agents/plugins/marketplace.json`, and the local Solo System RPG Codex plugin.
- The repository should ignore secrets, environment files, dependency folders, build outputs, caches, logs, local editor/OS state, Obsidian workspace/plugin runtime state, Supabase local runtime state, and agent runtime state.
- Text files should be normalized to LF through `.gitattributes` to reduce cross-platform and multi-agent line-ending churn.
- The empty root `null` file is treated as local scratch/junk and should not be tracked.
- The Obsidian vault is the project's graph-memory source of truth, with [[../00_START_HERE/00_Project_Index]] as the entry point.
- [[../00_START_HERE/06_Graph_Memory_Protocol]] defines the session reading route, authority rules, and post-session update loop.
- [[../00_START_HERE/07_File_Roles_and_Status]] defines authoritative, operational, reference, prompt, and raw-source files.
- [[Canonical_Naming]] defines naming rules for future docs, concepts, and graph links.
- Root instruction files and local project plugin skills should mirror the same graph-memory reading route.
- Runtime foundation uses a single repository root, not a nested app package, so the app and Obsidian vault stay together.
- Next.js App Router lives in `src/app`; feature code lives under `src/features`; shared UI lives under `src/components`; platform clients live under `src/lib`; config lives under `src/config`; shared types live under `src/shared/types`.
- The first runtime pass uses minimal custom UI and Tailwind CSS, with visual polish intentionally deferred.
- Telegram Mini App integration starts with client-side WebApp detection, safe area handling, init, and user data reading only.
- Full Telegram Bot behavior and server-side Telegram init data validation are deferred to the next pass.
- Supabase setup starts with a browser client, a server health route, tracked `.env.example`, and one MVP spine migration.
- The first Supabase migration is intentionally limited to `profiles`, `goals`, `user_paths`, `daily_quests`, `quest_completions`, `weekly_checkins`, `xp_events`, and `streaks`.
- Supabase health checks use `auth/v1/settings` with the anon key because the REST table surface depends on schema/table state.
- Decision: Future significant tasks must pass a strict pre-task gate with reading confirmation, active task, primary role, reviewer role, scope boundaries, allowed files, forbidden files, and required post-task docs.
- Reason: Previous work showed that role prompts and graph-memory rules were conceptual unless enforced before edits and checked after edits.
- Scope: [[../00_START_HERE/06_Graph_Memory_Protocol]], [[../07_TASKS/Agent_Workstreams]], root instruction files, and session brief template.
- Role: Architect.
- Reviewer: QA.
- Follow-up: Use [[Agent_Workstreams]] before the next implementation task.
- Decision: Future significant Codex sessions must use task-level classification, a lightweight mini-team pass, and merge-controlled parallel workstreams for Level 3 tasks.
- Reason: The project needs real execution architecture for multi-role work without letting parallel changes conflict or weaken the Obsidian vault as source of truth.
- Scope: [[../00_START_HERE/06_Graph_Memory_Protocol]], [[Agent_Workstreams]], [[Parallel_Workstreams]], [[../08_PROMPTS/Session_Brief_Template]], [[../08_PROMPTS/Orchestrator_Agent_Prompt]], `AGENTS.md`, and `CLAUDE.md`.
- Role: Architect.
- Reviewer: QA.
- Follow-up: Use Level 2 or Level 3 classification before the next Supabase or Telegram trust-boundary implementation task.
- Decision: MVP identity binding uses server-validated Telegram init data mapped to an internal `profiles.id`; `profiles.telegram_user_id` is the unique external identity binding.
- Reason: Telegram Mini App init data does not create a Supabase Auth session by itself, so `auth.uid()` cannot safely own MVP profile rows yet.
- Scope: `supabase/migrations/0001_mvp_spine.sql`, [[../04_DATA/Database_Schema]], [[../05_TECH/Supabase_Setup]], [[../05_TECH/Telegram_Integration]], [[../05_TECH/Security]], and [[../05_TECH/Architecture]].
- Role: Architect.
- Reviewer: DB, Telegram, QA.
- Follow-up: Apply the migration only after confirming the development target is clean, then implement profile lookup/create through the validated Telegram server route.
- Decision: Direct client access to user-owned Supabase tables remains deferred until a Supabase Auth/JWT and RLS policy strategy exists.
- Reason: Client-side RLS policies based on `auth.uid()` would fail for Telegram-only users and could push the app toward trusting client-supplied ownership fields.
- Scope: `supabase/migrations/0001_mvp_spine.sql`, [[../05_TECH/Security]], [[../05_TECH/Supabase_Setup]], and [[../04_DATA/Database_Schema]].
- Role: Architect.
- Reviewer: DB, Backend, QA.
- Follow-up: Keep MVP data writes on server routes that derive `profile_id` from validated Telegram identity.
- Decision: Use Vitest for TypeScript unit tests in the Next.js runtime.
- Reason: Telegram init-data validation is a security boundary and needs repeatable tests before profile creation or write routes depend on it.
- Scope: `package.json`, `vitest.config.ts`, `src/lib/telegram/validate-init-data.test.ts`, and [[../05_TECH/Architecture]].
- Role: QA.
- Reviewer: Telegram, Backend.
- Follow-up: Keep auth/trust-boundary code covered before wiring persistence.
- Decision: Supabase schema changes must use reviewed migration SQL through Supabase Dashboard SQL editor or an authenticated Supabase CLI workflow, not service-role API-key workarounds.
- Reason: DDL must stay controlled, reviewable, and separate from runtime API credentials.
- Scope: [[../05_TECH/Supabase_Setup]], [[../05_TECH/Security]], [[../04_DATA/Database_Schema]], and `supabase/README.md`.
- Role: DB.
- Reviewer: QA, Backend.
- Follow-up: Apply `supabase/migrations/0001_mvp_spine.sql` only after Dashboard SQL access or Supabase CLI auth/linking is available.

2026-04-16:

- Decision: Level 3 profile/onboarding implementation streams remain blocked until `npm run verify:supabase:mvp` passes.
- Reason: The accepted plan requires the DB gate first, and the live project still returns HTTP 404 for all eight MVP tables.
- Scope: [[Parallel_Workstreams]], [[Agent_Workstreams]], [[../00_START_HERE/05_Next_Steps]], and profile/onboarding implementation work.
- Role: Architect.
- Reviewer: DB, Backend, QA.
- Follow-up: Apply the MVP migration through Supabase Dashboard SQL Editor, rerun the verifier, then start the downstream streams.
- Decision: Temporary internal MVP onboarding keys are allowed for the next persistence pass.
- Reason: Goal/path persistence needs stable internal values before final public naming is decided.
- Scope: future onboarding route and onboarding UI work.
- Role: Product/Analyst.
- Reviewer: Architect, Backend, QA.
- Follow-up: Use `fat_loss`, `muscle_gain`, `recomposition`, `discipline`, `learning` for `goalType`; use `warrior`, `discipline`, `scholar`, `polyglot`, `rebuild`, `aesthetic`, `balance` for `pathKey`.
