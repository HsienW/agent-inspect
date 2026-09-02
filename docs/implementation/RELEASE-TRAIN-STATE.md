# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.17.5"
publishedVersion: "6.17.5"
targetVersion: "6.17.6"
currentTrain: "v6.17.6-security-containment"
trainStatus: "in-progress"
executionMode: "maintainer-reviewed"
namedTrain: "agentinspect-feedback-integrity-v6.17.5-to-v6.22"
branch: "main"
currentChunk: "6.17.6-0-audit"
lastConfirmedCommit: "d77374f"
lastValidationLevel: "full"
nextAction: "Complete 6.17.6-0 audit commit; implement #211 API surface then deps and Studio ingest"
pendingManualGate: ""
githubIssues:
  "211": "6.17.6-1 API surface snapshot — open, maintainer"
  "225": "6.17.6-9 no-egress harness — open, maintainer"
  "308": "6.20.0 requiredOrderMode — stay open; PR #315 REQUEST CHANGES on naming"
  "309": "6.20.0 alternatives.anyOf — stay open"
  "310": "closed"
  "311": "6.18.0 preview parity — stay open"
canonicalRoadmap: "docs/implementation/ROADMAP.md"
activePlan: "docs/implementation/active/EXECUTION-PLAN.md"
completedChunks:
  - "6.17.5 published (Trusted Publishing #317)"
remainingTrains:
  - "v6.17.6 security containment (active)"
  - "v6.17.7 remote Studio / website / skill safety"
  - "v6.17.8 workflows / scanners / SECURITY.md"
  - "v6.18.0 adapter capture parity"
  - "v6.19.0 external persisted-source readers"
  - "v6.20.0 alternative valid contract paths + ordering modes"
  - "v6.21.0 actor-scoped contracts + outcome provenance"
  - "v6.22.0 conditional design-partner recipes"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-09-02"
```
