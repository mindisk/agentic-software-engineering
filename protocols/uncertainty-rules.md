# Uncertainty Rules

This protocol defines how agents classify and handle uncertainty during any stage.
The goal is to be self-aware about what is known, what is assumed, and what is unknown —
and to surface that awareness to the engineer rather than hiding it.

---

## Uncertainty Classification

### Type 1 — Missing Information
Information that is required to complete the stage but was not provided.

**Response:** Ask the engineer (follow question-protocol.md).
**Example:** Spec mentions a "dashboard" but gives no detail on what it shows.

---

### Type 2 — Ambiguous Specification
The provided information can be interpreted in multiple valid ways.

**Response:** Present interpretations as options and ask which is intended.
**Example:** "The system must be fast" — fast for a single user? 10k concurrent users?

---

### Type 3 — Technical Risk
A technically feasible decision has meaningful risk that the engineer should be aware of.

**Response:** Proceed with the lower-risk option, but document the risk prominently
in the artifact and flag it in the PR description.
**Example:** Choosing a specific database — note the tradeoffs of that choice.

---

### Type 4 — Conflicting Requirements
Two stated requirements cannot both be fully satisfied.

**Response:** ALWAYS surface this immediately. Do not silently pick one.
Present the conflict clearly and ask for resolution.
**Example:** "Must work offline" conflicts with "must sync in real-time."

---

### Type 5 — Scope Uncertainty
It is unclear whether something is in scope or out of scope.

**Response:** Ask if it is high-impact. If low-impact, mark as out of scope
with a note that it can be revisited, and document that assumption.
**Example:** The spec describes a web app — is a mobile app also expected?

---

### Type 6 — Reasonable Assumption
The answer is not given, but one answer is clearly more reasonable than alternatives
given context, conventions, or common sense.

**Response:** Make the assumption, proceed, and document it clearly:
`> Assumption: [X] — rationale: [Y]. Revisit if this is incorrect.`
Do NOT ask the engineer for Type 6 uncertainties unless they are high-impact.
**Example:** Using UTC for timestamps when no timezone policy is given.

---

## Decision Matrix

```
                        IMPACT
                   Low          High
               ┌──────────┬──────────────┐
        Low    │ Assume & │  Assume &    │
CONFIDENCE     │ document │  flag in PR  │
               ├──────────┼──────────────┤
        High   │  Ask     │  ALWAYS ask  │
               │ (low pri)│  (blocking)  │
               └──────────┴──────────────┘
```

---

## Documenting Uncertainty in Artifacts

Every artifact must have an **Assumptions & Decisions** section that lists:

```markdown
## Assumptions & Decisions

| ID   | Assumption / Decision | Rationale | Source | Confidence |
|------|-----------------------|-----------|--------|------------|
| A-01 | Single-tenant system  | Spec does not mention multi-tenancy | Default | Medium |
| D-01 | PostgreSQL for storage | Team has prior experience per brief | Engineer Q&A | High |
```

---

## What Agents Must Never Do

- Silently pick an interpretation without documenting it
- Proceed past a Type 4 (conflicting requirements) without resolution
- Ask a question that has already been answered in a prior stage
- Present uncertainty as certainty in artifact text
- Use vague language to paper over unknown details ("TBD", "as needed", "etc.")
  — instead, replace these with explicit open items tagged `[OPEN]`
