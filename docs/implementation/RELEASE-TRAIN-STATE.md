# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.16.1"
publishedVersion: "6.16.1"
currentTrain: "v6.16.2-canonical-docs"
trainStatus: "active"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-repository-health-evidence-ux-v6.16-to-pre-v7"
branch: "main"
currentChunk: "6.16.2-0"
lastConfirmedCommit: "7782c2d"
lastValidationLevel: "release"
nextAction: "Recover root agent-inspect@6.16.1 on npm; then 6.16.2 single-source docs"
pendingManualGate: null
canonicalRoadmap: "docs/implementation/ROADMAP.md"
activePlan: "docs/implementation/active/EXECUTION-PLAN.md"
completedChunks:
  - "6.16.1 repository health (scoped packages published; root recovery)"
remainingTrains:
  - "v6.16.2 single-source docs"
  - "v6.17.0 evidence UX"
  - "v6.17.1 public proof"
  - "v6.18.0 niche launch"
  - "v6.18.x maintenance"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-12"
```
