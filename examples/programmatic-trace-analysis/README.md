# Programmatic trace analysis examples (6.15.0)

Canonical path for N-5: open a local JSONL file, build TraceFacts, evaluate a TraceContract.

Requires a built workspace (`pnpm build` from repo root) so `agent-inspect` resolves from the monorepo package.

```bash
node examples/programmatic-trace-analysis/quickstart.mjs
node examples/programmatic-trace-analysis/quickstart.cjs
```

TypeScript consumers should use `module`/`moduleResolution` `NodeNext` (ESM) or `Node16` (CJS `.cts`). See `packages/core/test/package-exports-compat.test.ts`.
