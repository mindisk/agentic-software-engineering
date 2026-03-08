# Stage 03 — System Design

## Purpose

Translate approved requirements into a concrete system design that developers
can implement directly. Every design decision must be justified. Every requirement
must be traceable to at least one design element.

---

## Inputs

| Artifact | Source | Required |
|----------|--------|----------|
| `project-brief.md` | Stage 01, APPROVED | Yes |
| `SRS.md` | Stage 02, APPROVED | Yes |
| `use-cases.md` | Stage 02, APPROVED | Yes |

Cross-reference other features' approved design artifacts for context if relevant —
mark clearly as `> Context reference:` and never list as a formal input.

---

## Output

| Artifact | Path | Notes |
|----------|------|-------|
| `design.md` | `.agentic/features/<feature>/artifacts/03-design/design.md` | Always |
| `api-contracts.md` | `.agentic/features/<feature>/artifacts/03-design/api-contracts.md` | Only if the feature exposes an external API |

One document covers architecture, component design, data model, and (for internal
interactions) API contracts. A separate `api-contracts.md` is only warranted when
the feature introduces an API that external consumers will integrate against.

---

## Process

### Step 1 — Read all inputs

Read all approved artifacts. Cross-reference requirements against use cases.
Build a full picture of what the system must do before asking any questions.

### Step 2 — Early question pass

Ask before designing anything:

1. **Existing tech stack** — What languages, frameworks, databases are already in use?
   Must this feature conform to existing patterns?
2. **Deployment environment** — Cloud, on-prem, serverless, container?
   Any constraints on what can be introduced?
3. **Scale targets** — Confirm NFR numbers. These drive architecture decisions.
4. **External API?** — Does this feature need to expose an API for other systems
   or clients to consume? (Determines whether api-contracts.md is needed.)
5. **Security model** — What auth/authz pattern is in place or required?
6. **Data ownership** — Who owns the data this feature produces?
   Retention and deletion policy?

### Step 3 — Write design.md

Use the template at `stages/03-design/templates/design.md`.

Cover all six sections in order:
1. **Architecture** — components, diagram, primary and error data flows
2. **Component design** — responsibility, interface, dependencies, error handling per component
3. **Data model** — entities, fields, relationships, lifecycle
4. **API contracts** — internal interactions; skip or mark N/A if no external API
5. **NFR coverage** — how each non-functional requirement is addressed in the design
6. **Security** — auth, authz, encryption, input validation, secrets

### Step 4 — Write api-contracts.md (if needed)

Only produce this if Step 2 confirmed an external API is required.
Use the template at `stages/03-design/templates/api-contracts.md`.

### Step 5 — Traceability check

Before opening the PR, verify every FR-NNN from the SRS maps to at least one
design element (component, entity, or endpoint). Document this in the
Requirements Traceability section of design.md. If any requirement is uncovered,
resolve it before proceeding.

### Step 6 — Commit and open PR

```
Branch:   agentic/<feature>/03-design
PR title: agentic/<feature>/03-design: system design
```

---

## Done Criteria

- [ ] `design.md` written, all six sections complete, status `REVIEW`
- [ ] `api-contracts.md` written if external API exists, otherwise explicitly noted as N/A
- [ ] Every FR-NNN traces to at least one design element
- [ ] Technology choices have documented rationale
- [ ] Security is addressed
- [ ] PR open with Stage 03 checklist completed
- [ ] Engineer merges PR → `APPROVED`
- [ ] `state.yaml` updated: `current_stage: 4`, `stage_03: approved`

---

## Common Failure Modes

- Designing in a vacuum without checking existing system patterns
- Making architecture decisions without documenting rationale
- Under-specifying component interfaces — leads to integration problems at implementation
- Skipping the error flow — it must be designed, not assumed
- Producing api-contracts.md when there is no external API (unnecessary overhead)
