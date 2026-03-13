# Stage 08 — Support Handover

## Purpose

Produce a complete operations manual that enables support team to own the feature
from day one — without needing to ask the engineering team basic questions.
This is a practical, operator-facing document: it covers how to use the feature,
how to configure and deploy it, how to monitor it, and what to do when things
go wrong.

This stage is not a summary of the build process. It is written for the people
who will run and support the feature in production.

---

## Inputs

| Artifact | Source | Required |
|----------|--------|----------|
| `project-brief.md` | Stage 01, APPROVED | Yes |
| `SRS.md` | Stage 02, APPROVED | Yes |
| `use-cases.md` | Stage 02, APPROVED | Yes |
| `design.md` | Stage 03, APPROVED | Yes |
| `plan.md` | Stage 04, APPROVED | Yes |
| Source code | Stage 05, APPROVED | Yes |
| `test-results.md` | Stage 06, APPROVED | Yes |
| `review-report.md` | Stage 07, APPROVED | Yes |

---

## Output

| Artifact | Path |
|----------|------|
| `operations-manual.md` | `.agentic/features/<feature>/artifacts/08-handover/operations-manual.md` |

---

## Process

### Step 1 — Read everything

Read all approved artifacts before writing anything. Pay particular attention to:
- Non-functional requirements (SRS) — these become monitoring targets
- Design components and their failure modes
- Any deferred open items from the review report
- Known limitations accepted at sign-off

### Step 2 — Audience check question pass

Ask the engineer (one pass only, batch all questions):

1. **Audience** — Who is the support team? Are they engineers, non-technical
   operators, or a mix? This sets the technical depth of the document.
2. **Configuration** — What is configurable post-deploy (feature flags, env vars,
   admin settings)? Are there values that require operator attention at launch?
3. **Deployment specifics** — Any manual steps (migrations, cache primes, DNS
   changes, third-party provisioning) required at first deploy or on updates?
4. **Runbook exists?** — Is there an existing runbook or monitoring setup this
   feature should integrate into? Reference it rather than duplicate it.
5. **Rollback procedure** — What is the expected rollback path if the feature
   causes issues in production? Feature flag toggle? DB migration revert?

If the engineer says "proceed with your best judgment", document your assumptions
clearly in the manual's Assumptions section.

### Step 3 — Delegate to `handover-writer`

After receiving engineer answers from the question pass, invoke the
`handover-writer` specialist to produce `operations-manual.md`.

Construct the brief using inputs from this stage (see main agent delegation
section: "Stage 08 — Invoking `handover-writer`").

**The specialist handles:** reading all prior artifacts, extracting configuration
items, failure modes, and monitoring signals from NFR-NNN, converting use-case
flows into user guide steps, writing all nine sections of the operations manual,
and marking gaps as `[REQUIRES INPUT FROM: ...]` where information is unavailable.

### Step 4 — Present for engineer approval

After the specialist returns, verify all nine sections are present, then present
a summary to the engineer:
- Who this document is written for (audience confirmed)
- Gap count: how many `[REQUIRES INPUT FROM: ...]` markers remain and in which sections
- Engineer decides: fill gaps now, or accept gaps with noted follow-up actions
- Filled-in Stage 08 review checklist (from Protocol 4)

**Wait for explicit engineer approval before marking the feature complete.**

---

## Done Criteria

- [ ] `operations-manual.md` written with all nine sections
- [ ] Written for the correct audience (technical depth matches support team)
- [ ] Every configurable setting is documented with its default and valid range
- [ ] Deployment steps are clear and ordered — no assumed knowledge
- [ ] At least one troubleshooting entry per significant failure mode in the design
- [ ] Rollback procedure is documented and does not require guesswork
- [ ] Any gaps requiring support team input are explicitly marked `[REQUIRES INPUT FROM: <role>]`
- [ ] Stage 08 review checklist presented and all items addressed
- [ ] Engineer explicitly approves
- [ ] `state.yaml` updated: `stage_08: approved`, `feature_status: complete`

---

## Communication Protocol

### Formal Inputs

| Artifact | Source | Status Required | Used For |
|----------|--------|-----------------|----------|
| `project-brief.md` | Stage 01 | APPROVED | Feature scope and business context for overview section |
| `SRS.md` | Stage 02 | APPROVED | NFRs become monitoring targets; FRs inform user guide |
| `use-cases.md` | Stage 02 | APPROVED | User flows for the user guide section |
| `design.md` | Stage 03 | APPROVED | Component failure modes for troubleshooting; Section 4 for interface reference |
| `plan.md` | Stage 04 | APPROVED | Task list to confirm all components are covered |
| Source code | Stage 05 | APPROVED | Configuration keys, env vars, and deployment steps |
| `test-results.md` | Stage 06 | APPROVED | Known failure modes confirmed by testing |
| `review-report.md` | Stage 07 | APPROVED | Deferred open items and accepted risks to document |

### Formal Outputs

| Artifact | Path | Consumed By |
|----------|------|-------------|
| `operations-manual.md` | `artifacts/08-handover/operations-manual.md` | Support team |

### Pre-Stage Verification

Before beginning Stage 08, confirm:
1. `artifacts/07-review/review-report.md` exists and has `status: APPROVED`
2. `state.yaml` shows `stage_07: approved`
3. No blocking open items remain unresolved in the review report

If any check fails, stop and surface to engineer before proceeding.

---

## Common Failure Modes

- Writing an engineering post-mortem instead of an operator's guide
- Documenting how the feature was built rather than how to use and run it
- Leaving monitoring/alerting sections empty because "the platform handles it"
- Not documenting rollback because it "shouldn't be needed"
- Using internal jargon or acronyms without explanation
- Describing edge-case behaviour without giving the operator a clear action
