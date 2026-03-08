---
title: Use Cases
stage: "02 — Requirements"
feature: FEATURE_NAME
version: 1.0.0
status: DRAFT
created: YYYY-MM-DD
updated: YYYY-MM-DD
project: PROJECT_NAME
authors: ""
approved_by: []
---

# Use Cases — FEATURE_NAME

## Purpose

This document describes the interactions between users and the system in concrete,
scenario-based terms. Use cases complement the SRS by showing the behaviour of
requirements in context — including alternative and failure paths that requirements
alone may not capture.

---

## Inputs

- `.agentic/features/FEATURE_NAME/artifacts/01-intake/project-brief.md` (APPROVED)
- `.agentic/features/FEATURE_NAME/artifacts/02-requirements/SRS.md` (co-produced)

---

## Use Case Index

| ID | Title | Primary Actor | Linked Requirements |
|----|-------|---------------|---------------------|
| UC-001 | [Title] | [Persona] | FR-001, FR-002 |
| UC-002 | [Title] | [Persona] | FR-003 |

---

## UC-001 — [Use Case Title]

**Primary Actor:** [Persona from SRS]
**Goal:** [What the actor wants to achieve]
**Scope:** [What part of the system is involved]
**Level:** User goal / Sub-function / Summary

**Pre-conditions:**
- [State that must be true before the use case begins]
- [e.g. User is authenticated]

**Post-conditions (success):**
- [State of the system after successful completion]

**Post-conditions (failure):**
- [State of the system after failure / abandonment]

---

### Main Success Scenario

| Step | Actor | Action | System Response |
|------|-------|--------|-----------------|
| 1 | [Actor] | [Does something] | [System does something] |
| 2 | [Actor] | [Does something] | [System does something] |
| 3 | [Actor] | [Does something] | [System does something] |

---

### Alternative Flows

#### Alt-001-A: [Name of alternative]

At step [N], if [condition]:
1. [What happens instead]
2. [Continue or end]

#### Alt-001-B: [Name of alternative]

At step [N], if [condition]:
1. [What happens instead]

---

### Exception / Error Flows

#### Err-001-A: [Error condition]

At step [N], if [error condition]:
1. System [response to error]
2. User [what they see / can do]
3. [Recovery path or dead-end]

#### Err-001-B: [Error condition]

At step [N], if [error condition]:
1. [What happens]

---

### Business Rules

| Rule | Description |
|------|-------------|
| BR-001 | [Rule that governs behaviour in this use case] |

---

### Edge Cases

| Edge Case | Description | Expected Behaviour |
|-----------|-------------|-------------------|
| [Condition] | [What is unusual about this] | [What the system must do] |

---

## UC-002 — [Use Case Title]

[Repeat structure above]

---

## Assumptions & Decisions

| ID | Assumption / Decision | Rationale | Source | Confidence |
|----|-----------------------|-----------|--------|------------|
| A-01 | [Assumption] | [Why] | [Source] | High / Medium / Low |

---

## Open Items

| ID | Description | Owner | Priority | Target Stage |
|----|-------------|-------|----------|--------------|
| OI-001 | [Open item] | Engineer | HIGH | Stage 03 |

---

## Change Log

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0.0 | YYYY-MM-DD | Initial draft | [agent] |
