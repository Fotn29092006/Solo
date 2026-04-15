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
- [[../07_TASKS/Agent_Workstreams]]
- [[../07_TASKS/Parallel_Workstreams]]
- [[../07_TASKS/Decisions_Log]]
- [[../07_TASKS/Open_Questions]]
- [[../10_LOGS/Session_Log]]
- [[../08_PROMPTS/Orchestrator_Agent_Prompt]]

## Content
Entry point:

- Start every project session at [[00_Project_Index]].
- Treat [[00_Project_Index]] as the route map, not as the full memory.
- Use [[07_File_Roles_and_Status]] to decide which file has authority when docs overlap.
- Treat this protocol as an execution gate. A task that skips required reading, role selection, workstream scope, or post-task memory updates is incomplete.

Strict pre-task gate:

Before any project work, complete and state this checklist:

1. Reading order confirmation.
2. Active task confirmation.
3. Task level classification: Level 0, Level 1, Level 2, or Level 3.
4. Mini-team pass for Level 2 and Level 3 work.
5. Primary role selection from Architect, Product/Analyst, Frontend, Backend, DB, QA, Telegram, or Design.
6. Reviewer role selection.
7. Scope boundaries.
8. Files allowed to change.
9. Files that must not change.
10. Required post-task docs.

No edits should start until the gate is complete. If the task is a tiny terminal-only operation, the gate can be abbreviated, but any code, vault, schema, env, security, or repo-policy change requires the full gate.

Task levels:

| Level | Name | Protocol Required |
| --- | --- | --- |
| Level 0 | Tiny local or non-project action | No full gate; log only if useful. |
| Level 1 | Non-significant project change | Abbreviated gate, one role, optional reviewer, update touched docs if needed. |
| Level 2 | Significant single-stream work | Full gate, mini-team pass, one primary role, required reviewer, post-task memory loop. |
| Level 3 | Large or cross-domain work | Full gate, mini-team pass, [[../07_TASKS/Parallel_Workstreams]], merge-control pass, integration review, post-task memory loop. |

Significant work includes:

- Architecture changes.
- Auth or trust-boundary changes.
- Telegram init-data, Mini App bridge, or Bot behavior.
- Schema, RLS, migration, or data ownership changes.
- Onboarding flow.
- Quest logic.
- XP, level, rank, or streak logic.
- New core user flows.
- Repo policy, deployment, or runtime structure.

Non-significant work includes:

- Isolated copy changes.
- Small visual fixes.
- Doc wording fixes.
- Narrow local refactors with no behavior change.
- Formatting-only changes.

Mini-team execution mode:

- Level 2 and Level 3 work must start with a mini-team pass.
- The mini-team pass is a short role-perspective check, not a long design meeting.
- Each role may give 1-3 bullets maximum.
- Include only role perspectives relevant to the task; irrelevant roles can say `No impact`.
- A single Codex session may simulate these perspectives unless the user explicitly asks for sub-agents, delegation, or parallel agent work.
- After the pass, select one primary execution role.
- Reviewer roles validate boundaries, risk, verification, and memory updates before completion.
- Level 1 work may use a shortened pass, but must state why it is non-significant.

Mini-team roles:

| Role | Must Comment On |
| --- | --- |
| Architect | Architecture, boundaries, repo/workflow impact, module ownership. |
| Product/Analyst | MVP fit, scope, acceptance intent, user-flow implications. |
| Frontend | Client/UI surface, component ownership, user-facing implementation risk. |
| Backend | Server/API/auth boundary implications and integration contracts. |
| DB | Schema, RLS, migration, indexes, data ownership, persistence risk. |
| QA | Acceptance checks, regression risks, verification plan. |
| Telegram | Mini App bridge, Bot, init data, notification, Telegram launch implications. |
| Design | UX consistency, mobile-first constraints, visual-system risks. |

Primary role selection:

| Work Type | Primary Role |
| --- | --- |
| Architecture, protocol, repo policy | Architect |
| Scope, acceptance, user-flow clarification | Product/Analyst |
| UI routes, client components, client feature work | Frontend |
| API routes, server logic, service integrations | Backend |
| Schema, RLS, migrations, data ownership | DB |
| Mini App bridge, Bot, init data, notifications | Telegram |
| Verification-only work | QA |
| Visual system, interaction direction, mobile UX | Design |

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
10. [[../07_TASKS/Agent_Workstreams]]
11. [[../07_TASKS/Parallel_Workstreams]] for Level 3 work.
12. Relevant module docs linked from the index, task, or changed files.
13. [[../07_TASKS/Current_Sprint]], [[../07_TASKS/Open_Questions]], and [[../07_TASKS/Decisions_Log]] when planning, resolving ambiguity, or changing direction.

Role enforcement:

- Every significant task must have one primary role in [[../07_TASKS/Agent_Workstreams]].
- Every significant task must have at least one reviewer role in [[../07_TASKS/Agent_Workstreams]].
- The primary role owns the allowed write scope.
- The reviewer role is responsible for checking risk, missing docs, and boundary violations.
- If a task touches files outside the workstream's owned files, update [[../07_TASKS/Agent_Workstreams]] before editing.
- If the user explicitly asks for parallel or multi-agent work, use sub-agents for bounded role-specific workstreams. Otherwise, a single Codex session may execute one role at a time and simulate reviewer perspectives, but it must still record the role.

