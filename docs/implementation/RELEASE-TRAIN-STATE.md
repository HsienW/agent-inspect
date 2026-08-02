# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md](./AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md)

```yaml
baselineVersion: "6.9.0"
publishedVersion: "6.9.0"
currentTrain: "v6.10.0-evidence-v2"
trainStatus: "in-progress"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-stability-and-focus-v6.7.3-to-v7-decision"
branch: "main"
currentChunk: "6.10-12"
lastConfirmedCommit: "1cd9905"
lastValidationLevel: "release readiness + changeset pending push"
nextAction: "Land 6.10-12; await Version Packages PR → merge → verify npm 6.10.0 → point train at v6.11"
pendingManualGate: null
canonicalRoadmap: "docs/implementation/AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md"
completedChunks:
  - "v6.4.1 through v6.9.0 npm publication"
  - "6.9 safety precision train (published)"
  - "6.10-0 through 6.10-11"
remainingTrains:
  - "v6.10.0 Portable Evidence v2 (active; 6.10-12 release readiness)"
  - "v6.11.0 Local coding-agent debug loop"
  - "v6.12.0 Consolidation and stable launch candidate"
  - "v6.12 adoption checkpoint (eight weeks)"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-02"
```

## Quick links

- **Active plan:** [release-trains/V6.10.0-EXECUTION-PLAN.md](./release-trains/V6.10.0-EXECUTION-PLAN.md)
- **Release readiness:** [release-trains/V6.10.0-RELEASE-READINESS.md](./release-trains/V6.10.0-RELEASE-READINESS.md)
- **Evidence contract:** [../EVIDENCE-FORMAT.md](../EVIDENCE-FORMAT.md)
- **Safety contract:** [../SAFETY-POLICY.md](../SAFETY-POLICY.md)
- **Maintainer rules:** [AGENTS.md](../../AGENTS.md)
