# Verification panel

A panel is a gate on one artifact. Several independent reviewers each look through one lens and vote. The vote arithmetic runs in code (`workflow/`), not in a model.

## When it runs

Per stage, as set in the consumer config (`panel.stages`). Defaults:

| Stage | Panel | Artifact | Lenses |
|---|---|---|---|
| intake | off | `01-intake/*` | scope-clarity · success-criteria · constraint-completeness |
| requirements | off | `02-requirements/*` | coverage · testability · conflicts |
| design | off | `03-design/*` | requirement-coverage · completeness · security-consistency |
| planning | **on** | `04-planning/plan.md`, `user-stories.md` | traceability · waves (no cycles, no two same-repo tasks in one wave) · granularity (Repo/Agent/Skills on every task) |
| implementation | off | code + tests of one task | correctness · test-quality · security-conventions |
| testing | off | `06-testing/<repo>/*` + test code | fr-coverage · edge-independence · results-honesty |
| review | **on** | `07-review/review-report.md` | traceability · impl-vs-design · test-signoff |
| handover | off | `08-handover/*` | completeness · operability · rollback |

## The vote

```json
{
  "reviewer": "<stage>/<lens>",
  "vote": "accept | reject",
  "blocking": [{ "id": "B-1", "summary": "...", "evidence": "file:line", "why_blocking": "..." }],
  "notes": ["..."]
}
```

- `accept`: from this lens the artifact is complete and correct enough to build on. `blocking` is empty.
- `reject`: at least one blocking gap, listed in `blocking`.
- When in doubt, `reject`.
- A gap is blocking when it forces a later decision to be guessed. Style is a note.

## Decision

1. Fewer valid votes than `quorum`: re-spawn the missing reviewers once. Still short: `NEEDS_HUMAN`.
2. A security lens with a blocking item forces rework, when `security_veto` is on.
3. `accept` votes ≥ `quorum`: pass.
4. Otherwise: rework. A fresh author gets the union of all blocking items. New reviewers vote again. After `rework_rounds` rounds without a pass: `ESCALATED`.

Rework runs for every stage up to implementation. A rejected test or review panel escalates to Gate 2 at once, because the fix is a code change the user decides on.

The script sets each vote's lens. An `accept` that lists blocking items counts as `reject`.

Never mark an item passed to end a rework loop. Escalate it.

## Rules for reviewers

- Read only. Never edit the artifact, the code or `state.yaml`.
- Judge through the assigned lens only.
- Do not see other votes or the author's reasoning.

## Config

```yaml
panel:
  size: 3
  quorum: 2           # between ceil(size/2) and size
  rework_rounds: 2
  security_veto: true
  stages: { planning: true, implementation: false, testing: false, review: true }   # others default off
```
