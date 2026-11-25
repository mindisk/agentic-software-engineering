---
name: technical-design
description: Shape a technical design before any code is written. It frames the problem, surfaces constraints, compares 2–3 real approaches with their tradeoffs, recommends one, and gets the human's approval. Use whenever the user asks to design, architect, or decide the approach for a feature, subsystem, API, data model, migration, or integration. Also use when a requested change touches several components or a public interface, even if they only say "how should we build X" or "let's add Y". Not for single-file bug fixes or small tweaks to existing behavior.
---

# Technical Design

A design is the set of decisions that will be expensive to change later. Your job is to make those decisions deliberately, together with the human, before code makes them by accident.

## 1. Size the work

Classify the request and say the classification out loud, so the human can override it:

- **Small**: fits an existing flow, touches one component, changes no interface. Write a few sentences in chat covering the approach, the files involved, and how it will be tested. Then stop and wait for a yes.
- **Significant**: a new component, a change across components, a public interface, a data model, or a migration. Work through the full process below.

If you discover hidden complexity mid-way, say so and step up to the full process. Never step down to skip work.

## 2. Ground it in the codebase

Before proposing anything, read the relevant code, how similar problems are already solved here, the tests, and the recent history. A design that ignores the existing architecture will surprise everyone who maintains it. Cite what you found with `file:line`.

## 3. Frame the problem

- **Problem**: what's wrong or missing, and for whom. One paragraph, written without solution language.
- **Goals / Non-goals**: the non-goals are where YAGNI gets enforced. List the tempting things you are deliberately *not* doing.
- **Constraints**: performance, compatibility, dependencies, deadlines, conventions. Mark each one as **stated** (by the human) or **assumed** (by you).
- **Success criteria**: things you can observe and test. These become the tests later.

If a gap here would change the design, ask, and ask all your questions in one round. Otherwise state the assumption and move on.

## 4. Options

Lay out 2–3 *genuinely different* approaches, not one real option padded with strawmen. Always include the simplest thing that could work. For each one, give:

- how it works, in a few lines
- what it costs to build and maintain
- what could go wrong
- what would be hard to reverse

Then recommend one, tied to the goals and constraints rather than to taste. If two options are close, prefer the one that's easier to change later.

## 5. Design the chosen option

Go only as deep as the decisions require:

- **Components**: each with a single responsibility, plus the boundaries and interfaces between them (signatures, contracts, data shapes)
- **Data and state**: where data lives, who owns it, how it flows
- **Errors**: what can fail, how it surfaces (fail fast), and what the user sees
- **Testing**: what proves each success criterion
- **Rollout and rollback**: required if anything persistent or shared changes
- **Risks and open questions**

Leave out anything an implementer can reasonably decide alone. A design that specifies everything is just code written in prose.

## 6. Self-review, then the human

Before you present the design, check:

- Every goal is addressed, and nothing from the non-goals has crept in.
- Nothing speculative remains, such as extension points or config options that no goal requires.
- The simplest option got a fair hearing.
- There are no TBDs, and no component lacks a clear responsibility.

For significant work, save the design. For a feature, write it to `artifacts/03-design/design.md` in the feature folder, from the `03-design/design.md` template. Otherwise use `docs/design/YYYY-MM-DD-<topic>.md`. Present your recommendation first, then the link to the doc, and wait for approval.

Approving the design does not approve implementation. The next step is the `implementation-plan` skill.

## Template

```markdown
# <Title>
Status: Draft | Approved · Date: YYYY-MM-DD

## Problem
## Goals / Non-goals
## Constraints (stated / assumed)
## Options considered
### A. <name>: how · cost · risk · reversibility
### B. <name>
**Recommendation:** <option>, because <reason tied to goals/constraints>
## Design
## Testing
## Rollout & rollback
## Risks & open questions
```
