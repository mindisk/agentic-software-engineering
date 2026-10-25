---
name: ase-design
description: "Use when the agentic pipeline reaches Stage 03, when approved requirements need a system design, when design.md or its ADRs need writing or revising, or when the adr-specialist, design-reviewer, or security-reviewer returns on a design."
---

# ase-design — Stage 03

A developer must be able to implement from `design.md` alone, without asking architectural
questions. Every FR traces to at least one design element, and every decision has its rationale
written down. You write the design. Three specialists check it before the engineer sees it.

## Inputs and outputs

| | Path (under `<artifacts.path>/<feature>/artifacts/`) |
|--|--|
| In | `01-intake/project-brief.md` · `02-requirements/SRS.md` · `02-requirements/use-cases.md` (all APPROVED) · `.agentic/constitution.md` if present · `.agentic/kb/` if present |
| Out | `03-design/design.md` · `03-design/adr/adr-NNNN-<slug>.md` (one per qualifying decision) |
| Templates | [assets/design.md](assets/design.md) · [assets/adr-format.md](assets/adr-format.md) (for `adr-specialist`) |

Before starting, confirm that the SRS and use cases are `APPROVED` and `state.yaml` shows
`stage_02: approved`. If not, stop and tell the engineer. Other features' designs may be read for
context; mark them `> Context reference:` and never list them as inputs.

## 1. Read everything, then check the constitution and the KB

- Read all inputs and cross-check the requirements against the use cases.
- **Constitution:** follow `ase-constitution-check` for the articles with `check_at: design`. Note which ones bear on this design. A requirement that seems to conflict with an article goes into the question pass, before any design.
- **KB:** if `.agentic/kb/` exists, follow `ase-kb-search` with the components and code areas this feature touches.
  - `decision` and `pattern` entries are precedent: follow them, or say why you depart.
  - `gotcha` entries go into the risks and error handling.
  - Cite entries by ID.

## 2. Ask

Follow `ase-questions`. Read the codebase first; it answers most of these:
- the existing stack, and the patterns the feature must follow
- the deployment environment, and what may be introduced
- confirmed NFR numbers (these drive the architecture)
- which interfaces the feature exposes (API, CLI, SDK, events, files); this sets §4
- the auth model
- data ownership, retention, and deletion

## 3. Write `design.md`

Cover all six sections, in order:
1. Architecture: components, a diagram, the primary and error data flows
2. Components: responsibility, interface, dependencies, and error handling for each
3. Data model: entities, fields, relationships, lifecycle
4. Interface contracts: every exposed interface (inputs, outputs, error cases, auth). Write N/A only if the feature exposes none; CLIs, SDKs, events, and file formats count.
5. NFR coverage: how each NFR is met
6. Security: auth, authz, encryption, input validation, secrets

Then fill the Requirements Traceability section: every FR maps to a COMP, an entity, or an API.

## 4. ADRs — `adr-specialist`

A decision qualifies if it meets at least 2 of these:
- hard to reverse
- real alternatives were weighed
- it affects several components or reaches beyond this feature
- a future engineer would ask "why this?"

**A constitution exception always qualifies.**

```
Feature: <feature>
Pass: post-design
SRS path: <A>/02-requirements/SRS.md
Use-cases path: <A>/02-requirements/use-cases.md
Design path: <A>/03-design/design.md
ADR output directory: <A>/03-design/adr/
ADR format path: .claude/skills/ase-design/assets/adr-format.md
Constitution path: .agentic/constitution.md (or N/A)
Product repo root: <absolute path>
```
The specialist researches each decision before writing it up.
- **A `RESEARCH BLOCKER`:** relay it to the engineer, record the answer in `qa_log`, and re-invoke.
- **No decisions qualify:** write `> ADR assessment performed — no qualifying decisions found.` in Assumptions & Decisions.
- **On return:** record the ADR paths in `FINDINGS.md`.

## 5. Reviews — `design-reviewer`, then `security-reviewer`

**`design-reviewer`**
```
Feature: <feature>
SRS path: <A>/02-requirements/SRS.md
Use-cases path: <A>/02-requirements/use-cases.md
Design draft path: <A>/03-design/design.md
Constitution path: .agentic/constitution.md (or N/A)
```
- **`NEEDS REVISION`:** fix the blocking gaps and re-invoke.
- **`READY FOR ENGINEER`:** fold its non-blocking notes into the design and continue.

**`security-reviewer`**
```
Mode: design
Feature: <feature>
SRS path: <A>/02-requirements/SRS.md
Design path: <A>/03-design/design.md
Constitution path: .agentic/constitution.md (or N/A)
```
- **HIGH:** fix the design, then re-invoke for a re-check, or the engineer accepts the risk in an ADR. Either way, this happens **before** you ask for approval.
- **MEDIUM and LOW:** list them in the summary. The engineer fixes or accepts each one.

## 6. Final checks before the gate

The reviewers each checked their own slice. You check the whole design:
- **Traceability:** every FR maps to a design element. Fix any gap first.
- **Constitution:** run `ase-constitution-check` yourself on the finished `design.md`, covering **every** article with `check_at: design`.
  - For each article, record the result in Assumptions & Decisions. A reviewer's line can be cited as evidence, but an article no reviewer assessed is yours to assess.
  - An `EXCEPTION` with no ADR blocks the gate. Ask the engineer: get an exception ADR (re-invoke `adr-specialist`), or change the design so it complies.

Then follow `ase-stage-gate` with the Stage 03 checklist. In the summary, include:
- the architecture in brief
- the key technology decisions and why they were made
- the ADRs produced, or "none qualify"
- one constitution line per article
- the reviewer verdicts, and any open MEDIUM or LOW findings
- the risks and open items

## Why these limits

- **No approval request while a HIGH finding or an undocumented exception is open.** Approval freezes the design for planning. Once the plan is built on a design with a known hole, the hole is in the plan too.
- **Assess every applicable article yourself.** Reviewers check their own areas. An article that falls between them, such as a new dependency, otherwise goes unchecked, while the summary reads as "all COMPLIANT".
- **Research before deciding, and record why.** Without the rationale, a later engineer cannot tell a deliberate trade-off from an accident, and will "fix" the trade-off.
