# agentic-software-engineering

A Claude Code plugin that coordinates feature work across many repos from one control plane. You control the feature in one place. Workers build in each repo's worktree, with that repo's context loaded.

## Parts

| Part | Role |
|---|---|
| `/feature <change>` | The coordinator. Runs the stages, the panels and the three human gates. Keeps `features/<change>/state.yaml`. |
| `write-spec` | Writes a proposal, spec or design only when `RULES.md` needs one. |
| `technical-design` | Frames the problem, compares options, recommends one. |
| `implementation-plan` | Writes `plan.md` with tickets (one repo each) and waves. |
| `implementation-execution` | Builds a step test first, then self-reviews the diff. |
| `debugging` | Finds the root cause before any fix. |
| `agents/` | `implementer`, `qa-engineer`, `reviewer`, `panel-reviewer`. |
| `workflow/autonomous-pipeline.js` | Implement → test → review across repos, with rework and escalation. |
| `workflow/panel.js` | One voting panel on one artifact. |
| `protocols/verification-panel.md` | The panel rules. |
| `PRINCIPLES.md` | The engineering principles the skills review against. |

## Stages

| Stage | Work | Panel default | Gate |
|---|---|---|---|
| shape | goal, repos, questions | — | — |
| spec | `write-spec`, only if a rule fires | off | you review the documents |
| plan | `implementation-plan` | on | **1: plan** |
| build | `autonomous-pipeline.js` | implement off, test off, review on | **2: pre-merge** |
| merge | you merge the worktrees | — | **3: final** |

## Control plane

A control plane is a repo where your feature folders live. It needs:

```
.agentic/config.yaml
templates/          proposal.md, spec.md, design.md, TEMPLATE-GUIDE.md (for write-spec)
features/<change>/  created by /feature
```

`.agentic/config.yaml`:

```yaml
engine:
  path: /abs/path/to/this/repo        # the workflow scripts and agent files are read from here
repos:
  my-api: /abs/path/to/my-api         # worktrees go to <path>.worktrees/<change>
panel:
  size: 3
  quorum: 2
  rework_rounds: 2
  security_veto: true
  stages: { spec: false, plan: true, implement: false, test: false, review: true }
agent_types: {}                       # optional: installed agent names, e.g. { implementer: "<plugin>:implementer" }
```

## Install

```
claude plugin marketplace add <path to this repo>
claude plugin install agentic-software-engineering@agentic-software-engineering
```

After a change, bump `version` in `.claude-plugin/plugin.json` and run `claude plugin update`. The installed copy is cached.
