---
name: ase-intake
description: "Use when the agentic pipeline starts a new feature or reaches Stage 01, when the engineer describes a feature idea or spec to turn into a project brief, or when project-brief.md needs revising."
---

# ase-intake — Stage 01

The brief is the root of every later artifact. Requirements, design, tests, and the review all
trace back to it, so what it gets wrong is paid for at every later stage. The job is to capture
the engineer's intent and make the unknowns visible. It is not to generate content.

## Inputs and outputs

| | Path (under `<artifacts.path>/<feature>/artifacts/`) |
|--|--|
| In | the engineer's description · `state.yaml` (`qa_log`) · other features' artifacts, as context only |
| Out | `01-intake/project-brief.md` |
| Template | [assets/project-brief.md](assets/project-brief.md) |

Follow `ase-artifacts` for headers, IDs, and markers.

## 1. Clarify pass — only when `stage_01: pending`

Skip this step when resuming. First judge the description. It is sufficient when all four are
clear:
- what the feature does, and for whom
- the scope boundary: what it does **not** do
- what success looks like for the user
- hard constraints: technical, regulatory, timeline

**All four clear:** log `[CLARIFY: skipped — description sufficient]` in `PROGRESS.md` and go to step 2.

**Otherwise:** ask at most **5** questions in one message, each as:
```
**Q[N]:** <one specific sentence>
*Why this matters:* <what changes depending on the answer>
```
Ask only what would change scope, users, or architecture. Anything design can decide waits for
design. Record the answers in `qa_log` and log `[CLARIFY: N questions asked, answered]`.

## 2. Read, then ask what is still open

Read the description and `qa_log`. Sort what you find into: stated, implied, missing but needed
later, ambiguous, and contradictory.

Then follow `ase-questions` for whatever is still open. Typical gaps:
- scope boundary
- primary users and what they do
- success criteria
- hard constraints
- relation to existing systems (check the codebase first)

Never re-ask anything that is in `qa_log`. The clarify pass and this pass together ask at most
7 questions. If nothing is open, ask nothing and go to step 3.

What happens next depends on the open items and on what the engineer asked for:
- **An answer would change what is in or out of scope, who the users are, or what success means,** and the engineer has not asked for the brief now: ask, and wait for the answers before writing.
- **Everything else** goes into the brief as an `OI-NNN` with your default. This covers where an existing system lives, how a stated fact matches the codebase, and details later stages will settle. Write the brief now.
- **The engineer asks you to write the brief now** ("write the brief", "use your judgment"): write it. Each open question becomes an `OI-NNN` with its default and the stage that must resolve it.

The engineer's description is the source of truth for what it states. If the description says "existing back office" and the repo doesn't show one, the brief keeps "existing" and records the mismatch as an open item. It does not reopen the scope.

## 3. Write the brief

Fill every section of the template. Write the brief from the engineer's words and answers:
- **Scope in and out** exactly as given. The out-of-scope list is as important as the in-scope list.
- **Success criteria** that can be measured. Restate the engineer's criteria; don't add new ones.
- **Constraints** only as stated. Something you think is missing (compliance, retention, performance) becomes an Open Item or an `> Assumption:`, never a requirement or a constraint.

Status `REVIEW`.

## 4. Gate

Self-check, then follow `ase-stage-gate` with the Stage 01 checklist:
- Would a new engineer understand what is being built, and why, from the brief alone?
- Are the scope boundaries explicit, and are the success criteria measurable?
- Is every assumption listed?

In the summary, include a one-paragraph description of the feature, the questions and answers,
the assumptions, and the open items.

## Why these limits

- **Never invent scope or constraints.** Every later stage treats the brief as the engineer's intent. Something invented here gets specified, designed, built, and tested before anyone notices that nobody asked for it.
- **Ask before writing, not after.** A brief drafted on guesses anchors the engineer on your reading, and they end up editing your guess instead of stating their intent.
- **Keep design questions for design.** Asking about tables or endpoints now makes the engineer decide things before the requirements exist.
