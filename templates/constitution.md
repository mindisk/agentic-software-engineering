---
title: "Project Constitution"
version: 1.0.0
ratified: YYYY-MM-DD
authors: []
---

# Project Constitution

This document captures the non-negotiable principles that govern how this project is built.
Every feature, design decision, and implementation choice must be consistent with these
articles — or produce an explicit ADR explaining why an exception is warranted.

The constitution is written once and maintained deliberately. It is not a requirements
document. It does not describe features. It describes the kind of project this is and
the values the team will not compromise on.

---

## Articles

<!--
  CATEGORY GUIDE — consider covering each of these domains.
  You do not need one article per domain, but a constitution with no article in a domain
  means the pipeline has no governance there. Aim for 5–9 articles total.

  Domains:
  1. Testing strategy    — mocks vs real, coverage floors, test types required
  2. Security            — secrets handling, auth requirements, input validation
  3. Complexity limits   — max services/layers/dependencies, no over-engineering rules
  4. Dependencies        — allowed/forbidden libraries, version policy, vendoring
  5. Observability       — what must always be logged, monitored, or traced
  6. Data                — ownership, retention, deletion, migration policy
  7. API contracts       — versioning, breaking-change policy, documentation requirements
  8. Tooling & stack     — locked-in language versions, frameworks, build tools
-->

---

<!--
  EXAMPLE ARTICLE — fully worked, showing the right level of specificity.
  Delete or replace this once you have written your own articles.

### Article 0: Integration-First Testing (EXAMPLE — DELETE WHEN DONE)

**Rule:** Tests MUST NOT mock the database, message queue, or any external service
that the team operates. Use real instances (local or containerised) in all test suites.

**Rationale:** Mocked infrastructure tests the mock, not the system. We have had multiple
incidents where mocked tests passed while a real migration or schema change broke production.
The cost of spinning up a real dependency in CI is lower than the cost of false confidence.

**How to check:** Review test files for mock/stub/fake patterns against owned infrastructure.
Any `mock_db`, `FakeQueue`, or `patch('database')` targeting internal services is a violation.
Third-party APIs the team does not operate (e.g. Stripe, Twilio) MAY be mocked.

**check_at:** implementation, review
-->

---

### Article 1: [Principle Name]

**Rule:** [One clear, checkable statement. Use MUST/SHALL/NEVER.]

**Rationale:** [Why this matters to this project specifically. What has gone wrong, or
will go wrong, without this rule.]

**How to check:** [Concrete, specific criteria. What does the agent look for in the
artifact or code? What is the pass/fail signal?]

**check_at:** [design | implementation | review | all]

---

### Article 2: [Principle Name]

**Rule:** [One clear, checkable statement.]

**Rationale:** [Why this matters.]

**How to check:** [Specific verification criteria — not "review the code" but what to
look for specifically.]

**check_at:** [design | implementation | review | all]

---

### Article 3: [Principle Name]

**Rule:** [One clear, checkable statement.]

**Rationale:** [Why this matters.]

**How to check:** [Specific verification criteria.]

**check_at:** [design | implementation | review | all]

---

<!-- Add articles 4–9 following the same structure.
     Fewer strong articles beat many weak ones.
     If you cannot write a concrete "How to check", the rule is too vague to enforce. -->

---

## Exceptions

When a feature genuinely cannot comply with an article, the team may declare an exception.

**An exception is valid only if:**
- It is documented in an ADR before implementation begins
- The ADR names the article being violated (e.g. "Article 2 exception")
- The ADR explains why compliance is impossible or harmful in this specific case
- The engineer explicitly approves the exception at Stage 03 (ADR)

Undocumented violations are not exceptions — they are defects.

---

## Amendments

To amend this constitution:
1. Propose the change with rationale
2. Engineer reviews and approves
3. Update this file, increment the version, update `ratified` date
4. Apply to features based on their current state:

| Feature state at amendment time | Action required |
|----------------------------------|-----------------|
| Stage 01–03 (pre-design) | Apply fully — no re-work needed |
| Stage 04–07 (design through testing) | Run a constitution check against work done so far; surface any new conflicts to engineer before proceeding |
| Stage 08 (review) | Re-run constitutional compliance check against the full feature before sign-off |
| Stage 09 or complete | Log the amendment in `FINDINGS.md` for the feature; no re-work unless engineer requests |

If an amendment *tightens* a rule (makes it stricter), features currently in Stage 04–07
must be checked immediately. If an amendment *relaxes* a rule, no retroactive action needed.

---

## Change Log

| Version | Date       | Change        | Author  |
|---------|------------|---------------|---------|
| 1.0.0   | YYYY-MM-DD | Initial ratification | [author] |
