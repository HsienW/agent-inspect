# broken-agent-debugging starter

Deterministic demo: agent calls the wrong tool, step fails, you inspect and redact locally.

No API keys. No network.

## Run

```bash
pnpm install
pnpm start
npx agent-inspect list --dir .agent-inspect
```

Copy a `<run-id>` from `list`, then:

```bash
npx agent-inspect report <run-id> --dir .agent-inspect
npx agent-inspect check <run-id> --dir .agent-inspect
npx agent-inspect redact <run-id> --dir .agent-inspect --profile share -o safe.jsonl
npx agent-inspect verify-safe <run-id> --dir .agent-inspect
```

Optional Evidence v2:

```bash
npx agent-inspect bundle <run-id> --dir .agent-inspect --profile share
npx agent-inspect bundle verify .agent-inspect/bundles/<run-id>
```

## Fix flow

```bash
pnpm run fixed
npx agent-inspect diff <old-run-id> <new-run-id> --dir .agent-inspect
```

## What to look for

- Failed `step.tool` with `status: "error"` in the trace
- `report` highlights the first failing / causal step
- Always pass a run id (or path) to `redact` / `verify-safe` / `check`

Adoption: [docs/FIRST-TRACE-IN-5-MINUTES.md](../../../docs/FIRST-TRACE-IN-5-MINUTES.md)
