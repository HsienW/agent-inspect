# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.31.1"
publishedVersion: "6.31.1"
pendingPublishVersion: "6.31.1"
currentTrain: "website-correctness-post-6310"
trainStatus: "releasing-6311"
executionMode: "maintainer-reviewed"
namedTrain: "website-correctness-post-6310"
branch: "main"
currentChunk: "P01–P03 + Changeset for 6.31.1"
lastConfirmedCommit: "464cdd27"
lastValidationLevel: "focused contract + langchain + prepublish-skip tests"
nextAction: "Push Changeset; merge Version Packages PR; confirm Trusted Publish"
pendingManualGate: "6.32.0 partner evidence; #422 factual review"
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
  - "P04 website repair (A–F) on main"
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
  ACTIVE: 6.31.1 Trusted Publish in progress
  NEXT_PATCH: 6.31.2
  RESERVED: 6.32.0 BLOCKED_ON_EXTERNAL_EVIDENCE
  V7_DECISION: NO-GO
  EVIDENCE_GATE: not approved
updatedAt: "2026-09-19"
```
