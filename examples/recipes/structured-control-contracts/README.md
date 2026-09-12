# Recipe: structured-control-contracts

## What this demonstrates

TraceContract 6.23 surfaces: JSON Pointer tool-argument checks, mixed
`orderRules`, declared-versus-enforced controls, and retry/side-effect safety
with explicit attempt identity.

## Why this matters

Policy-sensitive agents need more than tool presence. Structured evidence must
fail closed when capture is preview-only, and declared tool lists must stay
distinct from harness enforcement.

## How to run

```bash
pnpm build
cd examples/recipes/structured-control-contracts
pnpm install
pnpm start
```

## Expected output

See `expected-output.txt`.

## Notes and limitations

- Synthetic in-memory traces (no network).
- Schema remains **1.0**.
- Findings never embed full tool argument payloads.
