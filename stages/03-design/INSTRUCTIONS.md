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
| `.agentic/constitution.md` | Product repo | If present — checked before and after design |

Cross-reference other features' approved design artifacts for context if relevant —
mark clearly as `> Context reference:` and never list as a formal input.

---

## Output

| Artifact | Path | Notes |
|----------|------|-------|
| `design.md` | `artifacts/03-design/design.md` | Always — includes interface contracts in Section 4 |
| `adr/adr-NNNN-<slug>.md` | `artifacts/03-design/adr/` | Step 4 — one per qualifying decision; omitted if none qualify |

---

## Process

### Step 1 — Read all inputs and run constitution check

Read all approved artifacts. Cross-reference requirements against use cases.
Build a full picture of what the system must do before asking any questions.

If a constitution is loaded, run a constitution check against the requirements and
known constraints before proposing any architecture. Identify which articles are
likely to bear on design decisions — flag them explicitly so they inform the early
question pass and the design itself.

If any requirement appears to conflict with a constitution article, surface it in
the early question pass (Step 2) before designing anything.

### Step 2 — Early question pass

Ask before designing anything:

1. **Existing tech stack** — What languages, frameworks, databases are already in use?
   Must this feature conform to existing patterns?
2. **Deployment environment** — Cloud, on-prem, serverless, container?
   Any constraints on what can be introduced?
3. **Scale targets** — Confirm NFR numbers. These drive architecture decisions.
4. **Interface exposure** — Does this feature expose any interface for other systems
   or clients to consume (API, SDK, CLI, event stream, file format)? Determines the
   depth of Section 4 in design.md.
5. **Security model** — What auth/authz pattern is in place or required?
6. **Data ownership** — Who owns the data this feature produces?
   Retention and deletion policy?

### Step 3 — Write design.md

Use the template at `stages/03-design/templates/design.md`.

Cover all six sections in order:
1. **Architecture** — components, diagram, primary and error data flows
2. **Component design** — responsibility, interface, dependencies, error handling per component
3. **Data model** — entities, fields, relationships, lifecycle
4. **Interface contracts** — any interface this feature exposes (API endpoints, CLI commands,
   SDK methods, event schemas, file formats). Mark N/A if the feature exposes no external
   interface. If an interface exists, document: method/command, inputs, outputs, error cases.
5. **NFR coverage** — how each non-functional requirement is addressed in the design
6. **Security** — auth, authz, encryption, input validation, secrets

### Step 4 — ADR assessment and production (if qualifying decisions exist)

After `design.md` is drafted, invoke `adr-specialist` to assess whether any design
decisions warrant an ADR.

**A decision qualifies if it meets ≥2 of:**
- Hard to reverse — switching would require significant rework
- Meaningful alternatives were genuinely weighed
- Affects multiple components or has implications beyond this feature
- A future engineer would ask "why was this chosen?"

**Constitution exceptions always qualify** — no criteria check needed.

The specialist runs a research sub-step for each qualifying decision before writing
any ADR (see `agents/adr-specialist.md`). ADRs are written to `artifacts/03-design/adr/`.

**If no decisions qualify:** note explicitly in the design's Assumptions & Decisions
table: `> ADR assessment performed — no qualifying decisions found.`

See main agent — Stage 03 delegation for the specialist invocation brief.

### Step 5 — Review, traceability check, constitution check, and present for engineer approval

#### Step 5a — Invoke `design-reviewer`

Invoke the `design-reviewer` specialist (see main agent — Stage 03 Step 5a delegation)
to review the completed `design.md`. The specialist checks for:
- Missing or ambiguous component interfaces
- Requirements with no design element
- Error flows that are implied but not designed
- Inconsistencies within the design itself

Receive the reviewer's findings. Resolve any blocking issues before proceeding.

#### Step 5b — Invoke `security-reviewer` (Mode: design)

Invoke the `security-reviewer` specialist (see main agent — Stage 03 Step 5b delegation)
in **Mode A (design)** to review the security posture of the completed design.
The specialist checks auth/authz design, data protection, input validation, and
constitution compliance for security articles.

Receive security findings. Any HIGH severity findings block presentation to engineer
until resolved or accepted with an ADR.

#### Step 5c — Traceability check and constitution check

Verify every FR-NNN from the SRS maps to at least one design element (component,
entity, or interface). Document this in the Requirements Traceability section of
design.md. If any requirement is uncovered, resolve it before presenting.

If a constitution is loaded, run the full constitution check against the completed
`design.md`. Record the result for each article in the design's Assumptions &
Decisions table. Any `EXCEPTION` items block presentation until resolved.

Present a summary to the engineer:
- Architecture overview (key components and their responsibilities)
- Key technology decisions and rationale
- Step 4 result: ADRs produced (list titles), or no qualifying decisions found
- Constitution check results (all articles, one line each)
- Any design risks or open items
- Filled-in Stage 03 review checklist (from Protocol 4)

**Wait for explicit engineer approval before proceeding to Stage 04.**

---

## Done Criteria

- [ ] `design.md` written, all six sections complete, status `REVIEW`
- [ ] Section 4 (Interface contracts): complete if feature exposes an interface, explicitly N/A otherwise
- [ ] Step 4: ADR assessment performed — ADRs written for qualifying decisions, or none noted explicitly
- [ ] Every FR-NNN traces to at least one design element
- [ ] Technology choices have documented rationale
- [ ] Security is addressed
- [ ] `design-reviewer` invoked — blocking findings resolved
- [ ] `security-reviewer` invoked (Mode A) — HIGH findings resolved or ADR-covered
- [ ] Constitution check run — all articles assessed, exceptions have ADRs
- [ ] Stage 03 review checklist presented and all items addressed
- [ ] Engineer explicitly approves (artifact status updated to `APPROVED`)
- [ ] `state.yaml` updated: `current_stage: 4`, `stage_03: approved`

---

## Communication Protocol

### Formal Inputs

| Artifact | Source | Status Required | Used For |
|----------|--------|-----------------|----------|
| `project-brief.md` | Stage 01 | APPROVED | Scope and constraints context |
| `SRS.md` | Stage 02 | APPROVED | Requirements to design against |
| `use-cases.md` | Stage 02 | APPROVED | Flows to cover in the design |

### Formal Outputs

| Artifact | Path | Consumed By |
|----------|------|-------------|
| `design.md` | `artifacts/03-design/design.md` | Stages 04, 05, 06, 07, 08 |
| `adr/adr-NNNN-*.md` | `artifacts/03-design/adr/` | Stages 04, 07, 08 — for context on key decisions |

### Pre-Stage Verification

Before beginning Stage 03, confirm:
1. `artifacts/02-requirements/SRS.md` exists and has `status: APPROVED`
2. `artifacts/02-requirements/use-cases.md` exists and has `status: APPROVED`
3. `state.yaml` shows `stage_02: approved`

If any check fails, stop and surface to engineer before proceeding.

---

## Common Failure Modes

- Designing in a vacuum without checking existing system patterns
- Making architecture decisions without documenting rationale
- Under-specifying component interfaces — leads to integration problems at implementation
- Skipping the error flow — it must be designed, not assumed
- Marking Section 4 N/A when the feature does expose an interface (CLI, SDK, events count too)
- Skipping Step 4 — design always surfaces decisions; the question is whether they qualify
- Writing ADRs before researching the options — the specialist must research first
