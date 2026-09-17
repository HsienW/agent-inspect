# Recipe: mcp-transport-retry-429

## What this demonstrates

A **keyless synthetic** transport path: HTTP `429` → server-advertised delay → one explicit retry that succeeds. Retry identity is recorded on the application/transport layer (`operationId`, `attemptId`, `attemptNumber`, `retryOf`), not inferred by the MCP client wrapper.

## Why this matters

`wrapMcpClient` records each call as a separate tool step. It cannot reconstruct retry relationships or collapsed transport facts from an SDK error alone. AgentInspect **evaluates** retry evidence; it does **not** execute retries.

## How to run

```bash
pnpm build
cd examples/recipes/mcp-transport-retry-429
pnpm install
pnpm start
```

## Expected output

See `expected-output.txt`.

## Notes and limitations

- No real network — in-process mock only.
- Do not infer retries by matching tool names across steps.
