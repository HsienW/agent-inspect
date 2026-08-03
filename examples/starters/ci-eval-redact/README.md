# ci-eval-redact starter

Generates a trace, then use check/redact locally (CI-friendly).

```bash
pnpm install && pnpm start
npx agent-inspect list --dir .agent-inspect
```

Copy a `<run-id>`, then:

```bash
npx agent-inspect check <run-id> --dir .agent-inspect
npx agent-inspect redact <run-id> --dir .agent-inspect --profile share -o safe.jsonl
npx agent-inspect verify-safe <run-id> --dir .agent-inspect
```
