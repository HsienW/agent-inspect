# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md](./AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md)

```yaml
baselineVersion: "6.7.5"
publishedVersion: "6.7.5"
currentTrain: "v6.8.0-langgraph-fidelity"
trainStatus: "starting"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-stability-and-focus-v6.7.3-to-v7-decision"
branch: "main"
currentChunk: "6.8-0-fidelity-rfc"
lastConfirmedCommit: "b4146fc"
lastValidationLevel: "npm 6.7.5 published"
nextAction: "Land 6.8-0 LANGGRAPH-FIDELITY.md; continue 6.8-1+"
pendingManualGate: "v6.8-12 requires two external LangGraph fidelity validations"
canonicalRoadmap: "docs/implementation/AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md"
completedChunks:
  - "v6.4.1 through v6.7.5 npm publication"
  - "6.7.5 consumer/native/DX train (doctor, sqlite, jest, aliases, recipe)"
remainingTrains:
  - "v6.8.0 LangGraph fidelity contract (starting)"
  - "v6.9.0 Safety precision and share policy"
  - "v6.10.0 Portable Evidence v2"
  - "v6.11.0 Local coding-agent debug loop"
  - "v6.12.0 Consolidation and stable launch candidate"
  - "v6.12 adoption checkpoint (eight weeks)"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-02"
```

## Quick links

- **Active plan:** [release-trains/V6.8.0-EXECUTION-PLAN.md](./release-trains/V6.8.0-EXECUTION-PLAN.md)
- **Prior readiness:** [release-trains/V6.7.5-RELEASE-READINESS.md](./release-trains/V6.7.5-RELEASE-READINESS.md)
- **Maintainer rules:** [AGENTS.md](../../AGENTS.md)
