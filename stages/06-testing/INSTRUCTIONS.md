# Stage 06 — Testing

## Purpose

Verify that the implemented feature meets all requirements defined in the SRS.
Testing is not a formality — every requirement must be exercised, every error
path must be verified, and results must be honest.

This stage produces a test suite that serves as a living regression safety net
for the feature, plus a test results document that forms part of the sign-off record.

---

## Inputs

| Artifact | Source | Required |
|----------|--------|----------|
| `SRS.md` | Stage 02, APPROVED | Yes |
| `use-cases.md` | Stage 02, APPROVED | Yes |
| `api-contracts.md` | Stage 03, APPROVED | If applicable |
| `plan.md` | Stage 04, APPROVED | Yes |
| Source code | Stage 05, APPROVED | Yes |

---

## Process

### Step 1 — Early question pass

Before writing any tests:

1. **Testing framework** — What test framework is in use (or preferred)?
   Any existing test conventions in the codebase to follow?
2. **Coverage target** — Is there a minimum coverage percentage required?
3. **Test types in scope** — Unit only? Integration? E2E? Contract tests?
4. **Test environment** — How should tests be run? Against a real DB, in-memory, mocked?
5. **CI integration** — Do tests need to run in CI? Any constraints on how?

### Step 2 — Write test-plan.md

Define the testing strategy before writing any test code:
- Types of tests and their scope
- Coverage targets
- Tools and frameworks
- What is explicitly out of scope for testing in this stage
- Risk-based prioritisation (test high-risk areas first)

### Step 3 — Write test cases (from SRS)

Map every FR-NNN to at least one test case (TC-NNN).
For each test case:
- Test the happy path
- Test the error/edge cases defined in use-cases.md
- Test boundary conditions (empty inputs, maximum values, concurrent access)

### Step 4 — Write the tests

Implement tests following the approved test plan and conventions.

**Test quality rules:**
- Every test has one clear purpose — do not combine multiple assertions of
  different behaviours in a single test
- Tests are independent — no test depends on state set by another test
- Test names describe what they verify, not how:
  Good: `should return 404 when user is not found`
  Bad: `test_user_endpoint_2`
- Mock external dependencies at the appropriate boundary
- Do not test implementation details — test observable behaviour

### Step 5 — Run all tests and record results

Run the full test suite. Record results honestly in test-results.md.
If tests fail:
- Fix the test if the test is wrong
- Fix the implementation if the implementation is wrong
- Flag as `[OPEN]` if the failure reveals an unresolved design issue

Do not mark a test as passing if it is not passing.

### Step 6 — Coverage check

Run coverage analysis. If coverage falls below the target in test-plan.md,
add tests to cover the gap before opening the PR.

### Step 7 — Present for engineer approval

Present a summary to the engineer:
- Test coverage summary (X unit, Y integration, Z E2E)
- Coverage percentage achieved vs. target
- Any requirements that could not be tested and why
- Honest statement of test results (all passing, or failures with explanation)
- Filled-in Stage 06 review checklist (from Protocol 4)

**Wait for explicit engineer approval before proceeding to Stage 07.**

---

## Outputs

| Artifact | Path |
|----------|------|
| Test Plan | `.agentic/features/<feature>/artifacts/06-testing/test-plan.md` |
| Test Results | `.agentic/features/<feature>/artifacts/06-testing/test-results.md` |
| Test code | `tests/` (or project-appropriate path) |

---

## Done Criteria

- [ ] `test-plan.md` written and approved
- [ ] Every FR-NNN has at least one TC-NNN
- [ ] All tests pass
- [ ] Coverage meets target defined in test-plan.md
- [ ] `test-results.md` is complete and accurate
- [ ] Stage 06 review checklist presented and all items addressed
- [ ] Engineer explicitly approves (artifact status updated to `APPROVED`)
- [ ] `state.yaml` updated: `current_stage: 7`, `stage_06: approved`

---

## Common Failure Modes to Avoid

- Writing tests that only cover the happy path
- Tests that pass because they test nothing meaningful (false coverage)
- Hiding test failures in the results document
- Testing implementation internals instead of observable behaviour
- Tests that leave side effects (dirty database, mutated global state)
- Skipping edge cases that are "unlikely" — unlikely is when bugs hide
