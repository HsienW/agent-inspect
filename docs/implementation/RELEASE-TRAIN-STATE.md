# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.22.0"
publishedVersion: "6.22.0"
pendingPublishVersion: null
currentTrain: "v6.22.0-conditional-design-partner-recipes"
trainStatus: "ready"
executionMode: "maintainer-reviewed"
namedTrain: "agentinspect-feedback-integrity-v6.17.5-to-v6.22"
branch: "main"
currentChunk: "none"
lastConfirmedCommit: "origin/main"
lastValidationLevel: "npm-6.21.0-published-all-18"
nextAction: "Start conditional 6.22.0 when authorized — #331 only if external partner need is validated"
pendingManualGate: "maintainer authorization + external acceptance for 6.22.0"
githubIssues:
  "209": "keep open — cross-platform packed-consumer matrix"
  "295": "6.18-H deferred — VS Code Option A recorded"
  "297": "deferred CONFLICTING — post-6.18 preflight"
  "306": "draft hold — superseded after #297"
  "308": "closed — landed in 6.20.0"
  "309": "closed — landed in 6.20.0"
  "315": "closed — landed in 6.20.0 via #375"
  "320": "closed — landed in 6.21.0"
  "321": "closed — landed in 6.21.0"
  "331": "6.22 — design confirmed; existing APIs only; not implemented; roadmap-future"
  "377": "closed — 6.21 actor/provenance merged"
  "378": "closed — 6.21.0 Version Packages merged and published"
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
  - "6.21.0 actor scope + provenance (#377) + Version Packages #378 + Trusted Publish"
remainingTrains:
  - "v6.22.0 conditional design-partner recipes"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-09-12"
```
