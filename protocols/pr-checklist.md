# PR Checklist — Per Stage Review Guide

This document defines what the engineer must verify before merging each stage's PR.
Merging = formal approval to proceed to the next stage. Take it seriously.

The agent must include a filled-in version of the relevant checklist in every PR description.

---

## PR Gate Mode

Each feature has a `pr_gates` flag set in `state.yaml` at initialisation:

- **`pr_gates: true`** — One PR per stage. The agent stops after each stage PR and waits
  for merge before proceeding. This is the default for large or high-risk features.
- **`pr_gates: false`** — Continuous commits on a single feature branch. The agent works
  through all stages without stopping. One final PR covers the entire feature.
  The engineer still reviews; they just review it all at once at the end.

Regardless of mode, the checklists below define what must be verified before approval.

---

## General Checklist (all stages)

These apply to every PR regardless of stage:

- [ ] Artifact header is complete (title, feature, version, status=REVIEW, dates)
- [ ] All required sections are present (Purpose, Scope, Inputs, Assumptions, Open Items, Change Log)
- [ ] No vague language ("TBD", "etc.", "as needed") — all open items are in the Open Items table
- [ ] All IDs follow the naming convention (FR-NNN, UC-NNN, etc.)
- [ ] Decisions are documented with rationale, not just stated
- [ ] Cross-feature references are clearly marked as informational only
- [ ] Questions raised by the agent have been answered (or defaults accepted)
- [ ] No unresolved `[BLOCKING]` open items

---

## Stage 01 — Intake

**PR title format:** `agentic/<feature>/01-intake: project brief`

- [ ] Project purpose is clearly stated in one paragraph
- [ ] Scope is unambiguous — "in scope" and "out of scope" are both explicit
- [ ] Success criteria are measurable (not "the app works well")
- [ ] Key stakeholders / users are identified
- [ ] Known constraints are listed (tech, time, team, regulatory)
- [ ] Risks are identified — at least the obvious ones
- [ ] The brief reflects actual intent — not the agent's interpretation of it

**Gate question before merging:** *"If a new engineer read only this brief, would they understand what we're building and why?"*

---

## Stage 02 — Requirements

**PR title format:** `agentic/<feature>/02-requirements: SRS + use cases`

- [ ] Every functional requirement has an ID (FR-NNN), description, and acceptance criteria
- [ ] Non-functional requirements are specific and measurable (not "the system must be fast")
- [ ] Use cases cover the primary happy path AND alternative/error flows
- [ ] Edge cases are explicitly listed, not implied
- [ ] No requirement contradicts another — conflicts are resolved or flagged as `[OPEN]`
- [ ] Requirements trace back to the project brief (nothing is invented)
- [ ] MVP scope is clearly delineated if applicable
- [ ] All user personas mentioned are defined
- [ ] **Coverage:** [X]/[Y] brief scope items mapped to ≥1 FR-NNN — target: 100%
- [ ] **NFR dimensions:** performance, availability, security, scalability, maintainability — each has ≥1 NFR-NNN or explicitly N/A
- [ ] **Conflicts:** [N] unresolved contradictions — target: 0

**Gate question before merging:** *"Can we design a system from these requirements alone, without guessing?"*

---

## Stage 03 — System Design

**PR title format:** `agentic/<feature>/03-design: system design`

**Artifacts:** `design.md` (always) + `api-contracts.md` (only if an external API is required)

- [ ] Architecture diagram or description is clear at the component level
- [ ] Every component has a defined responsibility and boundary
- [ ] Data model covers all entities mentioned in requirements
- [ ] Relationships between entities are defined (one-to-many, etc.)
- [ ] `api-contracts.md` present if the feature exposes an external API; explicitly N/A otherwise
- [ ] API contracts include: endpoint, method, request schema, response schema, error codes
- [ ] Technology choices have documented rationale
- [ ] Non-functional requirements from SRS are addressed in the design (e.g. scalability approach)
- [ ] Security considerations are addressed (auth, input validation, data protection)
- [ ] Every FR-NNN from SRS is traceable to at least one design element
- [ ] **FR coverage:** [X]/[Y] FR-NNN traced to ≥1 COMP-NN or API-NNN — target: 100%
- [ ] **Component completeness:** [X]/[Y] COMP-NN have defined responsibility, interface, and error handling — target: 100%
- [ ] **API completeness:** [X]/[Y] API-NNN have request schema, response schema, and error codes — target: 100% (or N/A)

