# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.17.4"
publishedVersion: "6.17.4"
currentTrain: "v6.17.5-feedback-integrity"
trainStatus: "in-progress"
executionMode: "maintainer-reviewed"
namedTrain: "agentinspect-feedback-integrity-v6.17.5-to-v6.21"
branch: "main"
currentChunk: "6.17.5-7-validation"
lastConfirmedCommit: "5311084"
lastValidationLevel: "docs"
nextAction: "Maintainer review; then separate 6.17.5 release-readiness / publication prompt"
pendingManualGate: ""
canonicalRoadmap: "docs/implementation/ROADMAP.md"
activePlan: "docs/implementation/active/EXECUTION-PLAN.md"
completedChunks:
  - "6.16.1 repository health"
  - "6.16.2 single-source docs"
  - "6.17.0 evidence UX"
  - "6.17.1 public proof (published)"
  - "6.17.3 / 6.17.4 package line published"
remainingTrains:
  - "v6.17.5 feedback integrity (active)"
  - "v6.17.6 reserved corrective patch"
  - "v6.18.0 adapter capture parity"
  - "v6.19.0 external persisted-source readers"
  - "v6.20.0 alternative valid contract paths"
  - "v6.21.0 conditional enforcement evidence"
blockedTrains:
  - "v6.18.0 publication (deferred until 6.17.5 lands and is reviewed)"
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-31"
```
