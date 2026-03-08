# Stage 04 — Implementation Planning

## Purpose

Break the approved design into a concrete, ordered list of implementable tasks.
Each task must be small enough to complete in a focused session and clear enough
that an AI agent can implement it without follow-up questions.

This document is the direct execution guide for Stage 05.

---

## Inputs

| Artifact | Source | Required |
|----------|--------|----------|
| `SRS.md` | Stage 02, APPROVED | Yes |
| `design.md` | Stage 03, APPROVED | Yes |
| `api-contracts.md` | Stage 03, APPROVED | If it exists |

---

## Output

| Artifact | Path |
|----------|------|
| `user-stories.md` | `<artifacts>/04-planning/user-stories.md` |
| `plan.md` | `<artifacts>/04-planning/plan.md` |

`user-stories.md` defines what the feature does from the user's perspective —
stories, definitions of done, and subtasks linked to implementation tasks.
`plan.md` is the technical execution guide: tasks, dependencies, and order.

Both documents must be consistent: every subtask in `user-stories.md` must
reference a `TASK-NNN` in `plan.md`, and vice versa.

---

## Process

### Step 1 — Read all design artifacts

Understand every component, interface, entity, and endpoint before decomposing tasks.
Map them against requirements to ensure nothing is missed.

### Step 2 — Early question pass

1. **Task granularity** — Should tasks map to individual functions/modules, or
   to larger logical units? This affects PR size in Stage 05.
2. **Tests in same PR?** — Should each implementation task include its tests,
   or are tests a separate Stage 06 pass?
3. **Existing code** — Are there existing patterns, utilities, or conventions
   in the codebase that implementation must follow?
4. **Priority order** — Is there a subset of tasks needed first (demo, dependency,
   risk reduction)?

### Step 3 — Write user-stories.md

Use the template at `stages/04-planning/templates/user-stories.md`.

For each functional requirement or use case, write one or more user stories:

**Each story must have:**
- ID (`US-NNN`), title, and the canonical format: *"As a [role], I want [goal], so that [reason]."*
- Mapping to one or more `FR-NNN` from `SRS.md`
- Size estimate (XS / S / M / L / XL)
- Definition of Done — observable, user-facing outcomes (not implementation steps)
- Subtask table — each subtask names one discrete thing that must happen to fulfil
  the story, with a `TASK-NNN` reference to be filled in after `plan.md` is written

**After writing `plan.md` (Step 4), go back and fill in the `TASK-NNN` references
in each subtask row.** Cross-reference is mandatory — a subtask with no task ID
means either the task is missing from `plan.md` or the story is unimplementable.

Write the traceability matrix at the bottom: every `FR-NNN` must appear in at
least one story.

### Step 4 — Write plan.md

Use the template at `stages/04-planning/templates/plan.md`.

**Task categories to cover — all must be explicit tasks:**
- Infrastructure / scaffold (project setup, config, DB connection)
- Data layer (migrations, models, repositories)
- Business / core logic
- API layer (controllers, routes, middleware) — if applicable
- External integrations — if applicable
- Error handling and edge cases — always explicit, never implied
- Configuration and environment

**Each task must have:**
- ID (`TASK-NNN`), title, description
- What design artifact it implements (COMP-NN, FR-NNN, API-NNN, entity name)
- Acceptance criteria — concrete and verifiable, not "it works"
- Dependencies on other tasks
- Effort estimate (S / M / L / XL)
- Risk level

After completing `plan.md`, return to `user-stories.md` and fill in all
`TASK-NNN` references in the subtask tables.

### Step 5 — Define implementation order

In the same `plan.md`, define the dependency graph and ordered task list.
Verify:
- Every task has all dependencies resolved before it starts
- No circular dependencies
- The first task is immediately actionable with zero open decisions
- Parallel opportunities are identified

### Step 6 — Coverage check

Before opening the PR, verify:
- Every `FR-NNN` → at least one user story in `user-stories.md`
- Every `US-NNN` subtask → a `TASK-NNN` in `plan.md`
- Every COMP-NN → at least one task
- Every API-NNN → at least one task
- Every entity → at least one task (usually a migration task)
- Error handling → explicit tasks, not implied by other tasks

### Step 7 — Commit and open PR

```
Branch:   agentic/<feature>/04-planning
PR title: agentic/<feature>/04-planning: user stories and implementation plan
```

---

## Done Criteria

- [ ] `user-stories.md` written with all stories, definitions of done, and subtasks
- [ ] Every `FR-NNN` appears in at least one user story
- [ ] Every subtask has a `TASK-NNN` reference filled in
- [ ] `plan.md` written with all tasks, dependencies, order, and coverage check
- [ ] First task is immediately actionable
- [ ] No circular dependencies
- [ ] Every design element covered by at least one task
- [ ] PR open with Stage 04 checklist completed
- [ ] Engineer merges PR → `APPROVED`
- [ ] `state.yaml` updated: `current_stage: 5`, `stage_04: approved`

---

## Common Failure Modes

- Writing user stories that describe implementation steps rather than user outcomes
- Subtasks left without `TASK-NNN` references — always cross-link after writing `plan.md`
- Tasks too large ("implement the entire auth system") — break them down
- Error handling left as implied — always make it an explicit task
- Acceptance criteria that are vague ("auth works") — make them verifiable
- Missing infrastructure tasks — these must come first
- Not accounting for data migrations as an early, separate task
