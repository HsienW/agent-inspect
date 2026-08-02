# Coding-agent client instructions

Templates for local MCP debug loops. AgentInspect stays **read-only**; the coding assistant applies code fixes.

Configure (dry-run):

```bash
npx agent-inspect mcp configure --client cursor
# claude-code | codex | gemini
```

## Shared workflow

```text
1. Run the TypeScript agent (or starter) so traces land in .agent-inspect
2. list_recent_failures / list_recent_runs
3. get_first_causal_failure
4. get_execution_tree / get_slowest_path (tool path)
5. compare_runs against last success when available
6. get_contract_failures
7. Suggest a code fix (assistant) — do not ask MCP to edit files
8. Rerun the app/test
9. Confirm contracts pass
10. create_share_checked_evidence
```

Privacy: share redaction by default; no network; no unredacted dumps.

See also: [CODING-AGENT-LOOP.md](../CODING-AGENT-LOOP.md) · [MCP.md](../MCP.md)

## Per-client

| Client | Template |
|--------|----------|
| Cursor | [cursor.md](./cursor.md) |
| Claude Code | [claude-code.md](./claude-code.md) |
| Codex | [codex.md](./codex.md) |
| Gemini CLI | [gemini.md](./gemini.md) |
