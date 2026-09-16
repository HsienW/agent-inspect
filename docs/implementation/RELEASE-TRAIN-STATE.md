# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.29.1"
publishedVersion: "6.29.1"
pendingPublishVersion: "6.29.2"
currentTrain: "adoption-after-6291"
trainStatus: "implementation-complete-awaiting-publish"
executionMode: "autonomous-release-train"
namedTrain: "agentinspect-adoption-after-6291-v6.29.2-to-v6.32"
branch: "main"
currentChunk: "6292-6293-implementation-complete"
lastConfirmedCommit: "pending-commit"
lastValidationLevel: "typecheck + test (2204) + demo:verify + pack:smoke + packed-mcp-e2e + website build"
nextAction: "PREPARE RELEASE 6.29.2 after maintainer review; Trusted Publish only"
pendingManualGate: "main branch protection; remote merge PR #412; gh auth for issue linkage"
githubIssues:
  "209": "keep open — cross-platform packed-consumer matrix PARTIAL"
  "411": "suite init — fixed locally via #412 cherry-pick"
  "413": "MCP split runtime — implemented"
  "414": "nested metadata arguments — implemented"
  "415": "bounded error codes — implemented"
  "416": "OpenAI cached tokens — implemented in 6.29.3"
  "417": "browser observer — implemented in 6.29.3"
  "418": "Evidence fixtures — regenerated in 6.29.3"
  "419": "Glama pin/non-root — implemented in 6.29.3"
canonicalRoadmap: "docs/implementation/ROADMAP.md"
activePlan: "docs/implementation/active/NEXT-RELEASES.md"
completedChunks:
  - "adoption train activated"
  - "6.29.2 MCP external + packed ESM/CJS + suite init + nested args + error codes"
  - "6.29.3 OpenAI cache shape + browser observer + Evidence regen + Glama + docs"
blockedTrains:
  - "6.30.0 (BLOCKED_ON_6_30_EXTERNAL_INPUTS)"
  - "6.31.0 (BLOCKED_ON_6_31_REVIEW_FIXTURE)"
  - "6.32.0 (BLOCKED_ON_EXTERNAL_EVIDENCE)"
  - "v7.0.0 (V7_DECISION: NO-GO)"
stopMarker: |
  RELEASE_6.29.2_IMPLEMENTATION_COMPLETE
  RELEASE_6.29.3_IMPLEMENTATION_COMPLETE
  BLOCKED_ON_6_30_EXTERNAL_INPUTS
  LAST_PUBLISHED_RELEASE: 6.29.1
  V7_DECISION: NO-GO
updatedAt: "2026-09-15"
```
