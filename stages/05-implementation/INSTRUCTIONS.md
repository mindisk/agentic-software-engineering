# Stage 05 — Implementation

## Purpose

Implement each task defined in the approved plan, in the order specified
by the dependency graph in `plan.md`. Each task is a self-contained PR that moves
the feature forward incrementally.

This stage produces working code that directly implements the approved design.
No architectural decisions should be made here — if a design gap is discovered,
surface it and pause until resolved.

---

## Inputs

| Artifact | Source | Required |
|----------|--------|----------|
| `plan.md` | Stage 04, APPROVED | Yes |
| `design.md` | Stage 03, APPROVED | Yes |
| `api-contracts.md` | Stage 03, APPROVED | If applicable |

---

## Process (Per Task)

### Step 1 — Read the task definition

From `plan.md`, read the full task definition:
- Description
- Acceptance criteria
- Files expected to be created/modified
- Dependencies (confirm all are merged before starting)

### Step 2 — Read the relevant design artifacts

For this task, read the specific sections of design artifacts it implements.
Do not read all design docs for every task — focus on what is relevant.

### Step 3 — Task-level question pass

Before writing any code, ask if:
- Any part of the task definition is ambiguous about HOW to implement it
- Any existing code patterns in the repo must be followed (ask for pointer if unsure)
- Any design gap is discovered that cannot be resolved from the approved artifacts

Keep questions minimal. Implementation details that fall within the design spec
should be decided by the agent, documented in code comments if non-obvious.

### Step 4 — Implement

Write the code. Follow these rules:

**Correctness first:**
- Implement exactly what the task defines — no more, no less
- Match the interface/contract defined in design.md and api-contracts.md
- Handle all error cases specified in the task's acceptance criteria

**Code quality:**
- Use naming conventions consistent with the existing codebase
- No hardcoded values that belong in configuration
- No debug/temporary code left in the implementation
- Comments only where logic is non-obvious — not everywhere

**Security:**
- Validate all inputs at system boundaries (API endpoints, external data)
- No secrets in code or committed files
- Follow the security model defined in design.md

**No scope creep:**
- Do not implement adjacent functionality not in this task
- Do not refactor unrelated code
- If you find a bug in existing code, note it but do not fix it in this PR

### Step 5 — Self-verify acceptance criteria

Before committing, verify each acceptance criterion in the task definition is met.
Do not open a PR if acceptance criteria are not fully met.

### Step 6 — Commit and open PR

```
Branch: agentic/<feature>/05-impl/TASK-NNN
PR title: agentic/<feature>/impl: TASK-NNN [task title]
```

PR description must include:
- What was implemented (brief summary)
- Which acceptance criteria are met (checklist)
- Any implementation decisions made that deviate from or extend the design (and why)
- Any issues discovered (design gaps, edge cases not in the task) — do not fix silently
- Files created/modified list

### Step 7 — Wait for PR approval before next task

Do not begin the next task until the current task's PR is merged.
After merge, update `state.yaml` with task completion.

---

## When to Stop and Ask

Stop implementing and surface a question if:

- A design gap is discovered that requires an architectural decision
- The task's acceptance criteria cannot be met as written (spec conflict)
- An external integration does not behave as documented in the design
- A discovered constraint makes the task as defined impossible or unsafe

When stopping, comment on the open PR with `[DESIGN GAP]` or `[BLOCKER]` and describe the issue.

---

## Outputs

| Artifact | Path |
|----------|------|
| Source code | `src/` (or project-appropriate path) |
| Per-task implementation notes | `.agentic/features/<feature>/artifacts/05-implementation/TASK-NNN-notes.md` |

Implementation notes (one per task) capture: decisions made, deviations from design, known limitations.

---

## Done Criteria (per task)

- [ ] All acceptance criteria for TASK-NNN are met
- [ ] Code follows existing codebase conventions
- [ ] No debug code or TODOs left (or TODOs are tracked as new tasks)
- [ ] PR description is complete
- [ ] Engineer reviews and merges PR

## Done Criteria (full stage)

- [ ] All tasks in plan.md are merged
- [ ] `state.yaml` updated: `current_stage: 6`, `stage_05: approved`

---

## Common Failure Modes to Avoid

- Implementing features not in the current task ("while I'm here...")
- Silently making architectural decisions that deviate from the design
- Opening a PR before all acceptance criteria are met
- Hardcoding environment-specific values
- Starting the next task before the current PR is merged
- Fixing unrelated bugs without noting them separately
