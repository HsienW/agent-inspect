# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md](./AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md)

```yaml
baselineVersion: "6.14.2"
publishedVersion: "6.14.2"
currentTrain: "v6.15.0-fidelity-and-readers"
trainStatus: "active"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-swarm-stability-evidence-v6.14.1-to-pre-v7"
branch: "main"
currentChunk: "6.15-0"
lastConfirmedCommit: "36b5741"
lastValidationLevel: "release"
nextAction: "6.15-0 LangGraph fidelity classes A–E; block publish without external pilots"
pendingManualGate: null
canonicalRoadmap: "docs/implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md"
activePlan: "docs/implementation/release-trains/V6.15.0-EXECUTION-PLAN.md"
completedChunks:
  - "phase-0-activate-swarm-stability-roadmap"
  - "6.14.2-0 through 6.14.2-10 (publish 6.14.2)"
  - "6.14.3-skip"
remainingTrains:
  - "v6.15.0 fidelity + readers (active)"
  - "v6.15.1 (repair-or-skip)"
  - "v6.16.0 evidence CI (external gate)"
  - "v6.16.x adoption"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-08"
```
