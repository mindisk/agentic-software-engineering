# Stage 08 — Liveops Handover

## Purpose

Produce a complete operations manual that enables liveops to own the feature
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
| `api-contracts.md` | Stage 03, APPROVED | If it exists |
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

1. **Audience** — Who is the liveops team? Are they engineers, non-technical
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

### Step 3 — Write operations-manual.md

Use the template at `stages/08-handover/templates/operations-manual.md`.

Complete all nine sections:
1. **Feature overview** — what it does, who uses it, and why it matters to ops
2. **User guide** — step-by-step: how end users interact with the feature
3. **Configuration** — all configurable settings, defaults, required values
4. **Deployment & activation** — how to deploy, enable, and verify the feature
5. **Monitoring** — key metrics, dashboards, log patterns to watch
6. **Alerting** — what alerts exist, their thresholds, and expected response
7. **Troubleshooting** — known failure modes, symptoms, and resolution steps
8. **Rollback** — how to safely disable or revert the feature
9. **Known limitations & contacts** — accepted gaps and who to escalate to

Write plainly. Avoid jargon where possible. If the audience is non-technical,
use numbered steps and screenshots/diagrams rather than code blocks. If technical,
code examples are appropriate.

### Step 4 — Present for engineer approval

Present a summary to the engineer:
- Who this document is written for (assumed audience)
- Any gaps where information was not available from prior artifacts (document as
  `[REQUIRES INPUT FROM: <role>]` in the manual rather than guessing)
- Filled-in Stage 08 review checklist (from Protocol 4)

**Wait for explicit engineer approval before marking the feature complete.**

---

## Done Criteria

- [ ] `operations-manual.md` written with all nine sections
- [ ] Written for the correct audience (technical depth matches liveops team)
- [ ] Every configurable setting is documented with its default and valid range
- [ ] Deployment steps are clear and ordered — no assumed knowledge
- [ ] At least one troubleshooting entry per significant failure mode in the design
- [ ] Rollback procedure is documented and does not require guesswork
- [ ] Any gaps requiring liveops input are explicitly marked `[REQUIRES INPUT FROM: <role>]`
- [ ] Stage 08 review checklist presented and all items addressed
- [ ] Engineer explicitly approves
- [ ] `state.yaml` updated: `stage_08: approved`, `feature_status: complete`

---

## Common Failure Modes

- Writing an engineering post-mortem instead of an operator's guide
- Documenting how the feature was built rather than how to use and run it
- Leaving monitoring/alerting sections empty because "the platform handles it"
- Not documenting rollback because it "shouldn't be needed"
- Using internal jargon or acronyms without explanation
- Describing edge-case behaviour without giving the operator a clear action
