# File Roles and Status

## Purpose
Define which vault files are authoritative, operational, reference-only, or prompts so Codex can resolve overlaps.

## Status
Active

## Owner
Shared

## Last Updated
2026-04-15

## Related Files
- [[00_Project_Index]]
- [[06_Graph_Memory_Protocol]]
- [[04_Current_State]]
- [[05_Next_Steps]]
- [[../07_TASKS/Canonical_Naming]]
- [[../07_TASKS/Agent_Workstreams]]
- [[../07_TASKS/Parallel_Workstreams]]
- [[../07_TASKS/Decisions_Log]]

## Content
Role meanings:

- Entry: route into the graph.
- Authority: active project truth for a specific domain.
- Operational: current work state, tasks, logs, decisions, and questions.
- Reference: useful background that does not override curated docs.
- Prompt: reusable agent instruction.
- Raw Source: historical source material that must be distilled into curated docs before it changes project direction.

Status meanings:

- Active: current and usable.
- Draft: useful but not finalized.
- Reference: background only.
- Deprecated: kept for history and not used for new work.

Core files:

| File | Role | Status | Authority Notes |
| --- | --- | --- | --- |
| [[00_Project_Index]] | Entry | Active | First vault file to read; routes to every major memory area. |
| [[01_Product_Blueprint]] | Authority | Active | Compact canonical product definition extracted from `main.md`. |
| [[02_Non_Negotiables]] | Authority | Active | Highest-priority project constraints. |
| [[03_Roadmap]] | Authority | Active | High-level phase order. |
| [[04_Current_State]] | Operational | Active | Facts about what exists now. |
| [[05_Next_Steps]] | Operational | Active | Immediate work plan. |
| [[06_Graph_Memory_Protocol]] | Authority | Active | Rules for using and updating vault memory. |
| [[07_File_Roles_and_Status]] | Authority | Active | Resolves file role and status ambiguity. |
| `main.md` | Raw Source | Reference | Historical blueprint only; curate changes into vault docs before acting on them. |
| `AGENTS.md` | Operational | Active | Codex-facing root instruction file. |
| `CLAUDE.md` | Operational | Active | Claude-facing root instruction file. |
| `.cursorrules` | Operational | Active | Cursor-facing root instruction file. |
| `plugins/solo-system-rpg/*` | Prompt | Active | Local project plugin and skills; should mirror the graph-memory route. |

Product and UX:

| File | Role | Status | Authority Notes |
| --- | --- | --- | --- |
| [[../01_PRODUCT/Vision]] | Authority | Active | Product promise and fantasy. |
| [[../01_PRODUCT/Core_Loops]] | Authority | Draft | Daily and weekly loop behavior. |
| [[../02_UX_UI/Screen_Map]] | Authority | Active | Mini App screen architecture. |
| [[../02_UX_UI/Visual_Direction]] | Authority | Active | Visual and motion direction. |

Systems:

| File | Role | Status | Authority Notes |
| --- | --- | --- | --- |
| [[../03_SYSTEMS/Quest_System]] | Authority | Draft | Quest package rules. |
| [[../03_SYSTEMS/XP_System]] | Authority | Draft | XP rules and exploit resistance. |
| [[../03_SYSTEMS/Rank_System]] | Authority | Draft | Rank ladder and rank criteria. |
| [[../03_SYSTEMS/Streak_System]] | Authority | Draft | Streak types and break behavior. |
| [[../03_SYSTEMS/Adaptive_Mission_Engine]] | Authority | Draft | Adaptive inputs and outputs. |
| [[../03_SYSTEMS/Weekly_Review_System]] | Authority | Draft | Weekly check-in and summary behavior. |

Data and tech:

| File | Role | Status | Authority Notes |
| --- | --- | --- | --- |
| [[../04_DATA/Data_Model_Overview]] | Authority | Draft | Entity map. |
| [[../04_DATA/Database_Schema]] | Authority | Draft | Supabase/Postgres schema notes. |
| [[../05_TECH/Architecture]] | Authority | Draft | Stack and module boundaries. |
| [[../05_TECH/Env_Variables]] | Authority | Draft | Environment variable inventory. |
| [[../05_TECH/Security]] | Authority | Draft | Security risks and baseline. |
| [[../05_TECH/Supabase_Setup]] | Authority | Draft | Supabase setup and RLS direction. |
| [[../05_TECH/Telegram_Integration]] | Authority | Draft | Mini App and Bot integration direction. |

Build and operations:

| File | Role | Status | Authority Notes |
| --- | --- | --- | --- |
| [[../06_BUILD/MVP_Scope]] | Authority | Draft | MVP inclusion and exclusion boundaries. |
| [[../06_BUILD/Milestone_01_Foundation]] | Operational | Draft | Foundation milestone acceptance criteria. |
| [[../07_TASKS/Backlog]] | Operational | Active | Future work queue. |
| [[../07_TASKS/Agent_Workstreams]] | Operational | Active | Enforces role, scope, owned files, reviewer, and status before significant work. |
| [[../07_TASKS/Parallel_Workstreams]] | Operational | Active | Controls Level 3 parallel workstream ownership, dependencies, merge order, and integration review. |
| [[../07_TASKS/Current_Sprint]] | Operational | Active | Current sprint focus. |
| [[../07_TASKS/Decisions_Log]] | Operational | Active | Durable decisions; overrides older plans when explicit. |
| [[../07_TASKS/Open_Questions]] | Operational | Active | Unresolved planning and product questions. |
| [[../07_TASKS/Bugs]] | Operational | Active | Bugs and strange behavior. |
| [[../07_TASKS/Canonical_Naming]] | Authority | Active | Naming rules for files, concepts, and graph links. |
| [[../10_LOGS/Session_Log]] | Operational | Active | Chronological work history. |

Prompts and references:

| File | Role | Status | Authority Notes |
| --- | --- | --- | --- |
| [[../08_PROMPTS/Codex_Master_Instruction]] | Prompt | Active | Default Codex behavior for project sessions. |
| [[../08_PROMPTS/Session_Brief_Template]] | Prompt | Active | Template for scoped sessions. |
| [[../08_PROMPTS/Orchestrator_Agent_Prompt]] | Prompt | Active | Template for mini-team orchestration, Level 3 stream splitting, and merge-control sessions. |
| `08_PROMPTS/*_Agent_Prompt.md` | Prompt | Active | Focused role prompts for agents. |
| [[../09_REFERENCE/Inspiration]] | Reference | Draft | Product feel references only. |
| [[../09_REFERENCE/Telegram_Mini_App_Constraints]] | Reference | Draft | Telegram constraints to verify against official docs. |

Known overlap boundaries:

- [[01_Product_Blueprint]] and [[../01_PRODUCT/Vision]] overlap by design. Blueprint defines the product compactly; Vision defines the promise and fantasy.
- [[05_Next_Steps]], [[../07_TASKS/Current_Sprint]], and [[../07_TASKS/Backlog]] overlap by time horizon. Next Steps wins for immediate work; Current Sprint groups near-term work; Backlog stores future work.
- [[../05_TECH/Architecture]], [[../05_TECH/Supabase_Setup]], [[../05_TECH/Telegram_Integration]], and [[../05_TECH/Security]] overlap by implementation surface. The specialized file wins for detail.
- [[../04_DATA/Data_Model_Overview]] lists entities; [[../04_DATA/Database_Schema]] describes schema choices. Do not duplicate full schema in both.
- `main.md` may contain older or broader ideas. It must be treated as source material, not live instructions.
