# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md](./AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md)

```yaml
baselineVersion: "6.12.0"
publishedVersion: "6.12.0"
currentTrain: "v6.12-adoption-checkpoint"
trainStatus: "ready-to-start"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-stability-and-focus-v6.7.3-to-v7-decision"
branch: "main"
currentChunk: "adoption-0"
lastConfirmedCommit: "e1b1b20"
lastValidationLevel: "npm view agent-inspect@6.12.0 (18 fixed packages)"
nextAction: "Begin v6.12 adoption checkpoint; collect PARTIAL→external trial evidence"
pendingManualGate: null
canonicalRoadmap: "docs/implementation/AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md"
completedChunks:
  - "v6.4.1 through v6.12.0 npm publication"
  - "6.11 Local coding-agent debug loop (published)"
  - "6.12 Consolidation and stable launch candidate (published; external trials PARTIAL)"
remainingTrains:
  - "v6.12 adoption checkpoint (eight weeks) (next)"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-03"
```

## Quick links

- **Next plan:** [release-trains/V6.12-ADOPTION-CHECKPOINT.md](./release-trains/V6.12-ADOPTION-CHECKPOINT.md)
- **Completed readiness:** [release-trains/V6.12.0-RELEASE-READINESS.md](./release-trains/V6.12.0-RELEASE-READINESS.md)
- **Evidence contract:** [../EVIDENCE-FORMAT.md](../EVIDENCE-FORMAT.md)
- **Safety contract:** [../SAFETY-POLICY.md](../SAFETY-POLICY.md)
- **Maintainer rules:** [AGENTS.md](../../AGENTS.md)
