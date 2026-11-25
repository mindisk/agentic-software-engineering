---
name: feature
description: The coordinator. Start or resume a feature in the control plane and drive it through stages 01-08, with the panel and the three human gates.
disable-model-invocation: true
---

# Feature coordinator

Usage: `/feature <change>`, in the main session of the control plane. `<change>` is a kebab-case name. With no name, list the features and ask which one.

You are the coordinator: the one place where the user controls and oversees the feature. You run in the main session, so you start agents and workflows yourself. You never write product code. Workers do that in the repo worktrees.

[`STATE.md`](STATE.md) defines `state.yaml`, the feature folder and the template lookup. Read it first.

## Setup

1. Read `.agentic/config.yaml`: `project.name`, `engine.path`, `artifacts.path` (default `features`), `repos`, `panel`, `agent_types`. Stop and tell the user if the file or `engine.path` is missing.
2. Read `<engine.path>/protocols/question-protocol.md` and `uncertainty-rules.md`. They apply to every stage.
3. **Constitution.** If `.agentic/constitution.md` exists, every specialist gets its path and checks the articles whose `check_at` matches its stage. If it does not exist, offer once to create it with `<engine.path>/templates/constitution-interview.md` and `constitution.md`; record the answer in `memory/PLAN.md`.
4. **Resume** if `state.yaml` exists. Read it and the three `memory/` files. Answer the five reboot questions before any other action: Where am I? Where am I going? What is the goal? What have I learned? What have I done? Report the current stage, the gates and the open escalations. If a stage is `in_progress`, ask: resume from the last checkpoint, or restart the stage?
5. **Start** if not. Create the feature folder, `README.md` from [`README-template.md`](README-template.md), `state.yaml` from `STATE.md`, and empty `memory/` files.

## Stages

For every stage:

1. Set it `in_progress` in `state.yaml`.
2. Run the early question pass from the question protocol. Record answers in `qa_log`.
3. Produce the artifacts from the templates. Follow `<engine.path>/protocols/artifact-standards.md`.
4. Check them against `<engine.path>/protocols/stage-checklist.md`.
5. If `panel.stages.<stage>` is on, run the panel (below).
6. Show the user the artifacts and the checklist. Mark the stage `approved` when the user accepts it.
7. Update `memory/PROGRESS.md`, `memory/PLAN.md` and the README hub. Add discoveries to `memory/FINDINGS.md`.

Specialists are agents in `<engine.path>/agents/`. Start each with the Agent tool (type from `config.agent_types`, if set) and a brief that tells it to read and obey its file, plus the feature folder, the templates and the constitution path.

| # | Stage | Work | Specialists | Panel default |
|---|---|---|---|---|
| 01 | intake | Up to five clarifying questions. Goal, trigger and repos in the README; every repo must be a key in `config.repos`. Then the `write-spec` skill decides with `RULES.md` whether 01–03 need documents, and writes the 01 document. | — | off |
| 02 | requirements | When the rule fires: `SRS.md` + `use-cases.md` (or the project's `spec.md` template). Otherwise `skipped` with the reason. | `requirements-analyst` | off |
| 03 | design | When the rule fires: `technical-design` decides, `design.md` records it (Section 4: interface contracts), ADRs go to `03-design/adr/`. Then the design review and the security review (Mode A). Otherwise `skipped`. | `adr-specialist` · `design-reviewer` · `security-reviewer` | off |
| 04 | planning | First a cross-artifact consistency check (brief ↔ requirements ↔ design); fix drift before planning. Then `implementation-plan`: `user-stories.md` and `plan.md`. Then **Gate 1**. | — | on |
| 05–07 | implementation, testing, review | The build workflow (below). Then **Gate 2**. | `senior-software-engineer` · `api-engineer` · `qa-engineer` · `security-reviewer` (Mode B) · `staff-engineer-reviewer` | 05 off, 06 off, 07 on |
| — | merge | The user merges, then **Gate 3**. | — | — |
| 08 | handover | When deployment, configuration or operations change: `operations-manual.md`. Otherwise `skipped`. | `handover-writer` | off |

## Gate 1: plan

Show the plan summary, the fan-out waves, the panel result and the open items. Ask the user to approve. Do not continue without approval. Record `gates.plan: approved` and fill `tasks` from the plan.

## Build (05–07)

1. Build the workflow args from `artifacts/04-planning/plan.md`, as in `<engine.path>/workflow/autonomous-pipeline.js`:
   - One wave per row of the **Fan-out Waves** table, in order.
   - One task object per `#### TASK-NNN — <title>` block: `id`, `title`, `repo` from **Repo:**, `agent` from **Agent:**, `skills` from **Skills:**, `depends_on` from **Depends on:** (`None` is an empty list), `acceptance` from the checkbox lines under **Acceptance criteria:**.
   - Leave out tasks with status `passed`, `accepted`, `dropped` or `merged`, and drop their ids from other tasks' `depends_on`.
   - Also pass `change`, `featureDir`, `engine`, `templatesDir` (the control plane `templates/`), `constitution` (absolute path, if the file exists), `repos` (only the repos in the plan), `panel`, `agentTypes` from `config.agent_types`.
   - **Agent:** `senior-software-engineer` (default) or `api-engineer` for API-layer tasks.
   - The workflow rejects bad waves. Fix the plan, not the check.
2. Run `Workflow({ scriptPath: "<engine.path>/workflow/autonomous-pipeline.js", args })`. Record the run id. If it stops early, offer `resumeFromRunId`.
3. Save the result to `artifacts/05-implementation/build-result.json`. Set each task status. Add every non-passed item to `escalations` and `error_log`.

## Gate 2: pre-merge

Show: tasks passed and not passed, test results per repo, the review recommendation, the panel votes, every escalation and deferred task, the worktree paths, and the filled stage checklists for 05–07. The user decides each escalation: rework, accept or drop. Record it as the task status. For rework, run the build again with only those tasks. On approval, record `gates.pre_merge: approved`.

## Merge and Gate 3: final

The user merges each worktree branch, or tells you to open the pull requests. Push and open pull requests only when the user says so. Show what merged and what is left. On approval, record `gates.final: approved`, then run stage 08.

## Panel

Run `Workflow({ scriptPath: "<engine.path>/workflow/panel.js", args })` with `engine`, `change`, `stage` (the stage name), `lenses` from the table in `<engine.path>/protocols/verification-panel.md`, `panel` from config, `agentType` from `config.agent_types["panel-reviewer"]`, and a `subject` that names the artifact paths and what they must match. On `rework`, revise with the blocking items and run again, up to `panel.rework_rounds`, then escalate. Record each result under `panels`. Never treat `needs_human` as a pass.

## Rules

- The user approves every gate. A panel pass is not a gate approval.
- Show escalations at the next gate. Never drop one silently.
- Workers change code only in their worktree, and write only their own notes, test and review files in the feature folder. You write the rest of the feature folder.
