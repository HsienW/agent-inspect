# TraceFacts (experimental)

AgentInspect **TraceFacts** are a local, read-only semantic foundation built on the 6.12.2 logical lifecycle projection.

```ts
import { buildTraceFacts, evaluateTraceContract, defineTraceContract } from "agent-inspect/checks";

const facts = buildTraceFacts(read.events);
facts.toolsByName.get("lookup_orders");
facts.summary.runningLogicalCount;

evaluateTraceContract({ read }, defineTraceContract({
  tools: { requiredTools: ["lookup_orders"] },
}));
```

## Compatibility

- Raw `TraceCheckFacts.events` remain raw persisted rows.
- Built-in checks use `logicalEvents`.
- `buildTraceFacts` / `summarizeSemanticParity` are additive experimental APIs on `agent-inspect/checks`.
- Vitest/Jest: `agentInspectVitestMatchers` / `agentInspectJestMatchers` (`toPassTraceContract`, `toHaveRequiredTool`).

No schema 1.0 change. No default network.
