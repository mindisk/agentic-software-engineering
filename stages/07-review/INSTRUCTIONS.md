# Stage 07 — Review & Validation

## Purpose

Provide a complete, honest assessment of the feature from specification through
to implementation and testing. Verify every requirement was designed, implemented,
and tested. Surface any gaps that remain.

This is the final stage. It is not a rubber stamp.

---

## Inputs

| Artifact | Source | Required |
|----------|--------|----------|
| `project-brief.md` | Stage 01, APPROVED | Yes |
| `SRS.md` | Stage 02, APPROVED | Yes |
| `use-cases.md` | Stage 02, APPROVED | Yes |
| `design.md` | Stage 03, APPROVED | Yes |
| `plan.md` | Stage 04, APPROVED | Yes |
| Source code | Stage 05, all tasks APPROVED | Yes |
| `test-plan.md` | Stage 06, APPROVED | Yes |
| `test-results.md` | Stage 06, APPROVED | Yes |
| Implementation notes | Stage 05, per task | Yes |

---

## Output

| Artifact | Path |
|----------|------|
| `review-report.md` | `.agentic/features/<feature>/artifacts/07-review/review-report.md` |

The review report contains both the narrative assessment and the full requirements
traceability matrix in a single document.

---

## Process

### Step 1 — Read everything

Read all artifacts from all prior stages. Build a complete picture of what was
planned, what was built, and how well it was tested before writing anything.

### Step 2 — Build traceability

For every FR-NNN and NFR-NNN in the SRS, trace it through:
- Which design element (component, API, entity) addresses it
- Which task(s) implemented it
- Which test case(s) verify it
- Status: FULL / PARTIAL / NOT COVERED

Any requirement not fully traced is a gap. Document it explicitly.

### Step 3 — Review implementation against design

Compare implemented code (from implementation notes) against
the approved design. Flag:
- Deviations that were not reviewed
- Architectural decisions made during implementation without approval
- Missing error handling
- API responses that differ from design.md

### Step 4 — Resolve open items

Collect all OI-NNN items from all artifacts.
For each: resolved (how?), deferred (to when?), or still open (blocking sign-off?).

### Step 5 — Write review-report.md

Use the template at `stages/07-review/templates/review-report.md`.

Complete all eight sections:
1. Feature summary
2. Pipeline summary
3. Requirements traceability (FR + NFR + use cases)
4. Test results summary
5. Design deviations
6. Open items status
7. Remaining risks
8. Sign-off recommendation

### Step 6 — Present review report for engineer sign-off

Present a summary to the engineer:
- Requirements coverage (X/Y fully covered, any gaps)
- Test results summary
- Design deviations (if any)
- Open items status
- Sign-off recommendation with honest rationale
- Filled-in Stage 07 review checklist (from Protocol 4)

The engineer's explicit approval of the review report is the formal sign-off on the feature.

---

## Done Criteria

- [ ] `review-report.md` written with all eight sections
- [ ] Traceability covers every FR-NNN and NFR-NNN
- [ ] All gaps documented — none hidden
- [ ] All open items accounted for
- [ ] Honest sign-off recommendation given
- [ ] Stage 07 review checklist presented and all items addressed
- [ ] Engineer explicitly approves — feature complete
- [ ] `state.yaml` updated: `stage_07: approved`, `feature_status: complete`

---

## Common Failure Modes

- Rubber-stamping sign-off when gaps exist
- Skipping the implementation-vs-design comparison
- Marking requirements as covered when the test is superficial
- Leaving open items from prior stages unaddressed without an explicit decision
