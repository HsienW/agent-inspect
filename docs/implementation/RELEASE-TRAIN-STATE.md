# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.20.0"
publishedVersion: "6.20.0"
pendingPublishVersion: "6.20.0"
currentTrain: "v6.20.0-flexible-deterministic-contracts"
trainStatus: "in-progress"
executionMode: "maintainer-reviewed"
namedTrain: "agentinspect-feedback-integrity-v6.17.5-to-v6.22"
branch: "feat/620-flexible-contracts"
currentChunk: "flexible-contracts-implementation"
lastConfirmedCommit: "origin/main"
lastValidationLevel: "npm-6.19.1-published-rebase-onto-main"
nextAction: "Land feat/620-flexible-contracts (#375) when CI green; wait for Version Packages then Trusted Publish for 6.20.0"
pendingManualGate: "green CI on feat/620-flexible-contracts; merge #375; do not create Version Packages manually"
githubIssues:
  "209": "keep open — cross-platform packed-consumer matrix"
  "295": "6.18-H deferred — VS Code Option A recorded"
  "297": "deferred CONFLICTING — post-6.18 preflight"
  "306": "draft hold — superseded after #297"
  "308": "6.20 requiredOrderMode — implemented on feat/620-flexible-contracts via #315 commits"
  "309": "6.20 alternatives.anyOf — implemented on feat/620-flexible-contracts"
  "315": "6.20 PR — cherry-picked with HsienW authorship onto feat/620-flexible-contracts"
  "320": "6.21 actor-scoped contracts — roadmap-next; stay open"
  "321": "6.21 outcome provenance — roadmap-next; stay open"
  "331": "6.22 — design confirmed; existing APIs only; not implemented; roadmap-future"
  "354": "6.19 PR — merged"
  "355": "closed — 6.19.0 published on npm"
  "374": "closed — 6.19.1 Version Packages merged and published"
  "375": "6.20 flexible contracts PR — rebase onto main after #374"
canonicalRoadmap: "docs/implementation/ROADMAP.md"
activePlan: "docs/implementation/active/NEXT-RELEASES.md"
completedChunks:
  - "6.17.8 published (Version Packages #343)"
  - "6.18.0 A–H code + Version Packages #350 + Trusted Publish"
  - "6.19.0 A–D (#354) + Version Packages #357 + Trusted Publish"
  - "Phase 4 roadmap/label hygiene (#358)"
  - "6.19.1 trust restoration code (#366) on main"
  - "6.19.1 published (Version Packages #374)"
remainingTrains:
  - "v6.20.0 flexible deterministic contracts"
  - "v6.21.0 multi-agent evidence precision"
  - "v6.22.0 conditional design-partner recipes"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-09-11"
```
