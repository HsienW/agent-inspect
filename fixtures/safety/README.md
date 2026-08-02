# Safety false-positive / true-positive corpus (v6.9)

Synthetic fixtures for share-check precision. **No production data. No real credentials.**

Authority: [docs/SAFETY-POLICY.md](../../docs/SAFETY-POLICY.md) · roadmap §10 Scope F.

## Layout

| Path | Role |
|------|------|
| `corpus.json` | Catalog: case id, fixture file, notes, expected outcomes per policy |
| `*.jsonl` | Minimal schemaVersion `0.1` traces embedding the stimulus |

## Policies in expectations

| Key in `corpus.json` | Meaning |
|----------------------|---------|
| `development` | Local / development verification (lenient) |
| `share` | Share verification |
| `strict` | Strict verification |

Each expectation lists:

- `mustNotFlag` — detector ids / categories that must stay quiet (FP targets)
- `mustFlag` — detector ids / categories that must fire (TP targets)
- `status` — preferred aggregate status when only this case is present (`SAFE` · `SAFE WITH WARNINGS` · `UNSAFE` · `UNKNOWN`)

## Safety of fixtures

- Emails: `example.test` only
- Tokens: clearly fake (`sk_test_fake_…`, `ghp_synthetic_…`)
- JWT: public jwt.io-style demo payload (not a live credential)
- Card: Stripe test PAN `4242424242424242` (industry test number)
- Paths / packages / UUIDs / hashes: synthetic

## Validation

```bash
pnpm exec vitest run packages/cli/test/safety-fp-corpus.test.ts
```

Precision assertions against live detectors land in later 6.9 chunks; this train chunk locks the catalog contract.
