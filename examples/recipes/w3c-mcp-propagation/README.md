# Recipe: w3c-mcp-propagation

## What this demonstrates

A no-key local W3C Trace Context propagation path:

```text
intent span → traceparent → MCP tool attempt → AgentInspect facts
```

plus a negative control where propagation is disabled and identity stays unlinked.

## Why this matters

Cross-process correlation must use explicit propagated identity. AgentInspect must not invent causal links from tool name, timestamps, or adjacency.

## How to run

```bash
pnpm build
cd examples/recipes/w3c-mcp-propagation
pnpm install
pnpm start
```

## Expected output

See `expected-output.txt`.

## Notes

- Synthetic only; no network and no provider keys.
- Trace identity is correlation, not authentication.
- Schema writer path remains **1.0**.
