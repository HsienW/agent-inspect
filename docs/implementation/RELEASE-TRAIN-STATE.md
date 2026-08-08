# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md](./AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md)

```yaml
baselineVersion: "6.14.1"
publishedVersion: "6.14.1"
currentTrain: "v6.14.2-swarm-stability"
trainStatus: "active"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-swarm-stability-evidence-v6.14.1-to-pre-v7"
branch: "main"
currentChunk: "6.14.2-2"
lastConfirmedCommit: "4a52d0f"
lastValidationLevel: "focused"
nextAction: "6.14.2-2 Capture-level self-parent invariant"
pendingManualGate: null
canonicalRoadmap: "docs/implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md"
activePlan: "docs/implementation/release-trains/V6.14.2-EXECUTION-PLAN.md"
completedChunks:
  - "phase-0-activate-swarm-stability-roadmap"
  - "6.14.2-0"
  - "6.14.2-1"
remainingTrains:
  - "v6.14.2 (active)"
  - "v6.14.3 (repair-or-skip)"
  - "v6.15.0 fidelity + readers"
  - "v6.15.1 (repair-or-skip)"
  - "v6.16.0 evidence CI (external gate)"
  - "v6.16.x adoption"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-07"
```
