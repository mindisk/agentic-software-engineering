---
name: ase-feature-state
description: "Use when an agentic pipeline session starts or ends, when the engineer names a new or existing feature, or asks to continue, resume, or check status, or when state.yaml or the PLAN, FINDINGS, or PROGRESS memory files need reading or updating."
---

# ase-feature-state — state, memory, resume

## Layout

```
.agentic/features/<feature>/state.yaml        ← always in the product repo, versioned with code
<artifacts.path>/<feature>/
├── memory/   PLAN.md · FINDINGS.md · PROGRESS.md
└── artifacts/
    ├── 01-intake/            project-brief.md
    ├── 02-requirements/      SRS.md · use-cases.md
    ├── 03-design/            design.md · adr/adr-NNNN-<slug>.md
    ├── 04-planning/          user-stories.md · plan.md · tasks.json
    ├── 05-implementation/    ledger.md · context-pack.md · blackboard.md · panel-findings.md · briefs/ · reports/ · reviews/
    ├── 06-testing/           test-plan.md · test-results.md
    ├── 07-review/            review-report.md
    └── 08-handover/          operations-manual.md · pipeline-feedback.md
```

`artifacts.path` comes from `.agentic/config.yaml`, and the default is `.agentic/features`. A relative
path resolves from the repo root. An absolute path may be outside the repo; create it if it is missing.

## Starting

1. Ask which feature you are working on. Then read `state.yaml` for `current_stage`, `feature_status`, `qa_log`, `open_items`, and `error_log`.
   - Never re-ask a question that is already in `qa_log`.
   - Never repeat an approach that `error_log` records as failed.
2. Read the three memory files. Create any that are missing as empty files.

### New feature: initialise

Create the directories: `artifacts/{01-intake,02-requirements,03-design/adr,04-planning,05-implementation,06-testing,07-review,08-handover}` and `memory/`.

Then write `state.yaml`:

```yaml
feature: <feature-name>
project: <from config.yaml>
current_stage: 1
feature_status: in_progress
created: YYYY-MM-DD
updated: YYYY-MM-DD
stages:
  stage_01: pending
  stage_02: pending
  stage_03: pending
  stage_04: pending
  stage_05: pending
  stage_06: pending
  stage_07: pending
  stage_08: pending
qa_log: []        # - {q: "...", a: "...", stage: N, date: YYYY-MM-DD}
open_items: []    # - {id: OI-NNN, description: "...", owner: engineer, target_stage: N, status: open}
error_log: []     # shape: see ase-recovery
```

### Resume a stage left `in_progress`

- **Stage 05:** follow `ase-build` → Resuming. Never offer to restart a build.
- **Other stages:**
  1. Read `PROGRESS.md`, then answer for yourself before using any tool:
     - Where am I?
     - Where am I going?
     - What is the goal?
     - What have I learned (from `FINDINGS.md`)?
     - What did I last do?
  2. Ask: *"Stage NN — <name> is in progress. Last completed: <checkpoint>. Resume, or restart the stage?"*
  3. **Resume:** continue from the next unfinished item and redo nothing.
  4. **Restart:** clear that stage's `in_progress` records, reset its `PROGRESS.md` block, and begin the stage from its first step.

## Memory files

Only write facts that matter to a future session.

**`PLAN.md`** — update when structure changes. Remove entries once they are resolved.
```markdown
# Plan
## Active Feature
- Feature: <name> · Stage: <N — name> · Status: <in_progress | blocked>
## Key Decisions
- [D-01] <decision> — rationale, date
## Open Questions
- <question> — waiting for: engineer | stage N
```

**`FINDINGS.md`** — append when something is discovered. Never delete; mark entries `resolved` or `superseded`.
```markdown
# Findings
## Codebase Patterns
- <pattern> (source: path)
## Surfaced Conflicts
- [OI-NNN] <conflict> — status: open | resolved
## Q&A Resolutions
- Q: … → A: …, Stage N, date
## Stage-Specific Discoveries
### Stage <N>
- <anything expensive to re-derive>
```

**`PROGRESS.md`** — append one block per session. Never overwrite it.
```markdown
## Session YYYY-MM-DD
- Stage: <N>
- Completed: <milestones>
- Errors: <E-NNN refs, or none>
- Test results: <if applicable>
- Stopped at: <exact resume point>
```
