# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.29.0"
publishedVersion: "6.29.0"
pendingPublishVersion: "6.29.3"
currentTrain: "post-629-hardening-code-complete"
trainStatus: "blocked-on-release-then-external"
executionMode: "maintainer-reviewed"
namedTrain: "agentinspect-post-629-hardening-v6.29.1-to-v6.30"
branch: "feat/post-629-hardening"
currentChunk: "verified-maintenance-complete"
lastConfirmedCommit: "47416c4c"
lastValidationLevel: "focused-tests-for-6291-6293; recipes:check OK"
nextAction: "Open/merge PR → PREPARE RELEASE changeset for 6.29.x → Trusted Publish; keep 6.30 external-gated"
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
  - "6.29.1-A regex-free redaction policy"
  - "6.29.1-B OTLP declared-vs-emitted"
  - "6.29.2 recovery fail-closed"
  - "6.29.3 AI SDK terminalize + Evidence safety/HTML + DX recipe"
  - "verified maintenance (audit refresh + website privacy/security/CSP; no npm)"
remainingTrains:
  - "PREPARE RELEASE / publish 6.29.x"
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
  npmRelease: "not triggered by site-only maintenance"
stopMarker: |
  BLOCKED_ON_EXTERNAL_EVIDENCE (for 6.30+)
  LAST_PUBLISHED_RELEASE: 6.29.0
  LAST_IMPLEMENTED_CODE: 6.29.3 themes on feat/post-629-hardening
  V7_DECISION: NO-GO
  6.29.x_PATCHES: code-complete; awaiting Trusted Publish
updatedAt: "2026-09-13"
```
