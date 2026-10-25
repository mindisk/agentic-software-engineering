# Project Knowledge Base

Durable knowledge from past features: solved problems, conventions, traps, and decisions.
The agentic pipeline reads it with the `ase-kb-search` skill before designing, planning, and
building. The `knowledge-curator` (the `ase-kb-capture` skill) writes it at the end of each
feature. Humans are welcome to read and edit it.

| Folder | Holds |
|--------|-------|
| `solutions/` | problem → root cause → fix → prevention |
| `patterns/` | "how we do X here", with canonical file pointers |
| `gotchas/` | traps in libraries, infrastructure, and the test environment |
| `decisions/` | short "why" notes; formal ADRs stay with their feature and are linked from here |

`index.md` lists every entry. The curator keeps it up to date, and people may edit it too.
For the entry format, see `.claude/skills/ase-kb-capture/assets/kb-entry.md`.
