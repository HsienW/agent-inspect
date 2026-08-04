# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-CANONICAL-ROADMAP-V6.12.1-TO-V7.md](./AGENTINSPECT-CANONICAL-ROADMAP-V6.12.1-TO-V7.md)

```yaml
baselineVersion: "6.12.1"
publishedVersion: "6.12.1"
currentTrain: "v6.12.2-real-pilot-semantic-blockers"
trainStatus: "active"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-canonical-stability-evidence-v6.12.1-to-v7-decision"
branch: "main"
currentChunk: "6.12.2-12-release-readiness"
lastConfirmedCommit: "09a75b7"
lastValidationLevel: "implementation"
nextAction: "Release readiness + patch Changeset + publish 6.12.2 via publish.yml"
pendingManualGate: null
canonicalRoadmap: "docs/implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.12.1-TO-V7.md"
completedChunks:
  - "v6.4.1 through v6.12.1 npm publication"
  - "canonical roadmap activation"
  - "6.12.2-0 semantic consumer assumptions audit"
  - "6.12.2-1..7 logical projection + built-in rules + tool identity + token safety"
  - "6.12.2-8..11 shared facts surfaces + fixture + packed E2E + docs"
remainingTrains:
  - "v6.12.2 publication (active)"
  - "v6.12.3 cross-surface semantic parity"
  - "v6.13.0 TraceFacts + TraceContract stabilization"
  - "v6.13.1 reserved corrective patch (conditional)"
  - "v6.14.0 evidence-first CI / no-egress LC"
  - "v6.14.x stability and adoption"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-04"
```

## Quick links

- **Active plan:** [release-trains/V6.12.2-EXECUTION-PLAN.md](./release-trains/V6.12.2-EXECUTION-PLAN.md)
- **Baseline audit:** [reviews/V6.12.1-CANONICAL-STABILITY-BASELINE-AUDIT.md](./reviews/V6.12.1-CANONICAL-STABILITY-BASELINE-AUDIT.md)
