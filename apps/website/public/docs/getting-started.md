# First trace in 5 minutes

Goal: install → one trace → one trajectory check → one share-safe Evidence bundle.

**Docs site:** [https://agentinspect.vercel.app/docs/getting-started/](https://agentinspect.vercel.app/docs/getting-started/)

```bash
npm install agent-inspect
npx agent-inspect init --yes
node examples/agent-inspect-demo.mjs
npx agent-inspect list --dir .agent-inspect
```

Copy a `<run-id>` from `list`, then:

```bash
npx agent-inspect view <run-id> --dir .agent-inspect --summary
npx agent-inspect check <run-id> --dir .agent-inspect --preset trajectory
npx agent-inspect verify-safe <run-id> --dir .agent-inspect
npx agent-inspect bundle <run-id> --dir .agent-inspect --profile share --out ./evidence
npx agent-inspect bundle verify ./evidence
```

`init` scaffolds files into the current directory (`agent-inspect.config.ts`, `.agent-inspect/`, and `examples/agent-inspect-demo.mjs`). It does **not** install dependencies or write a trace by itself. Use `--preset trajectory` for structural CI gates; `--fail-on-observation` belongs only in examples that record explicit OUTCOME events.

## Minutes 0–1: Install

```bash
mkdir my-agent-debug && cd my-agent-debug
npm install agent-inspect
npx agent-inspect init --yes
```

Framework users: pick the correct capture path first — [CHOOSE-YOUR-CAPTURE-PATH.md](./CHOOSE-YOUR-CAPTURE-PATH.md).

## Minutes 1–2: Run

```bash
node examples/agent-inspect-demo.mjs
```

No API keys. Deterministic local trace under `.agent-inspect/`.

## Minutes 2–3: Inspect

```bash
npx agent-inspect list --dir .agent-inspect
npx agent-inspect view <run-id> --dir .agent-inspect --summary
```

Replace `<run-id>` with the ID printed by `list` (do not guess “latest file”).

## Minutes 3–4: Check

```bash
npx agent-inspect check <run-id> --dir .agent-inspect --preset trajectory
```

Expected exit code `0` for the keyless demo. Add `--required-tool <name>` only when that tool is part of the real expected workflow.

## Minutes 4–5: Share-safe artifact

```bash
npx agent-inspect verify-safe <run-id> --dir .agent-inspect
npx agent-inspect bundle <run-id> --dir .agent-inspect --profile share --out ./evidence
npx agent-inspect bundle verify ./evidence
```

`--out ./evidence` writes the Evidence v2 package to a known path; `bundle verify ./evidence` checks that exact directory. Do not use `--allow-unsafe` to force a share.

Optional file redaction before bundling:

```bash
npx agent-inspect redact <run-id> --dir .agent-inspect --profile share -o redacted.jsonl
```

## Next steps

| If you use… | Go to |
| ----------- | ----- |
| Full install + instrumentation guide | [GETTING-STARTED.md](./GETTING-STARTED.md) (site: [/docs/getting-started/guide](/docs/getting-started/guide)) |
| Broken agent demo (same answer, wrong path) | [broken-agent-debugging starter](../examples/starters/broken-agent-debugging/README.md) |
| Coding-agent MCP loop | [CODING-AGENT-LOOP.md](./CODING-AGENT-LOOP.md) |
| Contracts / CI gates | [TRACE-CONTRACTS.md](./TRACE-CONTRACTS.md) · [SUITES-COHORTS-GATES.md](./SUITES-COHORTS-GATES.md) |
| AI SDK | [AI SDK adoption](./AI-SDK-ADOPTION.md) |
| OpenAI Agents | [OpenAI Agents local](./OPENAI-AGENTS-LOCAL.md) |
| LangChain | [Adapters](./ADAPTERS.md) |
| CI tests | [CI artifacts](./CI-ARTIFACTS.md) |
| Golden path | [GOLDEN-PATH.md](./GOLDEN-PATH.md) |

Full index: [docs/README.md](./README.md) · Website docs: [agentinspect.vercel.app/docs](https://agentinspect.vercel.app/docs/)
