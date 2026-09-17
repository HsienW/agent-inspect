# Recipe: comparable-cohort-runs

## What this demonstrates

Optional **run-comparability provenance** for cohort-style checks: two deterministic local runs share a cohort label and prompt/template version, while a third run is intentionally not comparable.

## Why this matters

A deterministic checker can still read evidence from a nondeterministic agent. A changed path does not automatically prove a regression unless the runs are comparable enough to interpret.

Classification used here (guidance only — ordinary `check` does **not** fail when provenance is absent):

| Class | Meaning |
| --- | --- |
| `comparable` | Same cohort + test case + prompt/template version + available-tools commitment |
| `partially comparable` | Shared cohort/test case but missing tool or model commitments |
| `not comparable` | Different cohort or missing identity |
| `unknown` | No comparability metadata |

See [RUN-COMPARABILITY.md](../../../docs/RUN-COMPARABILITY.md).

## How to run

```bash
pnpm build
cd examples/recipes/comparable-cohort-runs
pnpm install
pnpm start
```

## Expected output

See `expected-output.txt`.

## Notes and limitations

- Keyless and local only — uses hashes of fixture strings, not raw prompts.
- Does not add a machine-readable comparable-run profile (reserved for 6.30.0 with external validation).
- Temperature zero is **not** treated as proof of determinism.
