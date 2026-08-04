# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-CANONICAL-ROADMAP-V6.12.1-TO-V7.md](./AGENTINSPECT-CANONICAL-ROADMAP-V6.12.1-TO-V7.md)

```yaml
baselineVersion: "6.13.0"
publishedVersion: "6.13.0"
currentTrain: "v6.14.0-evidence-first-lc"
trainStatus: "blocked-on-v6.14-external-evidence"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-canonical-stability-evidence-v6.12.1-to-v7-decision"
branch: "main"
currentChunk: "6.14.0-external-evidence-stop-gate"
lastConfirmedCommit: "41df06d"
lastValidationLevel: "published"
nextAction: "Do not Changeset 6.14.0 until external evidence gates are met; update assessment only; optional 6.14.x stability notes"
pendingManualGate: "blocked-on-v6.14-external-evidence"
canonicalRoadmap: "docs/implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.12.1-TO-V7.md"
completedChunks:
  - "6.12.2 logical lifecycle projection published"
  - "6.12.3 parity themes delivered in 6.13.0"
  - "6.13.0 TraceFacts + matchers published"
  - "6.13.1 skipped (no repair trigger)"
remainingTrains:
  - "v6.14.0 evidence-first LC (blocked on external evidence)"
  - "v6.14.x stability and adoption"
blockedTrains:
  - "v6.14.0 publication (external evidence)"
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-04"
```
