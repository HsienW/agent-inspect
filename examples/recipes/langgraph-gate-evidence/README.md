# Recipe: langgraph-gate-evidence

## What this demonstrates

Four-pillar flagship loop on a no-key LangGraph-shaped fixture:

```text
capture/fixture → TraceFacts/check (required tool) → gate → Evidence v2 (semantics) → optional MCP get_trace_facts
```

No provider API keys. No network from AgentInspect.

## How to run

```bash
pnpm build
cd examples/recipes/langgraph-gate-evidence
pnpm start
```

## Expected output

Exit code **0**. Prints `OK` and the evidence output directory. See `expected-output.txt`.

## Boundaries

- Uses `fixtures/langgraph/pilot-shaped-bridged-tool.jsonl` only.
- Artifact upload to GitHub is user-owned CI YAML (see `workflow-example.yml`).
- Not a design-partner attestation.
