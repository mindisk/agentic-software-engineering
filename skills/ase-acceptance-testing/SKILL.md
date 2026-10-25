---
name: ase-acceptance-testing
description: "Use when the agentic pipeline reaches Stage 06, when a built feature needs acceptance tests derived from its SRS scenarios, when the qa-engineer returns test results, or when test-plan.md or test-results.md needs revising."
---

# ase-acceptance-testing — Stage 06

Stage 05 proved each task against its acceptance criteria. Stage 06 proves the **feature**
against the **requirements**:
- every FR scenario becomes a test case
- every error path is exercised
- the results are reported as they are

You run the question pass and the gate. The `qa-engineer` writes and runs the tests.

## Inputs and outputs

| | Path (under `<artifacts.path>/<feature>/artifacts/`) |
|--|--|
| In | `02-requirements/SRS.md` · `02-requirements/use-cases.md` · `03-design/design.md` (§4 contracts) · `04-planning/plan.md` · code on `feat/<feature>` · `05-implementation/ledger.md`, `reports/` |
| Out | `06-testing/test-plan.md` · `06-testing/test-results.md` · test code in the project's test tree |
| Templates | [assets/test-plan.md](assets/test-plan.md) · [assets/test-results.md](assets/test-results.md) |

Before starting, confirm:
- every task in `tasks.json` is `done`, or `blocked` with an engineer decision
- the SRS is `APPROVED`
- `state.yaml` shows `stage_05: approved`

If not, stop and tell the engineer.

## 1. Ask

Follow `ase-questions`. Ask only what the repo and `qa_log` don't answer:
- test framework and conventions
- coverage target
- test types in scope: unit, integration, E2E, contract, performance
- test environment: real DB, in-memory, or mocked
- CI constraints

## 2. Delegate to `qa-engineer`

```
Feature: <feature>
SRS path: <A>/02-requirements/SRS.md
Use-cases path: <A>/02-requirements/use-cases.md
Design path: <A>/03-design/design.md
Source code: <source paths in the product repo>
Test framework: <answer>
Coverage target: <answer>
Constitution path: .agentic/constitution.md (or N/A)
Output paths:
  test-plan: <A>/06-testing/test-plan.md
  test-results: <A>/06-testing/test-results.md
Templates: .claude/skills/ase-acceptance-testing/assets/
```

The specialist:
- maps each Given/When/Then scenario to a `TC-NNN`: Given → setup, When → action, Then → assertion
- adds boundary and NFR-implied cases
- writes and runs the tests
- records the results

## 3. Verify the return

The reply is a claim. Check it against `test-results.md`, the test code, and the Stage 05 record:

| Check | Fails when |
|-------|-----------|
| Results | any test fails |
| Coverage | coverage is below the agreed target |
| FR → TC | any FR scenario has no TC, or its only TC is skipped |
| Error paths | an FR's error or edge scenario has no TC |
| Meaningful | a test passes without asserting the scenario's Then (for example, it checks only the status code when the Then is about data) |
| Honest | the results call something passing, flaky, or pre-existing that the evidence doesn't support |

**A failure called "flaky" or "pre-existing":**
1. Look for it in the Stage 05 ledger. A failure that was not there at the B0 baseline or at any wave gate is new.
2. If it is new and its test belongs to this feature, it is a defect in the feature until shown otherwise.
3. **REQUIRED SUB-SKILL:** superpowers:systematic-debugging. It applies to whoever investigates.

**Any check fails:** send the work back with the specific failures.
- **A test is wrong:** send it to `qa-engineer`.
- **The code is wrong:** fix it through a task reviewed as in Stage 05 (`ase-build`, B1 steps 2–6), then re-run the suite.
- **The failure exposes a design question:** mark it `[OPEN]` and ask the engineer.

Log each round in `error_log` (`ase-recovery`). A skipped test whose skip the engineer accepted
is recorded as unverified, never as passing.

## 4. Gate

Present only when every check passes, or when the engineer has decided on each remaining gap.
Follow `ase-stage-gate` with the Stage 06 checklist. In the summary, include:
- the test counts by type
- coverage against the target
- any requirement that could not be tested, and why
- an honest results line

## Why these limits

- **Never present red as green.** Stage 07 and the sign-off rest on this stage's results. A failure waved through as "flaky" reaches production with a signature on it.
- **Check the ledger before believing "pre-existing".** "Pre-existing" is the easiest way to dismiss a real failure. The ledger records what was green, and when.
- **Skipped is not passed.** A skipped test verifies nothing. Counting it hides an untested requirement inside a green total.
