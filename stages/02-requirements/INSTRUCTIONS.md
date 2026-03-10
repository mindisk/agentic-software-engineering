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

### Step 3 — Write the Software Requirements Specification

Produce `SRS.md` using the template at `stages/02-requirements/templates/SRS.md`.

**Functional Requirements (FR-NNN):**
- One requirement per ID
- State what the system SHALL do, not how — use RFC 2119 keywords (`SHALL`/`MUST` for mandatory, `SHOULD` for recommended, `MAY` for optional)
- Include at least one Given/When/Then scenario per requirement — scenarios are the acceptance criteria
- Group by feature area or user flow

**Requirement format (OpenSpec-compatible):**
```markdown
### FR-001: User authentication

Users SHALL be authenticated before accessing any protected resource.

#### Scenario: Valid credentials
Given a registered user provides a valid email and password
When they submit the login form
Then they receive a session token and are redirected to the dashboard

#### Scenario: Invalid credentials
Given a user provides an incorrect password
When they submit the login form
Then they receive a 401 response with no session created
```

Every requirement must have: RFC 2119 language in the statement + at least one scenario.
Error paths are explicit scenarios, not implied by the happy-path scenario.

**Non-Functional Requirements (NFR-NNN):**
- Performance: response times, throughput
- Availability: uptime targets, recovery time
- Security: authentication, authorisation, data protection
- Scalability: user/data volume targets
- Maintainability: logging, monitoring, deployment

**User Stories (linked to FR-NNN):**
- Format: "As a [persona], I want to [action] so that [outcome]"
- Link each story to one or more FR-NNN

### Step 4 — Write Use Cases

Produce `use-cases.md` using the template at `stages/02-requirements/templates/use-cases.md`.

For each primary use case:
- Main success scenario (step by step)
- Alternative flows
- Error/exception flows
- Pre-conditions and post-conditions

### Step 5 — Requirements validation pass and present for engineer approval

Before presenting:
- Every FR-NNN traces back to something in the project brief
- No two requirements contradict each other
- Every FR-NNN uses RFC 2119 language (`SHALL`/`MUST`/`SHOULD`/`MAY`) in its statement
- Every FR-NNN has at least one Given/When/Then scenario; error paths have their own explicit scenarios
- NFRs have measurable targets (no "must be fast")
- Edge cases are covered as scenarios within the relevant FR-NNN or flagged as `[OPEN]`

Present a summary to the engineer:
- Requirement count (X functional, Y non-functional, Z use cases)
- Any significant decisions made during this stage
- Conflicts found and how they were resolved
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
