## Architecture

> **Adoption-focused overview:** see [TECHNICAL-GUIDE.md](./TECHNICAL-GUIDE.md) for a comprehensive technical guide suitable for blogs and outreach.

AgentInspect is a **local-first execution-tree debugger and trajectory-test toolkit** for TypeScript AI agents: framework-native capture and manual traces produce inspectable step trees as local JSONL (default `.agent-inspect`), with CLI, TraceContract / TraceFacts checks, Evidence v2 packaging, and optional read-only MCP.

### Package layout

| Package | Published? | Role |
| -------- | ---------- | ---- |
| `agent-inspect` | Yes | Public tarball: core tracing APIs + CLI (`agent-inspect` binary) |
| `@agent-inspect/core` | No (private) | Tracing, storage, readers/writers, checks, export, diff |
| `@agent-inspect/cli` | No (private) | Commander CLI implementation |
| `@agent-inspect/redact` | Yes | Standalone redaction engine (also used by CLI `redact`) |
| `@agent-inspect/ai-sdk` | Yes (optional) | Vercel AI SDK telemetry integration |
| `@agent-inspect/openai-agents` | Yes (optional) | OpenAI Agents JS `setTraceProcessors()` adapter |
| `@agent-inspect/langchain` | Yes (optional) | LangChain.js / LangGraph callback adapter |
| `@agent-inspect/mcp` | Yes (optional) | MCP client `tools/list` / `tools/call` tracing |
| `@agent-inspect/adapter-sdk` | Yes (optional) | Shared adapter helpers / plugin surface |
| `@agent-inspect/vitest` / `@agent-inspect/jest` | Yes (optional) | Test reporters and TraceContract matchers |
| `@agent-inspect/eval` | Yes (optional) | Deterministic local eval heuristics |
| `@agent-inspect/guardrails` / `@agent-inspect/circuit` | Yes (optional) | Local guardrail and circuit utilities |
| `@agent-inspect/harness` | Yes (optional) | Lightweight local harness helpers |
| `@agent-inspect/viewer` | Yes (optional) | Local HTML/viewer surface |
| `@agent-inspect/tui` | Yes (optional) | Ink/React terminal viewer |
| `@agent-inspect/mcp-server` | Yes (optional) | Read-only local MCP server over traces |
| `@agent-inspect/index-sqlite` | Yes (optional) | Optional local SQLite metadata index |
| `@agent-inspect/studio` | Yes (optional) | Local studio CLI / ingest surfaces |

Root `agent-inspect` uses **conditional exports** for ESM/CJS TypeScript consumers (`import.types` / `require.types`). Heavy framework dependencies stay in optional packages.

### Event model and schema

- Manual global helpers (`inspectRun()` / `step()`) still write **`schemaVersion: "0.1"`** JSONL for compatibility (`run_started`, `step_started`, `step_completed`, `run_completed`).
- Failures use `step_completed` / `run_completed` with `status: "error"` — there is no `step_failed` event.
- **Persisted writer/runtime output targets schema 1.0.** `createInspector()` with built-in writers emits schema **1.0** persisted rows; v0.1 and v0.2 remain readable.
- Log-derived runs use confidence labels (`explicit`, `correlated`, `heuristic`, `unknown`) and conservative tree-building rules.
- Migration is explicit (`agent-inspect migrate …`); AgentInspect does not rewrite old traces in place.

See [SCHEMA.md](./SCHEMA.md) for field reference and [API.md](./API.md) for public surfaces (stable vs experimental).

### Safety and redaction

- Instrumentation must **not throw into user code**; trace safety failures degrade gracefully.
- **Manual metadata** is redacted before disk by default; `redact: false` opts out.
- **Error messages** also run high-confidence free-text credential detectors before disk (provider keys, bearer tokens, JWTs, and related patterns), unless `redact: false`.
- **Size bounds** cap persisted event and metadata size.
- Log ingest: JSON first-class; log4js best-effort; no `eval` or JS object-literal parsing.

See [SECURITY.md](../SECURITY.md) and [LIMITATIONS.md](./LIMITATIONS.md).

### Optional adapters and surfaces

Official adapters (`@agent-inspect/ai-sdk`, `@agent-inspect/openai-agents`, `@agent-inspect/langchain`) share a bounded preview-capture contract. MCP client tracing, reporters, eval, redact, viewer/TUI, studio, and read-only MCP are separate optional packages — see [ADAPTERS.md](./ADAPTERS.md) and [SUPPORT-LEVELS.md](./SUPPORT-LEVELS.md).

### Architecture proposals

Maintainer-owned RFCs and planning proposals are indexed in [proposals/README.md](./proposals/README.md). The active roadmap is [implementation/ROADMAP.md](./implementation/ROADMAP.md).

### Where to read next

- New users: [GETTING-STARTED.md](./GETTING-STARTED.md)
- CLI: [CLI.md](./CLI.md)
- Structured logs: [LOGS.md](./LOGS.md), [LOGGING-PLAYBOOK.md](./LOGGING-PLAYBOOK.md)
- Contributors: [CONTRIBUTING.md](../CONTRIBUTING.md), [docs/community/CONTRIBUTING.md](./community/CONTRIBUTING.md)

Maintainer-only internal docs under `docs-local/` may contain additional historical architecture depth; they are not required for contributors.
