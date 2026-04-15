# Canonical Naming

## Purpose
Naming rules for vault files, concepts, and graph links.

## Status
Active

## Owner
Shared

## Last Updated
2026-04-15

## Related Files
- [[../00_START_HERE/06_Graph_Memory_Protocol]]
- [[../00_START_HERE/07_File_Roles_and_Status]]
- [[Decisions_Log]]
- [[Open_Questions]]

## Content
File naming:

- Use `Title_Case_With_Underscores.md`.
- Keep numbered top-level folders as `00_START_HERE`, `01_PRODUCT`, `02_UX_UI`, `03_SYSTEMS`, `04_DATA`, `05_TECH`, `06_BUILD`, `07_TASKS`, `08_PROMPTS`, `09_REFERENCE`, and `10_LOGS`.
- Do not create duplicate files with spaces, lowercase variants, or singular/plural variants of existing concepts.
- New files must be added to [[../00_START_HERE/00_Project_Index]] and [[../00_START_HERE/07_File_Roles_and_Status]].

Wikilink naming:

- Prefer exact file links, for example `[[../05_TECH/Telegram_Integration]]`.
- Use relative links when linking across folders.
- Keep each `Related Files` section small and useful.
- If a concept is important enough to link repeatedly, it should have one canonical file.

Product terms:

- Project name: Solo System RPG.
- Product surface: Telegram Mini App.
- Notification surface: Telegram Bot.
- Backend platform: Supabase and Postgres.
- Source of truth: Obsidian vault.
- Raw historical blueprint: `main.md`.

Domain names:

- Body
- Nutrition
- Recovery
- Mind
- Language

System terms:

- Quest System
- XP System
- Rank System
- Streak System
- Adaptive Mission Engine
- Weekly Review System

Status terms:

- Active: current and usable.
- Draft: useful but not finalized.
- Reference: background only.
- Deprecated: kept for history and not used for new work.

Avoid:

- Mixing "Telegram app", "web app", and "Mini App" when referring to the primary product surface. Use "Telegram Mini App".
- Calling `main.md` the current source of truth. It is raw historical source.
- Creating new names for existing systems without updating every linked doc and [[Decisions_Log]].
