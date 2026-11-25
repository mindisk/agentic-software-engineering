---
title: Implementation Plan
stage: "04 — Planning"
feature: FEATURE_NAME
version: 1.0.0
status: DRAFT
created: YYYY-MM-DD
updated: YYYY-MM-DD
project: PROJECT_NAME
authors: ""
approved_by: []
---

# Implementation Plan — FEATURE_NAME

## Purpose

Defines all implementation tasks, their order, and dependencies.
Each task is a discrete unit of work traceable to the design.
This document is the execution guide for Stage 05.

---

## Inputs

- `features/FEATURE_NAME/artifacts/02-requirements/SRS.md` (APPROVED)
- `features/FEATURE_NAME/artifacts/03-design/design.md` (APPROVED)
- `features/FEATURE_NAME/artifacts/04-planning/user-stories.md` (DRAFT — written in same stage)

---

## Summary

| Metric | Value |
|--------|-------|
| Total tasks | [N] |
| Estimated effort | [Total, expressed as time range] |
| First unblocked task | TASK-001 |
| Affected repos | [repo keys from the `repos:` map] |
| Fan-out waves | [N — see Fan-out Waves below] |
| Parallel opportunities | [Yes / No — which tasks / which repos run concurrently] |

---

## Tasks

> **Effort:** S = hours · M = half day · L = full day · XL = multiple days
> **Risk:** Low / Medium / High
>
> **Fan-out fields — every task MUST carry these** (they drive autonomous Stage-05 fan-out):
> - **Repo:** the target impl repo, named by its key in the `repos:` map in `.agentic/config.yaml`.
> - **Agent:** `senior-software-engineer` (default) or `api-engineer` for API-layer tasks.
> - **Skills:** extra skills the implementer loads for this task. The implementer always follows
>   `implementation-execution` and loads the repo's own skills. Empty is allowed.
> - **Depends on:** the task IDs that must complete first. Drives the dependency graph and waves.
>   Cross-repo dependencies are allowed; the workspace orders them across repos.

### Group 1 — Infrastructure & Scaffold

#### TASK-001 — [Title]

**Description:** [Clear, specific description. Enough for an AI agent to implement
without follow-up questions. Reference design artifacts directly.]

**Implements:** COMP-NN / FR-NNN / API-NNN / [Entity]

**Acceptance criteria:**
- [ ] [Concrete, verifiable criterion]
- [ ] [Concrete, verifiable criterion]

**Repo:** [repo-key from the `repos:` map]
**Agent:** senior-software-engineer
**Skills:** []
**Depends on:** None
**Effort:** S / M / L / XL
**Risk:** Low / Medium / High — [note if Medium or High]

---

### Group 2 — Data Layer

#### TASK-002 — [Title]

**Description:** [Description]

**Implements:** [Entity] from design.md data model

**Acceptance criteria:**
- [ ] Migration creates [Entity] table with correct schema
- [ ] All constraints are enforced
- [ ] Migration is reversible

**Repo:** [repo-key from the `repos:` map]
**Agent:** senior-software-engineer
**Skills:** []
**Depends on:** TASK-001
**Effort:** S / M / L / XL
**Risk:** Low

---

### Group 3 — Core Logic

#### TASK-003 — [Title]

**Description:** [Description]

**Implements:** COMP-NN — [method], FR-NNN

**Acceptance criteria:**
- [ ] [Criterion]

**Repo:** [repo-key from the `repos:` map]
**Agent:** senior-software-engineer
**Skills:** []
**Depends on:** TASK-002
**Effort:** S / M / L / XL
**Risk:** Low / Medium / High

---

### Group 4 — API / Interface

#### TASK-004 — [Title]

**Description:** [Description. Reference API-NNN from design.md explicitly.]

**Implements:** API-NNN, FR-NNN

**Acceptance criteria:**
- [ ] Endpoint returns correct shape per design.md
- [ ] All error cases return correct status codes
- [ ] Auth is enforced as specified
- [ ] Input is validated

**Repo:** [repo-key from the `repos:` map]
**Agent:** senior-software-engineer
**Skills:** []
**Depends on:** TASK-003
**Effort:** S / M / L / XL
**Risk:** Low

---

### Group 5 — Error Handling & Edge Cases

#### TASK-005 — [Title]

**Description:** [Explicit description. Error handling is always an explicit task,
never assumed to be included in happy-path tasks.]

**Implements:** [Specific error scenario from use-cases.md]

**Acceptance criteria:**
- [ ] [Error case handled correctly]
- [ ] [Error response matches design.md format]

**Repo:** [repo-key from the `repos:` map]
**Agent:** senior-software-engineer
**Skills:** []
**Depends on:** TASK-004
**Effort:** S
**Risk:** Low

---

## Implementation Order

```
TASK-001 (no deps)
    │
    ├──► TASK-002
    │        └──► TASK-003
    │                 ├──► TASK-004
    │                 └──► TASK-005
    │
    └──► TASK-006 (parallel with TASK-002 if applicable)
```

| Position | Task | Repo | Effort | Depends on | Phase |
|----------|------|------|--------|------------|-------|
| 1 | TASK-001 | [repo] | M | — | Foundation |
| 2 | TASK-002 | [repo] | M | TASK-001 | Data |
| 3 | TASK-003 | [repo] | L | TASK-002 | Logic |
| 4 | TASK-004 | [repo] | M | TASK-003 | API |
| 5 | TASK-005 | [repo] | S | TASK-004 | Edge cases |

---

## Fan-out Waves

The autonomous Stage-05 orchestration (`workflow/autonomous-pipeline.js`) executes tasks in
**waves** derived from the dependency graph. Compute them here so fan-out is deterministic:

- A **wave** is a set of tasks whose dependencies are all satisfied by earlier waves.
- Tasks in **different repos** within the same wave run **in parallel**.
- Tasks in the **same repo** are placed in **different waves even if independent** — one worktree
  per `<repo>.worktrees/<change>` is shared, so same-repo work stays sequential to avoid collisions.
- Never place two tasks that touch overlapping files in the same wave.

| Wave | Tasks (repo) | Runs in parallel? |
|------|--------------|-------------------|
| W1 | TASK-001 (repoA) · TASK-010 (repoB) | Yes — different repos |
| W2 | TASK-002 (repoA) · TASK-011 (repoB) | Yes — different repos |
| W3 | TASK-003 (repoA) | No — single task |

> Validity rules the Stage-04 panel checks: no dependency cycles; no two same-repo tasks in one
> wave; the first wave contains at least one task with no dependencies.

---

## Coverage Check

Every design element must map to at least one task.

| Design element | Task(s) |
|----------------|---------|
| COMP-01 | TASK-001, TASK-003 |
| COMP-02 | TASK-004 |
| [Entity] | TASK-002 |
| API-001 | TASK-004 |
| FR-001 | TASK-003 |

---

## Assumptions & Decisions

| ID | Assumption / Decision | Rationale | Source | Confidence |
|----|-----------------------|-----------|--------|------------|
| A-01 | [Assumption] | [Why] | [Source] | High / Medium / Low |

---

## Open Items

| ID | Description | Owner | Priority | Target Stage |
|----|-------------|-------|----------|--------------|
| OI-001 | [Item] | Engineer | HIGH | Stage 05 |

---

## Change Log

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0.0 | YYYY-MM-DD | Initial draft | [agent] |
