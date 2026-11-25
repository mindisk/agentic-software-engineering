# agentic-software-engineering

A Claude Code plugin that coordinates feature work across many repos from one control plane. You control the feature in one place. Workers build in each repo's worktree, with that repo's context loaded.

## Parts

| Part | Role |
|---|---|
| `/feature <change>` | The coordinator. Runs the stages, the panels and the three human gates. Keeps `features/<change>/state.yaml`. |
| `write-spec` | Writes stages 01–03 only when `RULES.md` needs them. |
| `technical-design` | Frames the problem, compares options, recommends one. |
| `implementation-plan` | Writes `plan.md` with `TASK-NNN` blocks (one repo each) and fan-out waves. |
| `implementation-execution` | Builds a step test first, then self-reviews the diff. |
| `debugging` | Finds the root cause before any fix. |
| `agents/` | Specialists: `requirements-analyst`, `adr-specialist`, `adr-generator`, `design-reviewer`, `security-reviewer`, `senior-software-engineer`, `api-engineer`, `qa-engineer`, `staff-engineer-reviewer`, `handover-writer`, `panel-reviewer`. |
| `workflow/autonomous-pipeline.js` | Implement → test → review across repos, with rework and escalation. |
| `workflow/panel.js` | One voting panel on one artifact. |
| `protocols/` | Question protocol, uncertainty rules, artifact standards, stage checklist, panel rules. |
| `templates/` | One folder per stage, `01-intake` … `08-handover`, plus `constitution.md` and `constitution-interview.md`. |
| `PRINCIPLES.md` | The engineering principles the skills review against. |

## Stages

The feature folder keeps the v1 layout: `README.md` hub, `state.yaml`, `memory/` (PLAN, FINDINGS, PROGRESS) and `artifacts/01-intake` … `08-handover`.

| # | Stage | Work | Template(s) | Panel default | Gate |
|---|---|---|---|---|---|
| 01 | intake | goal, repos; `write-spec` decides 01–03 | `project-brief.md` | off | — |
| 02 | requirements | only if a rule fires | `SRS.md`, `use-cases.md` | off | — |
| 03 | design | only if a rule fires | `design.md`, `adr/` | off | — |
| 04 | planning | `implementation-plan` | `plan.md`, `user-stories.md` | on | **1: plan** |
| 05 | implementation | workflow, one task per repo worktree | — | off | |
| 06 | testing | workflow, per repo | `test-plan.md`, `test-results.md` | off | |
| 07 | review | workflow, whole feature | `review-report.md` | on | **2: pre-merge** |
| — | merge | you merge the worktrees | — | — | **3: final** |
| 08 | handover | only if operations change | `operations-manual.md` | off | — |

Templates live in `templates/<NN-stage>/`. A file at the same path in the control plane's `templates/` takes precedence.

An optional `.agentic/constitution.md` in the control plane holds organisation rules. Each article has `check_at`; the specialists check it at design, implementation, testing and review. A violation stops the task as a design gap, or blocks sign-off. `protocols/` holds the question protocol, uncertainty rules, artifact standards, stage checklist and panel rules.

## Control plane

A control plane is a repo where your feature folders live. It needs:

```
.agentic/config.yaml
templates/          optional overrides: <NN-stage>/<file>, and TEMPLATE-GUIDE.md
features/<change>/  created by /feature
```

`.agentic/config.yaml`:

```yaml
project:
  name: My Project
engine:
  path: /abs/path/to/this/repo        # workflow scripts, agents, templates and protocols are read from here
artifacts:
  path: features
repos:
  my-api: /abs/path/to/my-api         # worktrees go to <path>.worktrees/<change>
panel:
  size: 3
  quorum: 2
  rework_rounds: 2
  security_veto: true
  stages: { planning: true, implementation: false, testing: false, review: true }   # others default off
agent_types: {}                       # optional: agent name → installed type, e.g. { qa-engineer: "<plugin>:qa-engineer" }
```

## Install

```
claude plugin marketplace add <path to this repo>
claude plugin install agentic-software-engineering@agentic-software-engineering
```

After a change, bump `version` in `.claude-plugin/plugin.json` and run `claude plugin update`. The installed copy is cached.
