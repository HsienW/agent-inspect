# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: agentinspect-post-629-hardening-v6.29.1-to-v6.30
currentTrain: post-6293-code-complete-awaiting-release
trainStatus: blocked-external-for-minors
currentChunk: verified-maintenance-complete
nextAction: "PREPARE RELEASE for 6.29.1–6.29.3 (changeset → Version Packages → Trusted Publish); do not invent 6.30.0"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "GitHub branch protection on main + Dependabot triage; ignore-only for .redstamp/ Dockerfile glama.json redstamp-proposal-issue-body.md"
worktreeIgnoreOnly:
  - .redstamp/
  - Dockerfile
  - glama.json
  - redstamp-proposal-issue-body.md
```

## Published baseline

**6.29.0** on npm. Schema **1.0**. Root Node `>=20`.

## Implemented on branch (not yet published)

Code complete for **6.29.1–6.29.3** themes on `feat/post-629-hardening` (redaction security, OTLP honesty, recovery fail-closed, AI SDK terminalize, Evidence binding safety/HTML order, DX recipe). Publish only via Changesets → Version Packages → `publish.yml`.

## Freeze language

Core boundary frozen; evidence-backed security, correctness, compatibility, and public-truth patches remain active.

## External stop (minors)

```text
BLOCKED_ON_EXTERNAL_EVIDENCE
LAST_IMPLEMENTED_RELEASE: 6.29.3 (code; unpublished until Trusted Publish)
LAST_PUBLISHED_RELEASE: 6.29.0
V7_DECISION: NO-GO
```

Do not invent `6.30.0` without `EVIDENCE GATE APPROVED` and retained sanitized fixtures.
