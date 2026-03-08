---
title: API Contracts
stage: "03 — System Design"
feature: FEATURE_NAME
version: 1.0.0
status: DRAFT
created: YYYY-MM-DD
updated: YYYY-MM-DD
project: PROJECT_NAME
authors: ""
approved_by: []
---

# API Contracts — FEATURE_NAME

## Purpose

Defines the complete interface contract for all API endpoints introduced by this feature.
This document is the authoritative source for both implementation and integration.
Consumers of this API must be able to implement against this document without
additional clarification.

---

## Inputs

- `.agentic/features/FEATURE_NAME/artifacts/02-requirements/SRS.md` (APPROVED)
- `.agentic/features/FEATURE_NAME/artifacts/03-design/design.md` (co-produced)

---

## 1. General Conventions

| Convention | Value |
|------------|-------|
| Base URL | `/api/v[N]/` |
| Protocol | HTTPS |
| Format | JSON (application/json) |
| Authentication | [Bearer JWT / API Key / Session / etc.] |
| Date format | ISO 8601 (YYYY-MM-DDTHH:mm:ssZ) |
| ID format | [UUID v4 / auto-increment integer / etc.] |
| Pagination | [Cursor / Offset — describe parameters] |
| Error format | See Section 3 |

---

## 2. Endpoints

### API-001 — [Endpoint Title]

**Linked Requirements:** FR-NNN

| Property | Value |
|----------|-------|
| Method | `GET / POST / PUT / PATCH / DELETE` |
| Path | `/resource/{id}` |
| Authentication | Required / Not required |
| Rate limit | [X requests per Y seconds, or None] |

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | [Description] |

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `[param]` | string | No | [default] | [Description] |

#### Request Body

```json
{
  "[field]": "[type — description]",
  "[field]": "[type — description, required/optional]"
}
```

#### Response — 200 OK

```json
{
  "id": "uuid",
  "[field]": "[type]",
  "created_at": "ISO8601"
}
```

#### Response — Error Cases

| Status | Code | Message | When |
|--------|------|---------|------|
| 400 | `VALIDATION_ERROR` | [Message] | [When this occurs] |
| 401 | `UNAUTHORIZED` | [Message] | [When this occurs] |
| 403 | `FORBIDDEN` | [Message] | [When this occurs] |
| 404 | `NOT_FOUND` | [Message] | [When this occurs] |
| 409 | `CONFLICT` | [Message] | [When this occurs] |
| 500 | `INTERNAL_ERROR` | [Message] | Unexpected server error |

---

### API-002 — [Endpoint Title]

[Repeat structure above]

---

## 3. Error Response Format

All errors follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "details": [
      {
        "field": "field_name",
        "issue": "Description of the issue with this field"
      }
    ]
  }
}
```

The `details` array is only present for validation errors (400).

---

## 4. Authentication Details

[Describe the authentication mechanism in detail]

- **Token type:** [Bearer JWT / API Key / etc.]
- **Token location:** [Authorization header / Cookie / Query param]
- **Token format:** `Authorization: Bearer <token>`
- **Token expiry:** [Duration]
- **Refresh mechanism:** [How tokens are refreshed]
- **Unauthenticated response:** 401 with `UNAUTHORIZED` code

---

## 5. Endpoint Summary

| ID | Method | Path | Auth | FR Coverage |
|----|--------|------|------|-------------|
| API-001 | GET | `/resource/{id}` | Yes | FR-001 |
| API-002 | POST | `/resource` | Yes | FR-002 |

---

## Assumptions & Decisions

| ID | Assumption / Decision | Rationale | Source | Confidence |
|----|-----------------------|-----------|--------|------------|
| A-01 | [Assumption] | [Why] | [Source] | High / Medium / Low |

---

## Open Items

| ID | Description | Owner | Priority | Target Stage |
|----|-------------|-------|----------|--------------|
| OI-001 | [Open item] | Engineer | HIGH | Stage 05 |

---

## Change Log

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0.0 | YYYY-MM-DD | Initial draft | [agent] |
