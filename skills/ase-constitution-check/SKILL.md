---
name: ase-constitution-check
description: "Use when assessing requirements, a design, an ADR, code, tests, or a review in the agentic pipeline while a .agentic/constitution.md exists, even if the brief does not mention the constitution."
---

# ase-constitution-check

The constitution is at `.agentic/constitution.md` in the product repo. The constitution path
in your brief is that file, or `N/A`. If it is `N/A`, or the coordinator logged
`[NO CONSTITUTION]`, skip this check and write `N/A — no constitution`.

## Which articles apply

Each article has a `check_at` value. Evaluate only the articles whose value matches the
current stage. `all` matches every stage.

| `check_at` | Stage | Checked by |
|------------|-------|------------|
| `requirements` | 02 | `requirements-analyst` |
| `design` | 03 | `design-reviewer`, `security-reviewer` (design), `adr-specialist` |
| `implementation` | 05 | implementers (stop with `DESIGN_GAP`), `task-reviewer`, `architecture-reviewer`, `security-reviewer` (panel) |
| `testing` | 05 panel, 06 | `test-quality-reviewer`, `qa-engineer` |
| `review` | 07 | `staff-engineer-reviewer`, `security-reviewer` |
| `all` | every stage above | everyone above |

Security-related articles are also always checked by `security-reviewer` in whichever mode it runs.

## Assessment format

Give one line per applicable article, plus a one-sentence reason:

```
Article N — <name> (check_at: <value>): COMPLIANT | EXCEPTION | EXCEPTION — ADR-NNNN | N/A
  <one sentence: evidence, with file:line or artifact section>
```

- `COMPLIANT`: the subject follows the rule. Cite the evidence.
- `EXCEPTION`: the subject violates the rule, and no ADR covers it. **This is a blocking defect.**
- `EXCEPTION — ADR-NNNN`: the violation is covered by an approved exception ADR.
- `N/A`: the article does not apply to this subject. Say why.

When you need counts, summarise as: `[X] COMPLIANT · [Y] EXCEPTION (ADR-covered) · [Z] UNDOCUMENTED EXCEPTION`.

## Handling an exception without an ADR

- **Specialists:** report it as blocking in your return. Implementers return `DESIGN_GAP` and name the article. Never work around it or soften it.
- **Coordinator:** do not proceed with the affected decision. Tell the engineer:
  > "This conflicts with Article N: [rule]. An exception needs an ADR before we proceed.
  > Produce the exception ADR (Stage 03 / `adr-specialist`), or revise the decision?"

  Once an ADR is approved, mark the article `EXCEPTION — ADR-NNNN` in the artifact. If the decision is revised instead, re-check that article.

## Why these limits

- **Evaluate only the articles for the current stage.** An article checked at the wrong stage produces noise, or a judgement made before the evidence exists.
- **Give evidence for every `COMPLIANT`.** Without it, the check is a rubber stamp nobody can verify.
- **An undocumented exception is never an accepted risk.** The constitution exists to stop silent drift. An exception becomes legitimate only once an ADR records why.
