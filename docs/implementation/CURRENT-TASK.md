# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: agentinspect-adoption-first-v6.19-to-v6.25
currentTrain: v6.22.0-cross-runtime-causal-fidelity
trainStatus: in-progress
currentChunk: cross-runtime-fidelity-implementation
nextAction: "Land feat/622-cross-runtime-fidelity when CI green; Version Packages + Trusted Publish 6.22.0; then 6.23"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "green CI on 6.22 PR"
```

## Published baseline

**6.21.0** published on npm. Persisted schema **1.0**.

## Active focus — 6.22.0 Cross-runtime causal fidelity

| Chunk | Status |
| --- | --- |
| Mapping ledgers | implemented |
| Relationship facts on TraceFacts | implemented |
| Operation/attempt identity metadata | implemented |
| Omitted-payload digests | implemented |
| W3C MCP + #331 recipes | implemented |
| Merge + Trusted Publish | pending |

## Later

- **6.23.0** structured control contracts
- **6.24.0** adoption (external retained-use gate)
- **6.25.0** stability baseline
