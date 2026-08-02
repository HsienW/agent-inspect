# Recipe: shareable-bundle-basic

## What this demonstrates

Creating **share-safe offline Evidence v2** from a local AgentInspect trace with `agent-inspect bundle` (v4.3+ / 6.10+).

## Why this matters

PR and incident reviews need predictable evidence folders — redacted JSONL, offline HTML (`evidence.html`), hashed `evidence.json`, safety results, and a summary — without manual copy/paste across `redact`, `verify-safe`, and `export` commands.

## How to run

From the repository root:

```bash
pnpm build
cd examples/recipes/shareable-bundle-basic
pnpm install
pnpm start
```

Then create a bundle from the generated trace. Run ids are generated (`run_xxx`), so copy the `Run id:` the recipe prints:

```bash
npx agent-inspect bundle <run-id> \
  --dir ./.agent-inspect \
  --out ./bundle-out \
  --json

npx agent-inspect bundle verify ./bundle-out
```

Deterministic fixtures (no recipe run required):

```bash
npx agent-inspect bundle fixed --dir ../../fixtures/evidence/demo --out ./fixed-out
npx agent-inspect bundle verify ./fixed-out
```

## Expected output

See `expected-output.txt`.

## What to look for

- Default `--profile share` redacts IDs and sensitive keys.
- `verify-safe` runs on the **redacted artifact** before the bundle is written; UNSAFE artifacts fail unless `--allow-unsafe`.
- Source traces under `.agent-inspect/runs/` are not modified.
- `evidence.html`, `evidence.json`, `trace.html`, and `summary.md` open offline.
- `bundle verify` reports pass when hashes match.

## Boundaries

- Directory / HTML / ZIP formats (`--format`); ZIP uses a built-in STORE writer (no extra dependency).
- No upload or hosted sharing.
- Review every bundle before external sharing.
