# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md](./AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md)

```yaml
baselineVersion: "6.12.0"
publishedVersion: "6.12.0"
currentTrain: "6.12.1-presentation"
trainStatus: "in-progress"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-stability-and-focus-v6.7.3-to-v7-decision"
branch: "main"
currentChunk: "6.12.1-publish"
lastConfirmedCommit: "2a53751"
lastValidationLevel: "full-release-gate"
nextAction: "Push Version Packages 6.12.1; verify npm; return to adoption-4 calendar wait"
pendingManualGate: null
canonicalRoadmap: "docs/implementation/AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md"
completedChunks:
  - "v6.4.1 through v6.12.0 npm publication"
  - "6.11 Local coding-agent debug loop (published)"
  - "6.12 Consolidation and stable launch candidate (published; external trials PARTIAL)"
  - "adoption-0 through adoption-3"
  - "6.12.1-0 through 6.12.1-4 presentation refresh + release readiness"
remainingTrains:
  - "v6.12 adoption checkpoint (eight weeks; resume adoption-4 after 6.12.1)"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-03"
```

## Quick links

- **Active presentation plan:** [release-trains/V6.12.1-PRESENTATION-EXECUTION-PLAN.md](./release-trains/V6.12.1-PRESENTATION-EXECUTION-PLAN.md)
- **Readiness:** [release-trains/V6.12.1-RELEASE-READINESS.md](./release-trains/V6.12.1-RELEASE-READINESS.md)
- **Adoption plan (resume after publish):** [release-trains/V6.12-ADOPTION-CHECKPOINT.md](./release-trains/V6.12-ADOPTION-CHECKPOINT.md)
- **Maintainer rules:** [AGENTS.md](../../AGENTS.md)
