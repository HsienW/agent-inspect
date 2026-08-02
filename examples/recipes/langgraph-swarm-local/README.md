# LangGraph swarm-shaped local recipe

Multi-agent handoff through `@agent-inspect/langchain` callbacks only — no Nest, no LangGraph runtime, no provider keys.

## Run

```bash
pnpm --filter agent-inspect-recipe-langgraph-swarm-local start
```

## What it shows

- Persist-by-intent via relative `traceDir`
- Two LangGraph-shaped agents sharing semantic parent `LangGraph` (synthetic grouping when applicable)
- Worker correlated via `langGraph.handoffFrom` → planner `taskId`
- Human tool identity (`tool:fetch_itinerary`) with `DynamicStructuredTool` class preserved
- `close()` + `getDiagnostics()` after the swarm completes
