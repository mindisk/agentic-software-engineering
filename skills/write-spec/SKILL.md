---
name: write-spec
description: Decide whether a feature needs a proposal, spec or design, and write only the ones it needs, from the project's templates, into the feature folder.
disable-model-invocation: true
---

# Write spec

Usage: `/write-spec <change>`, run in the control plane after `/feature <change>`.

Templates come from `templates/` in the control plane: `proposal.md`, `spec.md`, `design.md` and `TEMPLATE-GUIDE.md`. If a file that a step needs is missing, stop and tell the user which one.

## Steps

1. **Read the change.** Read `features/<change>/README.md` and the conversation so far. Done when you can state the goal, the repos touched, and what the change alters.

2. **Apply the rules.** Read [`RULES.md`](RULES.md) and check every condition against the change. Write the result to the README as the rules file says. If no rule fires, tell the user that the ticket is enough, and stop.

3. **Read the guide.** Read `templates/TEMPLATE-GUIDE.md`. Its writing rules apply to every line you write.

4. **Write the proposal.** Copy `templates/proposal.md` to `features/<change>/proposal.md` and fill it in. Done when every section is filled or removed, and no placeholder comment is left.

5. **Write the spec.** Copy `templates/spec.md` to `features/<change>/spec.md` and fill it in. Stop at each GATE block and follow its loop. Done when every requirement has an ID, exactly one RFC 2119 keyword and at least one scenario, and every `REQ-` requirement has a `Traces to:` line.

6. **Write the design, if its rule fired.** Use the `technical-design` skill to make the decisions. Copy `templates/design.md` to `features/<change>/design.md` and record them there. Set `depth:` to `lite` unless the change needs more, and fill only the sections that depth keeps. Done when every gate is processed or skipped and no `[NEEDS CLARIFICATION]` marker remains.

7. **Hand over.** List the files you wrote. Tell the user to review them. The next step is the `implementation-plan` skill.
