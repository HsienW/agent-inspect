# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.29.5"
publishedVersion: "6.29.5"
pendingPublishVersion: "6.29.5"
currentTrain: "post-6294-correctness"
trainStatus: "prepare-release-6295"
executionMode: "maintainer-reviewed"
namedTrain: "post-6294-correctness-v6.29.5-to-v6.32"
branch: "main"
currentChunk: "R-6.29.5"
lastConfirmedCommit: "27d4307b"
lastValidationLevel: "build + typecheck + test (2224) + size + fixtures + pack:smoke + repo:health + git diff --check"
nextAction: "Commit + push 6.29.5 Changeset; merge Version Packages; verify Trusted Publish; continue 6.29.6"
pendingManualGate: "6.32.0 partner evidence; #422 factual review; Dependabot majors split"
githubIssues:
  "209": "keep open — cross-platform packed-consumer matrix PARTIAL"
canonicalRoadmap: "docs/implementation/ROADMAP.md"
activePlan: "docs/implementation/active/NEXT-RELEASES.md"
completedChunks:
  - "P0 green-main Evidence regen (ce4b4247)"
  - "6.29.4 MCP/LICENSE/demo/comparability (f905050c) + Trusted Publish"
  - "C0 stale operational docs hygiene"
  - "00 roadmap reconcile for post-6294 correctness train"
  - "6.29.5-01 confidence vocabulary"
  - "6.29.5-02 uncertain write completion"
  - "6.29.5-03 circuit logical/kind/run scope"
  - "6.29.5-04 extension execution accounting"
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
  LAST_PUBLISHED_RELEASE: 6.29.4
  ACTIVE: PREPARE RELEASE 6.29.5
  V7_DECISION: NO-GO
  EVIDENCE_GATE: not approved
updatedAt: "2026-09-18"
```
