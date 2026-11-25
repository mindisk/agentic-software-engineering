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
3. List the next commands for the user, in this order. The user types each one, because these skills only start by hand:
   1. `/grill-with-docs` — shape the change.
   2. `/write-spec <change>` — write a spec only if a rule needs one.
   3. `/to-tickets` — split the change into tickets, one repo each. Add the keys to the README.
   4. For each ticket, a session in its repo: `cd <repo>.worktrees/<branch> && claude --add-dir <control plane>`, then `/implement <ticket>`.
