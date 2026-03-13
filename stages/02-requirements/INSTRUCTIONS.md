# Stage 02 — Requirements Engineering

## Purpose

Translate the approved project brief into a complete, unambiguous requirements specification.
The output of this stage must be detailed enough that system design can proceed without
returning to the engineer for clarification on what the feature must do.

Requirements must be traceable — every requirement must map back to something
in the project brief, and forward to design and test artifacts.

---

## Inputs

| Artifact | Source | Required |
|----------|--------|----------|
| `project-brief.md` | Stage 01, APPROVED | Yes |
| `state.yaml` | Current feature | Yes |
| Other feature artifacts | Cross-feature (context only) | No |

---

## Process

### Step 1 — Read and internalize the project brief

Read `project-brief.md` fully. Identify:
- All stated and implied functional behaviours
- All stated and implied quality/performance expectations
- All actors/users and their goals
- All integrations and external dependencies

### Step 2 — Early question pass (BEFORE writing requirements)

Following `protocols/question-protocol.md`, ask the engineer:

Focus areas for this stage:

1. **User personas depth** — Do we need detailed persona definitions, or is the brief sufficient?
2. **MVP boundary** — If not already defined, which requirements are MVP vs. future?
3. **Non-functional specifics** — Concrete targets for performance, availability, scalability, security
4. **Integration contracts** — What do external systems provide/expect?
5. **Edge cases at boundaries** — e.g. What happens at data limits, concurrent access, auth failures?
6. **Regulatory / compliance requirements** — Any specific standards to meet?

Do not proceed with writing until answers are received or defaults are accepted.

### Step 3 — Delegate to `requirements-analyst`

After receiving all answers from the engineer's question pass, invoke the
`requirements-analyst` specialist to produce `SRS.md` and `use-cases.md`.

Construct the brief using the inputs from this stage (see main agent delegation
section: "Stage 02 — Invoking `requirements-analyst`").

**The specialist handles:** extracting scope items, converting QA log answers
into requirements, writing all FR-NNN and NFR-NNN in OpenSpec format with
Given/When/Then scenarios, writing use-cases.md with UC-NNN flows and FR→UC
traceability, and running the constitution check for requirements-stage articles.

**If the specialist returns a REQUIREMENTS BLOCKER:** relay the question to the
engineer, record the answer in `qa_log`, re-invoke the specialist with the
updated QA log.

### Step 4 — Validate and present for engineer approval

After the specialist returns, verify:
- Every FR-NNN traces back to something in the project brief
- Every FR-NNN has at least two scenarios (happy path + error/edge case)
- NFRs have measurable targets with units (no "must be fast")
- FR→UC traceability table is present in use-cases.md
- Any constitution articles flagged as EXCEPTION are surfaced to the engineer

Present a summary to the engineer:
- Requirement count (X functional, Y non-functional, Z use cases)
- Assumptions the specialist made (each needs confirmation)
- Constitution compliance results (all COMPLIANT, or exceptions listed)
- Open items carried forward
- Filled-in Stage 02 review checklist (from Protocol 4)

**Wait for explicit engineer approval before proceeding to Stage 03.**

---

## Outputs

| Artifact | Path |
|----------|------|
| Software Requirements Specification | `.agentic/features/<feature>/artifacts/02-requirements/SRS.md` |
| Use Cases | `.agentic/features/<feature>/artifacts/02-requirements/use-cases.md` |

---

## Done Criteria

- [ ] `SRS.md` written with all FR-NNN and NFR-NNN defined
- [ ] Every FR-NNN uses RFC 2119 language (`SHALL`/`MUST`/`SHOULD`/`MAY`)
- [ ] Every FR-NNN has at least one Given/When/Then scenario; error paths are explicit scenarios
- [ ] `use-cases.md` written with primary and alternative flows
- [ ] All requirements traceable to `project-brief.md`
- [ ] No untestable requirements
- [ ] Stage 02 review checklist presented and all items addressed
- [ ] Engineer explicitly approves (artifact status updated to `APPROVED`)
- [ ] `state.yaml` updated: `current_stage: 3`, `stage_02: approved`

---

## Communication Protocol

### Formal Inputs

| Artifact | Source | Status Required | Used For |
|----------|--------|-----------------|----------|
| `project-brief.md` | Stage 01 | APPROVED | Source of all requirements |
| `state.yaml` | Current feature | Any | QA log, error log, stage status |

### Formal Outputs

| Artifact | Path | Consumed By |
|----------|------|-------------|
| `SRS.md` | `artifacts/02-requirements/SRS.md` | Stages 03, 04, 06, 07, 08 |
| `use-cases.md` | `artifacts/02-requirements/use-cases.md` | Stages 03, 06, 07, 08 |

### Pre-Stage Verification

Before beginning Stage 02, confirm:
1. `artifacts/01-intake/project-brief.md` exists and has `status: APPROVED`
2. `state.yaml` shows `stage_01: approved`

If either check fails, stop and surface to engineer before proceeding.

---

## Common Failure Modes to Avoid

- Writing implementation details in requirements ("the system shall use Redis to cache...")
- Vague non-functional requirements ("must be performant", "should be secure")
- Missing the alternative and error flows in use cases
- Requirements that cannot be tested or verified
- Inventing requirements not supported by the project brief
- Conflating user stories with requirements — they complement each other, not replace
