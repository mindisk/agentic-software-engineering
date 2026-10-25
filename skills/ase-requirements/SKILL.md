---
name: ase-requirements
description: "Use when the agentic pipeline reaches Stage 02, when an approved project brief needs turning into requirements (SRS, use cases), when the requirements-analyst returns or raises a blocker, or when SRS.md or use-cases.md needs revising."
---

# ase-requirements — Stage 02

Design must be able to proceed from the requirements without coming back to the engineer about
what the feature must do. Every requirement traces back to the brief, and forward to design and
tests. You run the questions and the gate. The `requirements-analyst` writes the artifacts.

## Inputs and outputs

| | Path (under `<artifacts.path>/<feature>/artifacts/`) |
|--|--|
| In | `01-intake/project-brief.md` (APPROVED) · `state.yaml` (`qa_log`) |
| Out | `02-requirements/SRS.md` · `02-requirements/use-cases.md` |
| Templates | [assets/SRS.md](assets/SRS.md) · [assets/use-cases.md](assets/use-cases.md) |

Before starting, confirm that the brief is `APPROVED` and `state.yaml` shows `stage_01: approved`.
If not, stop and tell the engineer.

## 1. Read the brief, then ask

List the stated and implied behaviours, quality expectations, actors and their goals, and
integrations. Then follow `ase-questions`. Typical Stage 02 questions:
- the MVP boundary, if the brief doesn't set it
- concrete NFR targets: performance, availability, scalability, security
- integration contracts: what external systems provide and expect
- edge cases at boundaries: limits, concurrency, auth failures
- regulatory or compliance requirements
- whether the brief's users are enough, or personas are needed

Wait for the answers, or for accepted defaults, before delegating.

## 2. Delegate to `requirements-analyst`

Pass paths, never content (`ase-terse`):
```
Feature: <feature>
Project brief path: <A>/01-intake/project-brief.md
QA log: <verbatim qa_log from state.yaml>
SRS output path: <A>/02-requirements/SRS.md
Use-cases output path: <A>/02-requirements/use-cases.md
SRS template path: .claude/skills/ase-requirements/assets/SRS.md
Use-cases template path: .claude/skills/ase-requirements/assets/use-cases.md
Constitution path: .agentic/constitution.md (or N/A)
```

**If the analyst returns `REQUIREMENTS BLOCKER`:** relay each question to the engineer in
`ase-questions` format. Record the engineer's answer in `qa_log`, then re-invoke the analyst
with the updated log. The answer is the engineer's to give.
- If you keep work moving while waiting, every assumption you hand the analyst is labelled as unconfirmed and tracked as an `OI-NNN`.
- The gate waits until the engineer confirms or changes the assumption.

## 3. Verify the return against the artifacts

The analyst's summary is a claim. Check the files themselves:

| Check | Fails when |
|-------|-----------|
| Traceability | an FR has no source in the brief or `qa_log`, or a brief scope item has no FR |
| Scope | an FR covers something the brief lists as out of scope |
| Scenarios | an FR has fewer than 2 Given/When/Then scenarios (happy path + error or edge) |
| NFRs | a target has no number and unit ("fast", "reliable", "secure") |
| Solution-free | a requirement names an implementation (a library, a queue, a table) |
| Use cases | a UC has no alternative or error flow, or the FR→UC traceability table is missing |
| Constitution | an `EXCEPTION` is listed without an engineer decision |
| Assumptions | the analyst made assumptions; each one needs the engineer's confirmation |

For each failure:
- **The fix follows from the brief** (missing scenario, missing table, implementation detail): send it back to the analyst with the specific defects, or fix it yourself and list the fix in the summary.
- **The fix is a scope decision** (an invented FR, a vague NFR with no target in the brief): ask the engineer. Don't keep it silently, and don't delete it silently either.

Keep the artifacts `DRAFT` until every check passes.

## 4. Gate

Follow `ase-stage-gate` with the Stage 02 checklist. In the summary, include:
- the counts (FR, NFR, UC)
- the analyst's assumptions, each awaiting confirmation
- the constitution results
- the open items

## Why these limits

- **Verify files, not the return message.** The analyst checks its own work, and a self-check misses what it misread. The summary can say "4/4 mapped" while an FR is out of scope.
- **Scope decisions belong to the engineer.** Requirements that were silently added or dropped get designed, built, and tested, or never built, with nobody having decided either way.
- **Measurable NFRs, solution-free FRs.** Design and Stage 06 tests are built from these words. "Fast" can't be designed for or tested. "Use Celery" is a design decision made before design.
