# agentic-software-engineering

A Claude Code plugin for feature work, from idea to merged code. It has no dependency on other plugins.

| Skill | Use |
|---|---|
| `/feature <change>` | Start or resume a feature. Creates or reads `features/<change>/README.md` in the control plane. |
| `/write-spec <change>` | Writes a proposal, spec or design only when a rule in `skills/write-spec/RULES.md` needs one. |
| `technical-design` | Frames the problem, compares options, recommends one. |
| `implementation-plan` | Orders the work into small, verifiable steps, grouped into tickets. |
| `implementation-execution` | Builds each step test first, then self-reviews the diff. |
| `debugging` | Finds the root cause before any fix. |

You type `/feature` and `/write-spec`. The other four start when the task fits, or when you name them.

`PRINCIPLES.md` holds the engineering principles the skills review against. Copy them into your `CLAUDE.md`.

## Flow

1. Control plane: `/feature`, `/write-spec`, `implementation-plan`.
2. Each repo: open Claude Code in `<repo>.worktrees/<branch>` and implement the ticket.

`/write-spec` reads templates from `templates/` in the control plane: `proposal.md`, `spec.md`, `design.md`, `TEMPLATE-GUIDE.md`.

## Install

```
claude plugin marketplace add <path to this repo>
claude plugin install agentic-software-engineering@agentic-software-engineering
```

After a change, bump `version` in `.claude-plugin/plugin.json` and run `claude plugin update`. The installed copy is cached.

## v1 pipeline

The old staged pipeline (coordinator, specialists, stages) is in the history before this version.
