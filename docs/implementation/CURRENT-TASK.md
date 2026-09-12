# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: agentinspect-adoption-first-v6.19-to-v6.25
currentTrain: v6.25.0-stability-baseline
trainStatus: in-progress
currentChunk: stability-baseline-freeze
nextAction: "Land feat/625 after 6.24.0 is on npm; Version Packages + Trusted Publish; program closeout; v7 assessment only"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "6.24.0 Trusted Publish + green CI on 6.25 PR"
```

## Published baseline

**6.23.0** published on npm (6.24.0 Version Packages in flight). Persisted schema **1.0**.

## Active focus — 6.25.0 Stability baseline

| Chunk | Status |
| --- | --- |
| Stability freeze doc | implemented |
| Packed-matrix honesty refresh | implemented |
| Property-style tool-argument checks | implemented |
| Support/perf baseline honesty | implemented |
| v7 | assessment only (not implementing) |

## Program stop

After 6.25.0 publishes: adoption-first train complete. Retained-use claims remain `BLOCKED_ON_EXTERNAL_EVIDENCE` until maintainer pilots land.
