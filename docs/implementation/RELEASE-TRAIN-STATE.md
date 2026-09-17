# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.29.3"
publishedVersion: "6.29.3"
pendingPublishVersion: "6.29.4"
currentTrain: "post-6293-trust-and-adoption"
trainStatus: "awaiting-prepare-release-6294"
executionMode: "maintainer-reviewed"
namedTrain: "post-6293-trust-and-adoption-v6.29.4-to-v6.32"
branch: "main"
currentChunk: "6.29.4-implementation-complete"
lastConfirmedCommit: "f905050c"
lastValidationLevel: "docs:check + mcp-server tests + recipes:check + package-licenses:check"
nextAction: "PREPARE RELEASE 6.29.4 — add Changeset, Version Packages, Trusted Publish"
pendingManualGate: "PREPARE RELEASE auth; #422 factual review; Dependabot majors split"
githubIssues:
  "209": "keep open — cross-platform packed-consumer matrix PARTIAL"
canonicalRoadmap: "docs/implementation/ROADMAP.md"
activePlan: "docs/implementation/active/NEXT-RELEASES.md"
completedChunks:
  - "P0 green-main Evidence regen (ce4b4247)"
  - "train activation post-6293"
  - "6.29.4 MCP annotations + LICENSE matrix + demo sync + comparability/retry"
blockedTrains:
  - "6.30.0 comparable Evidence / interop (BLOCKED_ON_6_30_EXTERNAL_INPUTS)"
  - "6.31.0 failure-first review UX (BLOCKED_ON_6_31_REVIEW_FIXTURE)"
  - "6.32.0 external conformance (BLOCKED_ON_EXTERNAL_EVIDENCE)"
  - "v7.0.0 (assessment only — V7_DECISION: NO-GO)"
worktreeIgnoreOnly:
  - ".redstamp/"
  - "redstamp-proposal-issue-body.md"
stopMarker: |
  RELEASE_6_29_4_IMPLEMENTATION_COMPLETE
  AWAITING: PREPARE RELEASE 6.29.4 OR CONTINUE DECISION
  LAST_PUBLISHED_RELEASE: 6.29.3
  V7_DECISION: NO-GO
updatedAt: "2026-09-17"
```
