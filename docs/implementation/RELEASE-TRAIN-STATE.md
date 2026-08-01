# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md](./AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md)

```yaml
baselineVersion: "6.7.3"
publishedVersion: "6.7.3"
currentTrain: "v6.7.4-real-integration-blockers"
trainStatus: "release-pending"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-stability-and-focus-v6.7.3-to-v7-decision"
branch: "main"
currentChunk: "6.7.4-9-release-readiness"
lastConfirmedCommit: "b8c3aed"
lastValidationLevel: "pack:smoke + fixtures + test green"
nextAction: "Merge Version Packages PR; verify npm 6.7.4; begin v6.7.5"
pendingManualGate: "none until an explicit external-validation gate"
canonicalRoadmap: "docs/implementation/AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md"
completedChunks:
  - "v6.4.1 through v6.7.3 npm publication"
  - "stability-and-focus-roadmap committed (ddafa51)"
  - "operational SoT activation (e97b844)"
  - "6.7.4-0 through 6.7.4-8 implementation"
  - "6.7.4-9 release readiness + changeset (pending publish)"
remainingTrains:
  - "v6.7.4 Real-integration blocker patch (release pending)"
  - "v6.7.5 Consumer / native / DX reliability"
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

- **Active plan:** [release-trains/V6.7.4-EXECUTION-PLAN.md](./release-trains/V6.7.4-EXECUTION-PLAN.md)
- **Readiness:** [release-trains/V6.7.4-RELEASE-READINESS.md](./release-trains/V6.7.4-RELEASE-READINESS.md)
- **Maintainer rules:** [AGENTS.md](../../AGENTS.md)
