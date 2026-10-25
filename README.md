# Agentic Software Engineering

A structured AI-driven software engineering pipeline. Takes a feature idea through
every stage of development — from raw specification to production-ready code and
operations documentation — with a human approval gate between each stage.

The pipeline enforces discipline that AI agents naturally skip: requirements traceability,
architectural decision records, test-driven development, two-phase review, and constitutional
compliance. Every output is a structured artifact, not a chat response.

---

## How it works

The engine lives in this repository. Your product repos stay clean — they only
receive a small config file and copies of the agent definitions.

```
agentic-software-engineering/    ← this repo, cloned once anywhere on disk
  agents/                        ← coordinator + all specialist agents
  skills/                        ← ase-* skills: one per stage (+ templates in assets/), shared protocols, KB
  templates/                     ← constitution, settings, and KB templates

your-product-repo/
  .agentic/
    config.yaml                  ← engine path, project name, build + KB settings
    constitution.md              ← optional: organizational rules enforced at every stage
    kb/                          ← project knowledge base, grows with every feature
    features/
      <feature-name>/
        state.yaml               ← current stage, approval chain, Q&A log, PR links
        artifacts/               ← all generated documents, organized by stage
  .claude/agents/ skills/        ← copied by bootstrap
  .claude/settings.json          ← worktree base + git deny rules (from templates/)
```

The coordinator is a slim router plus approval gates, about 110 lines. On every activation it
reads `config.yaml` to find the engine and `state.yaml` to know the current stage. It then
invokes that stage's skill. Shared rules, such as how to ask questions,
how artifacts look, and how gates work, live in `ase-*` skills. Those load only when needed,
or are preloaded into the specialists that use them.

---

## The Pipeline

Eight stages, each gated by explicit engineer approval before the next begins.

| Stage | What it produces | Specialists invoked |
|-------|-----------------|---------------------|
| 01 — Intake | `project-brief.md` | — |
| 02 — Requirements | `SRS.md` · `use-cases.md` | `requirements-analyst` |
| 03 — Design | `design.md` (Section 4: interface contracts) · `adr/` (if decisions qualify) | `adr-specialist` · `design-reviewer` · `security-reviewer` |
| 04 — Planning | `user-stories.md` · `plan.md` · `tasks.json` | — |
| 05 — Build | Code on `feat/<feature>` · build workspace (briefs, reports, reviews, ledger, blackboard) | implementers per task (`senior-software-engineer`, `api-engineer`, …) · `task-reviewer` · panel: `security-reviewer`, `architecture-reviewer`, `test-quality-reviewer` |
| 06 — Testing | `test-plan.md` · `test-results.md` · test code | `qa-engineer` |
| 07 — Review | `review-report.md` (traceability matrix + quality assessment) | `staff-engineer-reviewer` · `security-reviewer` |
| 08 — Support Handover + Compound | `operations-manual.md` · KB updates · `pipeline-feedback.md` | `handover-writer` · `knowledge-curator` |

### What makes each stage distinct

**Stage 01 — Intake**: A structured clarification pass before anything is written.
The coordinator asks up to five targeted questions from the raw idea, then writes
`project-brief.md`. A vague idea becomes a scoped, bounded specification.

**Stage 02 — Requirements**: The `requirements-analyst` specialist derives formal
requirements in OpenSpec format: every `FR-NNN` has RFC 2119 language, two or more
Given/When/Then scenarios, and a direct trace to the project brief. `SRS.md` and
`use-cases.md` are produced together.

**Stage 03 — Design**: Six-section `design.md` covering architecture, component
design, data model, interface contracts (Section 4 — API, CLI, SDK, events, or N/A),
NFR coverage, and security. The `adr-specialist` runs a research sub-step for every
qualifying architectural decision before writing ADRs. The `design-reviewer` checks
every requirement for coverage. The `security-reviewer` audits auth, data protection,
and input validation. Constitutional compliance is checked against articles marked
`check_at: design`.

**Stage 04 — Planning**: A cross-artifact consistency check before any tasks are
written — catches SRS↔Design drift before it gets baked into implementation.
`user-stories.md` maps requirements to user outcomes. `plan.md` defines concrete
`TASK-NNN` tasks with acceptance criteria, dependencies, and effort estimates.
Every subtask in user stories cross-references a `TASK-NNN`.

