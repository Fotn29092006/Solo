# Parallel Workstreams

## Purpose
Control large or cross-domain Codex tasks that must be split into bounded role workstreams without losing merge discipline or vault authority.

## Status
Active

## Owner
Shared

## Last Updated
2026-04-15

## Related Files
- [[Agent_Workstreams]]
- [[Current_Sprint]]
- [[Decisions_Log]]
- [[Open_Questions]]
- [[../00_START_HERE/06_Graph_Memory_Protocol]]
- [[../08_PROMPTS/Orchestrator_Agent_Prompt]]
- [[../08_PROMPTS/Session_Brief_Template]]

## Content
Rule:

- Level 3 work must be split here before implementation starts.
- Parallel workstreams are only for large or cross-domain work.
- Role perspectives may be simulated in one Codex session unless the user explicitly requests sub-agents or parallel agent work.
- Sub-agents may only be used when the user explicitly asks for sub-agents, delegation, or parallel agent work.
- Every stream must have bounded owned files and forbidden files.
- No overlapping ownership is allowed unless this file records explicit approval.
- Parallel streams do not commit independently.
- One integration owner performs the merge and review pass before any final commit.
- Final memory updates happen after integration, not separately in conflicting edits.

Workstream table:

| ID | Role | Objective | Scope | Owned Files | Forbidden Files | Dependencies | Reviewer | Merge Order | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TBD | TBD | One sentence objective | Exact boundary | Exact files or folders | Exact files or folders | Upstream streams or none | Required reviewer | 1, 2, 3... | Planned / Active / Blocked / Review / Merged |
| TB-DB-01 | DB | Review and prepare MVP spine migration and live apply path | Inspect migration, RLS shape, identity model, and whether local credentials can apply or verify it | `supabase/migrations/0001_mvp_spine.sql`, `src/shared/types/database.ts`, `04_DATA/Database_Schema.md`, `05_TECH/Supabase_Setup.md`, `supabase/README.md` | unrelated `src/**`, `.env*`, product scope docs | None | QA, Backend | 1 | Merged 2026-04-15 |
| TB-TG-01 | Telegram | Implement server-side Telegram init-data validation scaffold | Add server-only validation utilities and a minimal auth validation route | `src/lib/telegram/server.ts`, `src/app/api/auth/telegram/route.ts`, `src/shared/types/telegram.ts` | `supabase/**`, `.env*`, unrelated UI files | None | QA, Backend | 2 | Merged 2026-04-15 |
| TB-QA-01 | QA | Verify trust-boundary pass | Run type/build checks, health checks, and review changed files for boundary leaks | `07_TASKS/Bugs.md` if defects are found | `src/**`, `supabase/**`, `.env*` unless explicitly assigned | TB-DB-01, TB-TG-01 | Architect | 3 | Merged 2026-04-15 |

Allowed split patterns:

| Workstream Type | Typical Owner | Typical Reviewer | Notes |
| --- | --- | --- | --- |
| Frontend | Frontend | QA, Design, Telegram if Mini App bridge changes | Owns routes, components, client feature files, and UX implementation details. |
| Backend | Backend | QA, DB, Telegram when auth or init data is involved | Owns API routes, server logic, and service integration outside schema ownership. |
| DB | DB | QA, Backend | Owns migrations, RLS, indexes, schema docs, and data ownership rules. |
| Telegram | Telegram | QA, Backend | Owns Mini App bridge, init-data validation, Bot behavior, notifications, and Telegram docs. |
| Design | Design | Frontend, Product/Analyst | Owns UX direction, interaction constraints, visual consistency, and mobile-first review. |
| QA | QA | Owning implementation role | Owns acceptance checks, regression notes, bugs, and verification summary. |
| Integration | Architect or owning lead | QA plus affected role reviewers | Owns merge order, conflict resolution, final docs, and final commit readiness. |

Merge control:

1. Open a Level 3 row in [[Agent_Workstreams]] for the overall task.
2. Add one row here for each parallel stream.
3. Assign exact owned files and forbidden files before implementation.
4. Record dependencies and merge order before implementation.
5. Keep streams out of each other's owned files.
6. If overlap is unavoidable, record the approved overlap and integration owner before edits continue.
7. Put completed streams in Review before integration.
8. The integration owner merges in the recorded order.
9. The integration owner runs final verification and checks memory updates.
10. The final commit, if requested, is created only after integration review.

Required stream report:

```md
## Stream Report
- ID:
- Role:
- Files changed:
- Verification:
- Memory impact:
- Out-of-scope findings:
- Reviewer notes:
```

Integration checklist:

- All streams are Review, Merged, or Blocked with reason.
- No unapproved ownership overlaps remain.
- Merge order was followed or updated here.
- Final verification was run or the blocker was recorded.
- [[../10_LOGS/Session_Log]] was updated.
- [[../00_START_HERE/04_Current_State]] was updated when facts changed.
- [[../00_START_HERE/05_Next_Steps]] was updated when the plan changed.
- [[Decisions_Log]] was updated for architecture, schema, env, security, runtime policy, or repo policy changes.
- Affected module docs were updated.
- [[Agent_Workstreams]] was updated to Completed, Blocked, or Review.

Failure signals:

- Two streams changed the same file without an approved overlap row.
- A stream committed directly before integration.
- A stream changed files outside its owned scope.
- A stream discovered out-of-scope work and kept editing.
- Integration completed without final memory updates.
- A durable integration decision was made without [[Decisions_Log]].
