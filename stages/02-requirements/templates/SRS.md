---
title: Software Requirements Specification
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

# Software Requirements Specification — FEATURE_NAME

## Purpose

This document defines the complete requirements for the FEATURE_NAME feature.
It serves as the authoritative source for what the system must do, forming the
basis for system design, implementation, and test planning.

---

## Scope

**In scope:** [What this SRS covers]
**Out of scope:** [What this SRS does not cover — reference project-brief.md scope section]

## Inputs

- `.agentic/features/FEATURE_NAME/artifacts/01-intake/project-brief.md` (v1.0.0, APPROVED)

---

## 1. User Personas

| Persona | Description | Goals | Technical Level |
|---------|-------------|-------|-----------------|
| [Name] | [Who they are] | [What they want to achieve] | Low / Medium / High |

---

## 2. Functional Requirements

> Each requirement states WHAT the system must do, not HOW.
> Format: The system SHALL [behaviour]. Acceptance: [how to verify].

### 2.1 [Feature Area Name]

### FR-001: [Requirement title]

The system SHALL [clearly stated behaviour].

**Priority:** Must-have / Should-have / Nice-to-have
**User Story:** [US-NNN]
**Source:** [Reference to project-brief.md section]

#### Scenario: [Happy path name]
Given [precondition]
When [action]
Then [observable outcome]

#### Scenario: [Error/edge case name]
Given [precondition]
When [action]
Then [observable outcome]

---

### FR-002: [Requirement title]

The system SHALL [clearly stated behaviour].

**Priority:** Must-have / Should-have / Nice-to-have
**User Story:** [US-NNN]
**Source:** [Reference to project-brief.md section]

#### Scenario: [Happy path name]
Given [precondition]
When [action]
Then [observable outcome]

#### Scenario: [Error/edge case name]
Given [precondition]
When [action]
Then [observable outcome]

---

### 2.2 [Feature Area Name]

### FR-003: [Requirement title]

[Continue pattern — every FR-NNN needs RFC 2119 language + at least two scenarios]

---

## 3. Non-Functional Requirements

> All NFRs must have measurable targets. No vague language.

#### NFR-001 — Performance

**Description:** The system SHALL respond to [operation] within [X ms] at [Y] concurrent users.

**Target:** [Specific measurable value]
**Measurement method:** [How to measure this in testing]
**Source:** [Reference]

---

#### NFR-002 — Availability

**Description:** The system SHALL maintain [X]% uptime, measured monthly.

**Target:** [e.g. 99.9% — allows ~43 min downtime/month]
**Recovery time objective (RTO):** [e.g. < 15 minutes]
**Recovery point objective (RPO):** [e.g. < 1 hour]
**Source:** [Reference]

---

#### NFR-003 — Security

**Description:** The system SHALL [specific security requirement].

**Target:** [Specific standard or measurable requirement]
**Source:** [Reference]

---

#### NFR-004 — Scalability

**Description:** The system SHALL support [X users / Y records / Z requests per second].

**Target:** [Specific measurable value]
**Source:** [Reference]

---

#### NFR-005 — Maintainability

**Description:** The system SHALL [logging / monitoring / deployment requirement].

**Target:** [Specific requirement]
**Source:** [Reference]

---

## 4. User Stories

| ID | Persona | Story | Linked Requirements |
|----|---------|-------|---------------------|
| US-001 | [Persona] | As a [persona], I want to [action] so that [outcome]. | FR-001, FR-002 |
| US-002 | [Persona] | As a [persona], I want to [action] so that [outcome]. | FR-003 |

---

## 5. Requirements Traceability to Project Brief

| FR/NFR ID | Requirement Summary | Project Brief Reference |
|-----------|---------------------|-------------------------|
| FR-001 | [Summary] | Brief Section [X] |
| NFR-001 | [Summary] | Brief Section [X] / Constraint [C-NN] |

---

## 6. Assumptions & Decisions

| ID   | Assumption / Decision | Rationale | Source | Confidence |
|------|-----------------------|-----------|--------|------------|
| A-01 | [Assumption] | [Why] | [Source] | High / Medium / Low |

---

## 7. Open Items

| ID | Description | Owner | Priority | Target Stage |
|----|-------------|-------|----------|--------------|
| OI-001 | [Open item] | Engineer | HIGH | Stage 03 |

---

## 8. Q&A Log

### Q1: [Question title]
**Asked:** YYYY-MM-DD
**Question:** [Full question]
**Answer:** [Engineer's answer]
**Decision taken:** [What was decided]

---

## Change Log

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0.0 | YYYY-MM-DD | Initial draft | [agent] |
