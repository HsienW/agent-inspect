# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: agentinspect-feedback-integrity-v6.17.5-to-v6.22
currentTrain: v6.20.0-flexible-deterministic-contracts
trainStatus: in-progress
currentChunk: flexible-contracts-implementation
nextAction: "Land feat/620-flexible-contracts (#375) when CI green; wait for Version Packages then Trusted Publish for 6.20.0"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "green CI on #375; merge to main; do not create Version Packages manually"
```

## Published baseline

**6.19.1** published on npm. Persisted schema **1.0**.

## Active focus — 6.20.0 Flexible Deterministic Contracts

| Chunk | Status |
| --- | --- |
| #315 causal `requiredOrderMode` (HsienW authorship preserved) | landed on `feat/620-flexible-contracts` |
| #309 `alternatives.anyOf` | implemented |
| Contract lint / explain | implemented |
| MCP expected-rejection + Promptfoo use-together recipes | implemented |
| Merge to main | ready when PR CI green after rebase onto `origin/main` |

## Later

- **6.21.0** — #320 actor scope; #321 outcome provenance (roadmap-next)
- **6.22.0** — #331 design confirmed; conditional; existing APIs only; not implemented (roadmap-future)
