# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.20.0"
publishedVersion: "6.20.0"
pendingPublishVersion: "6.21.0"
currentTrain: "v6.21.0-multi-agent-evidence-precision"
trainStatus: "in-progress"
executionMode: "maintainer-reviewed"
namedTrain: "agentinspect-feedback-integrity-v6.17.5-to-v6.22"
branch: "feat/621-actor-provenance"
currentChunk: "actor-scope-and-outcome-provenance"
lastConfirmedCommit: "origin/main"
lastValidationLevel: "focused-vitest-typecheck-recipes"
nextAction: "Land feat/621-actor-provenance when CI green; then Version Packages + Trusted Publish for 6.21.0"
pendingManualGate: "green CI on feat/621-actor-provenance; merge; do not create Version Packages manually"
githubIssues:
  "209": "keep open — cross-platform packed-consumer matrix"
  "295": "6.18-H deferred — VS Code Option A recorded"
  "297": "deferred CONFLICTING — post-6.18 preflight"
  "306": "draft hold — superseded after #297"
  "308": "closed — landed in 6.20.0"
  "309": "closed — landed in 6.20.0"
  "315": "closed — landed in 6.20.0 via #375"
  "320": "6.21 actor-scoped contracts — implementing on feat/621-actor-provenance"
  "321": "6.21 outcome provenance — implementing on feat/621-actor-provenance"
  "331": "6.22 — design confirmed; existing APIs only; not implemented; roadmap-future"
  "375": "closed — 6.20 flexible contracts merged"
  "376": "closed — 6.20.0 Version Packages merged and published"
canonicalRoadmap: "docs/implementation/ROADMAP.md"
activePlan: "docs/implementation/active/NEXT-RELEASES.md"
completedChunks:
  - "6.17.8 published (Version Packages #343)"
  - "6.18.0 A–H code + Version Packages #350 + Trusted Publish"
  - "6.19.0 A–D (#354) + Version Packages #357 + Trusted Publish"
  - "Phase 4 roadmap/label hygiene (#358)"
  - "6.19.1 trust restoration code (#366) on main"
  - "6.19.1 published (Version Packages #374)"
  - "6.20.0 flexible contracts (#375) + Version Packages #376 + Trusted Publish"
remainingTrains:
  - "v6.21.0 multi-agent evidence precision"
  - "v6.22.0 conditional design-partner recipes"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-09-12"
```
