---
name: ase-planning
description: "Use when the agentic pipeline reaches Stage 04, when the engineer asks to plan the implementation, break a design into tasks, write user stories, or re-plan after a design change, or when tasks.json, its owned files, or its waves need fixing (for example, the build preview shows no parallelism)."
---

# ase-planning — Stage 04

Planning is the last cheap moment to catch mistakes. A gap found here costs one edit. The same
gap found in Stage 05 costs a blocked build or a rework wave.

The output is consumed by machines as well as people:
- `tasks.json` is executed by the `ase-build` controller. Implementer subagents see **only their own brief**, so each task has to stand on its own.
- `plan.md` and `user-stories.md` are what the engineer approves, and what Stage 07 traces requirements against.

## Inputs and outputs

| | Path (under `<artifacts.path>/<feature>/artifacts/`) |
|--|--|
| In | `02-requirements/SRS.md` (APPROVED) · `02-requirements/use-cases.md` · `03-design/design.md` (APPROVED) · `03-design/adr/` |
| Out | `04-planning/user-stories.md` · `04-planning/plan.md` · `04-planning/tasks.json` |
| Templates | [assets/user-stories.md](assets/user-stories.md) · [assets/plan.md](assets/plan.md) · [assets/tasks.json](assets/tasks.json) |

Before starting, confirm that `SRS.md` and `design.md` are `APPROVED` and that `state.yaml` shows
`stage_03: approved`. If any of those is missing, stop and tell the engineer. Planning against an
unapproved design means planning against something that may still change.

Follow `ase-artifacts` for headers, IDs, and markers.

## 1. Read, then check consistency

Read the SRS, use cases, design, and ADRs completely before decomposing anything. Then check
that they agree with each other:

- **SRS ↔ design:** every `FR-NNN` maps to at least one component, entity, or endpoint. Every designed component traces back to a requirement; one that doesn't is scope creep.
- **Interfaces:** every interface in design §4 has an `API-NNN` (or equivalent) ID, and no method, path, or response shape disagrees.
- **ADRs ↔ design:** no ADR is contradicted by the design without a superseding ADR.
- **Open items:** collect every unresolved `OI-NNN` from the brief, SRS, and design that affects planning.

Report every failure as `[CONSISTENCY GAP] <what> — <where>`. What to do next depends on what
the gap would change:

- **It changes which tasks exist.** Examples: a requirement with no design element, a component no requirement asks for, an entity or interface missing from the design. **Stop before decomposing,** and write no plan files. Any task graph you write would encode a guess, and the build can execute it as though planning were complete.
- **It changes only the details of a task.** Examples: a validation rule, a status code, a field name. You may draft the plan, with the affected acceptance criteria marked `[OPEN: OI-NNN]`. Do not ask for approval until the gap is resolved.

Either way, the engineer either resolves the gap or explicitly accepts it as a documented risk.
If everything passes, record `> Cross-artifact consistency check passed at Stage 04 entry.` in
Assumptions & Decisions.

## 2. Consult the knowledge base

If `.agentic/kb/` exists, follow `ase-kb-search`, using the components and code areas the design
touches. Turn every relevant gotcha into an explicit acceptance criterion or task, and cite it
(`see KB-0042`). Knowledge that only sits in the KB doesn't reach the implementer. Only the
brief does.

## 3. Ask, once

Use `ase-questions`, and ask only what the artifacts and the codebase can't answer. Typical
planning questions:
- **Granularity:** do tasks map to modules or to larger units?
- **Shared hotspots:** route registries, dependency-injection containers, barrel files, and similar files that every change touches. Each needs a single owning task, or it serialises the build.
- **Conventions:** existing patterns or utilities the code must reuse.
- **Priorities:** any demo or risk-reduction order.

Look at the codebase first. Often the hotspots are visible in the code without asking.

## 4. Write `user-stories.md`

Write one or more stories per FR or use case:
- `US-NNN`, in the form *As a [role], I want [goal], so that [reason]*
- the `FR-NNN`s it maps to, and a size (XS–XL)
- a **Definition of Done** made of user-observable outcomes, not implementation steps
- a subtask table whose `TASK-NNN` column is filled in after step 5

