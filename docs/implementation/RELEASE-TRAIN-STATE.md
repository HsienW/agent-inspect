# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.16.0"
publishedVersion: "6.16.0"
currentTrain: "v6.16.1-repository-health-public-truth"
trainStatus: "active"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-repository-health-evidence-ux-v6.16-to-pre-v7"
branch: "main"
currentChunk: "6.16.1-6-adrs"
lastConfirmedCommit: "6525c4a"
lastValidationLevel: "docs"
nextAction: "Extract ADRs and delete shipped proposals."
pendingManualGate: null
canonicalRoadmap: "docs/implementation/ROADMAP.md"
activePlan: "docs/implementation/active/EXECUTION-PLAN.md"
completedChunks:
  - "6.16.0 published"
  - "program activation (7a169d4)"
  - "6.16.1-0 inventory"
  - "6.16.1-1 public truth"
  - "6.16.1-2 changelog/support"
  - "6.16.1-3 stable structure"
  - "6.16.1-4 delete trains"
  - "6.16.1-5 delete archive"
remainingTrains:
  - "v6.16.1 repository health"
  - "v6.16.2 single-source docs"
  - "v6.17.0 evidence UX"
  - "v6.17.1 public proof"
  - "v6.18.0 niche launch"
  - "v6.18.x maintenance"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-12"
```
