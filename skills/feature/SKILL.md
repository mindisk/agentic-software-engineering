---
name: feature
description: Start or resume a feature in the control plane - create or read features/<change>/README.md, then list the next commands.
disable-model-invocation: true
---

# Feature

Usage: `/feature <change>`, run in the control plane. `<change>` is a kebab-case name.

The feature folder is `features/<change>/`. Its `README.md` is the only state file. Ticket status lives in the issue tracker.

## Resume

If `features/<change>/README.md` exists:

1. Read it, and any `proposal.md`, `spec.md` or `design.md` it links.
2. Report the goal, the tickets and the latest note.
3. Name the next command from the list under **Start**, step 3. Stop.

## Start

If the README does not exist:

1. Copy [`README-template.md`](README-template.md) to `features/<change>/README.md`. Replace `<change>` with the name.
2. Fill in **Goal** and **Trigger** from what the user said. Leave the other sections as they are.
3. List the next steps for the user, in this order:
   1. Shape the change: goal, constraints, open questions. Ask all questions in one round.
   2. `/write-spec <change>`: writes a proposal, spec or design only if a rule needs one.
   3. `implementation-plan`: writes `features/<change>/plan.md`, grouped into tickets, one repo each. The user creates the tickets and adds the keys to the README.
   4. For each ticket, a session in its repo: `cd <repo>.worktrees/<branch> && claude --add-dir <control plane>`, then ask to implement the ticket. The `implementation-execution` skill runs it, and `debugging` handles failures.
