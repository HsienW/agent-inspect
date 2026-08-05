# NestJS + LangGraph local evidence (anonymized)

**Audience:** Public-safe integration story  
**Permission:** Anonymized fixture language only — no company names, logos, or retention claims.

## Context

Production-shaped NestJS services composing LangGraph / LangChain callbacks were instrumented with AgentInspect to keep execution trees on disk beside existing observability.

## What worked

- Additive integration without replacing the primary observability stack
- CommonJS / ESM interoperability in the consumer workspace
- Model, tool, and token metadata capture with metadata-first defaults
- Evidence v2 generation for CI handoff
- No default upload from AgentInspect surfaces

## Flagship loop exercised

```text
framework-native capture
→ TraceFacts / logical projection
→ TraceContract / gate
→ Evidence v2 package
→ optional local MCP get_trace_facts
```

## Non-claims

- This is not a named design-partner attestation.
- This is not a compliance certification.
- Empty adoption-ledger rows remain empty until real external evidence is retained with permission.

Related: [LANGGRAPH.md](../LANGGRAPH.md) · [NESTJS.md](../NESTJS.md) · [examples/recipes/langgraph-gate-evidence](../../examples/recipes/langgraph-gate-evidence)
