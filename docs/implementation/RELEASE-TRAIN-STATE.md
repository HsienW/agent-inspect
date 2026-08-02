# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md](./AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md)

```yaml
baselineVersion: "6.10.0"
publishedVersion: "6.10.0"
currentTrain: "v6.11.0-coding-agent-loop"
trainStatus: "in-progress"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-stability-and-focus-v6.7.3-to-v7-decision"
branch: "main"
currentChunk: "6.11-11"
lastConfirmedCommit: "b59a514"
lastValidationLevel: "packed mcp-server smoke (tools + bin --help)"
nextAction: "Await Version Packages → publish 6.11.0; then hand off to v6.12.0"
pendingManualGate: null
canonicalRoadmap: "docs/implementation/AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md"
completedChunks:
  - "v6.4.1 through v6.10.0 npm publication"
  - "6.10 Portable Evidence v2 (published)"
  - "6.11-0…6.11-10 coding-agent loop delivery"
remainingTrains:
  - "v6.11.0 Local coding-agent debug loop (awaiting Version Packages / npm)"
  - "v6.12.0 Consolidation and stable launch candidate"
  - "v6.12 adoption checkpoint (eight weeks)"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-02"
```

## Quick links

- **Active plan:** [release-trains/V6.11.0-EXECUTION-PLAN.md](./release-trains/V6.11.0-EXECUTION-PLAN.md)
- **Readiness:** [release-trains/V6.11.0-RELEASE-READINESS.md](./release-trains/V6.11.0-RELEASE-READINESS.md)
- **Completed readiness:** [release-trains/V6.10.0-RELEASE-READINESS.md](./release-trains/V6.10.0-RELEASE-READINESS.md)
- **Evidence contract:** [../EVIDENCE-FORMAT.md](../EVIDENCE-FORMAT.md)
- **Safety contract:** [../SAFETY-POLICY.md](../SAFETY-POLICY.md)
- **Maintainer rules:** [AGENTS.md](../../AGENTS.md)
