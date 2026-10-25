---
name: ase-kb-capture
description: "Use when a feature reaches the end of Stage 08, or when the engineer asks to compound, capture lessons, do a retro, or update the knowledge base for a feature, whether it shipped or was abandoned."
---

# ase-kb-capture — Compound

Turn one feature's experience into knowledge the next feature can find. Run this from the
coordinator by delegating to the `knowledge-curator` agent. In fallback, do the steps yourself.

## Inputs (paths only)

- `A/05-implementation/blackboard.md`, `reports/*.md`, `reviews/*.md`, `panel-findings.md`, `ledger.md` (the `Ruling:` lines)
- `.agentic/features/<feature>/state.yaml` → `error_log`, `qa_log`
- `A/06-testing/test-results.md`, `A/07-review/review-report.md`
- `A/03-design/adr/` (link the ADRs; do not copy them)
- The KB at `kb.path` (default `.agentic/kb`) and its `index.md`

## What qualifies

A candidate qualifies only if **someone would plausibly hit it again and re-deriving it would cost time**.

**Qualifies:**
- A root-caused failure (`error_log` entries with 2 or more attempts, gate failures, merge conflicts)
- A non-obvious convention
- A library or environment trap
- A ruling that will recur
- A review finding class that showed up in 2 or more tasks

**Does not qualify:**
- Anything the code or git history already says plainly
- One-off typos
- Feature-specific trivia

## Procedure

1. **Collect candidates.**
   - Every `[gotcha|pattern|decision|solution]` discovery.
   - Every resolved `error_log` entry.
   - Repeated review findings.
   - Rulings.
   - `owns` mistakes, which show up as merge conflicts in the ledger.
2. **Dedupe against the KB.**
   - For each candidate, search the KB with its files, tags, and title words, following the `ase-kb-search` procedure.
   - If an existing entry covers it, update that entry: add the new source, refresh `verified_at` to the current `HEAD`, and sharpen the text. Do not create a near-duplicate.
   - If the new knowledge contradicts an entry, write the new entry and set the old one to `status: superseded-by:KB-NNNN`.
3. **Write new entries** using `.claude/skills/ase-kb-capture/assets/kb-entry.md`. Name them `<kb>/<type>s/KB-NNNN-<slug>.md`. The ID is the highest `KB-NNNN` in `index.md` plus one; if there are none, start at `KB-0001`. Keep each to one problem, at most about 40 lines. The frontmatter uses inline lists only.
4. **Update `index.md`.** Keep one row per entry, sorted by ID, in the table format already in the file. Add rows for new entries, and update the title, tags, or status of changed ones. Never delete a row: superseded entries keep theirs with the new status.
5. **Propose promotions. Never apply them directly.**
   - If a lesson is cheap to state and applies to most future work (for example, "always run X before Y"), draft it as a diff to `CLAUDE.md`.
   - If it is an organisational rule, draft a constitution article instead.
   - Present the drafts to the engineer, and apply them only after approval.
6. **Pipeline feedback.** Record friction in the process itself, not in the product, at `A/08-handover/pipeline-feedback.md`. Examples: a brief that missed context, a reviewer that produced noise, a stage that asked for useless input. This feeds improvements to the engine.
7. **Return:**
   - New, updated, and superseded entry IDs
   - Proposed promotions
   - The path to the feedback file

## Why these limits

- **Distil; don't copy whole reports or diffs.** The knowledge base is only useful if a future agent can read an entry in seconds. Raw reports bury the one useful sentence.
- **No secrets, credentials, or customer data.** The knowledge base is committed and read by every future session.
- **Supersede entries; don't delete them.** History explains why an old pattern was dropped. The supersede chain also keeps old references from going stale silently.
