# Current task

```yaml
executionMode: autonomous-release-train
namedTrain: agentinspect-stability-and-focus-v6.7.3-to-v7-decision
currentTrain: v6.7.4-real-integration-blockers
trainStatus: active
currentChunk: 6.7.4-1-active-lifecycle-completion
nextAction: Adapter active-lifecycle completion for LangGraph-shaped parented callbacks
canonicalRoadmap: docs/implementation/AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md
activePlan: docs/implementation/release-trains/V6.7.4-EXECUTION-PLAN.md
```

## Published baseline

**6.7.3** — all **18** fixed-group packages on npm.

## Completed

- SoT activation (`e97b844`)
- **6.7.4-0** reproduction (`it.fails` locks + unpublished fix locks)

## Next

**6.7.4-1** — standalone LangGraph-shaped active-lifecycle completion (convert langchain `it.fails` when fixed).
