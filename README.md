# agentic-software-engineering

A Claude Code plugin with two skills for feature work. It works beside [`mattpocock-skills`](https://github.com/mattpocock/skills), which owns grilling, tickets, TDD, implementation and review.

| Skill | Use |
|---|---|
| `/feature <change>` | Start or resume a feature. Creates or reads `features/<change>/README.md` in the control plane. |
| `/write-spec <change>` | Writes a proposal, spec or design only when a rule in `skills/write-spec/RULES.md` needs one. Templates come from `templates/` in the control plane. |

`PRINCIPLES.md` holds the engineering principles.

## Flow

1. Control plane: `/feature`, `/grill-with-docs`, `/write-spec`, `/to-tickets`.
2. Each repo: open Claude Code in `<repo>.worktrees/<branch>`, then `/implement <ticket>`, `code-review`, `pr`, `retro`.

## Install

```
claude plugin marketplace add <path to this repo>
claude plugin install agentic-software-engineering@agentic-software-engineering
```

After a change, bump `version` in `.claude-plugin/plugin.json` and run `claude plugin update`. The installed copy is cached.

## v1 pipeline

The old staged pipeline (coordinator, specialists, stages) is in the history before this version.
