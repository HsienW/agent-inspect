# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.16.2"
publishedVersion: "6.16.2"
currentTrain: "v6.17.0-evidence-ux"
trainStatus: "releasing"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-repository-health-evidence-ux-v6.16-to-pre-v7"
branch: "main"
currentChunk: "6.17.0-release"
lastConfirmedCommit: "89836cf"
lastValidationLevel: "focused"
nextAction: "Push 6.17.0; Version Packages → Trusted Publishing; verify 18×6.17.0"
pendingManualGate: null
canonicalRoadmap: "docs/implementation/ROADMAP.md"
activePlan: "docs/implementation/active/EXECUTION-PLAN.md"
completedChunks:
  - "6.16.1 repository health"
  - "6.16.2 single-source docs (published)"
remainingTrains:
  - "v6.17.0 evidence UX (in release)"
  - "v6.17.1 public proof"
  - "v6.18.0 niche launch"
  - "v6.18.x maintenance"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-12"
```
