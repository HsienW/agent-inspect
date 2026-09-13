# Release train state

> Operational pointer only. Git state, package manifests, tests, npm, tags, GitHub releases, and CI are authoritative.
>
> **Canonical roadmap:** [ROADMAP.md](./ROADMAP.md)

```yaml
baselineVersion: "6.29.0"
publishedVersion: "6.29.0"
pendingPublishVersion: "6.29.1"
currentTrain: "immediate-gate"
trainStatus: "in-progress"
executionMode: "maintainer-reviewed"
namedTrain: "agentinspect-post-629-hardening-v6.29.1-to-v6.30"
branch: "main"
currentChunk: "immediate-gate"
lastConfirmedCommit: "d16fbb24e00bf0dc9600fe614958e3d4dc8c8829"
lastValidationLevel: "npm-6.29.0-published; post-6.29 plan approved"
nextAction: "Ship 6.29.1 (redaction security + OTLP truth) → 6.29.2 → 6.29.3; keep 6.30 external-gated"
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
remainingTrains:
  - "v6.29.1 redaction security + OTLP truth"
  - "v6.29.2 recovery fail-closed"
  - "v6.29.3 AI SDK / Evidence / DX"
  - "verified maintenance (no auto npm)"
blockedTrains:
  - "6.30.0 external conformance (BLOCKED_ON_EXTERNAL_EVIDENCE)"
  - "6.31.0 conformance review (BLOCKED_ON_EXTERNAL_EVIDENCE)"
  - "retained-use adoption claim (BLOCKED_ON_EXTERNAL_EVIDENCE)"
  - "v7.0.0 (assessment only — V7_DECISION: NO-GO)"
stopMarker: |
  BLOCKED_ON_EXTERNAL_EVIDENCE (for 6.30+)
  LAST_PUBLISHED_RELEASE: 6.29.0
  V7_DECISION: NO-GO
  6.29.x_PATCHES: active
updatedAt: "2026-09-13"
```
