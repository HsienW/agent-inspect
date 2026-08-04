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
currentChunk: "6.14.0-engineering-complete-stop-before-changeset"
lastConfirmedCommit: "b95156a"
lastValidationLevel: "implementation"
nextAction: "Hold publication; 6.14.x assessment-only until external evidence clears"
pendingManualGate: "blocked-on-v6.14-external-evidence"
canonicalRoadmap: "docs/implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.12.1-TO-V7.md"
completedChunks:
  - "6.12.2 / 6.13.0 published"
  - "6.14.0 engineering (Evidence semantics, MCP TraceFacts, no-egress docs, langgraph recipe, init --framework langgraph)"
  - "6.13.1 skipped"
remainingTrains:
  - "v6.14.0 publication (blocked on external evidence)"
  - "v6.14.x stability and adoption"
blockedTrains:
  - "v6.14.0 npm bump"
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-04"
```
