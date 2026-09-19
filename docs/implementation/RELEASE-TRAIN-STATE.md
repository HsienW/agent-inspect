# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.31.0"
publishedVersion: "6.31.0"
pendingPublishVersion: null
currentTrain: "website-correctness-post-6310"
trainStatus: "awaiting-preview-review"
executionMode: "maintainer-reviewed"
namedTrain: "website-correctness-post-6310"
branch: "main"
currentChunk: "P04 website repair complete — stop for preview"
lastConfirmedCommit: "988b747d"
lastValidationLevel: "website typecheck/build/crawl + resolve tests; npm still 6.31.0"
nextAction: "Maintainer preview/deploy review; then 6.31.1 P01–P03. No npm for website-only."
pendingManualGate: "6.32.0 partner evidence; #422 factual review; Vercel preview deploy"
githubIssues:
  "209": "keep open — cross-platform packed-consumer matrix PARTIAL"
canonicalRoadmap: "docs/implementation/ROADMAP.md"
activePlan: "docs/implementation/active/NEXT-RELEASES.md"
completedChunks:
  - "6.29.5 trustworthy checks + Trusted Publish"
  - "6.29.6 safe sharing + integration + Trusted Publish (#427)"
  - "6.30.0 rich CLI TraceContracts + Trusted Publish (#428)"
  - "6.31.0 typed cross-kind step ordering + Trusted Publish (#429 + root recovery)"
  - "P00 baseline 6.31.0 + website-first train ledger"
  - "P04 website repair (A–F)"
blockedTrains:
  - "6.32.0 external conformance (BLOCKED_ON_EXTERNAL_EVIDENCE)"
  - "v7.0.0 (assessment only — V7_DECISION: NO-GO)"
amendments:
  - "Post-6.31.0: website-first repair before 6.31.1 correctness patches"
  - "Do not consume reserved 6.32.0 for website or routine patches"
worktreeIgnoreOnly:
  - ".redstamp/"
  - "redstamp-proposal-issue-body.md"
stopMarker: |
  LAST_PUBLISHED_RELEASE: 6.31.0
  ACTIVE: website P04 awaiting preview review
  NEXT_PATCH: 6.31.1
  RESERVED: 6.32.0 BLOCKED_ON_EXTERNAL_EVIDENCE
  V7_DECISION: NO-GO
  EVIDENCE_GATE: not approved
updatedAt: "2026-09-19"
```
