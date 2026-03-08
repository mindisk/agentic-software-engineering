# Agentic Software Engineering

A structured AI-driven software engineering pipeline. Takes a high-level
specification through every stage of development — intake, requirements,
design, planning, implementation, testing, and review — with a human
approval gate (pull request) between each stage.

---

## How it works

The engine lives in this repository. Your product repos stay clean — they
only receive a small config file and the agent definition.

```
agentic-software-engineering/    ← this repo, cloned once anywhere on disk
  agents/                        ← the agent (single entry point)
  stages/                        ← stage instructions + templates
  protocols/                     ← canonical protocol files

your-product-repo/
  .agentic/
    config.yaml                  ← engine path + project name
    features/
      <feature-name>/
        state.yaml               ← current stage, Q&A log, PR links
        artifacts/               ← all generated documents
  .claude/agents/
    agentic-software-engineer.md           ← for Claude Code
  .github/agents/
    agentic-software-engineer.agent.md    ← for VSCode Copilot
```

The agent is self-bootstrapping. On every activation it reads `config.yaml`
to find the engine, reads `state.yaml` to know the current stage, and loads
the relevant stage instructions from the engine automatically.

---

## Setup

### 1. Clone the engine (once)

```bash
git clone <this-repo> ~/tools/agentic-software-engineering
```

### 2. Bootstrap a product repo (once per project)

```bash
~/tools/agentic-software-engineering/bootstrap.sh /path/to/product-repo "Project Name"
```

This creates:
- `.agentic/config.yaml` — points to the engine, stores the project name
- `.claude/agents/agentic-software-engineer.md` — agent for Claude Code
- `.github/agents/agentic-software-engineer.agent.md` — agent for VSCode Copilot

### 3. Commit the pipeline setup

```bash
cd /path/to/product-repo
git add .agentic/ .claude/ .github/
git commit -m "chore: add agentic pipeline"
```

### 4. Start working

Open the product repo in your AI tool and activate the agent:

| Tool | How to activate |
|------|----------------|
| **Claude Code** | Agent is available automatically. Just describe what you want to build. |
| **VSCode Copilot Chat** | Type `@agentic-software-engineer` in the chat panel. |
| **Any AI chat** | Paste the contents of `agents/agentic-software-engineer.md` as the system prompt. |

---

## The Agent

**`agents/agentic-software-engineer.md`** is the single entry point for the pipeline.

It contains:
- The agent's operating instructions and defining behaviours
- All four protocols embedded (question protocol, uncertainty rules, artifact standards, PR checklists)
- Self-bootstrapping logic (finds the engine, reads stage, loads instructions)

The agent reads stage-specific instructions and templates from the engine at
runtime — only for the current stage, keeping context lean.

---

## The Pipeline

| Stage | What the agent produces | PR |
|-------|------------------------|----|
| 01 — Intake | `project-brief.md` | `agentic/<feature>/01-intake` |
| 02 — Requirements | `SRS.md`, `use-cases.md` | `agentic/<feature>/02-requirements` |
| 03 — Design | `design.md` + `api-contracts.md` (if external API) | `agentic/<feature>/03-design` |
| 04 — Planning | `plan.md` (tasks + dependency graph + order) | `agentic/<feature>/04-planning` |
| 05 — Implementation | Source code + per-task notes (one PR per task) | `agentic/<feature>/05-impl/TASK-NNN` |
| 06 — Testing | `test-plan.md`, `test-results.md`, test code | `agentic/<feature>/06-testing` |
| 07 — Review | `review-report.md` (includes traceability matrix) | `agentic/<feature>/07-review` |

By default (`pr_gates: true`) each stage ends with a PR and the agent waits for
merge before proceeding. Set `pr_gates: false` at feature start for a single
final PR covering the whole feature — the engineer reviews everything at once.

---

## Multiple features

Each feature runs its own isolated pipeline. Start a new one by telling the agent:

> "Start a new feature called `payment-integration`"

The agent creates `.agentic/features/payment-integration/` and begins Stage 01.
Features never share artifacts — one feature may read another's approved artifacts
for context, but never as a formal input.

---

## Repository structure

```
agentic-software-engineering/
├── README.md
├── bootstrap.sh                      ← one-time setup per product repo
├── agents/
│   └── agentic-software-engineer.md  ← the agent (single entry point)
├── protocols/                        ← canonical protocol source files
│   ├── question-protocol.md
│   ├── uncertainty-rules.md
│   ├── artifact-standards.md
│   └── pr-checklist.md
└── stages/
    ├── 01-intake/
    │   ├── INSTRUCTIONS.md
    │   └── templates/
    │       └── project-brief.md
    ├── 02-requirements/
    │   ├── INSTRUCTIONS.md
    │   └── templates/
    │       ├── SRS.md
    │       └── use-cases.md
    ├── 03-design/
    │   ├── INSTRUCTIONS.md
    │   └── templates/
    │       ├── design.md
    │       └── api-contracts.md
    ├── 04-planning/
    │   ├── INSTRUCTIONS.md
    │   └── templates/
    │       └── plan.md
    ├── 05-implementation/
    │   └── INSTRUCTIONS.md
    ├── 06-testing/
    │   ├── INSTRUCTIONS.md
    │   └── templates/
    │       ├── test-plan.md
    │       └── test-results.md
    └── 07-review/
        ├── INSTRUCTIONS.md
        └── templates/
            └── review-report.md
```
