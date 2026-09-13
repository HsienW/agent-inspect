# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: agentinspect-post-629-hardening-v6.29.1-to-v6.30
currentTrain: v6.29.1-redaction-otlp
trainStatus: in-progress
currentChunk: 6291b-complete-next-prepare-6291-or-6292
nextAction: "Prepare 6.29.1 release (changeset) after A+B land; then CONTINUE 6.29.2 recovery fail-closed"
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

## Freeze language

Core boundary frozen; evidence-backed security, correctness, compatibility, and public-truth patches remain active.

## External stop (still in force for minors)

```text
BLOCKED_ON_EXTERNAL_EVIDENCE
LAST_IMPLEMENTED_RELEASE: 6.29.0
V7_DECISION: NO-GO
```

`6.29.x` hardening patches are authorized; do not invent `6.30.0` without retained external fixtures.
