# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md](./AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md)

```yaml
baselineVersion: "6.8.0"
publishedVersion: "6.8.0"
currentTrain: "v6.9.0-safety-precision"
trainStatus: "release-ready"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-stability-and-focus-v6.7.3-to-v7-decision"
branch: "main"
currentChunk: "6.9-10-publication"
lastConfirmedCommit: "2245de3"
lastValidationLevel: "vitest mcp artifact parity"
nextAction: "Merge Version Packages for 6.9.0; verify npm; start v6.10.0"
pendingManualGate: null
canonicalRoadmap: "docs/implementation/AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md"
completedChunks:
  - "v6.4.1 through v6.8.0 npm publication"
  - "6.9-0 through 6.9-9 safety precision implementation"
  - "6.9-10 readiness changeset"
remainingTrains:
  - "v6.9.0 npm publication (in flight)"
  - "v6.10.0 Portable Evidence v2"
  - "v6.11.0 Local coding-agent debug loop"
  - "v6.12.0 Consolidation and stable launch candidate"
  - "v6.12 adoption checkpoint (eight weeks)"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-02"
```

## Quick links

- **Active plan:** [release-trains/V6.9.0-EXECUTION-PLAN.md](./release-trains/V6.9.0-EXECUTION-PLAN.md)
- **Readiness:** [release-trains/V6.9.0-RELEASE-READINESS.md](./release-trains/V6.9.0-RELEASE-READINESS.md)
- **Safety contract:** [../SAFETY-POLICY.md](../SAFETY-POLICY.md)
- **Maintainer rules:** [AGENTS.md](../../AGENTS.md)
