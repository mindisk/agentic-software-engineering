Status: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED | DESIGN_GAP
Task: TASK-NNN — <title>
Workdir: <output of `git rev-parse --show-toplevel`>
Branch: <output of `git branch --show-current`>
Commits: <short SHAs, oldest first>

## Summary
<1–3 sentences: what was built and where.>

## Acceptance criteria
| AC | Status | Test(s) |
|----|--------|---------|
| AC-NNN-1 | MET | `<test name>` |

## Evidence
- Red: `<command>` → <N failing> (before implementation)
- Green: `<verify command>` → <N passed, 0 failed>

## Interfaces created or changed
<Public functions, classes, endpoints, schemas, with file paths. Later tasks will receive these. "None" if none.>

## Design deviations
<Deviation + rationale, or "None".>

## Concerns / questions
<Required for DONE_WITH_CONCERNS, NEEDS_CONTEXT, BLOCKED, DESIGN_GAP. Otherwise "None".>

## Discoveries
<Facts a later task or a future feature would want: gotchas, conventions found, environment quirks.
One bullet each, tagged: `[gotcha]`, `[pattern]`, `[decision]`, `[solution]`. "None" if none.>

## Known issues (pre-existing, not fixed)
<or "None">

## Files
- `<path>` — <one line>
