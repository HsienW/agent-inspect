# Recipe: langgraph-gate-evidence

## What this demonstrates

No-key LangGraph-shaped flagship loop using the anonymized bridged-tool fixture:

```text
check (required tool) → gate → CI Evidence package (evidence.json with TraceFacts semantics)
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
