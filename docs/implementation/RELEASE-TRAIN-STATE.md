# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md](./AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md)

```yaml
baselineVersion: "6.14.2"
publishedVersion: "6.14.2"
currentTrain: "v6.15.0-fidelity-and-readers"
trainStatus: "publishing"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-swarm-stability-evidence-v6.14.1-to-pre-v7"
branch: "main"
currentChunk: "6.15-12"
lastConfirmedCommit: "cf3acfd"
lastValidationLevel: "release"
nextAction: "Version Packages → Trusted Publishing → verify npm 6.15.0"
pendingManualGate: null
canonicalRoadmap: "docs/implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md"
activePlan: "docs/implementation/release-trains/V6.15.0-EXECUTION-PLAN.md"
completedChunks:
  - "6.15-0 … 6.15-11 docs/readiness"
  - "6.15-12 changeset (in flight)"
remainingTrains:
  - "v6.15.0 publish (in flight)"
  - "v6.15.1 repair-or-skip"
  - "v6.16.0 evidence CI"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-08"
```
