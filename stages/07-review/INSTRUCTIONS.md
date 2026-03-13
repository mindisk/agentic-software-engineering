# Stage 07 — Review & Validation

## Purpose

Provide a complete, honest assessment of the feature from specification through
to implementation and testing. Verify every requirement was designed, implemented,
and tested. Surface any gaps that remain.

This stage is not a rubber stamp.

---

## Inputs

| Artifact | Source | Required |
|----------|--------|----------|
| `project-brief.md` | Stage 01, APPROVED | Yes |
| `SRS.md` | Stage 02, APPROVED | Yes |
| `use-cases.md` | Stage 02, APPROVED | Yes |
| `design.md` | Stage 03, APPROVED | Yes — Section 4 used for interface contract compliance check |
| `adr/adr-NNNN-*.md` | Stage 03, APPROVED | If present — verify exceptions were honoured |
| `plan.md` | Stage 04, APPROVED | Yes |
| Source code | Stage 05, all tasks APPROVED | Yes |
| `test-plan.md` | Stage 06, APPROVED | Yes |
| `test-results.md` | Stage 06, APPROVED | Yes |
| Implementation notes | Stage 05, per task | Yes |
| `.agentic/constitution.md` | Product repo | If present — required for constitutional compliance check |

---

## Output

| Artifact | Path |
|----------|------|
| `review-report.md` | `.agentic/features/<feature>/artifacts/07-review/review-report.md` |

The review report contains both the narrative assessment and the full requirements
traceability matrix in a single document.

---

## Process

This stage runs in two sequential phases. Phase 2 begins only after the engineer
explicitly acknowledges Phase 1 findings. The two phases address different questions:
- **Phase 1** — *Is everything here?* (completeness)
- **Phase 2** — *Is everything good?* (quality)

Separating them prevents quality praise from masking structural gaps, and structural
completeness from masking quality problems.

---

### Phase 1 — Structural Completeness

#### Step 1 — Read everything

Read all artifacts from all prior stages before writing anything. Build a full
picture of what was planned, what was built, and how it was tested.

#### Step 2 — Build the traceability matrix

For every FR-NNN and NFR-NNN in the SRS, trace it through:
- Which design element (COMP-NN, API-NNN, entity) addresses it
- Which TASK-NNN implemented it
- Which TC-NNN verifies it
- Status: `FULL` / `PARTIAL` / `NOT COVERED`

Any requirement not fully traced is a gap. Document it explicitly — do not skip
or minimise gaps.

Compute coverage score: [X]/[Y] FR-NNN at `FULL` status.

#### Step 3 — Resolve open items

Collect every OI-NNN from every artifact across all stages.
For each, determine: `RESOLVED` (how?) / `DEFERRED` (to when?) / `STILL OPEN` (blocking sign-off?).

#### Step 4 — Present Phase 1 to engineer

Present to the engineer:
- Traceability coverage score: [X]/[Y] FR-NNN fully traced
- List of any PARTIAL or NOT COVERED requirements
- Open items disposition: [X] resolved, [Y] deferred, [Z] still open
- Phase 1 sub-checklist (see Protocol 4 Stage 07 below)

**Wait for explicit engineer acknowledgement before beginning Phase 2.**

If coverage is below 100% or blocking open items remain, the engineer decides:
- Return to the relevant stage to close the gap, or
- Accept the gap as a documented risk and proceed

Do not begin Phase 2 until this decision is made and recorded.

---

### Phase 2 — Quality Assessment

#### Step 5 — Review implementation against design

Compare implementation notes and code against the approved design.md. Flag:
- Deviations not reviewed during Stage 05
- Architectural decisions made during implementation without approval
- Missing error handling specified in the design
- Interface behaviour that differs from the contracts in design.md Section 4

#### Step 6 — Assess test quality

Review test-plan.md and test-results.md. Flag:
- Tests that cover the happy path only
- Acceptance criteria with no corresponding test
- Tests that passed trivially (testing nothing meaningful)
- Any failures hidden or glossed over in results

#### Step 7 — Security review and constitutional compliance check

##### Step 7a — Invoke `security-reviewer` (Mode: implementation)

Invoke the `security-reviewer` specialist (see main agent — Stage 07 Phase 2b delegation)
in **Mode B (implementation)** to review the completed source code.
The specialist checks OWASP Top 10 (A01–A05), design-vs-implementation security gaps,
hardcoded secrets, and constitution compliance for security articles.

