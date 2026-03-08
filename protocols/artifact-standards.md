# Artifact Standards

Every document produced by the agentic pipeline must conform to these standards.
Consistency makes review faster and traceability possible across stages.

---

## Feature Isolation

Every pipeline run is scoped to a single feature. Artifacts belong exclusively
to the feature that produced them.

**Rules:**
- A feature's artifacts live under `.agentic/features/<feature-name>/artifacts/`
- No artifact is shared between features
- A feature MAY read another feature's APPROVED artifacts for contextual awareness
  (e.g. to understand existing architecture before designing a new component)
- When doing so, clearly mark the influence:
  `> Context reference: features/user-auth/artifacts/03-design/design.md`
- Never list another feature's artifact as a formal **Input** to this document
- Never copy content verbatim from another feature — always rephrase in the
  context of the current feature's scope

---

## Required Header

Every artifact must begin with this header block:

```markdown
---
title: [Document title]
stage: [Stage number and name, e.g. "02 — Requirements"]
feature: [Feature identifier, e.g. "user-authentication"]
version: [Semantic version, e.g. "1.0.0"]
status: [DRAFT | REVIEW | APPROVED]
created: [YYYY-MM-DD]
updated: [YYYY-MM-DD]
project: [Project name from config.yaml]
authors: [AI agent + tool, e.g. "Claude Sonnet 4.6 via Claude Code"]
approved_by: []
---
```

---

## Required Sections (all artifacts)

### 1. Purpose
One paragraph: why this document exists and what decisions it supports.

### 2. Scope
What is covered and what is explicitly out of scope for this document.

### 3. Inputs
Prior artifacts this document was derived from. List with paths:
```markdown
- `.agentic/features/user-auth/artifacts/01-intake/project-brief.md` (v1.0.0, APPROVED)
```
Only list artifacts from the **same feature**. Cross-feature references go in a
separate **Context References** subsection and are clearly marked as informational only.

### 4. [Stage-specific content]
The body of the document. Structure varies by stage — see each stage's INSTRUCTIONS.md.

### 5. Assumptions & Decisions
Every assumption made and every decision taken, with rationale.

```markdown
| ID   | Assumption / Decision         | Rationale                    | Source        | Confidence |
|------|-------------------------------|------------------------------|---------------|------------|
| A-01 | Single-tenant system          | Spec does not mention multi-tenancy | Default  | Medium     |
| D-01 | PostgreSQL for storage        | Engineer answered Q3         | Q&A log       | High       |
```

### 6. Open Items
Unresolved questions or deferred decisions, tagged `[OPEN]`.

```markdown
| ID     | Description              | Owner      | Priority | Target Stage |
|--------|--------------------------|------------|----------|--------------|
| OI-001 | Mobile support required? | Engineer   | HIGH     | Stage 02     |
```

### 7. Change Log

```markdown
| Version | Date       | Change                                     | Author  |
|---------|------------|--------------------------------------------|---------|
| 1.0.0   | YYYY-MM-DD | Initial draft                              | [agent] |
| 1.1.0   | YYYY-MM-DD | Revised auth section per engineer feedback | [agent] |
```

---

## ID Schemes

Consistent IDs enable end-to-end traceability across all artifacts.

| Type                     | Format    | Example   |
|--------------------------|-----------|-----------|
| Functional Requirement   | `FR-NNN`  | `FR-001`  |
| Non-Functional Req.      | `NFR-NNN` | `NFR-003` |
| Use Case                 | `UC-NNN`  | `UC-012`  |
| Component                | `COMP-NN` | `COMP-04` |
| API Endpoint             | `API-NNN` | `API-007` |
| Task                     | `TASK-NNN`| `TASK-023`|
| Test Case                | `TC-NNN`  | `TC-008`  |
| Risk                     | `RISK-NN` | `RISK-02` |
| Assumption               | `A-NN`    | `A-05`    |
| Open Item                | `OI-NNN`  | `OI-001`  |

---

## Writing Style Rules

- Write for a reviewer who reads this document cold — no assumed context
- Use `SHALL` / `MUST` for mandatory requirements
- Use `SHOULD` for recommended but not mandatory
- Use `MAY` for optional
- No vague language: never write "etc.", "TBD", "as needed", "and so on"
  — replace with `[OPEN: describe what needs to be decided]`
- Prefer tables over prose for lists of items with multiple attributes
- Every reference to another artifact must include the full path

---

## Versioning

| Version bump | When |
|---|---|
| `1.0.0` | Initial draft submitted for review |
| `1.x.0` | Revised based on engineer review comments |
| `x.0.0` | Major revision due to upstream artifact change |

When an upstream artifact changes after a downstream one is APPROVED,
the downstream artifact must be re-reviewed. The pipeline state tracks this.

---

## Status Transitions

```
DRAFT ──► REVIEW ──► APPROVED
             │            │
             │◄───────────┘
         (revision requested → back to DRAFT)
```

- **DRAFT** — Agent is producing the document
- **REVIEW** — PR is open, engineer is reviewing
- **APPROVED** — PR merged. This version is the source of truth for downstream stages

Only APPROVED artifacts are used as formal inputs to the next stage.

---

## File Naming Convention

```
.agentic/features/<feature-name>/artifacts/<NN-stage-name>/<artifact-name>.md
```

Examples:
```
.agentic/features/user-auth/artifacts/01-intake/project-brief.md
.agentic/features/user-auth/artifacts/02-requirements/SRS.md
.agentic/features/user-auth/artifacts/02-requirements/use-cases.md
.agentic/features/user-auth/artifacts/03-design/design.md
.agentic/features/user-auth/artifacts/03-design/api-contracts.md      ← only if external API required
.agentic/features/user-auth/artifacts/04-planning/plan.md
.agentic/features/user-auth/artifacts/05-implementation/<task-id>-notes.md
.agentic/features/user-auth/artifacts/06-testing/test-plan.md
.agentic/features/user-auth/artifacts/06-testing/test-results.md
.agentic/features/user-auth/artifacts/07-review/review-report.md
```

**Artifact count per feature (typical):** 9 files
(`project-brief`, `SRS`, `use-cases`, `design`, `plan`, implementation notes per task, `test-plan`, `test-results`, `review-report`)
