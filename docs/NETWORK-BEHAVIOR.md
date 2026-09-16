# Network behavior

AgentInspect is **local-first**. Core tracing writes local files and does **not** upload to AgentInspect. Some optional surfaces can use the network when **explicitly** enabled.

## Summary

| Surface | Default | Network? | Notes |
| ------- | ------- | -------- | ----- |
| Core CLI / writers | On | No | Local JSONL only |
| Framework adapters | Opt-in install | No AgentInspect upload | Provider SDKs may still call their own APIs |
| `explain` | Local facts | No provider calls in default mode | |
| Viewer | Localhost | Loopback only | Read-only |
| Studio CLI | Localhost bind | Loopback by default | Customer-owned |
| Studio file-drop ingest | Off / explicit | No | Local files |
| Studio GitHub artifact import | Off / explicit | Yes → GitHub | User credentials; customer-owned |
| Studio HTTP ingest | **Disabled by default** | Yes if enabled | Token + binding required |
| MCP client (`@agent-inspect/mcp`) | Opt-in | To your MCP servers | Tracing only; not a gateway |
| MCP server | Opt-in | Exposes local evidence to connected client | Preview; share-profile boundary |
| Standards export / collector | Opt-in | Only if you configure export | Known losses documented |
| Website / docs | N/A | Public site | No trace upload |

## Rules of thumb

1. **No default upload** of traces to AgentInspect maintainers.
2. **No hidden telemetry** from the library.
3. **Customer-owned** destinations only (your disk, your Studio, your collector).
4. Prefer **redact / verify-safe** before any share or ingest path.
5. Redaction is best-effort, not certification.

## Transport evidence (HTTP / fetch / MCP)

Capture **HTTP status**, **server-advertised retry delay**, **selected delay**, and their **sources** at the transport or fetch boundary that observes them.

An MCP client wrapper or SDK error string cannot recover facts already collapsed into a message such as `"fetch failed"` or `"429 Too Many Requests"`. If the application needs TraceFacts or contracts over status/retry behavior, instrument the fetch/transport layer (or an observer that reads response headers before they are discarded).

AgentInspect does not invent transport facts from error message text.

## Enabling Studio ingest

See [SELF-HOSTING.md](./SELF-HOSTING.md) and [`@agent-inspect/studio`](https://github.com/rajudandigam/agent-inspect/tree/main/packages/studio). HTTP ingest remains off until you configure token and binding.
