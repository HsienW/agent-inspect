# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md](./AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md)

```yaml
baselineVersion: "6.11.0"
publishedVersion: "6.11.0"
currentTrain: "v6.12.0-consolidation"
trainStatus: "in-progress"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-stability-and-focus-v6.7.3-to-v7-decision"
branch: "main"
currentChunk: "6.12-2"
lastConfirmedCommit: "9e88f4a"
lastValidationLevel: "npm view agent-inspect@6.11.0 (18 fixed packages)"
nextAction: "Land 6.12-2; continue 6.12-3 packed matrix"
pendingManualGate: null
canonicalRoadmap: "docs/implementation/AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md"
completedChunks:
  - "v6.4.1 through v6.11.0 npm publication"
  - "6.11 Local coding-agent debug loop (published)"
remainingTrains:
  - "v6.12.0 Consolidation and stable launch candidate (next)"
  - "v6.12 adoption checkpoint (eight weeks)"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-02"
```

## Quick links

- **Next plan:** [release-trains/V6.12.0-EXECUTION-PLAN.md](./release-trains/V6.12.0-EXECUTION-PLAN.md)
- **Completed readiness:** [release-trains/V6.11.0-RELEASE-READINESS.md](./release-trains/V6.11.0-RELEASE-READINESS.md)
- **Evidence contract:** [../EVIDENCE-FORMAT.md](../EVIDENCE-FORMAT.md)
- **Safety contract:** [../SAFETY-POLICY.md](../SAFETY-POLICY.md)
- **Maintainer rules:** [AGENTS.md](../../AGENTS.md)
