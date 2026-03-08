---
title: Test Plan
stage: "06 — Testing"
feature: FEATURE_NAME
version: 1.0.0
status: DRAFT
created: YYYY-MM-DD
updated: YYYY-MM-DD
project: PROJECT_NAME
authors: ""
approved_by: []
---

# Test Plan — FEATURE_NAME

## Purpose

Defines the testing strategy, scope, tools, and coverage targets for the
FEATURE_NAME feature. This document guides test implementation and forms
part of the sign-off record.

---

## Inputs

- `.agentic/features/FEATURE_NAME/artifacts/02-requirements/SRS.md` (APPROVED)
- `.agentic/features/FEATURE_NAME/artifacts/02-requirements/use-cases.md` (APPROVED)
- `.agentic/features/FEATURE_NAME/artifacts/03-design/api-contracts.md` (APPROVED)

---

## 1. Testing Scope

### In Scope

- [What will be tested]
- [e.g. All FR-NNN from SRS.md]
- [e.g. All API endpoints in api-contracts.md]
- [e.g. Error handling defined in use-cases.md]

### Out of Scope

- [What will not be tested in this stage and why]
- [e.g. Performance load testing — deferred to dedicated performance sprint]
- [e.g. UI/UX testing — this feature has no UI]

---

## 2. Test Types

| Type | Description | Tool/Framework | Coverage Target |
|------|-------------|----------------|-----------------|
| Unit | Test individual functions/methods in isolation | [Framework] | [X]% line coverage |
| Integration | Test component interactions with real or in-memory DB | [Framework] | All data layer operations |
| API / Contract | Test API endpoints against api-contracts.md | [Framework] | All endpoints, all status codes |
| E2E | Test full user flows end-to-end | [Framework] | Primary use cases from UC-NNN |

---

## 3. Test Environment

| Aspect | Configuration |
|--------|--------------|
| Database | [Real / In-memory / Mocked — and why] |
| External services | [Mocked / Real sandbox / Stubbed] |
| Authentication | [How auth is handled in tests] |
| Test data | [Seeded / Factory-generated / Fixed fixtures] |
| Environment variables | [How test config is managed] |

---

## 4. Risk-Based Prioritisation

Test high-risk and high-impact areas first.

| Priority | Area | Risk | Why |
|----------|------|------|-----|
| P1 | [Area] | High | [Why this must be tested first] |
| P2 | [Area] | Medium | [Why] |
| P3 | [Area] | Low | [Why] |

---

## 5. Requirements-to-Test Mapping

| FR/NFR ID | Requirement Summary | Test Cases |
|-----------|---------------------|------------|
| FR-001 | [Summary] | TC-001, TC-002 |
| FR-002 | [Summary] | TC-003 |
| NFR-001 | [Performance target] | TC-010 |

---

## 6. Test Case Definitions

### TC-001 — [Test Case Title]

**Linked Requirement:** FR-NNN
**Type:** Unit / Integration / API / E2E
**Priority:** P1 / P2 / P3

**Scenario:** [What situation is being tested]

**Pre-conditions:**
- [State required before test runs]

**Steps:**
1. [Action]
2. [Action]

**Expected Result:**
- [What should happen]
- [What should be returned / stored / emitted]

**Edge Case / Error Variant (if applicable):**
- Input: [Edge input]
- Expected: [Edge result]

---

### TC-002 — [Test Case Title]

[Repeat structure]

---

## 7. Assumptions & Decisions

| ID | Assumption / Decision | Rationale | Source | Confidence |
|----|-----------------------|-----------|--------|------------|
| A-01 | [Assumption] | [Why] | [Source] | High / Medium / Low |

---

## 8. Open Items

| ID | Description | Owner | Priority | Target Stage |
|----|-------------|-------|----------|--------------|
| OI-001 | [Open item] | Engineer | HIGH | Stage 07 |

---

## Change Log

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0.0 | YYYY-MM-DD | Initial draft | [agent] |
