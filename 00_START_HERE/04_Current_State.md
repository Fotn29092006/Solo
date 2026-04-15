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
- [[../10_LOGS/Session_Log]]

## Content
- Workspace root: `C:\Projects\system`.
- Git repository has been initialized at the workspace root.
- Repository `.gitignore` exists for secrets, dependency folders, build outputs, caches, logs, local editor state, Obsidian workspace state, Supabase local runtime state, and agent runtime state.
- Repository `.gitattributes` exists to normalize text files to LF for cross-platform and multi-agent work.
- Raw product blueprint exists in `main.md`.
- Obsidian vault structure has been created in this workspace.
- Graph-memory protocol exists at [[06_Graph_Memory_Protocol]].
- File authority and role map exists at [[07_File_Roles_and_Status]].
- Canonical naming rules exist at [[../07_TASKS/Canonical_Naming]].
- [[00_Project_Index]] is the vault entry point for future Codex sessions.
- Local Codex project plugin exists at `plugins/solo-system-rpg`.
- Local Codex project plugin skills mirror the graph-memory startup route.
- Local marketplace exists at `.agents/plugins/marketplace.json`.
- `AGENTS.md` contains the graph-memory startup route for future Codex sessions.
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
- Supabase browser client setup exists at `src/lib/supabase/client.ts`.
- Supabase connection health route exists at `src/app/api/health/supabase/route.ts`.
- Tracked `.env.example` documents required Telegram and Supabase variables.
- Supabase MVP spine migration exists at `supabase/migrations/0001_mvp_spine.sql`.
- The MVP spine currently includes only `profiles`, `goals`, `user_paths`, `daily_quests`, `quest_completions`, `weekly_checkins`, `xp_events`, and `streaks`.
- `npm run typecheck` passes.
- `npm run build` passes.
- Supabase project credentials are not present in tracked files.
- Ignored local `.env.local` exists with `TELEGRAM_BOT_TOKEN` for development.
- Telegram Mini App client foundation exists, but BotFather/Mini App launch configuration is not present in this workspace.

Known risks:

- Product scope is large for an MVP.
- XP/rank systems can become fake if scoring rules are weak.
- Telegram reminders can become spammy if triggers are not controlled.
- Too many logging surfaces can create daily friction.
- The current Telegram Bot token was shared in chat and should be rotated before production use.
