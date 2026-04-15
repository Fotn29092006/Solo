# Decisions Log

## Purpose
Record important decisions and why they were made.

## Status
Active

## Owner
Shared

## Last Updated
2026-04-15

## Related Files
- [[Open_Questions]]
- [[../00_START_HERE/04_Current_State]]
- [[../00_START_HERE/06_Graph_Memory_Protocol]]
- [[../00_START_HERE/07_File_Roles_and_Status]]
- [[Canonical_Naming]]

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
