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
currentChunk: "6.17.5-8-issue-reconciliation"
lastConfirmedCommit: "4a74893"
lastValidationLevel: "full"
nextAction: "Maintainer review of v6.17.5 train including issue-reconciliation addendum; then separate 6.17.5 release-readiness / publication prompt"
pendingManualGate: ""
githubIssues:
  "308": "6.17.5 docs/tests + 6.20.0 requiredOrderMode — stay open"
  "309": "6.20.0 alternatives.anyOf — stay open"
  "310": "6.17.5 visible warning — recommend close after acceptance"
  "311": "6.18.0 preview parity — stay open"
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
