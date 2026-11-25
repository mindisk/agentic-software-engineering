---
name: implementation-plan
description: Turn an approved design, or a clear multi-step requirement, into an ordered plan of small, independently verifiable steps before any code is touched. Use after a technical design is approved, or whenever a task will touch more than a couple of files, span multiple commits, or need careful sequencing (migrations, refactors, staged rollouts). This includes requests like "plan this out", "break this down", or "how would you implement X".
---

# Implementation Plan

A plan records the decisions an implementer cannot make alone: which files, which interfaces, in what order, and how each step is proven. Everything else is noise. If a plan is longer than the code it describes, it has written the code instead.

## Input

Start from the approved design (`artifacts/03-design/design.md` of a feature, or `docs/design/...`), the requirements, or the requirements stated in the conversation. If neither says what "done" means, go back to `technical-design` or ask.

## Building the plan

1. **Map the change.** List the files to create or modify, and give each one's responsibility. Follow the existing structure. Only include a split or move if the design calls for it.
2. **Order the steps for early feedback.**
   - Every step should leave the system working and testable.
   - Build the thinnest end-to-end slice first, then widen it.
   - Put the riskiest unknown near the start. If something is going to fail, you want to learn that at step 2, not step 9.
   - Put hard-to-reverse steps (migrations, deletions, public interface changes) late, and mark them explicitly.
3. **Write each step in this format:**
   ```markdown
   ### Step N: <outcome, not activity>
   Files: path/to/file (create | modify)
   Interface: signatures or contracts this step introduces or consumes
   Test: test name, and what it asserts
   Verify: `command` → expected result
   ```
   A step is the right size when it is one commit a reviewer could accept or reject on its own.
4. **Note the risks.** List edge cases and failure modes that the design implies but no step's test covers. Add tests for the ones that matter to the steps that own that code.

## Self-check

- Every design goal maps to a step, and every step maps to a goal (YAGNI).
- Names and signatures stay consistent from one step to the next.
- No step decides nothing. "Handle edge cases", "add validation", and "TBD" are gaps, not steps.
- Every step has a verify command.
- Code bodies appear only where the signature and the test don't already determine the algorithm.

## Output

- Short plans: present them in chat.
- A feature: write `artifacts/04-planning/plan.md` and `user-stories.md` from the `04-planning/` templates. Each step group becomes one `TASK-NNN` block with **Repo**, **Agent**, **Skills**, **Depends on** and **Acceptance criteria**. One task covers one repo. Fill the **Fan-out Waves** table: dependencies only on earlier waves, never two tasks of one repo in one wave. The coordinator parses these fields, so keep their format.
- Other multi-session work: save to `docs/plans/YYYY-MM-DD-<topic>.md`.

Either way, ask for review before executing. Execution follows the `implementation-execution` skill.
