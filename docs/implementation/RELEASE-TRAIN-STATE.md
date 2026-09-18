# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.29.5"
publishedVersion: "6.29.5"
pendingPublishVersion: "6.29.6"
currentTrain: "post-6294-correctness"
trainStatus: "implement-6296"
executionMode: "maintainer-reviewed"
namedTrain: "post-6294-correctness-v6.29.5-to-v6.32"
branch: "main"
currentChunk: "6.29.6-05-sharing"
lastConfirmedCommit: "b5bf374a"
lastValidationLevel: "npm view fixed-group 6.29.5; vitest N-8 sharing regressions"
nextAction: "Finish 6.29.6 (05–07, 08–10 as ready); PREPARE RELEASE; then 6.30/6.31; stop 6.32 on external gate"
pendingManualGate: "6.32.0 partner evidence; #422 factual review"
githubIssues:
  "209": "keep open — cross-platform packed-consumer matrix PARTIAL"
canonicalRoadmap: "docs/implementation/ROADMAP.md"
activePlan: "docs/implementation/active/NEXT-RELEASES.md"
completedChunks:
  - "6.29.5 trustworthy checks + Trusted Publish (3e8750f1 / #426)"
  - "6.29.6-05 sharing (local)"
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
  LAST_PUBLISHED_RELEASE: 6.29.5
  ACTIVE: 6.29.6 implementation
  V7_DECISION: NO-GO
  EVIDENCE_GATE: not approved
updatedAt: "2026-09-18"
```
