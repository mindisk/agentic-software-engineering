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
| `plan.md` | `.agentic/features/<feature>/artifacts/04-planning/plan.md` |

One document covers the full task list, dependencies, implementation order,
and coverage check.

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

### Step 3 — Write plan.md

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

### Step 4 — Define implementation order

In the same document, define the dependency graph and ordered task list.
Verify:
- Every task has all dependencies resolved before it starts
- No circular dependencies
- The first task is immediately actionable with zero open decisions
- Parallel opportunities are identified

### Step 5 — Coverage check

Before opening the PR, verify every design element maps to at least one task:
- Every COMP-NN → at least one task
- Every FR-NNN → at least one task
- Every API-NNN → at least one task
- Every entity → at least one task (usually a migration task)
- Error handling → explicit tasks, not implied by other tasks

### Step 6 — Commit and open PR

```
Branch:   agentic/<feature>/04-planning
PR title: agentic/<feature>/04-planning: implementation plan
```

---

## Done Criteria

- [ ] `plan.md` written with all tasks, dependencies, order, and coverage check
- [ ] First task is immediately actionable
- [ ] No circular dependencies
- [ ] Every design element covered by at least one task
- [ ] PR open with Stage 04 checklist completed
- [ ] Engineer merges PR → `APPROVED`
- [ ] `state.yaml` updated: `current_stage: 5`, `stage_04: approved`

---

## Common Failure Modes

- Tasks too large ("implement the entire auth system") — break them down
- Error handling left as implied — always make it an explicit task
- Acceptance criteria that are vague ("auth works") — make them verifiable
- Missing infrastructure tasks — these must come first
- Not accounting for data migrations as an early, separate task
