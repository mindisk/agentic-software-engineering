---
title: Operations Manual
stage: "08 — Liveops Handover"
feature: FEATURE_NAME
version: 1.0.0
status: DRAFT
created: YYYY-MM-DD
updated: YYYY-MM-DD
project: PROJECT_NAME
authors: ""
approved_by: []
audience: [e.g. "Liveops engineers", "Support team", "Non-technical operators"]
---

# Operations Manual — FEATURE_NAME

## Purpose

This document enables liveops to deploy, configure, monitor, and support
FEATURE_NAME in production. It is written for [AUDIENCE] and assumes
[ASSUMED KNOWLEDGE LEVEL, e.g. "familiarity with the admin console but not
the codebase"].

If you cannot find what you need here, escalate to: [CONTACT — see Section 9].

---

## 1. Feature Overview

**What it does:**
[One to two paragraphs. Describe the feature from the operator's perspective —
what it enables users to do, what it changes in the system, and what liveops
is responsible for.]

**Who uses it:**
| Actor | Role |
|-------|------|
| [End user type] | [What they do with this feature] |
| [Admin / operator] | [What they configure or manage] |

**Why it matters to operations:**
[What breaks or degrades if this feature is unhealthy? What is the user impact
of an outage or misconfiguration?]

---

## 2. User Guide

Step-by-step instructions for each primary workflow.

### 2.1 [Primary workflow name, e.g. "Creating a new record"]

1. [Step 1]
2. [Step 2]
3. [Expected outcome]

**Common mistakes:**
- [Mistake and how to avoid it]

### 2.2 [Secondary workflow name]

1. [Step 1]
2. [Step 2]

*Add one subsection per significant user-facing workflow. Reference use-cases.md
UC-NNN identifiers where helpful.*

---

## 3. Configuration

All settings that can be changed without a code deployment.

### 3.1 Environment Variables

| Variable | Description | Default | Valid values | Required |
|----------|-------------|---------|--------------|---------|
| `VAR_NAME` | [What it controls] | `default_value` | [Range or options] | Yes / No |

### 3.2 Feature Flags

| Flag | Description | Default | Effect when enabled |
|------|-------------|---------|---------------------|
| `FLAG_NAME` | [What it gates] | OFF | [What changes] |

### 3.3 Admin / Application Settings

| Setting | Location | Default | Notes |
|---------|----------|---------|-------|
| [Setting name] | [Where to find it, e.g. Admin > Settings > Feature] | [Default] | [Guidance] |

**Settings that require operator action at first launch:**
- [ ] [Setting]: set to [value] because [reason]

---

## 4. Deployment & Activation

### 4.1 Prerequisites

Before deploying, confirm:
- [ ] [Prerequisite, e.g. "Database migration `20240101_add_feature_table` has run"]
- [ ] [Prerequisite, e.g. "Third-party API key `FEATURE_API_KEY` is set in the environment"]
- [ ] [Prerequisite, e.g. "Feature flag `FEATURE_NAME_ENABLED` is ready to toggle"]

### 4.2 Deployment Steps

1. [Step 1, e.g. "Run database migrations: `make migrate`"]
2. [Step 2, e.g. "Deploy the new version to staging and run smoke tests"]
3. [Step 3, e.g. "Toggle the feature flag for 5% of users"]
4. [Step 4, e.g. "Monitor error rates for 30 minutes before full rollout"]

### 4.3 Post-Deploy Verification

Confirm the feature is working before declaring the deployment complete:

- [ ] [Smoke test 1, e.g. "Load [URL] and verify [expected element] appears"]
- [ ] [Smoke test 2, e.g. "Create a test record and confirm it appears in [location]"]
- [ ] [Smoke test 3, e.g. "Check the `/health` endpoint returns `feature_name: ok`"]

---

## 5. Monitoring

### 5.1 Key Metrics

| Metric | Description | Normal range | Where to find it |
|--------|-------------|-------------|-----------------|
| [Metric name] | [What it measures] | [Expected value/range] | [Dashboard / query] |

### 5.2 Dashboards

| Dashboard | URL / Location | What to look at |
|-----------|----------------|-----------------|
| [Dashboard name] | [Link or path] | [Key panels to check] |

### 5.3 Log Patterns

Logs relevant to this feature are prefixed with `[FEATURE_NAME]` (or equivalent).

| Event | Log message pattern | Severity |
|-------|--------------------|----|
| [Normal event] | `[pattern]` | INFO |
| [Warning event] | `[pattern]` | WARN |
| [Error event] | `[pattern]` | ERROR |

**Log location:** [e.g. CloudWatch group `/app/feature-name`, Kibana index `app-logs`]

---

## 6. Alerting

| Alert name | Condition | Threshold | Severity | Initial response |
|-----------|-----------|-----------|----------|-----------------|
| [Alert name] | [What triggers it] | [Threshold, e.g. "> 5% error rate for 5 min"] | P1 / P2 / P3 | [First action, e.g. "Check Section 7.1"] |

**On-call escalation path:**
1. Check this manual's troubleshooting section first
2. [Escalation step, e.g. "Page on-call engineer via PagerDuty"]
3. [Escalation step, e.g. "Escalate to feature owner: [name/team]"]

---

## 7. Troubleshooting

### 7.1 [Failure mode, e.g. "Feature returns 500 errors"]

**Symptom:** [What the operator or user sees]

**Likely cause(s):**
1. [Cause 1] — check [what to check]
2. [Cause 2] — check [what to check]

**Resolution:**
1. [Step 1]
2. [Step 2]
3. If unresolved: [next action, e.g. "escalate to engineering"]

---

### 7.2 [Failure mode, e.g. "Feature flag shows as enabled but feature is not visible"]

**Symptom:** [What the operator or user sees]

**Likely cause(s):**
1. [Cause] — check [what to check]

**Resolution:**
1. [Step 1]

---

*Add one subsection per significant failure mode identified in the design or
known limitations from the review report.*

---

## 8. Rollback

**When to rollback:**
[Describe the conditions that justify rollback vs. a targeted fix, e.g. "Rollback
if error rate exceeds 10% and cannot be traced to a configuration issue within
15 minutes."]

### 8.1 Rollback Procedure

1. [Step 1, e.g. "Toggle feature flag `FEATURE_NAME_ENABLED` to OFF immediately"]
2. [Step 2, e.g. "Verify error rate returns to baseline within 2 minutes"]
3. [Step 3, e.g. "If DB state is affected: run revert migration `make migrate-down`"]
4. [Step 4, e.g. "Notify [team] that the feature has been rolled back"]

**Data impact:** [Does rollback affect existing data? e.g. "Records created during
the rollback window will remain but will not be visible until the feature is
re-enabled."]

**Expected recovery time:** [e.g. "Feature flag toggle takes effect within 30 seconds."]

---

## 9. Known Limitations & Contacts

### Known Limitations

| Limitation | Impact | Accepted by | Workaround |
|------------|--------|-------------|------------|
| [Limitation from review report] | [User / ops impact] | [Engineer] | [Workaround if any] |

### Support Contacts

| Role | Name / Team | Contact | For |
|------|-------------|---------|-----|
| Feature owner | [Name / team] | [Slack / email] | Architecture and code questions |
| Liveops lead | [Name / team] | [Slack / email] | Operational decisions and escalations |
| On-call | [Rotation name] | [PagerDuty / tool] | Production incidents |

---

## Assumptions & Open Items

| ID | Description | Owner | Status |
|----|-------------|-------|--------|
| A-01 | [Assumption made due to missing info] | [Who should confirm] | REQUIRES INPUT |

*Items marked `[REQUIRES INPUT FROM: <role>]` in this document must be resolved
before the first production deployment.*

---

## Change Log

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0.0 | YYYY-MM-DD | Initial draft | [agent] |
