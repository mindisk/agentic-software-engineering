# Brief — TASK-NNN — <title>

Feature: <feature> · Wave: <N> · Agent: <agent> · Tier: <tier>

## Where this fits
<1–3 sentences: what this task contributes to the feature and what depends on it.>

## Task (verbatim from plan.md)
<description>

## Acceptance criteria (verbatim from plan.md)
- AC-NNN-1: <criterion>

## Files you own
<owns[] from tasks.json — edit only these; creating new files under these paths is fine.
If you must touch anything else, stop and return NEEDS_CONTEXT.>

## Verify command
`<verify from tasks.json>`

## Design references
- design.md §<section> — <COMP-NN / API-NNN> (read only these sections)
- ADR-NNNN — <title> (if relevant)

## Interfaces available from earlier tasks
<Signatures/paths from prior task reports and the blackboard that this task should call or extend.
"None" for the first wave.>

## Knowledge to apply
<KB entry IDs + one-line gist from context-pack.md that bear on this task; "None" if none.>

## Rulings
<Controller decisions on ambiguities, copied from ledger.md ("Ruling: …"). "None" if none.>

## Global constraints (verbatim)
- Constitution articles with check_at: implementation | all — <article list or N/A>
- <any plan-wide constraint>

## Paths
- Artifacts base: <abs path to artifacts/>
- design.md: <abs path>
- Constitution: <abs path or N/A>
- Report: write to `.ase/reports/TASK-NNN.md` relative to your working directory (do not commit it)
