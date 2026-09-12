# Recipe: guardrail-refusal-non-action

## What this demonstrates

Correct refusal versus accidental no-op using **existing** TraceContract APIs only (#331):

1. Healthy refusal — guardrail decision + `request-refused` observation → PASS
2. Missing evidence — required observation absent → FAIL
3. Side-effect regression — forbidden protected tool present → FAIL

## Non-claims

Does not prove uninstrumented side effects are absent, policy semantic truth, or compliance.

## How to run

```bash
pnpm build
cd examples/recipes/guardrail-refusal-non-action
pnpm install
pnpm start
```
