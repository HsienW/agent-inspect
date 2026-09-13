# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: agentinspect-post-629-hardening-v6.29.1-to-v6.30
currentTrain: published-6291
trainStatus: blocked-external
currentChunk: stop
nextAction: "Do not invent 6.30.0 without EVIDENCE GATE APPROVED + retained fixtures"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "GitHub branch protection on main + Dependabot triage; ignore-only for .redstamp/ Dockerfile glama.json redstamp-proposal-issue-body.md"
worktreeIgnoreOnly:
  - .redstamp/
  - Dockerfile
  - glama.json
  - redstamp-proposal-issue-body.md
```

## Published baseline

**6.29.1** on npm (fixed group of 18 packages). Schema **1.0**. Root Node `>=20`.

Shipped themes (single publish): regex-free redaction, OTLP honesty, recovery fail-closed, AI SDK overlap terminalize, Evidence contract safety/HTML order, CLI/recipe DX, website privacy/security/CSP.

## Freeze language

Core boundary frozen; evidence-backed security, correctness, compatibility, and public-truth patches remain active.

## External stop

```text
BLOCKED_ON_EXTERNAL_EVIDENCE
LAST_PUBLISHED_RELEASE: 6.29.1
V7_DECISION: NO-GO
```
