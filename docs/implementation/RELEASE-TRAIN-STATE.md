# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md](./AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md)

```yaml
baselineVersion: "6.12.0"
publishedVersion: "6.12.0"
currentTrain: "v6.12-adoption-checkpoint"
trainStatus: "in-progress"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-stability-and-focus-v6.7.3-to-v7-decision"
branch: "main"
currentChunk: "adoption-2"
lastConfirmedCommit: "aa461cc"
lastValidationLevel: "pnpm pack:smoke (darwin Node 22) + docs:check"
nextAction: "Start adoption-2 public-truth and docs hygiene pass"
pendingManualGate: null
canonicalRoadmap: "docs/implementation/AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md"
completedChunks:
  - "v6.4.1 through v6.12.0 npm publication"
  - "6.11 Local coding-agent debug loop (published)"
  - "6.12 Consolidation and stable launch candidate (published; external trials PARTIAL)"
  - "adoption-0 Arm checkpoint (calendar + ledger + v7 assessment)"
  - "adoption-1 Local compatibility evidence (macOS Node 22 pack:smoke PASS)"
remainingTrains:
  - "v6.12 adoption checkpoint (eight weeks; active)"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-02"
```

## Quick links

- **Active plan:** [release-trains/V6.12-ADOPTION-CHECKPOINT.md](./release-trains/V6.12-ADOPTION-CHECKPOINT.md)
- **Evidence ledger:** [PRE-V7-ADOPTION-EVIDENCE.md](./PRE-V7-ADOPTION-EVIDENCE.md)
- **v7 assessment:** [release-trains/V7.0.0-READINESS-ASSESSMENT.md](./release-trains/V7.0.0-READINESS-ASSESSMENT.md)
- **Completed readiness:** [release-trains/V6.12.0-RELEASE-READINESS.md](./release-trains/V6.12.0-RELEASE-READINESS.md)
- **Maintainer rules:** [AGENTS.md](../../AGENTS.md)
