# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md](./AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md)

```yaml
baselineVersion: "6.14.2"
publishedVersion: "6.14.2"
currentTrain: "v6.15.0-fidelity-and-readers"
trainStatus: "blocked-on-v6.15-external-pilot"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-swarm-stability-evidence-v6.14.1-to-pre-v7"
branch: "main"
currentChunk: "6.15-10"
lastConfirmedCommit: "8053ff6"
lastValidationLevel: "focused"
nextAction: "Await two external LangGraph pilot worksheets; no 6.15.0 Changeset/publish"
pendingManualGate: "blocked-on-v6.15-external-pilot"
canonicalRoadmap: "docs/implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md"
activePlan: "docs/implementation/release-trains/V6.15.0-EXECUTION-PLAN.md"
pilotGate: "docs/implementation/release-trains/V6.15.0-EXTERNAL-PILOT-GATE.md"
completedChunks:
  - "phase-0-activate-swarm-stability-roadmap"
  - "6.14.2 publish + 6.14.3 skip"
  - "6.15-0 … 6.15-9 technical scope"
  - "6.15-10 external pilot gate (blocked)"
remainingTrains:
  - "v6.15.0 fidelity + readers (blocked on external pilots)"
  - "v6.15.1 (repair-or-skip after 6.15.0)"
  - "v6.16.0 evidence CI (external gate)"
blockedTrains:
  - "v6.15.0 publish (external pilots)"
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-08-08"
```
