# LangGraph with AgentInspect

Capture LangGraph / LangChain runs as local AgentInspect traces, evaluate them with TraceFacts and TraceContract, and produce Evidence v2 — without a collector or default upload.

## Install

```bash
npm install agent-inspect @agent-inspect/langchain
npx agent-inspect init --framework langgraph --yes
```

Or wire the LangChain callback path manually via [`@agent-inspect/langchain`](https://www.npmjs.com/package/@agent-inspect/langchain).

## No-key gate + Evidence recipe

Repository recipe (no API keys): [examples/recipes/langgraph-gate-evidence](../examples/recipes/langgraph-gate-evidence).

Typical loop:

```text
capture → check / TraceContract → gate → bundle --profile share → bundle verify
```

## Semantics to expect

- Raw JSONL events remain on disk.
- Built-in checks and TraceContract use the **logical** lifecycle projection (`logicalEvents` / TraceFacts).
- Canonical tool identity resolves bridged tool names (including nested `metadata.toolName` where applicable).

Details: [TRACE-FACTS.md](./TRACE-FACTS.md) · [LANGGRAPH-FIDELITY.md](./LANGGRAPH-FIDELITY.md) · [ADAPTERS.md](./ADAPTERS.md).

## Related NestJS path

For NestJS + LangGraph-style local evidence, see [NESTJS.md](./NESTJS.md) and the public-safe case study under [case-studies/](./case-studies/) when present.
