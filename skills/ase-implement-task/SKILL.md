---
name: ase-implement-task
description: "Use when dispatched with a TASK-NNN brief to implement one task of an agentic pipeline build, or when continued by the build controller with review findings or an answer to a question."
---

# ase-implement-task — implementer protocol

This protocol is the contract between any implementer and the build controller. Your agent
definition adds role-specific rules on top of it, for example API layering.

## 1. Orient

1. Read the brief at the path in your dispatch prompt, in full, before using any other tool.
2. Run `git rev-parse --show-toplevel` and `git branch --show-current`. These are your `Workdir` and `Branch`. Never switch branches.
3. Read only what the brief points to:
   - the listed `design.md` sections and ADRs
   - the code under "Files you own" and its immediate neighbours
   - the constitution articles named under global constraints
   - any KB entries the brief cites

   If the brief cites a KB entry marked `[STALE]`, verify its claim before relying on it.

## 2. Decide whether you can proceed

| Situation | Status to return now |
|-----------|----------------------|
| The task needs something the design does not specify, or a constitution article conflicts with it | `DESIGN_GAP`. Do not guess |
| You need a fact or decision that is in the artifacts but missing from the brief, or you must touch a file outside "Files you own" | `NEEDS_CONTEXT`, with the exact question |
| An external factor prevents progress, such as a broken dependency or a missing service | `BLOCKED` |
| An acceptance criterion has several valid readings, and none of them changes the design | Pick one, state it under Concerns, and continue |

To return early, still write the report (step 5) with the status and the question. Then stop.

## 3. Build it test-first

**REQUIRED SUB-SKILL:** superpowers:test-driven-development. Apply it to each acceptance criterion in the brief, and give every error path its own test.

These pipeline-specific points add to that skill:
- **Record the red run.** Copy the failing command and its count into the report's Evidence section. The reviewer checks that the red run happened.
- **Stay in your files.** Edit only the files the brief lists under "Files you own".
- **Match the design exactly.** Use the interfaces and names that the design references give.
- **Hit a bug you can't explain?** **REQUIRED SUB-SKILL:** superpowers:systematic-debugging, before trying fixes.

## 4. Verify before you claim

**REQUIRED SUB-SKILL:** superpowers:verification-before-completion. Run the brief's **verify command** and copy its real output into Evidence. A report may say `DONE` only when that run passes.

## 5. Commit and report

1. Commit on your current branch. Use one commit, or a few that tell a clear story. Message format: `TASK-NNN: <imperative summary>`. Never push, never amend commits you did not make, and never touch other branches.
2. Write the report to `.ase/reports/TASK-NNN.md` relative to `Workdir`, using the report template path given in the brief or dispatch. Do not commit it. Fill in every section:
   - **Interfaces:** what later tasks can call.
   - **Discoveries:** facts worth keeping beyond this task, each tagged `[gotcha]`, `[pattern]`, `[decision]`, or `[solution]`.
3. Reply with **only the report's header lines** (Status through Commits). The controller reads the file for everything else.

## 6. When the controller messages you again

- **Fix request:** **REQUIRED SUB-SKILL:** superpowers:receiving-code-review. Check each Critical and Important finding in the review file against the code before acting on it.
  - Fix the findings that hold.
  - For a finding you believe is wrong, explain why with evidence instead of complying blindly.

  Then re-run verify, commit, and update the report. Append a `## Round <k>` section that lists each finding with its outcome: fixed, or disputed and why.
- **An answer to NEEDS_CONTEXT:** continue from where you stopped.

## Status codes

- `DONE`: all acceptance criteria met, verify passes, everything committed.
- `DONE_WITH_CONCERNS`: done, but something deserves the controller's attention. State it under Concerns.
- `NEEDS_CONTEXT`: you cannot continue without an answer. Ask exactly one question per need.
- `BLOCKED`: you cannot continue because of something outside the task.
- `DESIGN_GAP`: the approved design does not cover what the task requires.

## Why these limits

- **Stay inside "Files you own"; ask through `NEEDS_CONTEXT` to go beyond.** Other tasks may be editing their files in parallel right now. Stray edits become merge conflicts, or overwrite someone else's work.
- **Report only evidence you observed.** The reviewer and the controller trust your Evidence section for what to re-check. False evidence is the most damaging thing an implementer can do.
- **Leave `tasks.json`, `state.yaml`, and other agents' files alone.** The controller owns the pipeline state. If two writers touch it, it stops being a reliable recovery map.
- **Don't push, open PRs, merge, rebase, or reset.** The controller integrates your branch, and outward-facing actions belong to the engineer. Rewriting history also breaks the review range the reviewer uses.
