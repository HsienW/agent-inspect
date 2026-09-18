# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: post-6294-correctness-v6.29.5-to-v6.32
currentTrain: stop-6320-blocked
trainStatus: blocked
currentChunk: "6.32.0 BLOCKED_ON_EXTERNAL_EVIDENCE"
nextAction: "Stop — need partner conformance evidence before 6.32.0; V7 NO-GO; do not invent EVIDENCE GATE APPROVED"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "6.32.0 partner evidence; PR #422 factual review"
worktreeIgnoreOnly:
  - .redstamp/
  - redstamp-proposal-issue-body.md
```

## Published baseline

**6.31.0** on npm (root + fixed group confirmed). Train stops here for the external evidence gate.

## Stop marker

```text
LAST_PUBLISHED_RELEASE: 6.31.0
ACTIVE: 6.32.0 BLOCKED_ON_EXTERNAL_EVIDENCE
NEXT: partner conformance inputs (then compact failure review)
V7_DECISION: NO-GO
EVIDENCE_GATE: not approved
```
