# Build ledger — <feature>

Plan: <abs path to tasks.json> · Branch: <feature branch> · Executor: <serial | waves> · Started: <YYYY-MM-DD>

<!-- Append-only. One line per event. After compaction or a new session, trust this file and
     `git log` over your own memory. Formats:
YYYY-MM-DD HH:MM · B0 · baseline <PASS|FAIL> (<command>) · base <sha>
YYYY-MM-DD HH:MM · W<n> · start · <TASK-…, TASK-…>
YYYY-MM-DD HH:MM · TASK-NNN · dispatched · agent=<name> tier=<model> base=<sha>
YYYY-MM-DD HH:MM · TASK-NNN · report · <STATUS>
YYYY-MM-DD HH:MM · TASK-NNN · review r<k> · <APPROVED|CHANGES_REQUIRED> (<c> crit, <i> imp)
YYYY-MM-DD HH:MM · TASK-NNN · merged · <sha>
YYYY-MM-DD HH:MM · W<n> · gate <PASS|FAIL> · <command>
YYYY-MM-DD HH:MM · Ruling: <decision> — <why> — <cost if wrong>
YYYY-MM-DD HH:MM · STOP · <reason> · waiting for engineer
-->
