---
name: ase-terse
description: "Use when writing a return to the pipeline coordinator, a brief for another agent, a stage summary, or a progress or stop message in the agentic pipeline."
---

# ase-terse — say less, point to files

Agents exchange **files**. Messages carry only the status, the counts, and the paths needed
to act. Anything longer than that belongs in a file the recipient can read.

## Agent → coordinator returns

- Use the return format your agent definition or skill specifies. If none is given, use:
  ```
  Status: <DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED | DESIGN_GAP | verdict word>
  Output: <path(s) written>
  Counts: <the 1–4 numbers that matter, e.g. "12 FR · 31 scenarios · 0 conflicts">
  Needs attention: <bullets, or "none">
  ```
- Don't restate the brief, the inputs, or your process. Don't add a preamble or a closing summary.
- Put findings in the output file. Mention only the blocking ones in the return.
- Quote from files only when the exact wording is the point. Otherwise cite the location as `path:line`.

## Coordinator → engineer

- **Stage summary:** at most about 12 lines plus the filled checklist. Cover what was produced (paths), the decisions taken, and what needs the engineer.
- **Questions:** use the `ase-questions` format and nothing else in the message.
- **Progress:** none between tasks or steps. Report only at gates and stop conditions.
- Prefer tables and counts to prose. Don't repeat what the engineer just said.

## Why these limits

- **Point to files instead of pasting them.** Whole artifacts, diffs, or logs in a message cost the recipient context it needs for its own work, and the file is already there to read.
- **Don't trade honesty for brevity.** Short is good. A short message that hides a failure or a concern is worse than a long one.
