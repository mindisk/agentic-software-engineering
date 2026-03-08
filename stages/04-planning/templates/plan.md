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

- `.agentic/features/FEATURE_NAME/artifacts/02-requirements/SRS.md` (APPROVED)
- `.agentic/features/FEATURE_NAME/artifacts/03-design/design.md` (APPROVED)

---

## Summary

| Metric | Value |
|--------|-------|
| Total tasks | [N] |
| Estimated effort | [Total, expressed as time range] |
| First unblocked task | TASK-001 |
| Parallel opportunities | [Yes / No — which tasks] |

---

## Tasks

> **Effort:** S = hours · M = half day · L = full day · XL = multiple days
> **Risk:** Low / Medium / High

### Group 1 — Infrastructure & Scaffold

#### TASK-001 — [Title]

**Description:** [Clear, specific description. Enough for an AI agent to implement
without follow-up questions. Reference design artifacts directly.]

**Implements:** COMP-NN / FR-NNN / API-NNN / [Entity]

**Acceptance criteria:**
- [ ] [Concrete, verifiable criterion]
- [ ] [Concrete, verifiable criterion]

**Dependencies:** None
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

**Dependencies:** TASK-001
**Effort:** S / M / L / XL
**Risk:** Low

---

### Group 3 — Core Logic

#### TASK-003 — [Title]

**Description:** [Description]

**Implements:** COMP-NN — [method], FR-NNN

**Acceptance criteria:**
- [ ] [Criterion]

**Dependencies:** TASK-002
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

**Dependencies:** TASK-003
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

**Dependencies:** TASK-004
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

| Position | Task | Effort | Depends on | Phase |
|----------|------|--------|------------|-------|
| 1 | TASK-001 | M | — | Foundation |
| 2 | TASK-002 | M | TASK-001 | Data |
| 3 | TASK-003 | L | TASK-002 | Logic |
| 4 | TASK-004 | M | TASK-003 | API |
| 5 | TASK-005 | S | TASK-004 | Edge cases |

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
