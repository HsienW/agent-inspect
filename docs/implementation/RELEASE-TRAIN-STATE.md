# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.24.0"
publishedVersion: "6.24.0"
pendingPublishVersion: "6.22.0"
currentTrain: "v6.23.0-structured-control-contracts"
trainStatus: "in-progress"
executionMode: "maintainer-reviewed"
namedTrain: "agentinspect-adoption-first-v6.19-to-v6.25"
branch: "feat/623-structured-control-contracts"
currentChunk: "structured-control-contracts-implementation"
lastConfirmedCommit: "origin/main"
lastValidationLevel: "npm-6.21.0-published; 6.22 Version Packages merged; Trusted Publish in flight"
nextAction: "Finish 6.23 PR after 6.22.0 is on npm; then Version Packages + Trusted Publish 6.23.0"
pendingManualGate: "green Trusted Publish for 6.22.0 + green CI on 6.23 PR"
githubIssues:
  "209": "keep open — cross-platform packed-consumer matrix"
  "295": "6.24 — VS Code publish-or-close"
  "297": "deferred CONFLICTING — post-6.18 preflight"
  "306": "draft hold — superseded after #297"
  "308": "closed — landed in 6.20.0"
  "309": "closed — landed in 6.20.0"
  "315": "closed — landed in 6.20.0 via #375"
  "320": "closed — landed in 6.21.0"
  "321": "closed — landed in 6.21.0"
  "331": "closed — guardrail refusal recipe in 6.22"
  "380": "closed — 6.22 cross-runtime fidelity merged"
  "381": "closed — 6.22.0 Version Packages merged; publish in flight"
canonicalRoadmap: "docs/implementation/ROADMAP.md"
activePlan: "docs/implementation/active/NEXT-RELEASES.md"
completedChunks:
  - "6.19.1 trust restoration published"
  - "6.20.0 flexible contracts published"
  - "6.21.0 actor scope + provenance published"
  - "6.22.0 feature + Version Packages merged (#380/#381)"
remainingTrains:
  - "v6.23.0 structured control contracts"
  - "v6.24.0 production adoption (BLOCKED_ON_EXTERNAL_EVIDENCE for retained-use claim)"
  - "v6.25.0 stability baseline"
blockedTrains:
  - "v7.0.0 (conditional — assessment only; not scheduled)"
updatedAt: "2026-09-12"
```
