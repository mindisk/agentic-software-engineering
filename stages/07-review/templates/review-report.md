---
title: Review Report
stage: "07 — Review & Validation"
feature: FEATURE_NAME
version: 1.0.0
status: DRAFT
created: YYYY-MM-DD
updated: YYYY-MM-DD
project: PROJECT_NAME
authors: ""
approved_by: []
---

# Review Report — FEATURE_NAME

## Purpose

Final assessment of the FEATURE_NAME feature. Documents what was built,
how well it was tested, what gaps remain, and whether the feature is ready
for sign-off. Includes full requirements traceability.

This is an honest document. Issues are not minimised.

---

## 1. Feature Summary

**What was built:**
[One to two paragraphs describing the feature as actually implemented.
Note any differences from the original project brief.]

**Alignment with original brief:**
[Does the implementation match the original intent? What diverged and why?]

---

## 2. Pipeline Summary

| Stage | Status | PR | Key decisions |
|-------|--------|-----|---------------|
| 01 Intake | APPROVED | #[N] | [Key decision] |
| 02 Requirements | APPROVED | #[N] | [Key decision] |
| 03 Design | APPROVED | #[N] | [Key decision] |
| 04 Planning | APPROVED | #[N] | [Task count, approach] |
| 05 Implementation | APPROVED | #[N]–#[N] | [Deviations] |
| 06 Testing | APPROVED | #[N] | [Coverage, results] |

---

## 3. Requirements Traceability

Every FR-NNN and NFR-NNN must appear here. Gaps are documented — not hidden.

### Functional Requirements

| FR ID | Summary | Design | Task(s) | Test(s) | Status |
|-------|---------|--------|---------|---------|--------|
| FR-001 | [Summary] | COMP-01, API-001 | TASK-003, TASK-004 | TC-001 | FULL |
| FR-002 | [Summary] | COMP-02 | TASK-005 | TC-003 | FULL |
| FR-003 | [Summary] | COMP-01 | TASK-006 | — | PARTIAL — no test |
| FR-004 | [Summary] | — | — | — | NOT COVERED |

**Status legend:**
- `FULL` — Designed, implemented, and tested
- `PARTIAL` — At least one of design / implementation / test is missing
- `NOT COVERED` — No design, implementation, or test coverage

### Non-Functional Requirements

| NFR ID | Requirement | Design decision | Verified by | Status |
|--------|-------------|-----------------|-------------|--------|
| NFR-001 | [e.g. 200ms p95] | [Caching at COMP-02] | TC-010 | VERIFIED |
| NFR-002 | [e.g. 99.9% uptime] | [Stateless + LB] | Architecture review | REVIEWED |

### Use Case Coverage

| UC ID | Title | Tested by | Status |
|-------|-------|-----------|--------|
| UC-001 | [Title] | TC-001, TC-002 | COVERED |
| UC-002 | [Title] | TC-005 | COVERED |

---

## 4. Test Results Summary

| Type | Total | Pass | Fail | Skip |
|------|-------|------|------|------|
| Unit | [N] | [N] | [N] | [N] |
| Integration | [N] | [N] | [N] | [N] |
| API | [N] | [N] | [N] | [N] |
| **Total** | **[N]** | **[N]** | **[N]** | **[N]** |

**Line coverage:** [X]% (target: [Y]%)

**Untested areas:**

| Area | Reason |
|------|--------|
| [File / module] | [Acceptable reason or gap to fix] |

---

## 5. Design Deviations

Differences between the approved design and what was implemented.

| ID | Design spec | Actual implementation | Impact | Reviewed |
|----|------------|----------------------|--------|---------|
| DEV-01 | [What design said] | [What was built] | Low/Med/High | Yes/No |

---

## 6. Open Items Status

| OI ID | Origin | Description | Status | Resolution |
|-------|--------|-------------|--------|------------|
| OI-001 | Stage 02 | [Description] | Resolved | [How] |
| OI-002 | Stage 03 | [Description] | Deferred | [To when] |
| OI-003 | Stage 06 | [Description] | Open | [What needs to happen] |

**Open items blocking sign-off:**
[List any OI that must be resolved before the feature is complete. If none, write "None."]

---

## 7. Remaining Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| [Description] | Low/Med/High | Low/Med/High | [What mitigates it] |

---

## 8. Sign-Off Recommendation

**Recommendation:** APPROVE / DO NOT APPROVE

**Rationale:**
[Clear, honest reasoning. List any conditions if recommending approval with caveats.]

**If DO NOT APPROVE — required actions:**
- [ ] [Required action]

**Known limitations accepted:**
[Gaps or deviations accepted as-is, with explicit acknowledgement.]

---

## Assumptions & Decisions

| ID | Assumption / Decision | Rationale | Source | Confidence |
|----|-----------------------|-----------|--------|------------|
| A-01 | [Assumption] | [Why] | [Source] | High / Medium / Low |

---

## Change Log

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0.0 | YYYY-MM-DD | Initial draft | [agent] |
