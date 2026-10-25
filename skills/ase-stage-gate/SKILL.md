---
name: ase-stage-gate
description: "Use when an agentic pipeline stage's artifacts are drafted and about to be shown to the engineer for approval, and right after the engineer approves or rejects a stage."
---

# ase-stage-gate — self-review, present, advance

The engineer's job at a gate is to **check your assessments**, not to work through the
checklist themselves. Your job is to make each assessment honest and quick to check.

## 1. Self-review

1. Open [checklists.md](checklists.md). Take the **General** checklist plus the section for the current stage.
2. Mark every item `[PASS]`, `[FAIL]`, or `[N/A — reason]`.
3. Compute every metric line (`[X]/[Y] …`) by **counting IDs in the produced artifacts**. Do not estimate.
4. Fix each `[FAIL]` now, then re-assess it. Do not present while any checkable item is `[FAIL]`. If an item cannot be fixed, it becomes an `[OPEN]` item plus a question for the engineer.
5. If a constitution is loaded and the stage checks it, confirm the specialist's `ase-constitution-check` results are present.

## 2. Present

Send one message, following `ase-terse`:
1. **Produced:** artifact paths, one line each.
2. **Key decisions:** `D-NN` lines, and any `[UNRESOLVED]` items or `[NEEDS CLARIFICATION]` markers listed together.
3. **Filled checklist:** the items with their marks, plus the metrics.
4. **Approval question:** the one from the stage's checklist section.

If the engineer disagrees with a `[PASS]`, that item becomes a revision request. Revise the
artifact, then go back to step 1.

**Do not advance without explicit approval.** "Looks good" or "proceed" both count.

## 3. After approval

1. Set the artifact `status: APPROVED`, add the engineer to `approved_by`, and bump the version if anything changed.
2. In `state.yaml`, set `stage_NN: approved` and `current_stage: NN+1`, and update `updated`.
3. Update the memory files, as described in `ase-feature-state`.
4. Ask: *"Stage NN approved. Ready to begin Stage NN+1 — <name>?"*

## Git

The pipeline never pushes or opens PRs. Only Stage 05 commits, on `feat/<feature>`. In every
other stage, the engineer decides when artifacts and code get committed.
