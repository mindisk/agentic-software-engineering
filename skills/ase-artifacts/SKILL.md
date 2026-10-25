---
name: ase-artifacts
description: "Use when creating, revising, or approving any agentic-pipeline document under a feature's artifacts/ folder (project brief, SRS, use cases, design, ADR, user stories, plan, test plan, review report, operations manual), or when unsure how to write an ID, an open item, an assumption, or an artifact status."
---

# ase-artifacts — artifact standards

Every document the pipeline produces follows these rules. Consistency is what makes review
fast and traceability possible.

## Location and isolation

- Path: `<artifacts.path>/<feature>/artifacts/<NN-stage>/<artifact-name>.md`. `artifacts.path` comes from `.agentic/config.yaml` and may be outside the repo.
- Artifacts belong to one feature only.
- Another feature's APPROVED artifacts may be read for context. Mark such a reference with `> Context reference: <path>`.
- Never list another feature's artifact as a formal Input, and never copy from one verbatim.

## Required header

```markdown
---
title: [Document title]
stage: [e.g. "02 — Requirements"]
feature: [feature id]
version: 1.0.0
status: DRAFT
created: YYYY-MM-DD
updated: YYYY-MM-DD
project: [from config.yaml]
authors: [model + tool]
approved_by: []
---
```

## Required sections

1. **Purpose:** one paragraph.
2. **Scope:** both in and out of scope, stated explicitly.
3. **Inputs:** the approved artifacts from this feature that this document derives from.
4. **The stage-specific body:** structured as the stage template defines.
5. **Assumptions & Decisions:**

   | ID | Assumption / Decision | Rationale | Source | Confidence |
   |----|-----------------------|-----------|--------|------------|
   | A-01 | Single-tenant | Spec silent on tenancy | Default | Medium |
   | D-01 | PostgreSQL | Engineer answered Q3 | qa_log | High |

6. **Open Items:**

   | ID | Description | Owner | Priority | Target Stage |
   |----|-------------|-------|----------|--------------|

7. **Change Log:**

   | Version | Date | Change | Author |
   |---------|------|--------|--------|

## IDs

| Item | ID format | Item | ID format |
|------|-----------|------|-----------|
| Functional req. | `FR-NNN` | Task | `TASK-NNN` |
| Non-functional req. | `NFR-NNN` | Acceptance criterion | `AC-NNN-n` |
| Use case | `UC-NNN` | Test case | `TC-NNN` |
| User story | `US-NNN` | Risk | `RISK-NN` |
| Component | `COMP-NN` | Assumption / Decision | `A-NN` / `D-NN` |
| API / interface | `API-NNN` | Open item | `OI-NNN` |
| ADR | `ADR-NNNN` | KB entry | `KB-NNNN` |

## Inline markers

| Marker | Use when | Lifecycle |
|--------|----------|-----------|
| `[OPEN: …]`, with a row in Open Items | The uncertainty spans sections or stages, or affects structure | Tracked by `OI-NNN` until resolved, deferred, or accepted |
| `[NEEDS CLARIFICATION: <one-sentence question>]` | A localized question inside one otherwise complete section | Allowed in `REVIEW`. List all markers in the stage summary. Remove them before `APPROVED` |
| `> Assumption: [X] — rationale: [Y]. Revisit if incorrect.` | A reasonable default was taken | Also add a row in Assumptions & Decisions |
| `> Decision: [summary] — per engineer answer [date]` | The engineer answered a question | Also add a row in Assumptions & Decisions |

Never use "TBD", "etc.", "as needed", or "and so on". Replace them with an `[OPEN: …]` item.

## Writing style

- Write for a reviewer reading the document cold.
- `SHALL`/`MUST` mean mandatory, `SHOULD` recommended, `MAY` optional (RFC 2119).
- Prefer tables for lists of items with several attributes.
- Give every reference to another artifact as its full path.

## Requirement format (SRS only)

```markdown
### FR-001: <Short title>

<Subject> SHALL/MUST/SHOULD/MAY <behaviour>.

#### Scenario: <Happy path>
Given <precondition>
When <action>
Then <observable outcome>

#### Scenario: <Error or edge case>
Given … When … Then …
```

- Each FR needs at least 2 scenarios: one happy path and one error or edge case.
- Each scenario maps 1:1 to a `TC-NNN` in Stage 06.
- NFRs do not use scenarios. They use measurable targets with units.

## Versioning and status

| Bump | When |
|------|------|
| `1.0.0` | First draft submitted for review |
| `1.x.0` | Revision after review comments |
| `x.0.0` | Major revision after an upstream artifact changed |

Status moves `DRAFT → REVIEW → APPROVED`. A revision request sends it back to `DRAFT`.

- Only `APPROVED` artifacts are formal inputs to later stages.
- If an upstream artifact changes after a downstream one was approved, the downstream artifact must be re-reviewed. Record that in `state.yaml`.
