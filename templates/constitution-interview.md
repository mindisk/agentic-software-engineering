# Constitution Interview Guide

This guide is used by the agent when helping an engineer create a project constitution
from scratch. Ask the questions below, one domain at a time. Listen for strong opinions —
those become articles. Absence of opinion in a domain means no article is needed there.

**Rules for the interview:**
- Ask all questions in a single pass — do not drip them one at a time
- Group questions by domain with a heading for each
- Maximum 2 questions per domain — if the engineer wants to go deeper, let them
- After answers: draft the articles, show them to the engineer, and ask for corrections
- Do not write an article for a domain where the engineer had no clear opinion
- Aim to produce 5–9 articles total

---

## Domain 1 — Testing Strategy

**Q1.1** When writing tests for code that talks to a database, message queue, or other
service your team operates — do you use real instances or mocks? Is there a rule, or
does it depend on the situation?

**Q1.2** Is there a minimum coverage level the team holds itself to, or a required mix of
test types (unit, integration, end-to-end)? What would make you reject a PR on testing
grounds alone?

---

## Domain 2 — Security

**Q2.1** What are the non-negotiables around secrets — API keys, credentials, tokens?
Is there a rule about where they can and cannot live?

**Q2.2** Is there a required authentication or authorisation pattern for this project?
Is there anything security-related you'd refuse to merge regardless of business justification?

---

## Domain 3 — Complexity

**Q3.1** Is there a ceiling on how complex a solution is allowed to be before you'd push
back? For example: maximum number of services, layers of abstraction, or dependencies
introduced per feature?

**Q3.2** Have you seen over-engineering cause real problems on this project or a previous
one? What would you want the agent to flag or refuse?

---

## Domain 4 — Dependencies

**Q4.1** Are there libraries or tools you'd never introduce into this project — either
because of past problems, licensing, or philosophical reasons?

**Q4.2** Is there a policy around adding new dependencies — approval process, version
pinning, vendoring, or a preference for fewer external packages?

---

## Domain 5 — Observability

**Q5.1** What must always be logged, monitored, or traced — regardless of how small the
feature? Is there a minimum bar for observability before something can ship?

**Q5.2** Has a production incident ever been made worse by missing logs or metrics?
If so, what rule would have prevented it?

---

## Domain 6 — Data

**Q6.1** Who owns the data this project produces, and what are the rules around its
retention and deletion? Is there a policy the agent must know?

**Q6.2** Are there rules around database migrations — how they're written, reviewed,
or rolled back? Anything that's caused pain in the past?

---

## Domain 7 — API Contracts

**Q7.1** When this project exposes an API that other systems consume, what are the rules
around breaking changes? Versioning strategy? Required documentation?

**Q7.2** Is there a protocol for deprecating endpoints or fields — notice period,
migration paths, communication requirements?

---

## Domain 8 — Tooling & Stack

**Q8.1** Are there language versions, frameworks, or build tools that are locked in and
not up for debate on a per-feature basis?

**Q8.2** Is there anything in the current stack the team actively wants to move away from?
Should the agent avoid deepening investment in it?

---

## Closing

After covering the domains, ask:

**Final Q:** Is there anything the pipeline might do that would immediately make you
reject the output — something not covered above? Any time a past agent or engineer
made a decision that you had to undo?

---

## Drafting Articles

For each domain where the engineer expressed a clear opinion:

1. Draft an article using this format:
   ```
   ### Article N: [Short name]
   **Rule:** [MUST/SHALL/NEVER statement]
   **Rationale:** [The reason the engineer gave — use their words where possible]
   **How to check:** [Concrete, specific signal — what to look for in code or artifacts]
   **check_at:** [design | implementation | review | all]
   ```

2. Show all drafted articles to the engineer at once:
   > "Here are the [N] articles I've drafted from your answers. Review each one —
   > edit the rule if it's not quite right, cut any that feel wrong, and tell me
   > if I've missed something important."

3. Incorporate feedback, then write the final constitution to `.agentic/constitution.md`
   using the template at `<engine.path>/templates/constitution.md`.

4. Confirm with the engineer before writing the file.
