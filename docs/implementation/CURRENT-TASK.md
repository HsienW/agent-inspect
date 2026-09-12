# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: agentinspect-adoption-first-v6.19-to-v6.25
currentTrain: v6.23.0-structured-control-contracts
trainStatus: in-progress
currentChunk: structured-control-contracts-implementation
nextAction: "Land feat/623-structured-control-contracts when CI green; Version Packages + Trusted Publish 6.23.0 after 6.22.0 is on npm; then 6.24"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "6.22.0 Trusted Publish completion + green CI on 6.23 PR"
```

## Published baseline

**6.21.0** published on npm (6.22.0 Trusted Publish in flight). Persisted schema **1.0**.

## Active focus — 6.23.0 Structured control contracts

| Chunk | Status |
| --- | --- |
| Tool-argument JSON Pointer checks | implemented |
| Mixed `orderRules` | implemented |
| Declared-versus-enforced `controls` | implemented |
| Retry / side-effect safety | implemented |
| ADR-0010 + TRACE-CONTRACTS docs + recipe | implemented |
| Merge + Trusted Publish | pending (after 6.22.0 on npm) |

## Later

- **6.24.0** adoption (external retained-use gate)
- **6.25.0** stability baseline
