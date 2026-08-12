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
currentChunk: "6.16.1-1-public-truth"
lastConfirmedCommit: "pending-6.16.1-0"
lastValidationLevel: "docs"
nextAction: "Correct public version/status/product truth for the 6.16 baseline."
completedChunks:
  - "6.16.0 published"
  - "program activation (7a169d4)"
  - "6.16.1-0 inventory"
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
