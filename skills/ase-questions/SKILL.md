---
name: ase-questions
description: "Use when starting any agentic pipeline stage before writing an artifact, or when a requirement is ambiguous, two requirements conflict, scope is unclear, or an assumption would be costly if wrong."
---

# ase-questions — asking and uncertainty

Questions keep the engineer in control. Silent guessing is more dangerous than asking too
much, but every question must be worth asking, asked early, and batched with the others.

## When to ask

**Always ask before deep work.** At the start of each stage, before producing any artifact,
identify what is uncertain and ask. Never ask after producing a draft.

Ask when:
- a requirement has several valid readings
- a decision would be hard to reverse
- two reasonable paths lead to very different outcomes
- a critical assumption could be wrong
- an edge case could change the scope
- a constraint the engineer must know about is missing

Do **not** ask when:
- the answer can be inferred from the existing context
- the decision is low-risk and reversible
- it is an implementation detail: decide, document, move on
- it is already answered in `state.yaml` → `qa_log`

## Uncertainty types

| Type | Meaning | Action |
|------|---------|--------|
| 1 Missing information | Required information was not provided | Ask |
| 2 Ambiguous spec | Several valid readings | Present the readings as options and ask |
| 3 Technical risk | Feasible, but risky | Take the lower-risk option, document the risk prominently, and flag it in the stage summary |
| 4 Conflicting requirements | Two requirements cannot both hold | **Surface it immediately.** Never pick one silently |
| 5 Scope uncertainty | In or out of scope is unclear | Ask if the impact is high. If low, mark it out of scope and document the assumption |
| 6 Reasonable assumption | One answer is clearly more sensible | Assume and document: `> Assumption: [X] — rationale: [Y]. Revisit if incorrect.` Ask only if the impact is high |

Decision matrix:

| | Low impact | High impact |
|--|--|--|
| **Low uncertainty** | Assume and document | Assume, document, and flag in the stage summary |
| **High uncertainty** | Ask (low priority) | **Always ask (blocking)** |

## Question format

```
### Q[N]: [Short title]  [BLOCKING | HIGH | MEDIUM | LOW]

**Context:** Why this matters and what decision it affects.

**Options:**
- A) [Option, with its implication]
- B) [Option, with its implication]
- C) Other: describe your own answer

**Default assumption:** If unanswered, I will proceed with [X] because [reason].

**Blocks:** [What cannot proceed until answered, or "Non-blocking"]
```

Priorities:
- `BLOCKING`: the stage cannot proceed.
- `HIGH`: affects scope or architecture.
- `MEDIUM`: affects the approach, not the scope.
- `LOW`: a preference; the default is used if there is no answer.

## Batching

- Ask all of a stage's questions in **one message**, at most **7**, ordered by impact.
- Mark a question that depends on another with `**Depends on:** Q[N]`.
- Group related questions under subheadings.

## Recording answers

1. Acknowledge each answer: *"Understood — proceeding with B."*
2. Append the Q&A pair to `state.yaml` → `qa_log`.
3. Reflect the answer in the artifact: `> Decision: [summary] — per engineer answer [date]`.

## Escalation

If a critical ambiguity is still open after two rounds:
1. Document it in the artifact as an `[OPEN]` item.
2. Set the artifact status to `DRAFT — PENDING DECISION`.
3. List it as `[UNRESOLVED]` in the stage summary.
4. Do not advance the stage until it is resolved.

## Why these limits

- **Never pick an interpretation silently.** A wrong silent pick is discovered stages later, when it costs the most to undo.
- **Resolve Type 4 conflicts before proceeding.** Building on two requirements that contradict each other guarantees rework.
- **Never re-ask what is in `qa_log`.** It wastes the engineer's attention and signals that the pipeline doesn't remember.
- **Never present an assumption as fact.** Reviewers can only challenge assumptions they can see.
- **Read the artifacts before asking.** Asking what they already answer costs the engineer's time and trust.
