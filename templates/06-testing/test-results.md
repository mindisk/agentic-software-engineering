---
title: Test Results
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

# Test Results — FEATURE_NAME

## Purpose

Records the outcome of executing the test suite defined in test-plan.md.
This is an honest record — failures are documented and explained, not hidden.

---

## 1. Summary

| Metric | Value |
|--------|-------|
| Total test cases | [N] |
| Passed | [N] |
| Failed | [N] |
| Skipped | [N] |
| Line coverage | [X]% |
| Branch coverage | [X]% |
| Target coverage | [X]% (from test-plan.md) |
| Coverage met | Yes / No |
| All tests passing | Yes / No |
| Date run | YYYY-MM-DD |
| Environment | [Test environment description] |

---

## 2. Results by Test Type

### Unit Tests

| Stat | Value |
|------|-------|
| Total | [N] |
| Passed | [N] |
| Failed | [N] |
| Coverage | [X]% |

### Integration Tests

| Stat | Value |
|------|-------|
| Total | [N] |
| Passed | [N] |
| Failed | [N] |

### API Tests

| Stat | Value |
|------|-------|
| Total | [N] |
| Passed | [N] |
| Failed | [N] |

### E2E Tests

| Stat | Value |
|------|-------|
| Total | [N] |
| Passed | [N] |
| Failed | [N] |

---

## 3. Test Case Results

| TC ID | Title | Type | Status | Notes |
|-------|-------|------|--------|-------|
| TC-001 | [Title] | Unit | PASS | — |
| TC-002 | [Title] | API | FAIL | See Section 4 |
| TC-003 | [Title] | Integration | SKIP | [Reason] |

---

## 4. Failures Detail

### Failure: TC-002 — [Test Case Title]

**Status:** FAIL
**Linked Requirement:** FR-NNN

**Error:**
```
[Paste actual error message or assertion failure]
```

**Root Cause:**
[What caused the failure — implementation bug, test bug, or design gap]

**Resolution:**
- [ ] Implementation fixed in commit [hash]
- [ ] Test corrected — [reason the test was wrong]
- [ ] Design gap flagged — [OPEN: OI-NNN] — deferred to [stage]

**Re-run Result:** PASS / Still failing

---

## 5. Coverage Report

### Uncovered Areas

| File / Module | Lines not covered | Why |
|---------------|-------------------|-----|
| [path/to/file] | [Line ranges] | [Reason — e.g. dead code, deferred edge case] |

### Coverage Gap Assessment

[Are the uncovered areas acceptable? Are they dead code, error paths that can't
be triggered in tests, or genuine gaps that should be covered?]

---

## 6. Requirements Coverage

| FR/NFR ID | Requirement | Test Cases | Status |
|-----------|-------------|------------|--------|
| FR-001 | [Summary] | TC-001, TC-002 | PASS |
| FR-002 | [Summary] | TC-003 | SKIP — [reason] |

**Requirements with no test coverage:**
[List any FR/NFR that could not be tested, with explicit reason]

---

## 7. Sign-Off Recommendation

Based on test results:

- [ ] All requirements are tested and passing → **Recommend proceeding to Stage 07**
- [ ] Some failures remain → **Do not proceed — resolve failures first**
- [ ] Coverage below target → **Do not proceed — add missing tests**

**Agent assessment:** [Honest summary of the test run and readiness to proceed]

---

## Change Log

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0.0 | YYYY-MM-DD | Initial test run | [agent] |
