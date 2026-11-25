---
name: implementation-execution
description: Execute an approved implementation plan or a well-defined coding task step by step. Write the test first, make the smallest change, verify each step, record any deviation, and finish with a self-review against the project principles. Use whenever you start writing production code for an agreed plan or task, e.g. "go ahead", "implement step 3", "build it", "execute the plan", "make the change".
---

# Implementation Execution

The plan already did the thinking. Execution is about discipline: small verified steps, no scope drift, and an honest record of what happened.

## Before the first change

- Make sure you are on a feature branch, not `main`, and know whether the working tree has uncommitted changes.
- Run the test suite once to establish a baseline. Record any failures that already exist. Don't fix them unless that is the task.
- For a feature ticket, work in a session inside the target repo worktree, so the repo `CLAUDE.md` and conventions load.
- Re-read the plan step and the code it touches. Work from the text, not from your memory of it.

## Per-step loop

1. **Red.** Write the step's test, run it, and watch it fail for the expected reason. A test that passes before the code exists is testing nothing, so fix the test.
2. **Green.** Write the minimum code that makes it pass, matching the surrounding style. Add nothing extra.
3. **Verify.** Run the step's verify command and the related tests. Read the output; don't assume it passed.
4. **Tidy your own code.** Clean up names, remove duplication you introduced, and delete dead code you created. Then re-run the tests.
5. **Commit**, if the human asked for commits. Make one commit per step, with a message that says why.

## When reality diverges from the plan

- **The code is wrong** (a test fails unexpectedly): switch to the `debugging` skill. Don't patch the symptom.
- **The plan is wrong** (an interface mismatch, an impossible step, a missed case): make the smallest change that honors the design's intent, and record it as `Deviation: <what> — <why> — <cost if wrong>`.
- **The deviation is big**: if it changes the scope, a public interface, or anything irreversible, stop and ask before acting.
- **You find an unrelated issue**: note it for the final report. Don't fix it.

Continue between steps without asking. Stop only for these:

- an irreversible or destructive action
- a security-sensitive change
- a side effect outside the repo (push, publish, external system)
- a decision the design doesn't answer and that would be costly to get wrong

## Finish

1. Run the full test suite, lint, and typecheck. Everything should pass. If anything fails, explain each failure.
2. Self-review the whole diff (`git diff <base>`) against `CLAUDE.md`:
   - Every hunk traces back to the task (surgical scope).
   - Nothing speculative (YAGNI), and nothing clever where something plain would work (KISS).
   - Errors surface instead of being swallowed (fail fast).
   - The code is consistent with its neighbors, with no debug output and no commented-out code.
3. Report:
   - **Done**: one line per step
   - **Verified**: the commands you ran and their results
   - **Deviations** from the plan
   - **Not done / not verified**
   - **Noticed, not fixed**: unrelated issues for the human to triage
