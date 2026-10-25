---
name: ase-kb-search
description: "Use when about to design, plan, or build in an area earlier features may have touched, when the engineer asks whether something was solved before or what the known gotchas are, or when a brief cites KB-NNNN entries."
---

# ase-kb-search

The project KB is plain markdown with frontmatter. It lives at `kb.path` from
`.agentic/config.yaml`, default `.agentic/kb`. It has four folders: `solutions/`, `patterns/`,
`gotchas/`, and `decisions/`. `index.md` lists every entry. Search with the Grep and Read tools.
There is no index service.

## 1. Search

Run the searches that apply, scoped to the KB directory:

| Looking for | Grep pattern (on `<kb>/**/*.md`) |
|-------------|----------------------------------|
| A file or directory you will touch | `^files:.*<path or parent dir>` |
| A component | `^components:.*\bCOMP-03\b` |
| A topic tag | `^tags:.*\b<tag>\b` |
| Free text | the key words, case-insensitive, over whole files |

Start with `index.md`. It is often enough to spot candidates from their titles.

Rank the hits:
1. File matches, including a match on a parent directory.
2. Component matches.
3. Tag matches.
4. Text matches.

Skip entries with `status: superseded-by:…` unless you are tracing history. Follow the
pointer to the replacement entry instead.

## 2. Check staleness of each hit you will use

Take the entry's `verified_at` and `files` and run:

```bash
git log --oneline <verified_at>..HEAD -- <files...>
```

- **Empty output:** the entry is current.
- **Any commits:** mark the entry **[STALE]**. Check its claim against the current code before relying on it.
  - If it still holds, cite it as `KB-NNNN (re-verified)`.
  - If it doesn't hold, ignore it and report `KB-NNNN outdated: <why>`.
  - Either way, the curator refreshes or supersedes the entry at Compound. Implementers report this under Discoveries.
- **An unknown commit,** for example after history was rewritten: treat the entry as stale.

## 3. Use

Cite entries by ID wherever you use them: in briefs, the design, the plan, or a context pack.
Give a one-line gist of each, and the `[STALE]` or `(re-verified)` mark where one applies.

If the KB does not exist or is empty, say so in one line and continue.