**Stage 05 — Build**: Run by the `ase-build` skill, with the coordinator as controller.
- **Prep:** check the build is green before any change, pull relevant knowledge from the KB into a context pack, and present the wave plan for one approval.
- **Per task:** a fresh implementer gets a brief file and works test-first, editing only the files it owns. It commits, then writes a report with a status: `DONE`, `NEEDS_CONTEXT`, `BLOCKED`, or `DESIGN_GAP`. A read-only `task-reviewer` checks spec compliance and quality. Fix rounds are capped, then escalate to a stronger model.
- **Waves:** tasks whose dependencies are done and whose `owns` do not overlap run **in parallel, each in its own git worktree**. They are merged one at a time, and the full test suite gates each wave.
- **Branch panel:** security, architecture, and test-quality reviewers look at the whole branch in parallel. Their findings are ranked P1/P2/P3, followed by one fix wave.

The build runs continuously and stops only for design gaps, destructive or outward-facing
actions, or unresolved blocks. Agents share knowledge through files: briefs, reports, and a
blackboard of interfaces and discoveries. Prompts pass paths, never pasted history.

**Stage 06 — Testing**: The `qa-engineer` derives `TC-NNN` test cases directly from
SRS scenarios — one requirement scenario, one test case. Every error path gets its
own explicit test. Results are recorded honestly: no hidden failures, no inflated
coverage numbers. Unit-level TDD already happened in Stage 05. This stage is acceptance
verification against the requirements.

**Stage 07 — Review**: Two sequential phases with an engineer gate between them.
Phase 1 (structural completeness) builds the requirements traceability matrix and
resolves every open item from all prior stages. Phase 2 (quality assessment) runs
the `security-reviewer` in implementation mode (OWASP A01–A05), checks design
deviations, assesses test quality, and runs the full constitutional compliance check.
An undocumented constitution violation is a defect that blocks sign-off.

**Stage 08 — Support Handover**: The `handover-writer` produces an operator-facing
`operations-manual.md` — not an engineering post-mortem. Monitoring targets come from
SRS NFRs. Troubleshooting entries come from design error paths and confirmed test
failures. Rollback procedures are specific, not "revert the deployment". Unknown
operational details are marked `[REQUIRES INPUT FROM: engineering]` — never guessed.
It then runs **Compound**: the `knowledge-curator` distils the build's discoveries,
root-caused failures, recurring review findings, and rulings into the project KB.
Existing entries are updated or superseded rather than duplicated. It also proposes
`CLAUDE.md` and constitution promotions for approval, and writes pipeline feedback for the engine.

---

## Specialist Agents

The coordinator delegates to specialists rather than doing all work itself. Each
specialist has a narrow scope, explicit boundaries, and returns structured output
to the coordinator. The coordinator merges findings and maintains pipeline state.

| Agent | Stage | Role |
|-------|-------|------|
| `requirements-analyst` | 02 | Derives FR-NNN and NFR-NNN in OpenSpec format from the project brief; checks every requirement traces to brief scope |
| `adr-specialist` | 03 | Identifies qualifying architectural decisions, researches each one (codebase scan → options → requirements evaluation → recommendation) before writing any ADR |
| `design-reviewer` | 03 | Adversarial review of `design.md`: checks every FR/NFR for coverage, traces use-case flows, flags underspecified components, checks constitutional compliance |
| `security-reviewer` | 03, 07 | Mode A (design): auth/authz design, data protection, missing security elements. Mode B (implementation): OWASP A01–A05, hardcoded secrets, design-vs-implementation gaps |
| `senior-software-engineer` | 05 | Implementer for non-API tasks (preloads `ase-implement-task`) |
| `api-engineer` | 05 | Implementer for API layer tasks: three-layer architecture, design.md Section 4 contract compliance (preloads `ase-implement-task`) |
| `task-reviewer` | 05 | Independent per-task review: spec compliance, vacuous tests, edits outside `owns`, verify re-run; keeps project memory of recurring defects |
| `architecture-reviewer` | 05 | Branch panel: design drift, cross-task duplication, interface seams, accidental complexity |
| `test-quality-reviewer` | 05 | Branch panel: acceptance coverage, vacuous/flaky tests, error paths, TDD evidence |
| `qa-engineer` | 06 | Full testing cycle: TC-NNN from SRS scenarios, test implementation, honest results, constitutional test requirements |
| `staff-engineer-reviewer` | 07 | Two-phase review: traceability matrix (Phase 1) + quality assessment and sign-off recommendation (Phase 2) |
| `handover-writer` | 08 | Audience-adaptive operations manual: user guide, configuration, deployment, monitoring, alerting, troubleshooting, rollback |
| `knowledge-curator` | 08 | Compound step: harvests the feature into `.agentic/kb/`, proposes CLAUDE.md/constitution promotions |

