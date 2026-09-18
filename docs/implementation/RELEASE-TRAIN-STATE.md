# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.30.0"
publishedVersion: "6.30.0"
pendingPublishVersion: "6.30.0"
currentTrain: "post-6294-correctness"
trainStatus: "implement-6300"
executionMode: "maintainer-reviewed"
namedTrain: "post-6294-correctness-v6.29.5-to-v6.32"
branch: "main"
currentChunk: "6.30.0-B-cli-contract-rich done; next 6.30.0-C"
lastConfirmedCommit: "7b19683d"
lastValidationLevel: "pnpm exec vitest run packages/cli/test/check.test.ts (37 passed)"
nextAction: "6.30.0-C Evidence binding + docs; then PREPARE RELEASE"
pendingManualGate: "6.32.0 partner evidence; #422 factual review"
githubIssues:
  "209": "keep open — cross-platform packed-consumer matrix PARTIAL"
canonicalRoadmap: "docs/implementation/ROADMAP.md"
activePlan: "docs/implementation/active/NEXT-RELEASES.md"
completedChunks:
  - "6.29.5 trustworthy checks + Trusted Publish"
  - "6.29.6 safe sharing + integration + Trusted Publish (#427)"
  - "6.30.0-A cli contract basic"
  - "6.30.0-B cli contract rich fields"
blockedTrains:
  - "6.32.0 external conformance (BLOCKED_ON_EXTERNAL_EVIDENCE)"
  - "v7.0.0 (assessment only — V7_DECISION: NO-GO)"
amendments:
  - "6.30.0 now: rich CLI TraceContracts (was comparable-Evidence/interop)"
  - "6.31.0 now: typed cross-kind ordering (was failure-first review UX)"
worktreeIgnoreOnly:
  - ".redstamp/"
  - "redstamp-proposal-issue-body.md"
stopMarker: |
  LAST_PUBLISHED_RELEASE: 6.29.6
  ACTIVE: 6.30.0 rich CLI TraceContracts
  V7_DECISION: NO-GO
  EVIDENCE_GATE: not approved
updatedAt: "2026-09-18"
```
