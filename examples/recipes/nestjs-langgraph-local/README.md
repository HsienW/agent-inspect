# Recipe: NestJS + LangGraph local (env-gated)

## What this demonstrates

A **copyable NestJS-style adoption path** for LangGraph-shaped agents using
`@agent-inspect/langchain`, without importing NestJS or LangGraph runtimes.

- Lazy, development-only dynamic import of the adapter
- `AGENT_INSPECT` environment gate (`createAgentInspectCallbacks()` → `[]` when off)
- Spread into a `callbacks` array with no production-path change when disabled
- Workspace-relative `traceDir` (`.agent-inspect/langchain`)
- `capture: "metadata-only"`
- LangGraph-shaped parented callbacks that emit exactly one `run_completed`
- No absolute machine paths in persisted event metadata

Older AgentInspect versions sometimes needed an explicit wrapper around graph
invoke; current `@agent-inspect/langchain` accepts the callback directly in the
framework `callbacks` array.

## How to run

```bash
pnpm build
pnpm --filter agent-inspect-recipe-nestjs-langgraph-local start
```

Disabled path (no adapter load):

```bash
AGENT_INSPECT=0 pnpm --filter agent-inspect-recipe-nestjs-langgraph-local start
```

## Nest wiring (conceptual)

```ts
import { createAgentInspectCallbacks } from "./agent-inspect-callbacks.js";

// Inside a Nest provider method:
const result = await this.graph.invoke(input, {
  callbacks: [
    ...(await createAgentInspectCallbacks({
      runName: "support-agent",
      traceDir: ".agent-inspect/langchain",
    })),
  ],
});
```

When `AGENT_INSPECT` is unset/false, the spread adds nothing.

## Expected output

See `expected-output.txt`.

## Notes

- No API keys, providers, Nest packages, or LangGraph packages are required.
- For Nest structured logs without an agent adapter, see [nestjs-json-logging](../nestjs-json-logging/).
- For pure LangGraph-shaped metadata coverage, see [langgraph-callback-local](../langgraph-callback-local/).
