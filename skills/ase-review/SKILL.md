---
name: ase-review
description: "Use when the agentic pipeline reaches Stage 07, when a tested feature needs its final review, traceability matrix, or sign-off recommendation, or when the staff-engineer-reviewer or security-reviewer returns on an implementation."
---

# ase-review — Stage 07

This stage is not a rubber stamp. It runs in two phases with an engineer gate between them:
- **Phase 1 — is everything here?** Traceability and open items.
- **Phase 2 — is everything good?** Design conformance, test quality, security, and the constitution.

Keeping them apart stops praise for quality from hiding a missing requirement, and stops a
complete matrix from hiding poor quality. The `staff-engineer-reviewer` does the review. You
run the gates.

## Inputs and outputs

| | Path (under `<artifacts.path>/<feature>/artifacts/`) |
|--|--|
| In | every APPROVED artifact from Stages 01–06 · `05-implementation/reports/`, `reviews/`, `panel-findings.md`, `ledger.md` · the code · `.agentic/constitution.md` if present |
| Out | `07-review/review-report.md` (narrative + full traceability matrix) |
| Template | [assets/review-report.md](assets/review-report.md) |

Before starting, confirm that all prior artifacts are `APPROVED`, `state.yaml` shows
`stage_06: approved`, and all Stage 05 tasks are complete. If not, stop and tell the engineer.

## Phase 1 — structural completeness

1. Invoke `staff-engineer-reviewer`:
   ```
   Feature: <feature>
   Phase: 1
   Artifacts base path: <A>/
   Source code path: <source paths>
   Review report output path: <A>/07-review/review-report.md
   Review report template path: .claude/skills/ase-review/assets/review-report.md
   ```
   It returns:
   - the traceability matrix: FR/NFR → design element → TASK → TC → `FULL`, `PARTIAL`, or `NOT COVERED`
   - the coverage score
   - a disposition for every `OI-NNN` from every stage: `RESOLVED`, `DEFERRED`, or `STILL OPEN`
2. Present it as returned, with the Phase 1 sub-checklist (`ase-stage-gate`, Stage 07 Phase 1).
3. **For each PARTIAL, NOT COVERED, or STILL OPEN item, ask for the engineer's decision:**
   - go back to the relevant stage and close the gap, or
   - accept it as a documented risk, or defer it, naming the target release

   Make it answerable in one reply: one line per gap, with options.
4. Record the decisions verbatim in `qa_log`. **Phase 2 starts only after they are recorded.** The decisions are the engineer's. Time pressure shortens the message, not the gate.

## Phase 2 — quality

1. Invoke `staff-engineer-reviewer`:
   ```
   Feature: <feature>
   Phase: 2
   Artifacts base path: <A>/
   Source code path: <source paths>
   Review report output path: <A>/07-review/review-report.md
   Review report template path: .claude/skills/ase-review/assets/review-report.md
   Phase 1 engineer decision: <verbatim record>
   ```
   The reviewer:
   - reads `panel-findings.md` first and verifies its dispositions instead of repeating the panel's work
   - looks for what the panel could not see: undeclared deviations, decisions made without approval, missing designed error handling, interfaces that differ from design §4
   - assesses test quality: happy path only, acceptance criteria with no test, tests that pass trivially, failures glossed over
2. **Security review.** Find the Stage 05 panel head in `ledger.md` (`B2 · panel at HEAD <sha>`). Then check whether any production code changed after it. Read the commits after the panel head, and the Stage 06 results for "fixed in" notes.
   - **Only test code changed:** reuse `05-implementation/reviews/panel-security-reviewer.md`, and record that it was reused.
   - **Production code changed:** do not reuse it. Invoke `security-reviewer` covering at least the changed files, and tell the engineer why:
     ```
     Mode: implementation
     Feature: <feature>
     SRS path: <A>/02-requirements/SRS.md
     Design path: <A>/03-design/design.md
     Source code paths: <the files from the reports' "Files" sections, plus the files changed since the panel head>
     Constitution path: .agentic/constitution.md (or N/A)
     ```
   - HIGH findings block sign-off until they are fixed or accepted as a documented risk. MEDIUM and LOW go to the engineer.
3. **Constitution:** the reviewer runs `ase-constitution-check` for the `check_at: review` articles, and confirms implementation-time results across all articles. An `EXCEPTION` with no ADR is a blocking defect: the engineer writes a retrospective ADR, or the code is fixed.
4. Check that `review-report.md` has all 9 sections, and that §6 (constitution and security) holds the security result actually used.

## Gate — sign-off

Present:
- the design deviations
- the test quality assessment
- the constitution table
- the remaining risks
- an **honest** sign-off recommendation
- the full Stage 07 checklist, both phases

Follow `ase-stage-gate`. The engineer's approval of the report is the feature's sign-off.

## Why these limits

- **The engineer decides on every Phase 1 gap.** An accepted risk is the engineer's to accept. A gap you accept on their behalf ships as if it had been reviewed.
- **Reuse a security review only if no production code changed after it.** A review covers the code it read. Code changed after the panel, often a fix made under pressure, is exactly the code nobody has reviewed.
- **An honest recommendation.** A sign-off that hides a gap moves the cost to production, where the gap costs most.
