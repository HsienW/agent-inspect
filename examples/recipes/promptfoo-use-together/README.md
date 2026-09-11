# Recipe: promptfoo-use-together

## What this demonstrates

A local, offline pattern for using AgentInspect TraceContracts beside Promptfoo:

1. Capture a fixture agent trajectory with `inspectRun` / `step.tool`.
2. Evaluate `defineTraceContract` + `evaluateTraceContractRead`.
3. Use `lintTraceContract` / `explainTraceContract` for brittle-contract hints.
4. Mirror the same assert from a Promptfoo JavaScript assertion (see
   `promptfooconfig.example.yaml`).

## Why this matters

Promptfoo grades model outputs; AgentInspect gates trajectory invariants
(`requiredOrderMode`, `alternatives.anyOf`) on local evidence. Keeping both
local avoids remote generation and keeps CI deterministic. Version ownership
stays explicit: writers remain on schema **1.0**.

## How to run

From the repository root:

```bash
pnpm build
cd examples/recipes/promptfoo-use-together
pnpm install
pnpm start
```

This recipe does **not** install or invoke Promptfoo. The YAML file is a sketch
only (`PROMPTFOO_DISABLE_REMOTE_GENERATION=true`).

## Expected output

See `expected-output.txt`.

## What to look for

- Contract passes for the retrieve → generate fixture under `happens-before`.
- `alternatives.anyOf` documents a second legitimate cache path without forcing it.
- Lint/explain print human-readable contract intent.

## Notes and limitations

- No Promptfoo dependency and no network calls.
- Do not enable remote generation when adapting the YAML sketch.
- Schema / version ownership: persisted writer path is schema **1.0**.
