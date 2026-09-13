# Recipe: sensitive-read-outbound-write-anyof

## What this demonstrates

A TraceContract `alternatives.anyOf` pattern for two legitimate paths:

1. **read-only-path** — sensitive read (`retrieve_secret_metadata`) without outbound write.
2. **write-path** — outbound write (`send_outbound`) only with declared write recovery semantics.

CLI `--required-tool` cannot express this OR of paths; use TraceContract instead.

## Why this matters

Sensitive-read and outbound-write are often both valid depending on the turn.
Forcing both with CLI shorthands creates brittle gates. `alternatives.anyOf`
documents the branch without inventing a new CLI command.

## How to run

From the repository root:

```bash
pnpm build
cd examples/recipes/sensitive-read-outbound-write-anyof
pnpm install
pnpm start
```

Offline only — synthetic in-memory events, no network.

## Expected output

See `expected-output.txt`.

## What to look for

- Read-only fixture passes the `read-only-path` branch.
- Write fixture passes the `write-path` branch with `sideEffectClass: "write"`.
- Explain/lint print human-readable branch intent.

## Notes and limitations

- Does not prove exactly-once writes; write path still fails closed on timeout/unknown without idempotency evidence (see bounded-read-recovery).
- Schema / version ownership: persisted writer path remains schema **1.0**.
