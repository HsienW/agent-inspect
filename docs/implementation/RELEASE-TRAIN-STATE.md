# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md](./AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md)

```yaml
baselineVersion: "6.12.0"
publishedVersion: "6.12.1"
currentTrain: "v6.12-adoption-checkpoint"
trainStatus: "in-progress"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-stability-and-focus-v6.7.3-to-v7-decision"
branch: "main"
currentChunk: "adoption-4"
lastConfirmedCommit: "0d7e2bb"
lastValidationLevel: "full-release-gate"
nextAction: "adoption-4 mid-checkpoint review (week ~4; calendar start 2026-08-02 → mid ~2026-08-30) — pending calendar; do not mark complete early"
pendingManualGate: null
canonicalRoadmap: "docs/implementation/AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md"
completedChunks:
  - "v6.4.1 through v6.12.0 npm publication"
  - "6.11 Local coding-agent debug loop (published)"
  - "6.12 Consolidation and stable launch candidate (published; external trials PARTIAL)"
  - "adoption-0 Arm checkpoint (calendar + ledger + v7 assessment)"
  - "adoption-1 Local compatibility evidence (macOS Node 22 pack:smoke PASS)"
  - "adoption-2 Public-truth and docs hygiene pass"
  - "adoption-3 External outreach / pilot kit readiness (docs only; no fabricated partners)"
  - "6.12.1 example-heavy presentation patch published on npm"
remainingTrains:
  - "v6.12 adoption checkpoint (eight weeks; active)"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-03"
```

## Quick links

- **Active plan:** [release-trains/V6.12-ADOPTION-CHECKPOINT.md](./release-trains/V6.12-ADOPTION-CHECKPOINT.md)
- **Presentation readiness:** [release-trains/V6.12.1-RELEASE-READINESS.md](./release-trains/V6.12.1-RELEASE-READINESS.md)
- **Evidence ledger:** [PRE-V7-ADOPTION-EVIDENCE.md](./PRE-V7-ADOPTION-EVIDENCE.md)
- **Outreach checklist:** [ADOPTION-OUTREACH-CHECKLIST.md](./ADOPTION-OUTREACH-CHECKLIST.md)
- **v7 assessment:** [release-trains/V7.0.0-READINESS-ASSESSMENT.md](./release-trains/V7.0.0-READINESS-ASSESSMENT.md)
- **Maintainer rules:** [AGENTS.md](../../AGENTS.md)