End the file with a traceability matrix in which every `FR-NNN` appears in at least one story.

## 5. Write `plan.md`

Make every kind of work an explicit task. Anything left implicit gets skipped:
- scaffold and config
- data layer and migrations, as early, separate tasks
- core logic
- API layer
- integrations
- **error handling and edge cases**
- environment and configuration

Each task needs:
- `TASK-NNN`, a title, and a description an implementer could act on **without asking anything**
- what it implements (`COMP-NN`, `FR-NNN`, `API-NNN`, entity)
- acceptance criteria (`AC-NNN-n`) that are verifiable. "Returns 409 on duplicate email" works; "auth works" does not.
- dependencies, effort (S/M/L/XL), and risk

**Size:** a task fits one focused session. "Implement the auth system" is several tasks.

Then go back to `user-stories.md` and fill in every subtask's `TASK-NNN`. A subtask without a task
means a missing task, or a story that can't be implemented.

## 6. Write `tasks.json` and assign waves

Create one entry per `TASK-NNN`, with the same IDs, titles, and dependencies as `plan.md`
(the template is in `assets/`). `plan.md` is what the engineer reads; `tasks.json` is what the
build executes. They must not disagree.

| Field | How to set it, and why |
|-------|------------------------|
| `owns` | Every file or directory the task may create or modify, **including its tests.** This decides what can run in parallel. Too coarse (`src/`) and the whole build runs serially. Too narrow, and the implementer has to stop and ask (`NEEDS_CONTEXT`) or edit outside its lane. Give each shared hotspot to exactly one task, and make the others depend on it. |
| `verify` | The narrowest command that proves this task's acceptance criteria, usually its own test file. The wave gate runs the full suite anyway. |
| `agent` | `api-engineer` if the task implements `API-NNN` endpoints, otherwise `senior-software-engineer`, or any other installed implementer whose role fits better. Check that the agent exists in `.claude/agents/`. |
| `tier` | `haiku` for mechanical single-file work with fully specified behaviour; `sonnet` by default; `opus` for concurrency, tricky integrations, or migrating existing data. |
| `design_ref`, `acceptance` | The IDs from the design and from the task's acceptance criteria. |
| `wave` | See the rules below. |
| `status`, `commit` | `"pending"` and `null`. |

### Task graph rules

These are the same rules `ase-build` uses, so the plan and the build cannot disagree.

- **Conflict:** two tasks conflict if any `owns` entry of one equals, contains, sits inside, or glob-matches an `owns` entry of the other.
- **Waves:** wave 1 holds the tasks with no dependencies. Every dependency must sit in an earlier wave. Tasks in the same wave must not conflict. No wave may hold more than `build.max_parallel` tasks (default 3). Put each task in the earliest wave that satisfies all of this.

Then check the graph, and record each result in `plan.md`'s Implementation Order section:
- unique IDs, matching `plan.md` one to one
- every dependency exists, and there are no cycles
- every dependency sits in an earlier wave
- no conflicts within a wave, and no wave larger than `max_parallel`
- every task has a non-empty `owns`, plus `verify`, `agent`, and `tier`
- every agent exists

Before writing `[PASS]`, re-read `tasks.json` and check each rule against it. These marks are
what the build trusts.

If almost every wave holds a single task, look at `owns` before accepting that. Usually one
hotspot file is shared by everything, and splitting it out into its own early task unlocks the
parallelism.

## 7. Coverage, then the gate

Check coverage:
- every FR has at least one story
- every story subtask has a task
- every component, entity, and endpoint has at least one task
- error handling has explicit tasks
- `tasks.json` matches `plan.md`

Then follow `ase-stage-gate`, using the Stage 04 checklist. In the summary, include:
- the story and task counts
- the effort range
- the wave table
- the graph-check results
- the KB entries applied
- any risks and open items

The approval question: *"Can the build start on wave 1 right now without further discussion?"*
