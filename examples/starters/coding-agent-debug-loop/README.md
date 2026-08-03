# Coding-agent debug loop starter

No API keys. No network. Demonstrates the v6.11 MCP inspection loop:

```text
broken run → MCP inspect (causal + contracts) → fix → passing rerun → share-checked evidence
```

## Run

```bash
pnpm install
pnpm start
pnpm run inspect-mcp
pnpm run fixed
pnpm run inspect-mcp
```

Configure a coding agent (dry-run):

```bash
npx agent-inspect mcp configure --client cursor
```

## Notes

- `@agent-inspect/mcp-server` tools are **read-only**
- Share redaction by default
- Flagship tools include `get_first_causal_failure` and `create_share_checked_evidence`
- See [docs/CODING-AGENT-LOOP.md](../../../docs/CODING-AGENT-LOOP.md)

## Optional CLI evidence

After a run id exists:

```bash
npx agent-inspect report <run-id> --dir .agent-inspect
npx agent-inspect bundle <run-id> --dir .agent-inspect --profile share
npx agent-inspect bundle verify .agent-inspect/bundles/<run-id>
```

