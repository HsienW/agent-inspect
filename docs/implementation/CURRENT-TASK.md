# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: agentinspect-feedback-integrity-v6.17.5-to-v6.22
currentTrain: v6.21.0-multi-agent-evidence-precision
trainStatus: in-progress
currentChunk: actor-scope-and-outcome-provenance
nextAction: "Land feat/621-actor-provenance when CI green; then Version Packages + Trusted Publish for 6.21.0"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "green CI on 6.21 PR; merge to main; do not create Version Packages manually"
```

## Published baseline

**6.20.0** published on npm. Persisted schema **1.0**.

## Active focus — 6.21.0 Multi-agent evidence precision

| Chunk | Status |
| --- | --- |
| #320 actor `scope` selectors | implemented on `feat/621-actor-provenance` |
| #321 `observations.requireProvenance` | implemented |
| planner/verifier recipe | implemented |
| Merge to main + Trusted Publish | pending |

## Later

- **6.22.0** — #331 design confirmed; conditional; existing APIs only; not implemented (roadmap-future)
