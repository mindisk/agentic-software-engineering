---
name: ase-recovery
description: "Use when a test, gate, merge, integration, or specialist fails during an agentic pipeline stage, before retrying anything, and when resuming work that failed in an earlier session."
---

# ase-recovery — 3-strike rule

## Before any retry

Read `state.yaml` → `error_log`. If this task or step already has attempts logged,
**do not repeat an approach marked as failed.** Start from the last failed point with a
different approach. The number of attempts already logged tells you which strike you are on.

## Strikes

1. **Diagnose and retry.** **REQUIRED SUB-SKILL:** superpowers:systematic-debugging. Find the root cause before any fix, then retry the same goal with a corrected approach. Most failures have a fixable cause.
2. **Use a structurally different approach.** Abandon the first approach. Log why it failed and why this one is different.
3. **Rethink the assumptions.** Re-read the approved artifacts. If the problem lies in an artifact (a design gap, a conflicting requirement, a missing spec), surface it to the engineer as `[BLOCKER]` and stop until it is resolved.

## Logging (after every strike)

Append to `state.yaml` → `error_log`, and write one line to `PROGRESS.md` naming the error ID:

```yaml
- id: E-<NNN>
  stage: <N>
  task: <TASK-NNN>        # omit if not task-specific
  description: "<what went wrong>"
  attempts:
    - attempt: 1
      approach: "<what was tried>"
      outcome: "failed — <why>"
  resolution: DEFERRED     # RESOLVED | DEFERRED | ESCALATED
```

Resolved entries with 2 or more attempts are prime input for Compound (`ase-kb-capture`).
Write the root cause clearly.

## Why these limits

- **Never repeat a logged failed approach.** Repeating it burns time and tokens for a known result.
- **Never absorb a failure silently.** It reappears later as a mysterious defect, without the context needed to fix it.
- **Tell the engineer at strike 3.** By then the problem is usually in the inputs, not the execution, and only the engineer can change the inputs.
- **Mark `RESOLVED` only when the acceptance criteria are met.** Compound harvests resolved entries as solved problems, so a false `RESOLVED` teaches the wrong lesson.
