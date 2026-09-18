# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: post-6294-correctness-v6.29.5-to-v6.32
currentTrain: implement-6300
trainStatus: in-progress
currentChunk: "6.30.0-B-cli-contract-rich done; next 6.30.0-C"
nextAction: "Implement 6.30.0-C (Evidence binding + docs); then PREPARE RELEASE 6.30.0"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "6.32.0 partner evidence; PR #422 factual review"
worktreeIgnoreOnly:
  - .redstamp/
  - redstamp-proposal-issue-body.md
```

## Published baseline

**6.29.6** on npm (Trusted Publish #427 → publish.yml). Schema **1.0**.

## Chunk log

| ID | State | Notes |
| --- | --- | --- |
| 6.29.6 | published | N-8 sharing; CI/outcome; Jest honesty; recipes 08–09; N-9 unverified |
| 6.30.0-A | done | Strict `contract` in `check --config` + basic evaluate |
| 6.30.0-B | done | Deferred keys: scope, alternatives, arguments, orderRules, controls, retry |

## Stop marker

```text
LAST_PUBLISHED_RELEASE: 6.29.6
ACTIVE: 6.30.0 rich CLI TraceContracts
V7_DECISION: NO-GO
EVIDENCE_GATE: not approved
```