**Adding a specialist.** Create an agent that preloads `ase-implement-task`, for example
`frontend-engineer`, and route tasks to it with the `agent` field in `tasks.json` at Stage 04.
The coordinator needs no changes.

Fallback: if the Agent tool is unavailable, the coordinator executes each stage directly
following the same instructions.

---

## Skills

| Skill | Used by | Purpose |
|-------|---------|---------|
| `ase-feature-state` | coordinator | Feature layout, `state.yaml` schema, memory files (PLAN/FINDINGS/PROGRESS), resume |
| `ase-questions` | coordinator | Question protocol, uncertainty types, decision matrix, recording answers |
| `ase-artifacts` | coordinator; preloaded into artifact writers | Header, required sections, ID scheme, inline markers, SRS format, versioning |
| `ase-constitution-check` | preloaded into every agent that checks it | Which articles apply when (`check_at`), assessment format, exception handling |
| `ase-stage-gate` | coordinator | Self-review → present → approve → advance; per-stage checklists in `checklists.md` |
| `ase-recovery` | coordinator, `ase-build` | 3-strike rule and the `error_log` format |
| `ase-terse` | preloaded into all specialists | Return format and output budgets: status, counts, paths |
| `ase-intake` | coordinator (Stage 01) | Clarify pass → open questions → project brief, nothing invented |
| `ase-requirements` | coordinator (Stage 02) | Question pass → `requirements-analyst` → verify its files, not its summary |
| `ase-design` | coordinator (Stage 03) | Constitution + KB → design.md → ADRs → design and security review → full constitution check |
| `ase-planning` | coordinator (Stage 04) | Consistency check → KB → stories → plan → `tasks.json` with owned files, verify, agent, tier, waves; graph checks |
| `ase-build` | coordinator (Stage 05) | Controller procedure: task graph rules, waves, dispatch, review, merge, gates, panel. A `Stop` prompt hook keeps it from stopping mid-build |
| `ase-acceptance-testing` | coordinator (Stage 06) | `qa-engineer` → verify results against the Stage 05 ledger; red is never presented as green |
| `ase-review` | coordinator (Stage 07) | Phase 1 traceability → engineer decides each gap → Phase 2 quality; security review reused only if no code changed |
| `ase-handover` | coordinator (Stage 08) | Operations manual → Compound via `knowledge-curator` → promotions as diffs |
| `ase-implement-task` | every implementer (preloaded) | Shared protocol: brief → test-first → commit → report with status code |
| `ase-kb-search` | Stages 03, 04, 05 | KB search with the Grep tool (frontmatter lines + text), staleness checked with `git log <verified_at>..HEAD -- <files>` |
| `ase-kb-capture` | `knowledge-curator` (Stage 08) | Compound procedure: dedupe, update or supersede, write, re-index, propose promotions |

### Superpowers integration

