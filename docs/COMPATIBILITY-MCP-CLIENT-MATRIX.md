# MCP client matrix (v6.12)

**Status:** PARTIAL — protocol/privacy corpus + packed bin smoke + client instruction templates; external client E2E not fully matrixed.  
**Authority:** roadmap §13 Scope D · [CODING-AGENT-LOOP.md](./CODING-AGENT-LOOP.md)  
**Date:** 2026-08-02 · baseline `@agent-inspect/mcp-server@6.11.0`

## Method

| Source | Evidence |
|--------|----------|
| Packed smoke | Flagship tools present; `agent-inspect-mcp-server --help` works from tarball |
| `fixtures/mcp/protocol-conformance.v1.json` + tests | Protocol/privacy conformance corpus |
| `agent-inspect mcp configure --dry-run` | Cursor / Claude Code / Codex / Gemini config generators |
| Client instruction docs | `docs/coding-agent-instructions/*` |
| External live client sessions | Not claimed as passed for 6.12 without partner evidence |

## Client matrix

| Client | Config generator | Instruction doc | Live E2E | Result |
|--------|------------------|-----------------|----------|--------|
| Cursor | Yes (`--client cursor`) | [cursor.md](./coding-agent-instructions/cursor.md) | Not retained here | **PARTIAL** (fixture/docs) |
| Claude Code | Yes | [claude-code.md](./coding-agent-instructions/claude-code.md) | Not retained here | **PARTIAL** |
| Codex | Yes | [codex.md](./coding-agent-instructions/codex.md) | Not retained here | **PARTIAL** |
| Gemini CLI | Yes | [gemini.md](./coding-agent-instructions/gemini.md) | Not retained here | **PARTIAL** |
| Generic stdio MCP | Bin + protocol tests | [CODING-AGENT-LOOP.md](./CODING-AGENT-LOOP.md) | Packed help + unit/protocol | **PASS** (automated) |

## Privacy / read-only

| Check | Result |
|-------|--------|
| Share redaction default | PASS (server context + conformance) |
| Read-only tools (no code mutation) | PASS (contract tests) |
| No default network upload | PASS (local stdio) |

External “real MCP coding-agent use” remains an adoption gate — see trial docs (6.12-6…8) and [V6.12-ADOPTION-CHECKPOINT.md](./implementation/release-trains/V6.12-ADOPTION-CHECKPOINT.md).
