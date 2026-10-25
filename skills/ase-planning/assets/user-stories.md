---
title: User Stories
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

# User Stories — FEATURE_NAME

## Purpose

Captures the feature's functionality from the end-user perspective.
Each story defines who wants what and why, with explicit acceptance criteria
and a breakdown into subtasks that map directly to implementation tasks in `plan.md`.

---

## Inputs

- `.agentic/features/FEATURE_NAME/artifacts/02-requirements/SRS.md` (APPROVED)
- `.agentic/features/FEATURE_NAME/artifacts/02-requirements/use-cases.md` (APPROVED)
- `.agentic/features/FEATURE_NAME/artifacts/03-design/design.md` (APPROVED)

---

## User Stories

> **Format:** `As a [role], I want [goal], so that [reason].`
> Each story maps to one or more functional requirements (`FR-NNN`) and decomposes
> into subtasks that link to implementation tasks (`TASK-NNN`).

---

### US-001 — [Story title]

**Story:**
> As a **[role / persona]**, I want **[goal]**, so that **[reason / business value]**.

**Maps to:** FR-NNN, FR-NNN

**Size:** XS / S / M / L / XL
*(XS = trivial · S = hours · M = half-day · L = full day · XL = multiple days)*

**Definition of Done:**
- [ ] [Concrete, user-observable outcome — not an implementation detail]
- [ ] [Edge case or error scenario the user experiences correctly]
- [ ] [Any UX, accessibility, or performance criterion visible to the user]

**Subtasks:**

| ID | Subtask | Implementation Task | Notes |
|----|---------|---------------------|-------|
| US-001.1 | [What needs to happen to fulfil this story — e.g., "Persist user record"] | TASK-NNN | |
| US-001.2 | [Another subtask — e.g., "Return auth token in response"] | TASK-NNN | |
| US-001.3 | [Error path — e.g., "Return 409 if email already registered"] | TASK-NNN | |

---

### US-002 — [Story title]

**Story:**
> As a **[role / persona]**, I want **[goal]**, so that **[reason / business value]**.

**Maps to:** FR-NNN

**Size:** XS / S / M / L / XL

**Definition of Done:**
- [ ] [Criterion]
- [ ] [Criterion]

**Subtasks:**

| ID | Subtask | Implementation Task | Notes |
|----|---------|---------------------|-------|
| US-002.1 | [Subtask] | TASK-NNN | |

---

## Traceability Matrix

Every functional requirement must appear in at least one user story.

| FR | Requirement summary | User Story | Status |
|----|---------------------|------------|--------|
| FR-001 | [Short description] | US-001 | Covered |
| FR-002 | [Short description] | US-001, US-002 | Covered |

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
