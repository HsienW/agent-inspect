# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md](./AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md)

```yaml
baselineVersion: "6.12.0"
publishedVersion: "6.12.0"
currentTrain: "6.12.1-presentation"
trainStatus: "in-progress"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-stability-and-focus-v6.7.3-to-v7-decision"
branch: "main"
currentChunk: "6.12.1-0"
lastConfirmedCommit: "4318c20"
lastValidationLevel: "docs:check"
nextAction: "6.12.1 example-heavy presentation patch → publish → return to adoption-4 calendar wait"
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
remainingTrains:
  - "v6.12 adoption checkpoint (eight weeks; active; resume adoption-4 after 6.12.1)"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-03"
```

## Quick links

- **Active presentation plan:** [release-trains/V6.12.1-PRESENTATION-EXECUTION-PLAN.md](./release-trains/V6.12.1-PRESENTATION-EXECUTION-PLAN.md)
- **Adoption plan (resume after publish):** [release-trains/V6.12-ADOPTION-CHECKPOINT.md](./release-trains/V6.12-ADOPTION-CHECKPOINT.md)
- **Evidence ledger:** [PRE-V7-ADOPTION-EVIDENCE.md](./PRE-V7-ADOPTION-EVIDENCE.md)
- **Outreach checklist:** [ADOPTION-OUTREACH-CHECKLIST.md](./ADOPTION-OUTREACH-CHECKLIST.md)
- **v7 assessment:** [release-trains/V7.0.0-READINESS-ASSESSMENT.md](./release-trains/V7.0.0-READINESS-ASSESSMENT.md)
- **Completed readiness:** [release-trains/V6.12.0-RELEASE-READINESS.md](./release-trains/V6.12.0-RELEASE-READINESS.md)
- **Maintainer rules:** [AGENTS.md](../../AGENTS.md)
