# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.29.4"
publishedVersion: "6.29.4"
pendingPublishVersion: null
currentTrain: "post-6293-trust-and-adoption"
trainStatus: "published-6294-stop"
executionMode: "maintainer-reviewed"
namedTrain: "post-6293-trust-and-adoption-v6.29.4-to-v6.32"
branch: "main"
currentChunk: "stop-after-6294"
lastConfirmedCommit: "3a906f94"
lastValidationLevel: "Trusted Publish 6.29.4 + public-truth/demo sync + main CI green on sync commit"
nextAction: "STOP — do not invent 6.30.0 without EVIDENCE GATE APPROVED"
pendingManualGate: "#422 factual review; Dependabot majors split; 6.30+ external evidence"
githubIssues:
  "209": "keep open — cross-platform packed-consumer matrix PARTIAL"
canonicalRoadmap: "docs/implementation/ROADMAP.md"
activePlan: "docs/implementation/active/NEXT-RELEASES.md"
completedChunks:
  - "P0 green-main Evidence regen (ce4b4247)"
  - "train activation post-6293"
  - "6.29.4 MCP annotations + LICENSE matrix + demo sync + comparability/retry (f905050c)"
  - "PREPARE RELEASE + Trusted Publish 6.29.4 (ab4b8c3d / publish run 35192486423)"
  - "public-truth + Evidence demos synced to 6.29.4 (3a906f94)"
blockedTrains:
  - "6.30.0 comparable Evidence / interop (BLOCKED_ON_6_30_EXTERNAL_INPUTS)"
  - "6.31.0 failure-first review UX (BLOCKED_ON_6_31_REVIEW_FIXTURE)"
  - "6.32.0 external conformance (BLOCKED_ON_EXTERNAL_EVIDENCE)"
  - "v7.0.0 (assessment only — V7_DECISION: NO-GO)"
worktreeIgnoreOnly:
  - ".redstamp/"
  - "redstamp-proposal-issue-body.md"
stopMarker: |
  RELEASE_6_29_4_PUBLISHED
  STOP: do not invent 6.30.0 without EVIDENCE GATE APPROVED
  LAST_PUBLISHED_RELEASE: 6.29.4
  V7_DECISION: NO-GO
updatedAt: "2026-09-17"
```
