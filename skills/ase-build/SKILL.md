---
name: ase-build
description: "Use when the agentic pipeline reaches Stage 05, when the engineer asks to build, implement the plan, or run the tasks, or when a build is in progress (a ledger.md exists or tasks.json has pending, in_progress, or review tasks), including after a session restart."
hooks:
  Stop:
    - hooks:
        - type: prompt
          prompt: |
            You are checking whether the pipeline build controller may end its turn. Input: $ARGUMENTS
            Look only at last_assistant_message.
            Respond {"ok": true} if ANY of these holds:
            - the message is not about the Stage 05 build;
            - it asks the engineer a question or for approval (start gate, P2 acceptance, Stage 05 approval);
            - it reports a stop condition: DESIGN GAP, destructive or outward-facing action needing approval, task still BLOCKED after escalation, gate failed twice, or a configured wave checkpoint;
            - it presents the final Stage 05 summary.
            Respond {"ok": false, "reason": "..."} if the message ends mid-build without one of those, e.g. it says it will continue, reports progress between tasks or waves, or summarises a wave and stops. Use this reason: "Build is not at a stop condition. Re-read the ledger and tasks.json and continue with the next step of ase-build."
---

# ase-build — Stage 05 controller procedure

You are the **controller**. You never write production code yourself. You prepare the
workspace, write briefs, dispatch subagents, read their reports, merge their work, keep the
ledger, and decide on ambiguities. Everything moves between agents as **files**. Dispatch prompts
carry paths, never pasted history or diffs.

No architectural decisions are made here. A design gap stops the affected task and goes to the
engineer.

## Inputs and outputs

| | Path |
|--|--|
| In | `A/04-planning/plan.md` + `tasks.json` (APPROVED) · `A/03-design/design.md` + `adr/` · `A/04-planning/user-stories.md` · `.agentic/kb/` if present |
| Out | code and tests on `feat/<feature>`, one merge per task · `W/`: `ledger.md`, `context-pack.md`, `blackboard.md`, `briefs/`, `reports/`, `reviews/`, `panel-findings.md` |

Before B0, confirm:
- `plan.md` is `APPROVED`, and `tasks.json` sits next to it
- `design.md` is `APPROVED`
- `state.yaml` shows `stage_04: approved`

If any of these fails, stop and tell the engineer.

**Question pass.** One message, asking only the questions whose answers are not already in config or `qa_log`:
1. The full verification command: tests, lint, and type checks. It becomes `build.verify_command`.
2. A setup command for a fresh worktree. Suggest `.worktreeinclude` for gitignored files such as `.env`.
3. Whether `feat/<feature>` is acceptable as the branch name.
4. Waves or serial. Ask only if the wave plan shows parallelism and `build.executor` is unset.

## Paths and settings

