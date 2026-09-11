# Recipe: mcp-expected-rejection

## What this demonstrates

An MCP tool call that returns `isError: true` (expected rejection) is captured
locally. A TraceContract asserts the negative path without rewriting or deleting
the rejection event from JSONL history.

## Why this matters

Negative tests should prove the rejection happened and remains inspectable.
AgentInspect keeps the original TOOL event; contracts evaluate the recorded
trajectory instead of mutating it after the fact. Version ownership stays
explicit: writers remain on schema **1.0**, and v0.1 / v0.2 traces stay readable.

## How to run

From the repository root:

```bash
pnpm build
cd examples/recipes/mcp-expected-rejection
pnpm install
pnpm start
```

## Expected output

See `expected-output.txt`.

## What to look for

- `wrapMcpClient` records the rejected `callTool` result locally.
- `evaluateTraceContractRead` passes while the rejection payload remains on disk.
- No remote MCP server or network call is required (fixture client only).

## Notes and limitations

- Fixture-only; `serverUrl` is metadata for the adapter, not a live connection.
- Does not demonstrate live MCP authorization or provider billing.
- Schema / version ownership: persisted writer path is schema **1.0**.
