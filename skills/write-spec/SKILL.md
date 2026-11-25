---
name: write-spec
description: Decide with RULES.md whether a feature needs intake, requirements and design documents, and write only those, from the templates, into the feature's artifacts folders. Use in stage 01 of the feature coordinator, or when the user asks for a spec.
---

# Write spec

The `/feature` coordinator runs this in stage 01. The user can also run `/write-spec <change>` in the control plane.

The feature folder, `state.yaml` and the template lookup are defined in the `feature` skill's `STATE.md`. Template names below are files under `templates/<NN-stage>/`, found by that lookup.

## Steps

1. **Read the change.** Read the feature README hub, `memory/`, `qa_log` and the conversation. Done when you can state the goal, the repos touched, and what the change alters.

2. **Apply the rules.** Read [`RULES.md`](RULES.md) and check every condition. Record the result in `state.yaml` as it says. If no rule fires, stop.

3. **Read the writing rules.** Read `templates/TEMPLATE-GUIDE.md` in the control plane, if it exists, and `protocols/artifact-standards.md` in the engine.

4. **Write 01 intake.** Use `01-intake/proposal.md` if that template exists, else `01-intake/project-brief.md`. Write it to `artifacts/01-intake/`.

5. **Write 02 requirements.** Use `02-requirements/spec.md` if that template exists, else `02-requirements/SRS.md` and `02-requirements/use-cases.md`. Write them to `artifacts/02-requirements/`. Done when every requirement has an ID, traces to a use case, and has at least one testable scenario.

6. **Write 03 design, if its rule fired.** Use the `technical-design` skill to make the decisions. Record them in `artifacts/03-design/design.md` from the `03-design/design.md` template. Add `api-contracts.md` when an external API changes.

For every document: follow the template's own instructions (gates, depth, checklists). Done when every section is filled or removed, no placeholder is left, and every open point is in the Open Items table.

7. **Hand over.** List the files you wrote and the stages skipped, with the reason. The coordinator shows them to the user.
