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
currentChunk: "6.11-2"
lastConfirmedCommit: "7040b52"
lastValidationLevel: "protocol hardening pending push"
nextAction: "Land 6.11-2; continue 6.11-3 Curated flagship tools"
pendingManualGate: null
canonicalRoadmap: "docs/implementation/AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md"
completedChunks:
  - "v6.4.1 through v6.10.0 npm publication"
  - "6.10 Portable Evidence v2 (published)"
  - "6.11-0 RFC"
  - "6.11-1 MCP package executable"
remainingTrains:
  - "v6.11.0 Local coding-agent debug loop (active; 6.11-2 in flight)"
  - "v6.12.0 Consolidation and stable launch candidate"
  - "v6.12 adoption checkpoint (eight weeks)"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-02"
```

## Quick links

- **Active plan:** [release-trains/V6.11.0-EXECUTION-PLAN.md](./release-trains/V6.11.0-EXECUTION-PLAN.md)
- **Loop contract:** [../CODING-AGENT-LOOP.md](../CODING-AGENT-LOOP.md)
- **6.11-2 review:** [reviews/V6.11.0-2-PROTOCOL-HARDENING.md](./reviews/V6.11.0-2-PROTOCOL-HARDENING.md)
- **Evidence contract:** [../EVIDENCE-FORMAT.md](../EVIDENCE-FORMAT.md)
- **Safety contract:** [../SAFETY-POLICY.md](../SAFETY-POLICY.md)
- **Maintainer rules:** [AGENTS.md](../../AGENTS.md)
