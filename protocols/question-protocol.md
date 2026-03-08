# Question Protocol

This protocol governs how an AI agent asks questions during any stage of the pipeline.
Every agent executing a stage MUST follow these rules.

---

## Core Philosophy

Questions are not a sign of failure — they are the primary mechanism for keeping the
engineer in control. An agent that proceeds without surfacing genuine uncertainty is
more dangerous than one that asks too much. However, questions must be surgical:
high-value, early, and batched.

---

## When to Ask Questions

### ALWAYS ask before doing deep work
At the start of each stage, before producing any artifact, the agent MUST identify
uncertainties and ask the engineer to resolve them. This is the "early question pass".

Never ask questions after producing a full draft — that wastes effort and signals
the agent worked in isolation.

### Ask when any of these conditions are true

| Condition | Example |
|-----------|---------|
| A requirement is ambiguous with multiple valid interpretations | "Secure login" could mean OAuth, magic link, or username/password |
| A decision would be hard to reverse later | Choosing a data model structure |
| Two reasonable paths lead to significantly different outcomes | Monolith vs. microservices |
| A critical assumption has been made that could be wrong | Assuming single-tenant when the spec doesn't say |
| An edge case could affect scope significantly | "What happens if a user deletes their account mid-transaction?" |
| A constraint is missing that the engineer must know | No mention of expected scale |

### Do NOT ask when

- The answer can be reasonably inferred from existing context
- The decision is low-risk and reversible
- The question is about implementation detail (make a decision, document it, move on)
- You would be asking the same question twice (check prior answers first)

---

## Question Format

Each question must follow this structure:

```
### Q[N]: [Short question title]

**Context:** Why this question matters and what decision it affects.

**Options:**
- A) [Option with brief implication]
- B) [Option with brief implication]
- C) [Other — describe your own answer]

**Default assumption:** If you do not answer, I will proceed with [X] because [reason].

**Blocks:** [What cannot be done until this is answered — or "Non-blocking"]
```

### Example

```
### Q1: Authentication mechanism

**Context:** The spec mentions "users must log in" but does not specify the
authentication method. This affects the data model, third-party dependencies,
and security architecture.

**Options:**
- A) Username + password (store hashed credentials, handle password reset flow)
- B) OAuth only (Google, GitHub, etc. — no password storage)
- C) Magic link via email (passwordless, no OAuth dependency)
- D) Other — describe your preferred approach

**Default assumption:** If you do not answer within 24h, I will proceed with
Option A (username + password) as it is the most self-contained.

**Blocks:** design.md (data model section), api-contracts.md (auth endpoints)
```

---

## Batching Rules

- Ask all questions for the current stage in a **single pass** at stage start
- Maximum **7 questions** per batch (if more arise, prioritize by impact)
- If a follow-up question depends on the answer to a prior one, mark it as:
  `**Depends on:** Q[N] answer`
- Group related questions together under a subheading

---

## Priority Levels

Label each question with a priority:

| Label | Meaning |
|-------|---------|
| `[BLOCKING]` | Stage cannot proceed without an answer |
| `[HIGH]` | Significantly affects scope or architecture |
| `[MEDIUM]` | Affects implementation approach but not scope |
| `[LOW]` | Minor preference question — default will be used if unanswered |

---

## Recording Answers

When the engineer answers, the agent must:

1. Acknowledge the answer explicitly ("Understood — proceeding with Option B")
2. Update `state.yaml` with the Q&A pair
3. Reflect the decision in the produced artifact with a note:
   `> Decision: [summary] — per engineer answer [date]`

---

## Escalation

If after two rounds of Q&A a critical ambiguity still cannot be resolved,
the agent must:

1. Document the unresolved ambiguity clearly in the artifact
2. Mark the artifact status as `DRAFT — PENDING DECISION`
3. Add the open question to the PR description with `[UNRESOLVED]` tag
4. Not proceed to the next stage until the PR comment is addressed
