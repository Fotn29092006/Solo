# Graph Memory Protocol

## Purpose
Operational rules for using the Obsidian vault as Codex project memory.

## Status
Active

## Owner
Shared

## Last Updated
2026-04-15

## Related Files
- [[00_Project_Index]]
- [[07_File_Roles_and_Status]]
- [[04_Current_State]]
- [[05_Next_Steps]]
- [[../07_TASKS/Decisions_Log]]
- [[../07_TASKS/Open_Questions]]
- [[../10_LOGS/Session_Log]]

## Content
Entry point:

- Start every project session at [[00_Project_Index]].
- Treat [[00_Project_Index]] as the route map, not as the full memory.
- Use [[07_File_Roles_and_Status]] to decide which file has authority when docs overlap.

Required reading order for every significant session:

1. Root operational instructions: `AGENTS.md`; `CLAUDE.md` only when working with Claude.
2. [[00_Project_Index]]
3. [[01_Product_Blueprint]]
4. [[02_Non_Negotiables]]
5. [[03_Roadmap]]
6. [[04_Current_State]]
7. [[05_Next_Steps]]
8. [[06_Graph_Memory_Protocol]]
9. [[07_File_Roles_and_Status]]
10. Relevant module docs linked from the index, task, or changed files.
11. [[../07_TASKS/Current_Sprint]], [[../07_TASKS/Open_Questions]], and [[../07_TASKS/Decisions_Log]] when planning, resolving ambiguity, or changing direction.

How to follow links:

- Follow `Related Files` first.
- Read one hop from the entry or task-relevant doc before searching the whole vault.
- Follow additional links only when they answer the current task or resolve a contradiction.
- If a link is broken, fix it during the session or record it in [[../07_TASKS/Open_Questions]].
- Do not treat example links inside `main.md` as graph links.

Authority and override rules:

1. [[02_Non_Negotiables]] overrides every other project doc.
2. [[../07_TASKS/Decisions_Log]] overrides older plans when it records a settled decision.
3. [[04_Current_State]] is the authority for facts about what exists now.
4. [[05_Next_Steps]] and [[../07_TASKS/Current_Sprint]] are the authority for immediate work.
5. Module docs are authoritative for their domain: product, UX/UI, systems, data, tech, build, tasks, prompts, or reference.
6. [[01_Product_Blueprint]] is the compact product authority unless a more specific active module doc refines it without violating non-negotiables.
7. `main.md` is raw historical source. It can inspire updates, but it does not override the curated vault.

File meaning:

- Facts live in [[04_Current_State]].
- Plans live in [[05_Next_Steps]], [[03_Roadmap]], [[../07_TASKS/Current_Sprint]], and build docs.
- Questions live in [[../07_TASKS/Open_Questions]].
- Decisions live in [[../07_TASKS/Decisions_Log]].
- Work history lives in [[../10_LOGS/Session_Log]].
- Domain rules live in the relevant module folders.
- Reusable agent instructions live in [[../08_PROMPTS/Codex_Master_Instruction]] and the focused prompt files.

Post-session memory loop:

- Always update [[../10_LOGS/Session_Log]] after significant work.
- Update [[04_Current_State]] when facts changed.
- Update [[05_Next_Steps]] when the immediate plan changed.
- Update [[../07_TASKS/Decisions_Log]] when a durable decision was made.
- Update [[../07_TASKS/Open_Questions]] when a blocker, ambiguity, or unresolved finding remains.
- Update the relevant domain doc when architecture, data, product, UX, or implementation rules changed.

Architecture changes must update:

- The relevant file in `05_TECH`, `04_DATA`, or `03_SYSTEMS`.
- [[../07_TASKS/Decisions_Log]] if a direction is selected.
- [[04_Current_State]] if the architecture now exists or configuration changed.
- [[05_Next_Steps]] if implementation order changes.
- [[../10_LOGS/Session_Log]].

Implementation changes must update:

- [[04_Current_State]] with what now exists.
- [[05_Next_Steps]] with the next concrete task.
- The relevant build, tech, data, product, UX, or systems doc if behavior changed.
- [[../07_TASKS/Bugs]] if a bug or regression is found.
- [[../10_LOGS/Session_Log]].

Unresolved findings must update:

- [[../07_TASKS/Open_Questions]] with the concrete question or risk.
- [[05_Next_Steps]] if the unresolved item blocks the next task.
- [[../10_LOGS/Session_Log]].

Duplicate prevention:

- Search the index and [[07_File_Roles_and_Status]] before creating a new file.
- Add to an existing domain doc when the concept fits there.
- Create a new file only when the concept is durable, likely to grow, and cross-session useful.
- When creating a file, add it to [[00_Project_Index]], [[07_File_Roles_and_Status]], and at least one `Related Files` section.
- Preserve naming rules from [[../07_TASKS/Canonical_Naming]].
