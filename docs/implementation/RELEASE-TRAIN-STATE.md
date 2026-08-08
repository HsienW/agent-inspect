# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md](./AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md)

```yaml
baselineVersion: "6.15.0"
publishedVersion: "6.15.0"
currentTrain: "v6.16.0-evidence-ci-pilot"
trainStatus: "publishing"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-swarm-stability-evidence-v6.14.1-to-pre-v7"
branch: "main"
currentChunk: "6.16-12"
lastConfirmedCommit: "3830be6"
lastValidationLevel: "release"
nextAction: "Version Packages → Trusted Publishing → verify npm 6.16.0 → 6.16.x stability"
pendingManualGate: null
canonicalRoadmap: "docs/implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md"
activePlan: "docs/implementation/release-trains/V6.16.0-EXECUTION-PLAN.md"
completedChunks:
  - "6.15.0 published"
  - "6.15.1 skip"
  - "6.16-0 … 6.16-12 readiness/changeset (in flight)"
remainingTrains:
  - "v6.16.0 publish (in flight)"
  - "v6.16.x eight-week stability"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-08"
```
