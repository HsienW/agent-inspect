# Moderate production-shaped LangGraph fixture

Public-safe synthetic Evidence sample generated from an in-repo fixture.
No customer traces. No organization names.

## Contents

- `source.jsonl` — fixture copy
- `check-trajectory.json` — `check --preset trajectory` result
- `evidence/` — Evidence v2 directory (`evidence.html`, `evidence.json`, …)
- `bundle-verify.json` — `bundle verify` result

## Regenerate

```bash
pnpm build && pnpm demo:generate && pnpm demo:verify
```
