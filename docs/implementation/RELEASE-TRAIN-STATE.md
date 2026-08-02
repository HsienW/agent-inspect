# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md](./AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md)

```yaml
baselineVersion: "6.9.0"
publishedVersion: "6.9.0"
currentTrain: "v6.10.0-evidence-v2"
trainStatus: "ready-to-start"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-stability-and-focus-v6.7.3-to-v7-decision"
branch: "main"
currentChunk: "6.10-0"
lastConfirmedCommit: "bc3daf1"
lastValidationLevel: "npm view agent-inspect@6.9.0"
nextAction: "Begin v6.10.0 Portable Evidence v2"
pendingManualGate: null
canonicalRoadmap: "docs/implementation/AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md"
completedChunks:
  - "v6.4.1 through v6.9.0 npm publication"
  - "6.9 safety precision train (published)"
remainingTrains:
  - "v6.10.0 Portable Evidence v2 (next)"
  - "v6.11.0 Local coding-agent debug loop"
  - "v6.12.0 Consolidation and stable launch candidate"
  - "v6.12 adoption checkpoint (eight weeks)"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-02"
```

## Quick links

- **Next plan:** [release-trains/V6.10.0-EXECUTION-PLAN.md](./release-trains/V6.10.0-EXECUTION-PLAN.md)
- **Completed readiness:** [release-trains/V6.9.0-RELEASE-READINESS.md](./release-trains/V6.9.0-RELEASE-READINESS.md)
- **Safety contract:** [../SAFETY-POLICY.md](../SAFETY-POLICY.md)
- **Maintainer rules:** [AGENTS.md](../../AGENTS.md)
