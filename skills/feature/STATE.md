# state.yaml

`features/<change>/state.yaml` is the coordinator's state. Only the coordinator writes it. Workers and reviewers never write it.

```yaml
change: <change>
stage: shape            # shape | spec | plan | build | merge | done
gates:
  plan: pending         # pending | approved
  pre_merge: pending
  final: pending
spec_rule: none         # which RULES.md rule fired, or none
tickets:                # from plan.md, after Gate 1
  - id: T-1
    repo: <repo-key>
    key: <tracker key>  # empty until the user creates the ticket
    status: open        # open | passed | escalated | needs_human | deferred | merged
workflow:
  run_id: <id>          # last autonomous-pipeline run, for resumeFromRunId
  result: <path>        # where the run result was saved
panels:                 # one entry per panel run
  - stage: plan
    status: pass        # pass | rework | needs_human
    round: 0
escalations:            # open items for the next gate
  - item: T-2
    reason: <text>
log:                    # one line per event
  - 2026-11-25 created
```

Rules:

- Update `stage` only after the gate or step that ends the current stage.
- Add a `log` line for each stage change, gate decision, panel result and workflow run.
- An escalation leaves the list only when the user decides it at a gate.
