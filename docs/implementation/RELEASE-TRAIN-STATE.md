# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.29.1"
publishedVersion: "6.29.1"
pendingPublishVersion: null
currentTrain: "post-629-hardening-published"
trainStatus: "blocked-external"
executionMode: "maintainer-reviewed"
namedTrain: "agentinspect-post-629-hardening-v6.29.1-to-v6.30"
branch: "main"
currentChunk: "published-6291-stop"
lastConfirmedCommit: "15d978f4"
lastValidationLevel: "Trusted Publish 6.29.1 (scoped packages + root via publish.yml re-run 34779223285)"
nextAction: "Keep 6.30+ blocked until EVIDENCE GATE APPROVED; maintenance-only otherwise"
pendingManualGate: "main branch protection; Dependabot majors close/split; Actions bumps independently; worktree ignore-only for known untracked paths"
githubIssues:
  "209": "keep open — cross-platform packed-consumer matrix PARTIAL"
  "295": "park — VS Code Marketplace unpublished (Option A)"
  "362": "closed — leave closed"
  "115": "park/close unless active ADPA partner"
canonicalRoadmap: "docs/implementation/ROADMAP.md"
activePlan: "docs/implementation/active/NEXT-RELEASES.md"
completedChunks:
  - "prior train through 6.29.0 published"
  - "post-6.29 plan approved; operational docs activated"
  - "6.29.1–6.29.3 themes shipped as agent-inspect@6.29.1 (Trusted Publish)"
  - "verified maintenance (audit + website privacy/security/CSP)"
remainingTrains: []
blockedTrains:
  - "6.30.0 external conformance (BLOCKED_ON_EXTERNAL_EVIDENCE)"
  - "6.31.0 conformance review (BLOCKED_ON_EXTERNAL_EVIDENCE)"
  - "retained-use adoption claim (BLOCKED_ON_EXTERNAL_EVIDENCE)"
  - "v7.0.0 (assessment only — V7_DECISION: NO-GO)"
verifiedMaintenance:
  auditedAt: "2026-09-13"
  pnpmAuditProd: "17 vulns (3 low / 10 moderate / 4 high); no critical; mostly transitive recipe/adapter peers (hono, @ai-sdk/provider-utils)"
  policy: "split dependency families; no grouped majors; no Node floor bump; no auto npm for site-only"
  websiteTrust: "added /privacy /security + CSP meta (static export)"
  npmRelease: "6.29.1 published via Trusted Publish"
stopMarker: |
  BLOCKED_ON_EXTERNAL_EVIDENCE (for 6.30+)
  LAST_PUBLISHED_RELEASE: 6.29.1
  V7_DECISION: NO-GO
updatedAt: "2026-09-13"
```