| Name | Value |
|------|-------|
| `A` | `<artifacts.path>/<feature>/artifacts` |
| `W` | `A/05-implementation` (build workspace) |
| `TASKS` | `A/04-planning/tasks.json` (see "Editing tasks.json") |
| `T` | `.claude/skills/ase-build/assets/` (this skill's templates; absolute path when passed to subagents) |

Read the `build:` block of `.agentic/config.yaml`. If a key is missing, use its default:

```yaml
build:
  executor: waves          # serial | waves
  max_parallel: 3
  fix_rounds: 3
  checkpoint: none         # none | wave  (pause for the engineer after every wave)
  setup_command: ""        # e.g. "npm ci"
  verify_command: ""       # full gate, e.g. "npm test && npm run lint && npm run typecheck"
  panel: [security-reviewer, architecture-reviewer, test-quality-reviewer]
  hooks: { post_task: "", post_wave: "", post_build: "" }   # shell commands; empty = none
kb:
  path: .agentic/kb
```

## Task graph rules

These are the same rules as in `ase-planning`, so planning and building cannot drift apart. If you change them, change both.

- **Ready:** `status` is `pending` and every task in `deps` is `done`.
- **Held:** the task depends, directly or transitively, on a `blocked` task. Held tasks are skipped until the block is resolved.
- **Conflict:** two tasks conflict if any `owns` entry of one equals, contains, or sits inside, or glob-matches, an `owns` entry of the other. A task with an empty `owns` conflicts with everything.
- **Next wave:** the lowest `wave` number that still has `pending` tasks. Run the ready tasks of that wave, but never more than `max_parallel`, and never two that conflict. A task that is not ready or overflows moves to `wave + 1`. With `executor: serial`, run one task at a time in `tasks.json` order.

### Editing tasks.json

Use the Edit tool. After Stage 04 approval, change **only** `status`, `commit`, `branch`, `rounds`, and `wave`.
- `status` values: `pending`, `in_progress`, `review`, `done`, `blocked`.
- Never edit a task's definition. If a definition is wrong, that is a `DESIGN_GAP` or a ruling for the engineer.

## Stop conditions — the ONLY reasons to pause and wait for the engineer

1. A `DESIGN_GAP`, including constitution violations.
2. An irreversible or destructive operation: history rewrite, data deletion, dropping a migration.
3. Pushing, opening a PR, or merging into the default branch. These are never done by the build, and `.claude/settings.json` denies them.
4. A task is still `BLOCKED` after escalation, and nothing else can proceed.
5. A baseline or wave gate fails twice after fix attempts.
6. `checkpoint: wave` is configured and a wave just finished.

Decide anything else yourself, log a ruling, and continue. A `Stop` hook on this skill sends
you back to work if you end a turn mid-build without a stop condition.

---

## B0 — Prep

1. **Pre-checks**
   - `plan.md` is `APPROVED`.
   - Re-check `tasks.json` against the graph checks in `ase-planning`:
     - unique IDs
     - deps exist
     - no cycles
     - every dep has a lower `wave`
     - no conflicts within a wave
     - no wave larger than `max_parallel`
     - every task has non-empty `owns`, `verify`, `agent`, and `tier`

     If any check fails, stop and send the engineer back to Stage 04.
2. **Git**
   - Record `DEFAULT`, the remote default branch: `git symbolic-ref --short refs/remotes/origin/HEAD`, minus the `origin/` prefix. If that fails, use `main`.
   - If you are on `DEFAULT`, run `git switch -c feat/<feature>`.
   - The working tree must be clean outside `.agentic/` and the artifacts path. If it is not, stop and ask.
   - Record `BASE0` = `git rev-parse HEAD`.
3. **Harness settings**
   - Read `.claude/settings.json`.
   - `executor: waves` needs `"worktree": {"baseRef": "head"}`. Without it, subagent worktrees branch from `DEFAULT` and miss the earlier waves. If it is missing, offer to add it. If the engineer declines, fall back to `serial`.
   - `.ase/` must be listed in `.gitignore`.
4. **Baseline**
   - Run `setup_command`, then `verify_command`.
   - If `verify_command` is empty, it was asked in the question pass above.
   - A failing baseline stops the build. Either the engineer fixes it, or they accept the named failing tests as the known baseline (log that).
5. **Context pack**
   - Follow the `ase-kb-search` skill, searching by the `owns` paths, `design_ref` components, and topic words from the task titles.
   - Read `CLAUDE.md` and the code around the `owns` paths.
   - Write `W/context-pack.md` from `T/context-pack.md`.
6. **Workspace**
   - Create `W/briefs/`, `W/reports/`, and `W/reviews/`.
   - Copy `T/ledger.md` to `W/ledger.md` and `T/blackboard.md` to `W/blackboard.md`, with the headers filled.
   - Log `B0 · baseline …`.
7. **Start gate — the only planned human gate before the build**
   - Present:
     - the wave table (wave → tasks → agent and tier)
     - the executor
     - the baseline result
     - the KB hits
   - Ask: *"Start the build?"* After approval, run B1 and B2 to completion, stopping only at the stop conditions.

### Resuming

Read `W/ledger.md`, `TASKS`, and `git log --oneline BASE0..HEAD`. Trust them over your memory.

For a task left `in_progress` or `review`:
1. Find its workdir. Check `git worktree list` and the task's `branch` field.
2. If the work there is committed, continue from review (B1 step 4).
3. Otherwise set the task back to `pending` and re-dispatch it.

---

## B1 — Waves

Repeat until no task is ready.

### 1. Open the wave
- Pick the next wave using the Task graph rules, and log `W<k> · start · <ids>`.
- For each task, fill a brief from `T/task-brief.md` into `W/briefs/TASK-NNN.md`:
  - Copy the description and acceptance criteria verbatim from `plan.md`.
  - Copy `owns`, `verify`, and the design refs from `TASKS`.
  - Add interfaces from `W/blackboard.md` and earlier reports.
  - Add the KB items from the context pack.
  - Add any rulings from the ledger.
- Set `status: in_progress` and `wave: <k>`.
- Record `BASE` = `git rev-parse HEAD`.

### 2. Dispatch implementers
Use the Agent tool with `subagent_type: <task.agent>` and `model: <task.tier>`. Always pass the model explicitly. For parallel dispatch, superpowers:dispatching-parallel-agents is useful background: independent problems, focused prompts, one message.
- **waves:** also pass `isolation: "worktree"`, and dispatch every task of the wave **in one message** so they run in parallel.
- **serial:** no isolation. The implementer works on the feature branch in the main checkout.

Dispatch prompt (keep it this short):
```
Implement TASK-NNN. Read your brief first: <abs path W/briefs/TASK-NNN.md>
Report template: <abs path T/task-report.md>
```
The implementer's preloaded `ase-implement-task` skill covers everything else:
- owned files only
- commit on its own branch
- report written to `.ase/reports/TASK-NNN.md` in its workdir
- reply containing only the header lines

A `SubagentStop` hook makes it finish the report before it returns.

### 3. Collect each report
- Read `<Workdir>/.ase/reports/TASK-NNN.md`. `Workdir` and `Branch` are in the reply's header.
- Write a copy to `W/reports/TASK-NNN.md`.
- Store `branch` in `TASKS`, and log `TASK-NNN · report · <STATUS>`.

| Status | Action |
|--------|--------|
| `DONE` | → review |
| `DONE_WITH_CONCERNS` | Read the concerns. If one is about design, treat it as `DESIGN_GAP`. Otherwise log a ruling → review |
| `NEEDS_CONTEXT` | Answer from the artifacts and log a ruling. Continue the **same** implementer with `SendMessage` (its agent ID or name). Allowed at most 2 times per task, then treat it as `BLOCKED` |
| `BLOCKED` | Escalate once: continue the implementer with more context, or dispatch a fresh one on `opus`, telling it to work in the same workdir. If it is still blocked: `status: blocked`, then follow Recovery below |
| `DESIGN_GAP` | `status: blocked`. Let the other tasks in this wave finish, then **stop** and surface it with the `[DESIGN GAP]` format |

### 4. Review each task (independent, read-only)
- Set `status: review`.
- Dispatch `task-reviewer` with `model: sonnet`, passing:
  - the brief and report paths
  - `Workdir`
  - `Range: <BASE>..<Branch>`. In serial mode, `Branch` is `HEAD`.
  - the output path `W/reviews/TASK-NNN.md`
  - the template `T/task-review.md`

  The reviewer reads the diff itself with `git -C <Workdir> diff <Range>`. Reviewers for the tasks in one wave may run in parallel.
- Do not tell the reviewer what to ignore, and do not pre-judge its findings.
- Log `review r<k> · <verdict>`.

### 5. Fix loop (`CHANGES_REQUIRED`)
- Continue the **same** implementer: *"Fix every Critical and Important finding in <review path>, re-run your verify command, commit, update your report."*
- Re-review the whole task range (round k+1), and set `rounds: <k>`.
- After `fix_rounds` rounds, escalate once: a fresh implementer on `opus` in the same workdir, with the brief and every review of this task.
- If it still fails: `status: blocked` and follow Recovery.
- Minor findings are not fixed in the loop. They are carried to the panel triage list.

### 6. Integrate an approved task
- **waves:** in the main checkout, run `git merge --no-ff <Branch> -m "Merge TASK-NNN: <title>"`.
  - On a conflict: run `git merge --abort`, set the task to `status: pending` and `wave: <k+1>`, and log a ruling. The conflict means `owns` was wrong, so note that for Compound.
  - Once merged, run `git worktree remove <Workdir>`, then `git branch -d <Branch>`.
- **serial:** the commits are already on the feature branch.
- Then:
  - **REQUIRED SUB-SKILL:** superpowers:verification-before-completion. You must have seen the task's `verify` pass on the merged result before the next step.
  - Set `status: done` and `commit: <merge or last sha>`, and log `merged`.
  - Append the report's **Interfaces** and **Discoveries** to `W/blackboard.md`, each line prefixed with the task ID.
  - Run the `hooks.post_task` command if one is configured.

### 7. Wave gate
- Run `verify_command`, then `hooks.post_wave`. Log `W<k> · gate`.
- **On failure:**
  - Find the culprit by mapping the failing tests and files to `owns`.
  - Dispatch that task's agent (serial, main checkout) with the failure output. The agent applies superpowers:systematic-debugging, finding the root cause before fixing anything.
  - Review the fix as in steps 4–5.
  - After two failed attempts, **stop**.
- If `checkpoint: wave` is set, present a 5-line wave report and wait.

### Recovery for blocked tasks
- Their dependents are held, per the Task graph rules.
- Continue with every task that is not held.
- When nothing can proceed, **stop** and present the blocked tasks, what was tried, and the options.
- Log each strike in the `state.yaml` `error_log`, following `ase-recovery`.

---

## B2 — Branch review panel

Run this once all tasks are `done`.

1. Dispatch each reviewer listed in `panel` **in one message**, read-only. Pass each one:
   - `Range: BASE0..HEAD`
   - the SRS, `design.md`, and constitution paths
   - `W/reports/`
   - its output path `W/reviews/panel-<name>.md`

   Per reviewer:
   - `security-reviewer`: `Mode: implementation`, with the source paths taken from the reports' "Files" sections. It has no write access, so write its returned report to `W/reviews/panel-security-reviewer.md` yourself. Map HIGH to P1, MEDIUM to P2, and LOW to P3. An undocumented constitution `EXCEPTION` is P1.
   - `architecture-reviewer`: `model: opus`.
   - Everything else: `model: sonnet`.
2. Merge the findings into `W/panel-findings.md` (template `T/panel-findings.md`). Dedupe them, and add the Minor findings from the per-task reviews as P3.
3. **Fix wave**
   - Group the P1 and P2 findings by the owning task's `owns`.
   - Dispatch implementers for each group: parallel worktrees if the groups do not conflict, otherwise serial. Each gets a brief that cites the findings.
   - Run each fix through B1 steps 3–7.
   - Ask the reviewer that raised a P1 to re-check it against the fix range.
4. Run the `hooks.post_build` command if one is configured.

## B3 — Present Stage 05

Give the engineer (terse):
- Tasks done and blocked.
- Waves run and fix rounds used.
- Final gate result.
- Panel P1/P2 status: fixed / accepted / deferred → `OI-NNN`.
- Rulings made.
- The range `BASE0..HEAD` on `feat/<feature>`.

Then follow `ase-stage-gate` with the Stage 05 checklist. The engineer accepts P2s or sends them
back. Stage 05 approval also covers the commits on the feature branch. Pushing and opening a PR
remain the engineer's call.

---

## Fallback — no Agent tool

Run tasks serially yourself. Follow `.claude/agents/senior-software-engineer.md` (or
`api-engineer.md` for API tasks) and the `ase-implement-task` skill exactly. Still write briefs,
reports, and the ledger. Review your own diff against `task-reviewer.md` after a fresh re-read
of the brief.

Tell the engineer that independent review did not happen.

## Why these limits

Each of these has been the cause of a broken build in agentic setups. The reason is stated so you can spot the same failure in other forms.

- **Pasting reports, diffs, or history into a dispatch.** It fills your context, and you need that context to coordinate the remaining waves. The subagent can read the file itself, so pass the path or range.
- **Letting an implementer's self-report stand in for review.** The implementer is the worst-placed agent to spot its own misreading of the brief. Independent review is the main quality gain of this flow.
- **Skipping re-review after a "small" fix.** Small fixes are where regressions and scope creep slip in unnoticed.
- **Dropping a finding without a disposition.** Every finding gets one: fixed, accepted, or deferred. Without it, Stage 07 can't tell "never seen" from "seen and accepted".
- **Running conflicting tasks in parallel, or parallelising without `baseRef: head`.** The first causes merge conflicts. The second builds on the wrong base, so the work of earlier waves is invisible to later ones.
- **Editing task definitions in `tasks.json`.** The engineer approved those definitions. Changing them quietly breaks that approval and the traceability built on it.
- **Pushing, opening PRs, or merging to the default branch.** These are outward-facing actions, and they belong to the engineer.
- **Marking a task done without a merged commit and a green verify you saw yourself.** A "done" you didn't observe is how agents declare victory early.
