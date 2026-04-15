# Current State

## Purpose
Facts about what exists now.

## Status
Active

## Owner
Shared

## Last Updated
2026-04-15

## Related Files
- [[00_Project_Index]]
- [[06_Graph_Memory_Protocol]]
- [[07_File_Roles_and_Status]]
- [[05_Next_Steps]]
- [[../07_TASKS/Decisions_Log]]
- [[../07_TASKS/Parallel_Workstreams]]
- [[../10_LOGS/Session_Log]]

## Content
- Workspace root: `C:\Projects\system`.
- Git repository has been initialized at the workspace root.
- GitHub remote `origin/main` has received the runtime env status, mini-team workflow controls, and Telegram trust-boundary foundation commits.
- Repository `.gitignore` exists for secrets, dependency folders, build outputs, caches, logs, local editor state, Obsidian workspace state, Supabase local runtime state, and agent runtime state.
- Repository `.gitattributes` exists to normalize text files to LF for cross-platform and multi-agent work.
- Raw product blueprint exists in `main.md`.
- Obsidian vault structure has been created in this workspace.
- Graph-memory protocol exists at [[06_Graph_Memory_Protocol]].
- File authority and role map exists at [[07_File_Roles_and_Status]].
- Canonical naming rules exist at [[../07_TASKS/Canonical_Naming]].
- Strict pre-task, role, memory-update, decision, and failure-detection enforcement is documented in [[06_Graph_Memory_Protocol]].
- Agent workstream enforcement exists at [[../07_TASKS/Agent_Workstreams]].
- Mini-team execution mode is documented in [[06_Graph_Memory_Protocol]] for significant Level 2 and Level 3 work.
- Parallel workstream control exists at [[../07_TASKS/Parallel_Workstreams]] for Level 3 large or cross-domain tasks.
- Orchestrator session guidance exists at [[../08_PROMPTS/Orchestrator_Agent_Prompt]].
- [[00_Project_Index]] is the vault entry point for future Codex sessions.
- Local Codex project plugin exists at `plugins/solo-system-rpg`.
- Local Codex project plugin skills mirror the graph-memory startup route.
- Local marketplace exists at `.agents/plugins/marketplace.json`.
- `AGENTS.md` contains the graph-memory startup route and pre-task enforcement gate for future Codex sessions.
- Foundation files intended for version control include vault Markdown, `main.md`, root agent guidance files, stable `.obsidian` settings, `.agents/plugins/marketplace.json`, and the local project plugin manifest/skills.
- Obsidian workspace state remains local and ignored.
- Empty root file `null` exists and is treated as local scratch/junk, not project source.
- Practical Codex skills are installed under `C:\Users\Almas\.codex\skills`.
- Figma/design skills are installed for design work.
- Application runtime foundation now exists at the repository root.
- Next.js App Router project is configured with TypeScript and Tailwind CSS.
- Runtime source lives under `src`, with `src/app`, `src/features`, `src/components`, `src/lib`, `src/config`, and `src/shared/types`.
- Home screen shell exists at `src/app/page.tsx`.
- Onboarding structure exists at `src/app/onboarding/page.tsx`.
- Telegram Mini App base integration exists under `src/features/telegram` and `src/lib/telegram`.
- Server-side Telegram Mini App init-data validation scaffold exists at `src/lib/telegram/server.ts`.
- Telegram auth validation route exists at `src/app/api/auth/telegram/route.ts`.
- Telegram init-data validation unit tests exist at `src/lib/telegram/validate-init-data.test.ts`.
- Vitest is configured as the TypeScript unit test runner.
- Supabase browser client setup exists at `src/lib/supabase/client.ts`.
- Supabase connection health route exists at `src/app/api/health/supabase/route.ts`.
- Tracked `.env.example` documents required Telegram and Supabase variables.
- Ignored local `.env.local` contains Supabase URL, anon key, service role key, Telegram Bot token, and Telegram Bot username for development.
- Supabase URL and anon key were verified against the Supabase Auth settings endpoint.
- Supabase Auth settings health returned HTTP 200 from this workspace with local development credentials on 2026-04-15.
- Supabase CLI is installed locally at version 2.84.2.
- This workspace does not currently have `supabase/config.toml`, so it is not linked as a Supabase CLI project workspace.
- Supabase CLI project listing is blocked because no CLI access token is available in the workspace environment.
- No Supabase MCP SQL/migration resources are exposed to this Codex session.
- Supabase MVP spine migration exists at `supabase/migrations/0001_mvp_spine.sql`.
- The MVP spine currently includes only `profiles`, `goals`, `user_paths`, `daily_quests`, `quest_completions`, `weekly_checkins`, `xp_events`, and `streaks`.
- The MVP identity boundary is server-validated Telegram identity mapped to an internal `profiles.id`.
- `profiles.telegram_user_id` is the unique external Telegram identity binding.
- Direct client writes to user-owned Supabase tables are deferred until a Supabase Auth/JWT and RLS policy strategy exists.
- Live Supabase health passed through local `/api/health/supabase`.
- The MVP migration has been reviewed and prepared, but has not been applied from this workspace.
- Applying the MVP migration from this workspace is currently blocked until either Supabase Dashboard SQL is used manually or Supabase CLI auth/linking is configured.
- `npm run typecheck` passes.
- `npm run build` passes.
- Supabase project credentials are not present in tracked files.
- Telegram Mini App client foundation exists, but BotFather/Mini App launch configuration is not present in this workspace.

Known risks:

- Product scope is large for an MVP.
- XP/rank systems can become fake if scoring rules are weak.
- Telegram reminders can become spammy if triggers are not controlled.
- Too many logging surfaces can create daily friction.
- The current Telegram Bot token and Supabase service role key were shared in chat and should be rotated before production use.
- Profile creation and data writes are still blocked until the Supabase migration is applied and verified.
