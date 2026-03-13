# Stage 05 — Implementation

## Purpose

Implement each task defined in the approved plan, in the order specified
by the dependency graph in `plan.md`. Each task is a self-contained unit of work
that moves the feature forward incrementally.

This stage produces working code that directly implements the approved design.
No architectural decisions should be made here — if a design gap is discovered,
surface it and pause until resolved.

---

## Inputs

| Artifact | Source | Required |
|----------|--------|----------|
| `plan.md` | Stage 04, APPROVED | Yes |
| `design.md` | Stage 03, APPROVED | Yes |

---

## Specialist Selection

Before starting each task, identify which specialist to invoke:

| Task implements | Specialist |
|-----------------|------------|
| HTTP endpoints, routes, controllers, middleware | `api-engineer` |
| All other tasks | `senior-software-engineer` |

Check the task's design reference in `plan.md`. If it references `API-NNN` identifiers
from `design.md` Section 4, use `api-engineer`. Otherwise use `senior-software-engineer`.
See main agent — Stage 05 delegation for the brief format for each.

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

### Step 4 — Implement using TDD (Red → Green → Refactor)

All implementation follows Test-Driven Development. Tests are written **before**
the production code that satisfies them. This is non-negotiable.

#### Step 4a — Write failing tests (Red)

Before writing any production code:

1. Derive test cases directly from the task's **acceptance criteria** and from
   the user story's **Definition of Done** in `user-stories.md`.
2. Write tests that call the interface/function/endpoint as it will be defined —
   even though it does not exist yet.
3. Confirm tests **fail** (or fail to compile/import) before proceeding.
   A test that passes without implementation is a broken test.

**Test naming convention:** names must describe the behaviour under test, not
the implementation. Format: `<unit>_<scenario>_<expected outcome>`.
Example: `createUser_duplicateEmail_returns409`

**One acceptance criterion = at least one test.** Multiple tests per criterion
are encouraged for edge cases. Error paths are always explicit test cases, not
implied by happy-path coverage.

#### Step 4b — Implement to make tests pass (Green)

Write the minimum production code needed to make all failing tests pass.

**Correctness first:**
- Implement exactly what the task defines — no more, no less
- Match the interface/contract defined in design.md (Section 4)
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

#### Step 4c — Refactor (Refactor)

With all tests green, clean up the implementation:
- Remove duplication
- Improve readability
- Rename for clarity

Run tests again after refactoring. All must still pass before proceeding.

### Step 5 — Self-review before presenting to engineer

Before presenting the completed task, run a self-review. Fill in each item honestly —
do not present until all items are `[PASS]`:

```
[ ] All tests pass — zero failures
[ ] Every acceptance criterion in the task definition has at least one test
[ ] Tests were written before implementation (TDD red-green-refactor followed)
[ ] No acceptance criterion is covered only by a trivial or vacuous test
[ ] Implementation matches the interface defined in design.md (Section 4)
[ ] No hardcoded values, debug code, or TODOs left uncommitted
[ ] Any deviation from the design is documented in TASK-NNN-notes.md with rationale
```

Do not present the task as complete if any item is `[FAIL]`. Fix it first, then re-run
the self-review. If an item cannot be resolved, mark it `[BLOCKED]` and surface it
as a `[DESIGN GAP]` or `[BLOCKER]` to the engineer — do not silently skip it.

### Step 6 — Task completion and checkpoint reporting

After completing each task:

1. Record it as complete in `state.yaml` and log it in `PROGRESS.md`.
2. Increment your internal task counter for this stage.

**Checkpoint cadence** is set by `pipeline.checkpoint_interval_tasks` in
`.agentic/config.yaml` (default: 3). Read this value at the start of Stage 05.

- If `checkpoint_interval_tasks` is **0**: continue silently through all tasks
  and report only at full stage end.
- Otherwise: when `tasks_completed mod checkpoint_interval_tasks == 0`,
  pause and present a checkpoint report:

```
=== Stage 05 Checkpoint ===
Completed this batch : TASK-NNN, TASK-NNN, TASK-NNN
Remaining            : X tasks
Test status          : X passing, 0 failing
Blockers / gaps      : none | [describe if any]
==========================
```

Wait for the engineer to acknowledge ("continue" / "ok" / any reply) before
proceeding to the next task. If the engineer requests a pause or review, stop
and address their feedback before resuming.

**Per-task summary** (always, regardless of checkpoint cadence):
- What was implemented
- Which acceptance criteria are met
- Any implementation decisions that deviate from or extend the design (and why)
- Any issues discovered — do not fix silently; surface with `[DESIGN GAP]` or `[BLOCKER]`
- Files created or modified

---

## When to Stop and Ask

Stop implementing and surface a question if:

- A design gap is discovered that requires an architectural decision
- The task's acceptance criteria cannot be met as written (spec conflict)
- An external integration does not behave as documented in the design
- A discovered constraint makes the task as defined impossible or unsafe

When stopping, surface the issue to the engineer immediately with `[DESIGN GAP]` or `[BLOCKER]` and describe the issue clearly.

---

## Outputs

| Artifact | Path |
|----------|------|
| Source code | `src/` (or project-appropriate path) |
| Per-task implementation notes | `.agentic/features/<feature>/artifacts/05-implementation/TASK-NNN-notes.md` |

Implementation notes (one per task) capture: decisions made, deviations from design, known limitations.

---

## Done Criteria (per task)

- [ ] Tests written **before** implementation (TDD red-green-refactor followed)
- [ ] Every acceptance criterion has at least one test
- [ ] All tests pass
- [ ] All acceptance criteria for TASK-NNN are met
- [ ] Code follows existing codebase conventions
- [ ] No debug code or TODOs left (or TODOs are tracked as new tasks)
- [ ] Task summary presented to engineer
- [ ] `state.yaml` updated with task completion

## Done Criteria (full stage)

- [ ] All tasks in plan.md are complete
- [ ] Engineer approves the full implementation stage
- [ ] `state.yaml` updated: `current_stage: 6`, `stage_05: approved`

---

## Communication Protocol

### Formal Inputs

| Artifact | Source | Status Required | Used For |
|----------|--------|-----------------|----------|
| `plan.md` | Stage 04 | APPROVED | Task definitions and implementation order |
| `design.md` | Stage 03 | APPROVED | Architecture and interface contracts to implement against |

### Formal Outputs

| Artifact | Path | Consumed By |
|----------|------|-------------|
| Source code | `src/` (or project path) | Stages 06, 07, 08 |
| `TASK-NNN-notes.md` (per task) | `artifacts/05-implementation/TASK-NNN-notes.md` | Stages 07, 08 |

### Pre-Stage Verification

Before beginning Stage 05, confirm:
1. `artifacts/04-planning/plan.md` exists and has `status: APPROVED`
2. `artifacts/03-design/design.md` exists and has `status: APPROVED`
3. `state.yaml` shows `stage_04: approved`
4. Read `pipeline.checkpoint_interval_tasks` from `.agentic/config.yaml` (default: 3)

If any check fails, stop and surface to engineer before proceeding.

---

## Common Failure Modes to Avoid

- Writing tests after (or during) implementation — TDD requires tests to fail first
- Tests that pass without any implementation — the test is wrong or testing nothing
- Acceptance criteria without a corresponding test — every criterion needs coverage
- Implementing features not in the current task ("while I'm here...")
- Silently making architectural decisions that deviate from the design
- Moving to the next task before all acceptance criteria for the current one are met
- Hardcoding environment-specific values
- Fixing unrelated bugs without noting them separately
