---
name: ase-handover
description: "Use when the agentic pipeline reaches Stage 08, when a signed-off feature needs an operations manual or support handover, when the engineer asks to close out, finish, or compound a feature (including an abandoned one), or when the handover-writer or knowledge-curator returns."
---

# ase-handover — Stage 08: Handover + Compound

Two outputs:
- **Handover.** An operations manual the support team can run the feature from on day one. It is written for operators: how to use, configure, deploy, monitor, troubleshoot, and roll back. It is not a story of how the feature was built.
- **Compound.** What this feature taught goes into the project KB, so the next feature starts ahead.

## Inputs and outputs

| | Path |
|--|--|
| In | every APPROVED artifact under `<A>/` · the code · `07-review/review-report.md` (deferred items, accepted risks) |
| Out | `<A>/08-handover/operations-manual.md` · KB entries in `.agentic/kb/` · `<A>/08-handover/pipeline-feedback.md` |
| Template | [assets/operations-manual.md](assets/operations-manual.md) |

Before starting, confirm that `review-report.md` is `APPROVED`, `state.yaml` shows
`stage_07: approved`, and no blocking open item remains. If not, stop and tell the engineer.
**Exception:** Compound alone (step 4) may run on an abandoned feature, using whatever artifacts
exist.

## 1. Read, then ask

Read everything. NFRs become monitoring targets. Component failure modes become troubleshooting
entries. Deferred items and accepted risks become known limitations.

Follow `ase-questions`, in one pass:
- **Audience:** engineers, non-technical operators, or a mix. This sets the depth.
- **Post-deploy configuration:** flags, env vars, settings that need attention at launch.
- **Deployment specifics:** migrations, cache primes, DNS, third-party provisioning.
- **An existing runbook** or monitoring setup to plug into, rather than duplicate.
- **The rollback path:** a flag toggle, a migration revert.

## 2. Delegate to `handover-writer`

```
Feature: <feature>
Audience: <technical-engineers | non-technical-operators | mixed>
Artifacts base path: <A>/
Source code path: <source paths>
Output path: <A>/08-handover/operations-manual.md
Template path: .claude/skills/ase-handover/assets/operations-manual.md
Constitution path: .agentic/constitution.md (or N/A)
Deployment specifics: <answer, or NONE>
Runbook exists: <path, or NONE>
Rollback procedure: <answer, or BEST JUDGMENT>
Post-deploy config: <answer, or NONE>
```

**On return**, verify:
- all nine sections are present
- no section is empty
- every `[REQUIRES INPUT FROM: <role>]` gap is listed

## 3. Manual gate

Follow `ase-stage-gate` with the Stage 08 checklist (the manual items). In the summary, include:
- the audience
- the number of gaps, and the sections they are in

The engineer either fills the gaps or accepts them as follow-ups. **Wait for approval of the
manual before Compound.**

## 4. Compound — `knowledge-curator`

The feature is not closed until Compound has returned. Delegate. The curator follows
`ase-kb-capture`.
```
Feature: <feature>
Artifacts: <A>
State: .agentic/features/<feature>/state.yaml
KB: <kb.path, default .agentic/kb>
Entry template: .claude/skills/ase-kb-capture/assets/kb-entry.md
Feedback output: <A>/08-handover/pipeline-feedback.md
```

On return, present:
1. **The KB delta:** new, updated, and superseded entry IDs.
2. **Each proposed promotion, as a diff,** for the engineer to approve or reject one by one.
   - `CLAUDE.md`: apply only the approved diffs.
   - **Constitution:** a change follows the constitution's own amendment rules (version bump, ratification). Point out any conflict with decisions the engineer already accepted for this feature.
   - Until the engineer answers, neither file is touched.
3. **`pipeline-feedback.md`.** It is input for improving the pipeline engine, not product work.
4. **Commit.** The KB lives in the product repo. Tell the engineer to commit `.agentic/kb/` (and any approved `CLAUDE.md` or constitution change) together with the feature, or right after it.

## 5. Close

Once the promotions are decided:
- set `stage_08: approved` and `feature_status: complete` in `state.yaml`
- update the memory files (`ase-feature-state`)

## Why these limits

- **An operator's guide, not a build diary.** Support reads this during an incident. Every paragraph about how the feature was built is one they have to skip.
- **No feature closes without Compound.** Knowledge that isn't harvested at close is lost. Losing it means the next feature repeats this feature's gotchas.
- **Promotions are the engineer's decision, one diff at a time.** `CLAUDE.md` and the constitution steer every future agent session. One wrong line there misleads everyone after this feature.
