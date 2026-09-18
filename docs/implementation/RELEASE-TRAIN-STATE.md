# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.29.6"
publishedVersion: "6.29.6"
pendingPublishVersion: "6.29.6"
currentTrain: "post-6294-correctness"
trainStatus: "prepare-release-6296"
executionMode: "maintainer-reviewed"
namedTrain: "post-6294-correctness-v6.29.5-to-v6.32"
branch: "main"
currentChunk: "PREPARE RELEASE 6.29.6"
lastConfirmedCommit: "5db1f9dc"
lastValidationLevel: "vitest jest association; browser recipe matrix"
nextAction: "Changeset + release gates; Version Packages Trusted Publish 6.29.6; then 6.30.0 rich CLI contracts"
pendingManualGate: "6.32.0 partner evidence; #422 factual review"
githubIssues:
  "209": "keep open — cross-platform packed-consumer matrix PARTIAL"
canonicalRoadmap: "docs/implementation/ROADMAP.md"
activePlan: "docs/implementation/active/NEXT-RELEASES.md"
completedChunks:
  - "6.29.5 trustworthy checks + Trusted Publish (3e8750f1 / #426)"
  - "6.29.6-05 sharing"
  - "6.29.6-06 CI/outcome guidance"
  - "6.29.6-07 Jest association (synthetic); N-9 unverified"
  - "6.29.6-08 comparable-cohort pairwise commitments"
  - "6.29.6-09 browser observed-outcome matrix"
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
  ACTIVE: PREPARE RELEASE 6.29.6
  V7_DECISION: NO-GO
  EVIDENCE_GATE: not approved
updatedAt: "2026-09-18"
```
