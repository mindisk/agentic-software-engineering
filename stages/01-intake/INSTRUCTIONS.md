# Stage 01 — Intake

## Purpose

Convert a high-level specification into a structured project brief. This is the
foundation of the entire pipeline. Every subsequent stage derives from this document,
so clarity and honesty here are critical.

This stage is not about generating content — it is about understanding intent,
surfacing what is unknown, and producing a brief that a technical team could act on.

---

## Inputs

- High-level specification (provided by the engineer at pipeline invocation)
- `.agentic/features/<feature>/state.yaml` (for any prior context if this is a revision)
- Any other feature artifacts as contextual reference only (read-only, informational)

---

## Process

### Step 1 — First read

Read the provided specification carefully. Do not produce any output yet.
Identify:

- What is clearly stated
- What is implied but not stated
- What is missing but will be required later
- What is ambiguous (multiple valid interpretations)
- What contradicts itself

### Step 2 — Early question pass (BEFORE writing the brief)

Following `protocols/question-protocol.md` and `protocols/uncertainty-rules.md`:

Ask the engineer to clarify the top ambiguities. Focus on:

1. **Scope boundaries** — What is definitively in scope vs. out of scope?
2. **Primary users** — Who is this for? What do they do with it?
3. **Success criteria** — How will we know this is done and working?
4. **Hard constraints** — Any non-negotiable technical, regulatory, or time constraints?
5. **Relation to existing systems** — Does this integrate with or replace anything?

Batch all questions in one pass. Do not ask more than 7. Label each with a priority
(`[BLOCKING]`, `[HIGH]`, `[MEDIUM]`, `[LOW]`).

Wait for answers before writing the brief.
If the engineer explicitly says "proceed with your best judgment", make your
assumptions explicit and proceed.

### Step 3 — Write the project brief

Produce `.agentic/features/<feature>/artifacts/01-intake/project-brief.md`
using the template at `stages/01-intake/templates/project-brief.md`.

Fill in every section. Do not leave any section empty or partially filled.
If something is genuinely unknown after Q&A, record it as an Open Item.

### Step 4 — Self-review and present for engineer approval

Before presenting the artifact, verify:

- Would a new engineer understand what is being built and why from this doc alone?
- Are all scope boundaries explicit?
- Are success criteria measurable?
- Are all assumptions listed?

Present a summary to the engineer:
- One-paragraph summary of what the feature is
- List of questions asked and answers received
- List of assumptions made
- Filled-in Stage 01 review checklist (from Protocol 4)
- Any open items the engineer should be aware of

**Wait for explicit engineer approval before proceeding to Stage 02.**
Approval can be as simple as "looks good" or "proceed". If the engineer requests
changes, update the artifact and re-present. Do not advance the stage until approved.

---

## Outputs

| Artifact | Path |
|----------|------|
| Project Brief | `.agentic/features/<feature>/artifacts/01-intake/project-brief.md` |

---

## Done Criteria

The stage is complete when:
- [ ] `project-brief.md` is written with status `REVIEW`
- [ ] Stage 01 review checklist presented and all items addressed
- [ ] Engineer explicitly approves (artifact status updated to `APPROVED`)
- [ ] `state.yaml` is updated: `current_stage: 2`, `stage_01: approved`

---

## Communication Protocol

### Formal Inputs

| Artifact | Source | Status Required |
|----------|--------|-----------------|
| High-level specification | Provided by engineer at pipeline invocation | N/A |
| `state.yaml` | `.agentic/features/<feature>/state.yaml` | Any |

### Formal Outputs

| Artifact | Path | Consumed By |
|----------|------|-------------|
| `project-brief.md` | `artifacts/01-intake/project-brief.md` | Stages 02, 03, 04, 07, 08 |

### Pre-Stage Verification

Stage 01 is the pipeline entry point — no prior approved artifacts are required.
Verify that `state.yaml` exists or is being initialised for the feature.

---

## Common Failure Modes to Avoid

- Writing a brief that just paraphrases the original spec without adding structure
- Leaving success criteria vague ("the feature works correctly")
- Not distinguishing between must-have and nice-to-have scope
- Skipping the question pass because the spec "seems clear enough"
- Inventing constraints or requirements not supported by the spec
