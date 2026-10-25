# Stage checklists

Use **General** plus the current stage. Mark each item `[PASS]`, `[FAIL]`, or `[N/A — reason]`,
and compute every metric by counting.

## General (all stages)

- [ ] Artifact header complete (title, feature, version, status=REVIEW, dates)
- [ ] Required sections present (Purpose, Scope, Inputs, Assumptions & Decisions, Open Items, Change Log)
- [ ] No vague language; every open item is in Open Items with an `OI-NNN`
- [ ] IDs follow the scheme in `ase-artifacts`
- [ ] Decisions documented with rationale
- [ ] Cross-feature references marked as informational only
- [ ] The agent's questions are answered, or their defaults accepted
- [ ] No unresolved `[BLOCKING]` items

## Stage 01 — Intake

- [ ] Purpose stated in one paragraph
- [ ] In-scope and out-of-scope both explicit
- [ ] Success criteria measurable
- [ ] Stakeholders / users identified
- [ ] Constraints listed (tech, time, team, regulatory)
- [ ] Risks identified
- [ ] Brief reflects the engineer's intent, not the agent's interpretation

**Approval question:** *"If a new engineer read only this brief, would they understand what we're building and why?"*

## Stage 02 — Requirements

- [ ] Every FR-NNN has a description and ≥2 Given/When/Then scenarios
- [ ] NFRs specific and measurable, with units
- [ ] Use cases cover happy path plus alternative and error flows
- [ ] Edge cases explicit
- [ ] No contradictions, or each one flagged `[OPEN]`
- [ ] Every requirement traces to the brief (nothing invented)
- [ ] MVP scope delineated (if applicable)
- [ ] Personas defined
- [ ] **Coverage:** [X]/[Y] brief scope items → ≥1 FR — target 100%
- [ ] **NFR dimensions:** performance, availability, security, scalability, maintainability each have ≥1 NFR or are explicitly N/A
- [ ] **Conflicts:** [N] unresolved — target 0

**Approval question:** *"Can we design a system from these requirements alone, without guessing?"*

## Stage 03 — Design

- [ ] Architecture described at component level (diagram or equivalent)
- [ ] Every component has a responsibility and boundary
- [ ] Data model covers entities, relationships, lifecycle
- [ ] Technology choices have rationale
- [ ] NFRs addressed
- [ ] Security addressed (auth, authz, encryption, input validation, secrets); `security-reviewer` HIGH findings fixed
- [ ] Every FR traces to ≥1 design element
- [ ] Section 4 interface contracts complete, or explicitly N/A
- [ ] ADR assessment done; ADRs researched and written for qualifying decisions, or "none qualify" stated
- [ ] KB consulted (`ase-kb-search`); relevant entries cited or departures justified
- [ ] Constitution check results recorded; every exception has an ADR (or N/A)
- [ ] `design-reviewer` verdict READY FOR ENGINEER
- [ ] **FR coverage:** [X]/[Y] FR → ≥1 COMP/API — target 100%
- [ ] **Component completeness:** [X]/[Y] COMP with responsibility, interface, error handling — target 100%
- [ ] **API completeness:** [X]/[Y] API with request, response, error codes — target 100% (or N/A)

**Approval question:** *"Can a developer implement this system from design.md alone without asking architectural questions?"*

## Stage 04 — Planning

- [ ] Cross-artifact consistency check passed (FR↔design, interfaces, ADRs, open items)
- [ ] Every FR → ≥1 user story; stories in canonical form with a Definition of Done
- [ ] Every story subtask references a TASK-NNN
- [ ] Every task has ID, description, design reference, acceptance criteria, dependencies, effort, risk
- [ ] Task granularity fits a single focused session
- [ ] Every component, entity, endpoint → ≥1 task; error handling has explicit tasks
- [ ] `tasks.json` matches `plan.md` 1:1; every task has `owns`, `verify`, `agent`, `tier`, `wave`
- [ ] Graph checks pass (`ase-planning` "Task graph rules"): deps exist, no cycles, deps in earlier waves, no conflicts within a wave, wave size ≤ `max_parallel`
- [ ] KB consulted; known gotchas turned into acceptance criteria or tasks
- [ ] **Story coverage:** [X]/[Y] FR → ≥1 US — target 100%
- [ ] **Task coverage:** [X]/[Y] COMP and API → ≥1 TASK — target 100%
- [ ] **Parallelism:** [W] waves for [T] tasks (lower W/T means more parallelism)

**Approval question:** *"Can the build start on wave 1 right now without further discussion?"*

## Stage 05 — Build

- [ ] Every task `done` with a merged commit, or `blocked` with an engineer decision
- [ ] Every done task has an independent `APPROVED` review
- [ ] Every report records red-then-green evidence and a passing verify command
- [ ] No edits outside `owns` without a recorded ruling
- [ ] Final `verify_command` passes on the branch head
- [ ] Panel ran; every P1 fixed; every P2 fixed or accepted
- [ ] Design deviations declared and dispositioned
- [ ] Ledger complete; blackboard holds every report's interfaces and discoveries
- [ ] **Tasks:** [X]/[Y] done · **Fix rounds:** [N] · **Panel:** [P1]/[P2]/[P3] found, [fixed]/[accepted]

**Approval question:** *"Is every task independently reviewed, merged, and green, and are the panel findings resolved?"*

## Stage 06 — Acceptance testing

- [ ] Test plan defines scope, types, tools, coverage targets
- [ ] Every FR → ≥1 TC-NNN derived from its scenarios
- [ ] Happy and error/edge paths covered
- [ ] Tests independent; names describe behaviour
- [ ] All tests pass; coverage meets target
- [ ] Results complete and honest
- [ ] **FR test coverage:** [X]/[Y] — target 100%
- [ ] **Error path share:** [X]/[Y] TC are error/edge — target ≥25%
- [ ] **Results:** [X] passing, [Y] failing — target 0 failing

**Approval question:** *"If these tests pass, are we confident the feature works correctly?"*

## Stage 07 — Review

**Phase 1 — Structural completeness** *(engineer acknowledges before Phase 2)*
- [ ] Traceability matrix: every FR and NFR has an entry
- [ ] **Traceability:** [X]/[Y] FR at FULL; PARTIAL / NOT COVERED listed
- [ ] **NFR:** [X]/[Y] verified
- [ ] **Open items:** [X]/[Y] OI have a disposition
- [ ] Engineer acknowledged Phase 1 and decided on gaps

**Phase 2 — Quality**
- [ ] Implementation vs design compared; Stage 05 panel dispositions verified
- [ ] Test quality assessed
- [ ] No untested requirement without justification; no untraceable code
- [ ] Security review available (panel reused or re-run); HIGH findings resolved or accepted
- [ ] Constitution check complete; undocumented exceptions flagged
- [ ] Sign-off recommendation honest

**Approval question:** *"Would you be comfortable deploying this feature to production?"*

## Stage 08 — Handover + Compound

- [ ] Written for the confirmed audience
- [ ] Overview explains ops impact
- [ ] User guide covers primary workflows
- [ ] Every setting documented with default and valid range
- [ ] Deployment steps complete and ordered; post-deploy verification included
- [ ] ≥1 troubleshooting entry per significant failure mode
- [ ] Rollback specific and actionable
- [ ] Known limitations carried over from the review
- [ ] Gaps marked `[REQUIRES INPUT FROM: <role>]`
- [ ] Compound run: KB updated, index current, promotions presented, `pipeline-feedback.md` written

**Approval question:** *"Could the support team deploy and support this feature from day one using only this document?"*
