# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.31.3"
publishedVersion: "6.31.3"
pendingPublishVersion: null
currentTrain: "website-correctness-post-6310"
trainStatus: "complete-through-6313"
executionMode: "maintainer-reviewed"
namedTrain: "website-correctness-post-6310"
branch: "main"
currentChunk: "stopped — 6.32.0 still evidence-blocked"
lastConfirmedCommit: "02ce1695"
lastValidationLevel: "npm agent-inspect@6.31.3 Trusted Publish success"
nextAction: "Await partner evidence for 6.32.0; no routine patches consume 6.32"
pendingManualGate: "6.32.0 partner evidence; #422 factual review"
githubIssues:
  "209": "keep open — cross-platform packed-consumer matrix PARTIAL"
canonicalRoadmap: "docs/implementation/ROADMAP.md"
activePlan: "docs/implementation/active/NEXT-RELEASES.md"
completedChunks:
  - "6.31.0 typed cross-kind step ordering + Trusted Publish"
  - "P04 website repair (A–F)"
  - "6.31.1 status validation + prepublish skip + LangChain parentage"
  - "6.31.2 README / AI SDK / Jest observation-flag docs"
  - "6.31.3 OTLP BigInt unixNano timestamps"
blockedTrains:
  - "6.32.0 external conformance (BLOCKED_ON_EXTERNAL_EVIDENCE)"
  - "v7.0.0 (assessment only — V7_DECISION: NO-GO)"
amendments:
  - "Post-6.31.0 website-first train executed through 6.31.3"
  - "Do not invent or consume reserved 6.32.0"
worktreeIgnoreOnly:
  - ".redstamp/"
  - "redstamp-proposal-issue-body.md"
stopMarker: |
  LAST_PUBLISHED_RELEASE: 6.31.3
  ACTIVE: stopped
  RESERVED: 6.32.0 BLOCKED_ON_EXTERNAL_EVIDENCE
  V7_DECISION: NO-GO
  EVIDENCE_GATE: not approved
updatedAt: "2026-09-19"
```
