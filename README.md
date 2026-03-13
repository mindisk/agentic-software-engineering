# Agentic Software Engineering

A structured AI-driven software engineering pipeline. Takes a feature idea through
every stage of development — from raw specification to production-ready code and
operations documentation — with a human approval gate between each stage.

The pipeline enforces discipline that AI agents naturally skip: requirements traceability,
architectural decision records, test-driven development, two-phase review, and constitutional
compliance. Every output is a structured artifact, not a chat response.

---

## How it works

The engine lives in this repository. Your product repos stay clean — they only receive
a small config file and the main agent definition.

```
agentic-software-engineering/    ← this repo, cloned once anywhere on disk
  agents/                        ← coordinator + all specialist agents
  stages/                        ← stage instructions + artifact templates
  protocols/                     ← canonical protocol files
  templates/                     ← optional constitution templates

your-product-repo/
  .agentic/
    config.yaml                  ← engine path, project name, pipeline settings
    constitution.md              ← optional: organizational rules enforced at every stage
    features/
      <feature-name>/
        state.yaml               ← current stage, approval chain, Q&A log, PR links
        artifacts/               ← all generated documents, organized by stage
  .claude/agents/
    agentic-software-engineer.md          ← for Claude Code
  .github/agents/
    agentic-software-engineer.agent.md   ← for VSCode Copilot
```

The coordinator agent is self-bootstrapping. On every activation it reads `config.yaml`
to find the engine, reads `state.yaml` to know the current stage, and loads the relevant
stage instructions from the engine automatically.

---

## The Pipeline

Eight stages, each gated by explicit engineer approval before the next begins.

| Stage | What it produces | Specialists invoked |
|-------|-----------------|---------------------|
| 01 — Intake | `project-brief.md` | — |
| 02 — Requirements | `SRS.md` · `use-cases.md` | `requirements-analyst` |
| 03 — Design | `design.md` (Section 4: interface contracts) · `adr/` (if decisions qualify) | `adr-specialist` · `design-reviewer` · `security-reviewer` |
| 04 — Planning | `user-stories.md` · `plan.md` | — |
| 05 — Implementation | Source code · `TASK-NNN-notes.md` per task | `senior-software-engineer` · `api-engineer` (API tasks) |
| 06 — Testing | `test-plan.md` · `test-results.md` · test code | `qa-engineer` |
| 07 — Review | `review-report.md` (traceability matrix + quality assessment) | `staff-engineer-reviewer` · `security-reviewer` |
| 08 — Support Handover | `operations-manual.md` | `handover-writer` |

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

**Stage 05 — Implementation**: TDD is non-negotiable. Tests are written before
production code — confirmed failing before the first line of implementation.
API layer tasks are routed to `api-engineer` (enforces design.md Section 4 contracts
with a three-layer architecture). All other tasks go to `senior-software-engineer`.
Both specialists check constitutional `check_at: implementation` articles and stop
with `[DESIGN GAP]` rather than making undocumented decisions.

**Stage 06 — Testing**: The `qa-engineer` derives `TC-NNN` test cases directly from
SRS scenarios — one requirement scenario, one test case. Every error path gets its
own explicit test. Results are recorded honestly: no hidden failures, no inflated
coverage numbers.

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
| `senior-software-engineer` | 05 | TDD implementation of non-API tasks: red-green-refactor per task, design.md compliance, per-task notes |
| `api-engineer` | 05 | TDD implementation of API layer tasks: three-layer architecture (service/manager/resilience), design.md Section 4 contract compliance, full error path coverage |
| `qa-engineer` | 06 | Full testing cycle: TC-NNN from SRS scenarios, test implementation, honest results, constitutional test requirements |
| `staff-engineer-reviewer` | 07 | Two-phase review: traceability matrix (Phase 1) + quality assessment and sign-off recommendation (Phase 2) |
| `handover-writer` | 08 | Audience-adaptive operations manual: user guide, configuration, deployment, monitoring, alerting, troubleshooting, rollback |

Fallback: if the Agent tool is unavailable, the coordinator executes each stage directly
following the same instructions.

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
- `.agentic/config.yaml` — engine path, project name, checkpoint interval
- `.claude/agents/agentic-software-engineer.md` — agent for Claude Code
- `.github/agents/agentic-software-engineer.agent.md` — agent for VSCode Copilot

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
git add .agentic/config.yaml .claude/ .github/
git commit -m "chore: add agentic pipeline"
```

### 5. Start working

Open the product repo in your AI tool and activate the agent:

| Tool | How to activate |
|------|----------------|
| **Claude Code** | Agent is available automatically. Describe what you want to build. |
| **VSCode Copilot Chat** | Type `@agentic-software-engineer` in the chat panel. |
| **Any AI chat** | Paste the contents of `agents/agentic-software-engineer.md` as the system prompt. |

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
│   ├── adr-generator.md               ← ADR format reference
│   ├── design-reviewer.md             ← Stage 03: adversarial design review
│   ├── security-reviewer.md           ← Stage 03 + 07: security audit
│   ├── senior-software-engineer.md    ← Stage 05: general implementation
│   ├── api-engineer.md                ← Stage 05: API layer implementation
│   ├── qa-engineer.md                 ← Stage 06: testing
│   ├── staff-engineer-reviewer.md     ← Stage 07: two-phase review
│   └── handover-writer.md             ← Stage 08: operations manual
│
├── stages/
│   ├── 01-intake/
│   │   ├── INSTRUCTIONS.md
│   │   └── templates/project-brief.md
│   ├── 02-requirements/
│   │   ├── INSTRUCTIONS.md
│   │   └── templates/{SRS.md, use-cases.md}
│   ├── 03-design/
│   │   ├── INSTRUCTIONS.md
│   │   └── templates/{design.md, api-contracts.md}
│   ├── 04-planning/
│   │   ├── INSTRUCTIONS.md
│   │   └── templates/{user-stories.md, plan.md}
│   ├── 05-implementation/
│   │   └── INSTRUCTIONS.md
│   ├── 06-testing/
│   │   ├── INSTRUCTIONS.md
│   │   └── templates/{test-plan.md, test-results.md}
│   ├── 07-review/
│   │   ├── INSTRUCTIONS.md
│   │   └── templates/review-report.md
│   └── 08-handover/
│       ├── INSTRUCTIONS.md
│       └── templates/operations-manual.md
│
├── protocols/
│   ├── question-protocol.md           ← when and how to ask questions
│   ├── uncertainty-rules.md           ← [NEEDS CLARIFICATION] and [OPEN] markers
│   ├── artifact-standards.md          ← status lifecycle, frontmatter, naming
│   └── pr-checklist.md                ← stage review checklists
│
└── templates/
    ├── constitution.md                ← annotated constitution template
    └── constitution-interview.md      ← guided interview to derive a constitution
```

---

## Credits and inspiration

This pipeline was shaped by several projects and formats:

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