**Gate question before merging:** *"Can a developer implement this system from these docs without asking architectural questions?"*

---

## Stage 04 — Implementation Planning

**PR title format:** `agentic/<feature>/04-planning: implementation plan`

**Artifact:** `plan.md` (task list, dependency graph, and implementation order in one document)

- [ ] Every task has: ID, title, description, acceptance criteria, dependencies, effort estimate
- [ ] Task granularity is appropriate — each task is implementable in a single focused session
- [ ] Every design component maps to at least one task
- [ ] Dependencies between tasks are explicit and form no cycles
- [ ] Implementation order is justified — not arbitrary
- [ ] The first tasks are unblocked and actionable immediately
- [ ] Edge cases and error handling are tasked explicitly (not assumed)
- [ ] Coverage check confirms every FR-NNN and COMP-NN maps to at least one task
- [ ] **Story coverage:** [X]/[Y] FR-NNN mapped to ≥1 US-NNN — target: 100%
- [ ] **Task coverage:** [X]/[Y] COMP-NN and API-NNN mapped to ≥1 TASK-NNN — target: 100%
- [ ] **Dependency cycles:** [N] cycles found — target: 0

**Gate question before merging:** *"Can we start implementing task TASK-001 right now without further discussion?"*

---

## Stage 05 — Implementation

**PR title format:** `agentic/<feature>/05-impl: TASK-NNN [task title]`
*(One PR per task or logical group of closely related tasks)*

- [ ] Code implements exactly what TASK-NNN defines — no more, no less
- [ ] Code matches the design in design.md
- [ ] Naming conventions are consistent with the codebase
- [ ] No hardcoded values that should be configuration
- [ ] Error cases described in the task are handled
- [ ] Code is readable — logic is not obscured
- [ ] No obvious security issues (injection, unvalidated input at boundaries, etc.)
- [ ] The task's acceptance criteria are all met

**Gate question before merging:** *"Does this code do what TASK-NNN says it should do, and nothing else?"*

---

## Stage 06 — Testing

**PR title format:** `agentic/<feature>/06-testing: test suite`

- [ ] Test plan defines: scope, types of tests, tools, coverage targets
- [ ] Every FR-NNN has at least one test case (TC-NNN)
- [ ] Happy path AND error/edge cases are covered
- [ ] Tests are independent — no test depends on the side effects of another
- [ ] Test names clearly describe what they verify
- [ ] All tests pass
- [ ] Coverage meets the target defined in the test plan
- [ ] Test results document is complete and honest — failures are not hidden
- [ ] **FR test coverage:** [X]/[Y] FR-NNN have ≥1 TC-NNN — target: 100%
- [ ] **Error path coverage:** [X]/[Y] TC-NNN are error or edge-case tests — target: ≥25%
- [ ] **Test results:** [X] passing, [Y] failing — target: 0 failing

**Gate question before merging:** *"If these tests pass, are we confident the feature works correctly?"*

---

## Stage 07 — Review & Validation

**PR title format:** `agentic/<feature>/07-review: review report`

**Artifact:** `review-report.md` (includes embedded requirements traceability matrix)

**Phase 1 — Structural Completeness** *(verify before approving Phase 2)*
- [ ] Traceability matrix built — every FR-NNN and NFR-NNN has an entry
- [ ] **Traceability completeness:** [X]/[Y] FR-NNN at FULL status — list any PARTIAL or NOT COVERED
- [ ] **NFR traceability:** [X]/[Y] NFR-NNN verified — list any unverified
- [ ] **Open items resolved:** [X]/[Y] OI-NNN from all stages have a disposition (resolved / deferred / accepted risk)
- [ ] Any coverage gaps explicitly decided: closed, deferred, or accepted as risk

**Phase 2 — Quality Assessment**
- [ ] Implementation vs. design comparison complete — deviations documented
- [ ] Test quality assessed — superficial or missing coverage flagged
- [ ] No requirements are untested without explicit justification
- [ ] No code exists that is not traceable to a requirement
- [ ] Design deviations section is complete and honest
- [ ] Sign-off recommendation is clear and not rubber-stamped
- [ ] The feature is genuinely ready — or "DO NOT APPROVE" is stated with required actions

**Gate question before merging:** *"Would you be comfortable deploying this feature to production?"*
