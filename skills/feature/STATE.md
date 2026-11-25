# Feature state

## state.yaml

`<artifacts.path>/<change>/state.yaml`. Only the coordinator writes it. If only `.agentic/features/<change>/state.yaml` exists (older layout), use that file.

```yaml
feature: <change>
project: <project.name from config>
current_stage: 1
feature_status: in_progress        # in_progress | done | abandoned
created: YYYY-MM-DD
updated: YYYY-MM-DD

stages:                            # pending | in_progress | approved | skipped
  stage_01: pending                # intake
  stage_02: pending                # requirements
  stage_03: pending                # design
  stage_04: pending                # planning
  stage_05: pending                # implementation
  stage_06: pending                # testing
  stage_07: pending                # review
  stage_08: pending                # handover
skipped: {}                        # stage_NN: reason (e.g. which RULES.md rule did not fire)

gates:                             # pending | approved
  plan: pending                    # after stage 04
  pre_merge: pending               # after stage 07
  final: pending                   # after merge

tasks:                             # from plan.md, after Gate 1
  - id: TASK-001
    repo: <repo key>
    key: <tracker key>             # empty until a ticket exists
    status: open                   # open | passed | escalated | needs_human | deferred | accepted | dropped | merged

workflow:
  run_id: <id>                     # last autonomous-pipeline run, for resumeFromRunId
  result: <path>

panels: []                         # - { stage: "04", status: pass | rework | needs_human, round: 0 }
escalations: []                    # - { item: TASK-002, reason: <text> }

qa_log: []                         # - { stage: "01", q: <question>, a: <answer> }  — never ask these again
open_items: []                     # - { id: OI-001, description: <text>, stage: "05" }
error_log: []
# error_log entry:
#   - id: E-001
#     stage: 5
#     task: TASK-003
#     description: "What went wrong"
#     attempts:
#       - { approach: "First thing tried", outcome: "failed — reason" }
#     resolution: RESOLVED | DEFERRED | ESCALATED
```

Rules:

- Set a stage to `approved` only after its gate or the user's acceptance. Set `current_stage` to the next stage at the same time.
- An escalation leaves the list only when the user decides it at a gate.
- Bump `updated` on every write.

## Feature folder

```
<artifacts.path>/<change>/
├── README.md              hub: goal, repos, links to every artifact
├── state.yaml
├── memory/
│   ├── PLAN.md            current stage, key decisions, open questions
│   ├── FINDINGS.md        codebase patterns, answers, discoveries — so nothing is read twice
│   └── PROGRESS.md        session log, tasks done, errors, test results
└── artifacts/
    ├── 01-intake/         project-brief.md or proposal.md
    ├── 02-requirements/   SRS.md + use-cases.md, or spec.md
    ├── 03-design/         design.md (Section 4: interface contracts), adr/
    ├── 04-planning/       plan.md, user-stories.md
    ├── 05-implementation/ TASK-NNN-notes.md
    ├── 06-testing/        <repo>/test-plan.md, <repo>/test-results.md
    ├── 07-review/         review-report.md
    └── 08-handover/       operations-manual.md
```

Create the folders when the feature starts. A skipped stage keeps its empty folder.

## Templates

For each artifact, use the first template that exists:

1. `templates/<NN-stage>/<file>` in the control plane (project-specific).
2. `<engine.path>/templates/<NN-stage>/<file>` (default).

`templates/TEMPLATE-GUIDE.md` in the control plane, if it exists, holds writing rules for every artifact.