Receive security findings. Any HIGH severity findings are blocking gaps in Phase 2.
The engineer must either fix the violation or accept it as a documented risk before sign-off.

##### Step 7b — Constitutional compliance check (if constitution loaded)

If `.agentic/constitution.md` exists, run the constitution check against the completed
implementation. For each article, assess:

- `COMPLIANT` — implementation follows the rule
- `EXCEPTION` — implementation violates the article; check that an approved ADR covers it
- `N/A` — article does not apply to this feature

**An undocumented exception is a defect.** If the implementation violates a constitution
article and no ADR covers it, flag it as a blocking gap in Phase 2. The engineer must
either produce a retrospective ADR or fix the violation before sign-off.

Record the full compliance table in `review-report.md`.

#### Step 8 — Write review-report.md

Use the template at `stages/07-review/templates/review-report.md`.

Complete all sections:
1. Feature summary
2. Pipeline summary
3. Requirements traceability matrix (FR + NFR + use cases) — built in Phase 1
4. Test results summary — from Phase 2 quality assessment
5. Design deviations
6. Constitutional compliance table (if constitution loaded; N/A otherwise)
7. Open items status — from Phase 1
8. Remaining risks
9. Sign-off recommendation — honest, not rubber-stamped

#### Step 9 — Present Phase 2 and full review report for engineer sign-off

Present to the engineer:
- Design deviation summary (if any)
- Test quality assessment
- Constitutional compliance table (if constitution loaded)
- Remaining risks
- Sign-off recommendation with honest rationale
- Full Stage 07 checklist (both phases, all items filled in)

The engineer's explicit approval of the full review report is the formal sign-off
on the feature.

---

## Done Criteria

**Phase 1 — Structural Completeness**
- [ ] Traceability matrix built — every FR-NNN and NFR-NNN has an entry
- [ ] Coverage score computed and presented ([X]/[Y] at FULL status)
- [ ] Every OI-NNN from all prior stages has a disposition
- [ ] Engineer has explicitly acknowledged Phase 1 findings and any coverage gaps

**Phase 2 — Quality Assessment**
- [ ] Implementation vs. design comparison complete — deviations documented
- [ ] Test quality assessed — superficial or missing coverage flagged
- [ ] `security-reviewer` invoked (Mode B) — HIGH findings resolved or accepted as documented risk
- [ ] Constitutional compliance check run — all articles assessed, undocumented exceptions flagged
- [ ] `review-report.md` written with all sections
- [ ] No gaps hidden — all gaps documented honestly
- [ ] Honest sign-off recommendation given
- [ ] Stage 07 full checklist (both phases) presented and all items addressed
- [ ] Engineer explicitly approves the full review report
- [ ] `state.yaml` updated: `current_stage: 8`, `stage_07: approved`

---

## Communication Protocol

### Formal Inputs

| Artifact | Source | Status Required | Used For |
|----------|--------|-----------------|----------|
| `project-brief.md` | Stage 01 | APPROVED | Original intent to validate against |
| `SRS.md` | Stage 02 | APPROVED | Requirements source for traceability matrix |
| `use-cases.md` | Stage 02 | APPROVED | Flow coverage validation |
| `design.md` | Stage 03 | APPROVED | Baseline for implementation comparison; Section 4 for interface contract compliance |
| `adr/adr-NNNN-*.md` | Stage 03 | APPROVED (if exists) | Verify constitution exceptions were documented |
| `user-stories.md` | Stage 04 | APPROVED | Story coverage check |
| `plan.md` | Stage 04 | APPROVED | Task completion baseline |
| Source code + `TASK-NNN-notes.md` | Stage 05 | APPROVED | Implementation to assess |
| `test-plan.md` | Stage 06 | APPROVED | Testing strategy and coverage targets |
| `test-results.md` | Stage 06 | APPROVED | Honest results to verify |

### Formal Outputs

| Artifact | Path | Consumed By |
|----------|------|-------------|
| `review-report.md` | `artifacts/07-review/review-report.md` | Stage 08 |

### Pre-Stage Verification

Before beginning Stage 07, confirm:
1. All prior stage artifacts exist and have `status: APPROVED`
2. `state.yaml` shows `stage_06: approved`
3. All Stage 05 tasks are marked complete

If any check fails, stop and surface to engineer before proceeding.

---

## Common Failure Modes

- Rubber-stamping sign-off when gaps exist
- Skipping the implementation-vs-design comparison
- Marking requirements as covered when the test is superficial
- Leaving open items from prior stages unaddressed without an explicit decision