Reviewer requirements:

- QA review is required before completion for any code, schema, auth, env, or user-facing behavior change.
- DB review is required for schema, migration, RLS, index, or data ownership changes.
- Telegram review is required for Mini App bridge, Bot, notification, deep-link, or init-data changes.
- Backend review is required for server auth, API routes, privileged Supabase usage, and notification dispatch.
- Architect review is required for repo structure, module boundaries, deployment structure, or cross-domain decisions.
- Design review is required for new user-facing flow structure or visual-system changes.

Parallel workstream system:

- Level 3 tasks must use [[../07_TASKS/Parallel_Workstreams]] before implementation.
- Split work by role, file ownership, and dependency order.
- Every stream must define objective, scope, owned files, forbidden files, dependencies, reviewer, merge order, and status.
- Workstreams must not overlap file ownership unless [[../07_TASKS/Parallel_Workstreams]] records explicit approval.
- Parallel streams do not commit independently.
- One integration owner performs the final merge/review pass.
- Final memory updates happen after integration so the vault records the integrated truth.

Merge control:

1. No overlapping ownership without explicit approval.
2. No direct commits from every stream.
3. One integration/review pass is required before the final commit.
4. The integration owner resolves conflicts and updates workstream statuses.
5. Required memory updates happen after merge.
6. Integration changes affecting architecture, schema, env, security, runtime policy, or repo policy require a [[../07_TASKS/Decisions_Log]] entry.
7. If a stream discovers out-of-scope work, it stops and updates the orchestrator/workstream record before continuing.

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
- Update [[../07_TASKS/Agent_Workstreams]] with Completed, Blocked, or Review status.

Required post-task updates by task type:

| Task Type | Mandatory Files |
| --- | --- |
| Code change | [[../10_LOGS/Session_Log]], [[04_Current_State]], [[05_Next_Steps]], affected module docs, [[../07_TASKS/Bugs]] if defects are found |
| Architecture change | [[../10_LOGS/Session_Log]], [[04_Current_State]], [[05_Next_Steps]], [[../07_TASKS/Decisions_Log]], relevant `05_TECH` or `06_BUILD` docs |
| Env change | [[../10_LOGS/Session_Log]], [[04_Current_State]], [[05_Next_Steps]], [[../07_TASKS/Decisions_Log]], [[../05_TECH/Env_Variables]], [[../05_TECH/Security]] if secrets or trust boundaries are involved |
| DB change | [[../10_LOGS/Session_Log]], [[04_Current_State]], [[05_Next_Steps]], [[../07_TASKS/Decisions_Log]], [[../04_DATA/Data_Model_Overview]], [[../04_DATA/Database_Schema]], [[../05_TECH/Supabase_Setup]] |
| Telegram change | [[../10_LOGS/Session_Log]], [[04_Current_State]], [[05_Next_Steps]], [[../07_TASKS/Decisions_Log]] if auth/security/config changes, [[../05_TECH/Telegram_Integration]], [[../05_TECH/Security]] if trust boundaries are involved |
| Repo policy change | [[../10_LOGS/Session_Log]], [[04_Current_State]], [[05_Next_Steps]], [[../07_TASKS/Decisions_Log]], root instruction files, affected memory-control docs |
| Documentation-only operational change | [[../10_LOGS/Session_Log]], [[04_Current_State]] if facts changed, [[05_Next_Steps]] if plan changed, affected docs |

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

Decision enforcement:

- Any change affecting architecture, schema, env, security, repo policy, auth, data ownership, deployment, or runtime structure must create a [[../07_TASKS/Decisions_Log]] entry.
- A commit that includes one of those changes without a decision entry is protocol-broken.
- Small implementation details do not need a decision entry unless they alter project direction, boundaries, trust, or future work rules.

Decision template:

```md
2026-04-15:

- Decision: <what changed>
- Reason: <why this was chosen>
- Scope: <files/modules affected>
- Role: <primary role>
- Reviewer: <reviewer role>
- Follow-up: <next action or none>
```

Failure signals:

- A commit exists but [[../10_LOGS/Session_Log]] was not updated.
- `src` changed but [[04_Current_State]] and affected module docs were not checked.
- `supabase` changed but [[../04_DATA/Database_Schema]] or [[../05_TECH/Supabase_Setup]] was not updated.
- `.env.example`, env docs, or env behavior changed but [[../05_TECH/Env_Variables]] was not updated.
- Auth, token, RLS, or sensitive data behavior changed but [[../05_TECH/Security]] was not updated.
- Telegram integration changed but [[../05_TECH/Telegram_Integration]] was not updated.
- Repo policy changed but [[../07_TASKS/Decisions_Log]] was not updated.
- Work was completed without an [[../07_TASKS/Agent_Workstreams]] row.
- A role touched files outside its owned scope without updating the workstream.
- A task ended with unresolved ambiguity but [[../07_TASKS/Open_Questions]] was not updated.

Duplicate prevention:

- Search the index and [[07_File_Roles_and_Status]] before creating a new file.
- Add to an existing domain doc when the concept fits there.
- Create a new file only when the concept is durable, likely to grow, and cross-session useful.
- When creating a file, add it to [[00_Project_Index]], [[07_File_Roles_and_Status]], and at least one `Related Files` section.
- Preserve naming rules from [[../07_TASKS/Canonical_Naming]].