The pipeline **requires** the [superpowers](https://github.com/obra/superpowers) plugin
(`/plugin install superpowers`). We reuse its discipline skills rather than restating them:

| superpowers skill | Used by |
|-------------------|---------|
| `test-driven-development`, `verification-before-completion` | Preloaded into every implementer |
| `receiving-code-review` | Implementers in the Stage 05 fix loop. A finding can be disputed with evidence, and the reviewer then upholds or withdraws it |
| `systematic-debugging` | `ase-recovery` strike 1, wave-gate failures, implementer bugs |
| `dispatching-parallel-agents` | Background for the build controller's waves and panel |
| `writing-skills` | How `ase-*` skills are developed and tested (see below) |

`brainstorming`, `writing-plans`, `subagent-driven-development`, and `executing-plans` are **not**
used inside the pipeline. Each is a complete flow with its own outputs (`docs/superpowers/…`),
and Stages 01, 04, and 05 already cover those roles. The coordinator states this precedence
explicitly, and `using-superpowers` defers to agent instructions.

### Developing ase-* skills

Change a skill the way `superpowers:writing-skills` describes: write a pressure scenario, run it
with a subagent without the change and then with it, and keep the change only if it fixes what the
first run got wrong. Run scenarios in a scratch directory. Test material is not kept in this repo.
Descriptions say only *when* to use a skill ("Use when…"). A description that summarises the
workflow tempts agents to skip the skill's body.

## Shared knowledge

| Layer | Where | Lifetime | Written by | Read by |
|-------|-------|----------|------------|---------|
| Build workspace | `<artifacts>/05-implementation/` (ledger, context pack, blackboard, briefs, reports, reviews) | one feature | build controller, implementers (reports), reviewers | every later task in the build, Stage 07, Compound |
| Project KB | `.agentic/kb/{solutions,patterns,gotchas,decisions}/` | permanent, versioned | `knowledge-curator` | Stages 03–05 via `ase-kb-search` |
| Always-on | `CLAUDE.md`, constitution, agent memory (`.claude/agent-memory/<agent>/`) | permanent | engineer-approved promotions; reviewers' own memory | every session |

KB entries are markdown with frontmatter (`tags`, `components`, `files`, `verified_at`,
`status`). An entry whose files have changed since `verified_at` is flagged as stale.

## Build configuration

`.agentic/config.yaml`:

```yaml
build:
  executor: waves          # waves (parallel in worktrees) | serial
  max_parallel: 3
  fix_rounds: 3
  checkpoint: none         # none | wave
  setup_command: ""        # run in fresh worktrees
  verify_command: ""       # full gate: tests + lint + types
  panel: [security-reviewer, architecture-reviewer, test-quality-reviewer]
  hooks: { post_task: "", post_wave: "", post_build: "" }
kb:
  path: .agentic/kb
```

Parallel waves need `worktree.baseRef: "head"` in `.claude/settings.json`. Bootstrap sets it, or the coordinator merges it in on first run.
Without it, subagent worktrees branch from the default branch instead of your feature branch.
For gitignored files that fresh worktrees need, such as `.env`, add a `.worktreeinclude`.

**Git policy.** The build commits and merges task branches only on `feat/<feature>`. It never
pushes, opens PRs, merges into the default branch, or hard-resets. The `permissions.deny` rules
in `.claude/settings.json` (from `templates/claude-settings.json`) enforce this for the coordinator
and every subagent. They match commands as written, so `git -C . push` would slip through. For
hard guarantees, enable the sandbox.

## No scripts: harness-native only

The framework is made only of Claude Code definitions: agents, skills, settings, and markdown or
JSON templates. Every check that a helper script might do is either a rule the agents follow,
written into a skill, or a harness feature:

| Concern | Mechanism |
|---------|-----------|
| Task graph validity, waves | Rules in `ase-build` ("Task graph rules"), applied by Stage 04 when planning and re-checked at Stage 05 B0 |
| Implementer finishes with a commit and a report | `SubagentStop` prompt hook in each implementer's frontmatter |
| Reviewer returns a verdict | `SubagentStop` prompt hook in `task-reviewer` |
| Controller doesn't stop mid-build | `Stop` prompt hook in the `ase-build` skill's frontmatter |
| No push, PR, hard reset, rebase | `permissions.deny` in `.claude/settings.json` |
| Parallel isolation | `isolation: "worktree"` on dispatch + `worktree.baseRef: "head"` |
| Review diffs | Reviewers read `git diff <range>` themselves |
| KB search, staleness, index | Grep tool + `git log`; `index.md` maintained by the curator |

`bootstrap.sh` is the only shell file. It copies definitions into the product repo.

---

## The Constitution

The optional `.agentic/constitution.md` defines organizational engineering rules.
Each article specifies when it is checked (`check_at: design | implementation | testing | review | all`).

Articles are enforced at:
- **Stage 03** — `design-reviewer` checks `design` and `all` articles; `security-reviewer` checks security articles
- **Stage 05** — `senior-software-engineer` and `api-engineer` check `implementation` and `all` articles
- **Stage 06** — `qa-engineer` checks `testing` and `all` articles
- **Stage 07** — `staff-engineer-reviewer` and `security-reviewer` run the full compliance check

A constitution violation found during implementation stops the task and surfaces it
as `[DESIGN GAP: constitution violation]`. A violation in review without a covering
ADR is a defect that blocks sign-off.

Two templates are provided:
- `templates/constitution.md` — full annotated template with common articles
- `templates/constitution-interview.md` — guided interview to derive your constitution

---

## Setup

### 1. Clone the engine (once)

```bash
git clone https://github.com/your-org/agentic-software-engineering ~/tools/agentic-software-engineering
```

### 2. Bootstrap a product repo (once per project)

```bash
~/tools/agentic-software-engineering/bootstrap.sh /path/to/product-repo "Project Name" 2
```

The third argument sets where pipeline artifacts are stored:

| Option | Location |
|--------|----------|
| `1` | Inside the product repo (`.agentic/features/`) — committed with code |
| `2` | Outside the repo (`~/agentic-artifacts/<project>/`) — local only *(recommended)* |
| `/abs/path` | Custom absolute path |

This creates:
- `.agentic/config.yaml`: engine path, project name, build and KB settings
- `.agentic/kb/`: an empty project knowledge base
- `.claude/agents/*.md`: the coordinator and every specialist agent
- `.claude/skills/ase-*/`
- `.claude/settings.json` with `worktree.baseRef: "head"` and the git deny rules. This happens only if the file doesn't exist; otherwise the coordinator offers to merge the entries on first run
- `.gitignore` entries for `.ase/` (implementer reports in progress) and `.claude/worktrees/`

Re-run bootstrap after pulling engine updates to refresh agents, skills, and hooks. An existing
`config.yaml` and KB are kept. Upgrading from an earlier bootstrap? Delete `.github/agents/` —
Copilot is no longer supported.

### 3. (Optional) Add a constitution

```bash
cp ~/tools/agentic-software-engineering/templates/constitution.md /path/to/product-repo/.agentic/constitution.md
# Edit to reflect your organization's engineering standards
```

Or use the interview template to derive one collaboratively with the agent:
`templates/constitution-interview.md`

### 4. Commit the pipeline setup

```bash
cd /path/to/product-repo
git add .agentic/config.yaml .agentic/kb/ .claude/ .gitignore
git commit -m "chore: add agentic pipeline"
```

### 5. Start working

Start Claude Code in the product repo with the coordinator as the session agent:

```bash
claude --agent agentic-software-engineer
```

The coordinator must be the main session agent. It holds the approval gates with you, and
the Stage 05 build dispatches implementers and reviewers one level below it, sometimes in
parallel. Started as a subagent, it would be nested too deep and lose the conversation with
you, so it falls back to running every stage itself.

Tell the agent what feature you want to build. It handles everything from there,
asking for approval at each stage gate.

---

## Multiple features

Each feature runs its own isolated pipeline. Start a new one:

> "Start a new feature called `payment-integration`"

The agent creates `.agentic/features/payment-integration/` with its own `state.yaml`
and `artifacts/` tree. Features never share artifacts — one feature may read another's
approved artifacts for context, but never as a formal input.

---

## Repository structure

```
agentic-software-engineering/
├── README.md
├── bootstrap.sh                        ← one-time setup per product repo
│
├── agents/
│   ├── agentic-software-engineer.md   ← coordinator (single entry point)
│   ├── requirements-analyst.md        ← Stage 02 specialist
│   ├── adr-specialist.md              ← Stage 03: architectural decisions
│   ├── design-reviewer.md             ← Stage 03: adversarial design review
│   ├── security-reviewer.md           ← Stage 03 + 07: security audit
│   ├── senior-software-engineer.md    ← Stage 05: general implementer
│   ├── api-engineer.md                ← Stage 05: API layer implementer
│   ├── task-reviewer.md               ← Stage 05: independent per-task review
│   ├── architecture-reviewer.md       ← Stage 05: branch panel (structure)
│   ├── test-quality-reviewer.md       ← Stage 05: branch panel (tests)
│   ├── knowledge-curator.md           ← Stage 08: Compound → project KB
│   ├── qa-engineer.md                 ← Stage 06: testing
│   ├── staff-engineer-reviewer.md     ← Stage 07: two-phase review
│   └── handover-writer.md             ← Stage 08: operations manual
│
├── skills/
│   ├── ase-feature-state/             ← feature layout, state.yaml, memory, resume
│   ├── ase-questions/                 ← question + uncertainty protocol
│   ├── ase-artifacts/                 ← artifact standards
│   ├── ase-constitution-check/        ← constitution compliance check
│   ├── ase-stage-gate/                ← self-review, present, approve (+ checklists.md)
│   ├── ase-recovery/                  ← 3-strike rule
│   ├── ase-terse/                     ← return format and output budgets
│   ├── ase-intake/                    ← Stage 01 (+ assets: project-brief)
│   ├── ase-requirements/              ← Stage 02 (+ assets: SRS, use-cases)
│   ├── ase-design/                    ← Stage 03 (+ assets: design, adr-format)
│   ├── ase-planning/                  ← Stage 04 (+ assets: plan, user-stories, tasks.json)
│   ├── ase-build/                     ← Stage 05 controller (+ assets: brief, report, review, ledger…)
│   ├── ase-acceptance-testing/        ← Stage 06 (+ assets: test-plan, test-results)
│   ├── ase-review/                    ← Stage 07 (+ assets: review-report)
│   ├── ase-handover/                  ← Stage 08 (+ assets: operations-manual)
│   ├── ase-implement-task/            ← shared implementer protocol
│   ├── ase-kb-search/                 ← KB retrieval
│   └── ase-kb-capture/                ← Compound procedure
│
└── templates/
    ├── constitution.md                ← annotated constitution template
    ├── constitution-interview.md      ← guided interview to derive a constitution
    ├── kb-readme.md, kb-index.md      ← installed into .agentic/kb/
    └── claude-settings.json           ← worktree base + git deny rules for .claude/settings.json
```

---

## Credits and inspiration

This pipeline was shaped by several projects and formats:

**[superpowers](https://github.com/obra/superpowers)**: the Stage 05 controller pattern
(fresh implementer per task, brief/report/review package as files, status codes, an
independent reviewer per task, capped fix loop with model escalation, a ledger as the
recovery map) follows its `subagent-driven-development` skill.

**[Compound Engineering](https://every.to/guides/compound-engineering)**: the Compound step
and the searchable solutions knowledge base with frontmatter.

**[Effective harnesses for long-running agents](https://anthropic.com/engineering/effective-harnesses-for-long-running-agents)**:
JSON task list whose only mutable fields are status fields, verifying the baseline first, and never declaring done early.

**[GSD](https://github.com/open-gsd/gsd-core)**: dependency waves of parallel executors in fresh contexts.

**[Awesome Copilot](https://github.com/github/awesome-copilot)**
A community collection of GitHub Copilot agent definitions and custom instructions.
The `security-reviewer` and `handover-writer` agents were adapted from patterns
in this collection, particularly `se-security-reviewer.agent.md` and
`gem-documentation-writer.agent.md`.

**[OpenAPI Specification](https://www.openapis.org/)**
The interface contract approach in `design.md` Section 4 draws on OpenAPI's
philosophy of specification-first development — define the contract before writing
any code. Unlike OpenAPI, this pipeline's interface contracts are intentionally
format-agnostic: they cover REST APIs, CLIs, SDKs, event schemas, and file formats
with equal formality.

**[Architecture Decision Records](https://adr.github.io/)**
The ADR format in Stage 03 follows the pattern documented by Michael Nygard and
the ADR GitHub organisation. The `adr-specialist` adds a mandatory research
sub-step before any ADR is written — decisions must be investigated, not assumed.

**[BDD / Gherkin](https://cucumber.io/docs/gherkin/)**
The Given/When/Then scenario format used in `SRS.md` requirements (via the
`requirements-analyst`) is derived from Behavior-Driven Development. Each `FR-NNN`
requires at minimum two scenarios: a happy path and an error path.

**[RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119)**
Requirements in `SRS.md` use RFC 2119 modal language — MUST, SHOULD, MAY — to
eliminate ambiguity about requirement strength. The `requirements-analyst` enforces
this in every FR-NNN it produces.
