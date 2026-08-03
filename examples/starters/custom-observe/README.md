# custom-observe starter

Manual `inspectRun` / `step` tracing without framework adapters.

Adoption: [docs/ADOPTION.md](../../../docs/ADOPTION.md)

Deterministic `observe()` demo — no API keys.

```bash
pnpm install
pnpm start
npx agent-inspect list --dir .agent-inspect
```

Copy a `<run-id>`, then:

```bash
npx agent-inspect check <run-id> --dir .agent-inspect
npx agent-inspect redact <run-id> --dir .agent-inspect --profile share -o safe.jsonl
npx agent-inspect verify-safe <run-id> --dir .agent-inspect
```
