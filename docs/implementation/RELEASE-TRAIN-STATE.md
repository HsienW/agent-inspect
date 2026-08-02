# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md](./AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md)

```yaml
baselineVersion: "6.7.4"
publishedVersion: "6.7.4"
currentTrain: "v6.7.5-consumer-native-dx"
trainStatus: "in-progress"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-stability-and-focus-v6.7.3-to-v7-decision"
branch: "main"
currentChunk: "6.7.5-4-omit-absolute-traceDir"
lastConfirmedCommit: "0a52fb9"
lastValidationLevel: "lazy sqlite driver on main"
nextAction: "Land 6.7.5-4 omit absolute traceDir; continue 6.7.5-5+"
pendingManualGate: "none until an explicit external-validation gate"
canonicalRoadmap: "docs/implementation/AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md"
completedChunks:
  - "v6.4.1 through v6.7.4 npm publication"
  - "stability-and-focus-roadmap + operational SoT activation"
  - "6.7.4-0 through 6.7.4-9 + Version Packages + Trusted Publishing"
remainingTrains:
  - "v6.7.5 Consumer / native / DX reliability (in progress)"
  - "v6.8.0 LangGraph fidelity contract"
  - "v6.9.0 Safety precision and share policy"
  - "v6.10.0 Portable Evidence v2"
  - "v6.11.0 Local coding-agent debug loop"
  - "v6.12.0 Consolidation and stable launch candidate"
  - "v6.12 adoption checkpoint (eight weeks)"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-01"
```

## Quick links

- **Active plan:** [release-trains/V6.7.5-EXECUTION-PLAN.md](./release-trains/V6.7.5-EXECUTION-PLAN.md)
- **Prior readiness:** [release-trains/V6.7.4-RELEASE-READINESS.md](./release-trains/V6.7.4-RELEASE-READINESS.md)
- **Maintainer rules:** [AGENTS.md](../../AGENTS.md)
