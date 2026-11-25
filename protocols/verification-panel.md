# Verification panel

A panel is a gate on one artifact. Several independent reviewers each look through one lens and vote. The vote arithmetic runs in code (`workflow/`), not in a model.

## When it runs

Per stage, as set in the consumer config (`panel.stages`). Defaults:

| Stage | Panel | Artifact | Lenses |
|---|---|---|---|
| plan | on | `plan.md` | traceability (ticket ↔ spec/design) · waves (dependencies, no cycles, one repo per ticket) · granularity (one reviewable change per ticket) |
| implement | off | code + tests of one ticket | correctness · test-quality · security-conventions |
| test | off | test plan, results, test code of one repo | coverage · edge-cases · results-honesty |
| review | on | `review-report.md` | traceability · impl-vs-design · test-signoff |

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
  stages: { plan: true, implement: false, test: false, review: true }
```
