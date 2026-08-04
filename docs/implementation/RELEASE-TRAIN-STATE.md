# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-CANONICAL-ROADMAP-V6.12.1-TO-V7.md](./AGENTINSPECT-CANONICAL-ROADMAP-V6.12.1-TO-V7.md)

```yaml
baselineVersion: "6.12.2"
publishedVersion: "6.12.2"
currentTrain: "v6.12.3-semantic-parity"
trainStatus: "active"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-canonical-stability-evidence-v6.12.1-to-v7-decision"
branch: "main"
currentChunk: "6.12.3-0-parity-matrix"
lastConfirmedCommit: "2287d8d"
lastValidationLevel: "published"
nextAction: "Cross-surface semantic parity over shared logical facts; then TraceFacts 6.13"
pendingManualGate: null
canonicalRoadmap: "docs/implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.12.1-TO-V7.md"
completedChunks:
  - "v6.4.1 through v6.12.2 npm publication"
  - "6.12.2 logical lifecycle projection (N-1/N-2/N-3)"
remainingTrains:
  - "v6.12.3 cross-surface semantic parity (active)"
  - "v6.13.0 TraceFacts + TraceContract stabilization"
  - "v6.13.1 reserved corrective patch (conditional)"
  - "v6.14.0 evidence-first CI / no-egress LC"
  - "v6.14.x stability and adoption"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-04"
```
