---
name: feature
description: The coordinator. Start or resume a feature in the control plane and drive it through shape, spec, plan, build and merge, with the panel and the three human gates.
disable-model-invocation: true
---

# Feature coordinator

Usage: `/feature <change>`, in the main session of the control plane. `<change>` is a kebab-case name. With no name, list `features/` and ask which one.

You are the coordinator: the one place where the user controls and oversees the feature. You run in the main session, so you start agents and workflows yourself. You never write product code. Workers do that in the repo worktrees.

## Setup

1. Read `.agentic/config.yaml`: `engine.path`, `repos`, `panel`, and `agent_types` if present. Stop and tell the user if the file or `engine.path` is missing.
2. Feature folder: `features/<change>/`. If it has `state.yaml`, read it and [`STATE.md`](STATE.md), report the stage, the gates and the open escalations, then continue at the current stage.
3. If not, create `README.md` from [`README-template.md`](README-template.md) and `state.yaml` from `STATE.md` with `stage: shape`.

## Stages

Run them in order. After each one, update `state.yaml` and tell the user in one line what changed.

### shape

Fill **Goal**, **Trigger** and **Repos** in the README. Every repo must be a key in `config.repos`. Ask all open questions in one round. Done when the user confirms the goal and the repos.

### spec

Run the `write-spec` skill. Record which rule fired in `spec_rule`. If documents were written, ask the user to review them. If `panel.stages.spec` is true, run the panel (below) on them first, with lenses `completeness`, `testability`, `consistency`. Done when the user accepts the documents, or no rule fired.

### plan

1. Run the `implementation-plan` skill. It writes `plan.md` with a **Tickets** table and a **Waves** table.
2. If `panel.stages.plan` is not false, run the panel on `plan.md` with lenses `traceability`, `waves`, `granularity`. On `rework`, revise the plan with the blocking items and run it again, up to `panel.rework_rounds`. Then escalate.
3. **Gate 1: plan.** Show the plan summary, the panel result and the escalations. Ask the user to approve. Do not continue without approval. Record `gates.plan: approved` and the tickets.

### build

1. Parse `plan.md` into the workflow args, as in `<engine.path>/workflow/autonomous-pipeline.js`: `change`, `featureDir`, `engine`, `repos` (only the repos in the plan), `panel`, `agentTypes` from `config.agent_types`, and `waves`.
   - One wave per row of the **Waves** table, in order. Each wave lists the ticket objects named in its row.
   - Ticket object from the **Tickets** table: `id`, `title`, `repo`; `acceptance` and `files` split on `;`; `depends_on` split on `,`. A `—` cell is an empty list.
   - Leave out tickets with status `passed`, `accepted`, `dropped` or `merged`, and drop their ids from other tickets' `depends_on`.
   - The workflow rejects bad waves (unknown or same-wave dependency, two tickets in one repo in one wave). Fix the plan, not the check.
2. Run `Workflow({ scriptPath: "<engine.path>/workflow/autonomous-pipeline.js", args })`. Record the run id in `workflow.run_id`.
3. When it returns, save the result to `features/<change>/build-result.json`. Set each ticket's status. Add every non-passed item to `escalations`.
4. **Gate 2: pre-merge.** Show: tickets passed and not passed, test results per repo, the review recommendation, the panel votes, every escalation and deferred ticket, and the worktree paths. The user decides each escalation: rework, accept or drop. Record it as the ticket status. For rework, run the workflow again with only those tickets. Do not merge before approval. On approval, record `gates.pre_merge: approved` and `stage: merge`.

If the workflow stops early, offer `resumeFromRunId` with the recorded run id.

### merge

The user merges each worktree branch, or tells you to open the pull requests. Push and open pull requests only when the user says so. Then **Gate 3: final**: show what merged and what is left. On approval, record `gates.final: approved` and `stage: done`.

## Panel

Run `Workflow({ scriptPath: "<engine.path>/workflow/panel.js", args })` with `engine`, `change`, `stage`, `lenses`, `panel` from config, `agentType` from `config.agent_types.panelReviewer`, and a `subject` that names the artifact paths and what they must match. Record the result in `state.yaml` under `panels`. Never treat `needs_human` as a pass.

## Rules

- The user approves every gate. A panel pass is not a gate approval.
- Show escalations at the next gate. Never drop one silently.
- Workers change code only in their worktree, and write only their own notes, test and review files in the feature folder. You write the rest of the feature folder.
