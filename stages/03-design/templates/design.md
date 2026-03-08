---
title: System Design
stage: "03 — Design"
feature: FEATURE_NAME
version: 1.0.0
status: DRAFT
created: YYYY-MM-DD
updated: YYYY-MM-DD
project: PROJECT_NAME
authors: ""
approved_by: []
---

# System Design — FEATURE_NAME

## Purpose

Defines the technical design for FEATURE_NAME — how the system is structured,
what each component does, how data is modelled, and how components interact.
This is the authoritative reference for implementation.

---

## Inputs

- `.agentic/features/FEATURE_NAME/artifacts/02-requirements/SRS.md` (APPROVED)
- `.agentic/features/FEATURE_NAME/artifacts/02-requirements/use-cases.md` (APPROVED)

---

## 1. Architecture

### Overview

[One to two paragraphs describing the architectural style and why it was chosen.
e.g. layered, event-driven, serverless. Be explicit about the rationale.]

### Components

| ID | Name | Responsibility | Technology |
|----|------|----------------|------------|
| COMP-01 | [Name] | [What it does — and what it does NOT do] | [Stack] |
| COMP-02 | [Name] | [Responsibility] | [Stack] |

### System Diagram

```
[Describe the system structure using ASCII art or text.
Show components, their connections, and data flow direction.]

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   COMP-01    │────►│   COMP-02    │────►│   COMP-03    │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Primary Data Flow

Step-by-step for the main use case:

1. [Actor/component] → [action] → [COMP-NN]
2. [COMP-NN] → [action] → [COMP-NN]
3. [Result returned to actor]

### Error Flow

What happens when something goes wrong in the primary flow:

1. [Error condition] → [how it propagates]
2. [Recovery or failure response]

---

## 2. Component Design

For each component defined above:

### COMP-01 — [Name]

**Does:**
- [Specific responsibility]

**Does not:**
- [Explicit boundary — prevents scope creep during implementation]

**Interface (what it exposes):**

| Method / Endpoint | Input | Output | Errors |
|-------------------|-------|--------|--------|
| [name] | [params] | [return] | [error cases] |

**Dependencies:**

| Depends on | Type | Purpose |
|------------|------|---------|
| COMP-NN | Internal | [Why] |
| [External] | External | [Why] |

**Error handling:** [How errors from dependencies are handled]
**State:** Stateless / Stateful — [if stateful, where and how long]

---

### COMP-02 — [Name]

[Repeat structure above]

---

## 3. Data Model

### Entities

#### [EntityName]

| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `id` | UUID | Yes | Yes | auto | Primary key |
| `[field]` | [type] | Yes/No | Yes/No | [value] | [Description] |
| `created_at` | Timestamp | Yes | No | now() | Creation time |
| `updated_at` | Timestamp | Yes | No | now() | Last modified |

**Indexes:** [List indexes and their purpose]
**Constraints:** [Business rules enforced at data level]

---

### Relationships

| From | Relationship | To | Cardinality | Notes |
|------|--------------|----|-------------|-------|
| [Entity A] | has many | [Entity B] | 1:N | [FK: entity_a_id on B] |

### Data Lifecycle

| Entity | Created | Updated | Deleted | Retention |
|--------|---------|---------|---------|-----------|
| [Entity] | [When] | [When] | Soft / Hard / Never | [Policy] |

---

## 4. API Contracts

> Complete this section if the feature exposes an API.
> If no external API is introduced, replace this section with:
> "No external API — all interactions are internal to [component]."

### General Conventions

| Convention | Value |
|------------|-------|
| Base path | `/api/v[N]/` |
| Format | JSON |
| Auth | [Bearer JWT / API Key / Session] |
| Error format | See below |

### Endpoints

#### API-001 — [Title]

| Property | Value |
|----------|-------|
| Method | GET / POST / PUT / PATCH / DELETE |
| Path | `/resource/{id}` |
| Auth required | Yes / No |
| Linked requirements | FR-NNN |

**Request:**
```json
{ "[field]": "[type — description]" }
```

**Response 200:**
```json
{ "id": "uuid", "[field]": "[type]" }
```

**Errors:**

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | [Condition] |
| 401 | `UNAUTHORIZED` | Missing or invalid token |
| 404 | `NOT_FOUND` | Resource does not exist |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

**Error response shape:**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "details": [{ "field": "name", "issue": "description" }]
  }
}
```

---

## 5. Non-Functional Requirement Coverage

| NFR ID | Requirement | Design decision addressing it |
|--------|-------------|-------------------------------|
| NFR-001 | [e.g. 200ms p95 response] | [e.g. in-memory cache at COMP-02] |
| NFR-002 | [e.g. 99.9% uptime] | [e.g. stateless services, horizontal scaling] |

---

## 6. Security

- **Authentication:** [How identity is verified]
- **Authorisation:** [How access is controlled]
- **Data in transit:** [Encryption approach]
- **Data at rest:** [Encryption approach]
- **Input validation:** [Where and how]
- **Secrets:** [How credentials and keys are managed]

---

## 7. Requirements Traceability

| FR/NFR | Summary | Addressed by |
|--------|---------|--------------|
| FR-001 | [Summary] | COMP-01, API-001 |
| NFR-001 | [Summary] | Architecture decision A-02 |

---

## Assumptions & Decisions

| ID | Assumption / Decision | Rationale | Source | Confidence |
|----|-----------------------|-----------|--------|------------|
| A-01 | [Assumption] | [Why] | [Source] | High / Medium / Low |

---

## Open Items

| ID | Description | Owner | Priority | Target Stage |
|----|-------------|-------|----------|--------------|
| OI-001 | [Item] | Engineer | HIGH | Stage 04 |

---

## Change Log

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0.0 | YYYY-MM-DD | Initial draft | [agent] |
