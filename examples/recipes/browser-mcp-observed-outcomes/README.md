# Recipe: browser-mcp-observed-outcomes

## What this demonstrates

A synthetic Browser/MCP-style harness separates **tool-reported success** from
**observed effect**, with explicit resource binding and preconditions.

Acceptance matrix (all synthetic / in-memory):

| Case | Expected gate |
| --- | --- |
| Valid start, correct resource, actual transition | `passed` |
| Tool success but state unchanged | `failed` (postcondition) |
| Observation from a different resource that already has the target page | `failed` (resource binding) — never pass by page-value equality |
| Invalid starting state | `failed` (precondition); postcondition skipped |
| Observer missing/failed/incomplete | `unknown` — never success |

The observer is injected in-process and may read the same fixture memory as the
action surface when resource IDs match. This does **not** prove an independent
browser channel, Safari delivery, or real MCP transport.

## How to run

```bash
pnpm build
pnpm --filter agent-inspect-recipe-browser-mcp-observed-outcomes start
```

## Expected output

See `expected-output.txt` for the matrix gates and class line.
