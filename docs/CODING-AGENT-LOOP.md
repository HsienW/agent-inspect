# Coding-agent debug loop (MCP)

**Status:** experimental contract for AgentInspect **6.11+**  
**Authority:** Stability and Focus roadmap §12 · [V6.11.0-EXECUTION-PLAN.md](./implementation/release-trains/V6.11.0-EXECUTION-PLAN.md)

This document defines the **local coding-agent debug loop**: a read-only MCP server that lets a coding assistant inspect TypeScript agent runs without an OpenTelemetry backend, collector, or account.

Related: [MCP.md](./MCP.md) · [READ-ONLY-MCP-SERVER.md](./proposals/READ-ONLY-MCP-SERVER.md) · [EVIDENCE-FORMAT.md](./EVIDENCE-FORMAT.md) · [SAFETY-POLICY.md](./SAFETY-POLICY.md)

## Product boundary

| In scope | Out of scope |
|----------|--------------|
| Local stdio MCP over a configured trace directory | Hosted MCP relay / remote fetch |
| Read-only tools with share redaction by default | Modifying application code or traces |
| Deterministic causal-failure + contract evidence | Model-generated diagnosis presented as fact |
| Client config generators (dry-run default) | Credentials, API keys, or default upload |
| Share-checked evidence creation via existing gates | Executing target-app tools through MCP |

AgentInspect remains **read-only**. The coding assistant applies fixes; this server only inspects local traces and emits share-checked artifacts.

## Executable entrypoint (6.11-1)

Preferred invocation (no wrapper script):

```bash
npx @agent-inspect/mcp-server --dir .agent-inspect
```

| Rule | Detail |
|------|--------|
| Package | Existing `@agent-inspect/mcp-server` only — **no new package** |
| Transport | **stdio** for the flagship path (HTTP not required) |
| Default dir | `.agent-inspect` when `--dir` / `AGENT_INSPECT_TRACE_DIR` omitted |
| Redaction | `AGENT_INSPECT_MCP_REDACTION_PROFILE` — `share` (default), `strict`, `local` |
| Network | None by default |

## Client configuration (6.11-6)

```bash
agent-inspect mcp configure --client cursor
agent-inspect mcp configure --client claude-code
agent-inspect mcp configure --client codex
agent-inspect mcp configure --client gemini
```

Behavior:

- dry-run by default when editing user-level configuration
- project-local option
- explicit confirmation before writing
- no network; no credentials
- clear trace-directory scope; easy removal

## Protocol (6.11-2)

**Decision (6.11-2):** Harden the hand-written stdio JSON-RPC layer rather than pull `@modelcontextprotocol/sdk` (HTTP/Express stack) or jump to MCP SDK v2 until the coding-agent client matrix is validated. Protocol version remains **`2024-11-05`**. Full SDK adoption stays optional and mcp-server-only when practical.

Must support:

- protocol negotiation / `2024-11-05`
- `initialize`, `ping`, `tools/list`, `tools/call`
- `notifications/cancelled` (abort in-flight tool calls)
- bounded request frames + bounded tool errors
- resources/prompts only when read-only (not required for flagship stdio path)

Existing consumers remain compatible or receive migration guidance.

## Flagship tool surface (6.11-3…5)

Canonical **names** for the coding-agent loop (additive; legacy names may remain as aliases during transition):

| Flagship tool | Role | Legacy / related (today) |
|---------------|------|---------------------------|
| `list_recent_runs` | Recent runs in scope | `list_traces` |
| `list_recent_failures` | Failed runs only | filter on `list_traces` / checks |
| `get_run_summary` | Bounded run summary | `summarize_failed_run`, `read_trace` |
| `get_execution_tree` | Tree projection | `read_trace` |
| `get_first_causal_failure` | Deterministic first causal failure | `find_first_error` (stricter engine) |
| `get_slowest_path` | Slow path summary | `find_slowest_path` |
| `get_contract_failures` | Contract / check failures | `run_checks` |
| `get_failed_observations` | Failed observed outcomes | `find_failed_observation` |
| `compare_runs` | Structural diff | `compare_runs` |
| `create_share_checked_evidence` | Evidence v2 / share gate | `create_share_safe_bundle` |
| `get_adapter_diagnostics` | Adapter/source diagnostics | (new / additive) |

### Output contract

Every tool result must be:

- **redacted** (share profile by default)
- **bounded** (event counts, string lengths, payload size)
- **deterministic** for the same inputs
- **source-linked** (run ids / event ids — not raw local paths by default)
- **explicit about uncertainty**
- free of known fixture secrets in conformance corpus

Assessment for share gates follows [SAFETY-POLICY.md](./SAFETY-POLICY.md): **artifact** assessment gates writes; source status remains informational.

## First causal failure (6.11-4)

Conservative ordering (stop at first match; return evidence ids + rationale):

1. Explicit failed/error event
2. Failed observed outcome
3. Contract failure linked to an event
4. Nearest failed ancestor/child relationship
5. **No** inference from timing correlation alone

Do not present model-generated diagnosis as fact.

## Coding-agent workflow

```text
run the agent
→ find latest failed trace
→ inspect first causal failure
→ inspect tool path
→ compare against last success
→ read contract failure
→ suggest code fix (assistant)
→ rerun the app/test
→ confirm contract passes
→ create share-checked evidence
```

Client instruction templates: [coding-agent-instructions/](./coding-agent-instructions/).

## Flagship recipe (6.11-8)

```text
examples/starters/coding-agent-debug-loop/
```

No provider key for the default fixture. Demonstrate:

```text
broken LangGraph-like run
→ MCP inspection
→ deterministic contract failure
→ code/fixture fix
→ passing rerun
→ portable evidence
```

## Privacy and conformance (6.11-9)

Follow current MCP security principles: explicit user control, read-only tools, sanitized outputs, bounded payloads, clear local scope, no hidden prompt sampling, no tool execution against the target app, no unredacted evidence by default.

Conformance corpus must cover: `initialize`, `tools/list`, `tools/call`, cancellation, malformed request, unknown tool, oversized result, sensitive trace, missing trace, protocol version negotiation.

## Compatibility

| Surface | Rule |
|---------|------|
| Trace schema | Unchanged (`0.1` / `0.2` / `1.0` readable) |
| Evidence format | Independent; use Evidence v2 for share-checked packages |
| Root/core deps | No new root/core runtime dependency without approval |
| `@agent-inspect/mcp` | Client telemetry — unchanged |
| Existing MCP tools | Keep working or alias; document renames |

## Acceptance (release gate)

- Configure Cursor or Claude Code in under five minutes on a clean project
- No collector/backend required
- MCP outputs contain no known fixture secrets
- Coding assistant can identify deterministic failure evidence
- Server cannot modify code or execute target tools
- Debug-loop fixture passes end to end
- Existing MCP consumers remain compatible or have migration guidance
