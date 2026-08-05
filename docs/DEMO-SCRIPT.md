# Live demo script (~4 minutes)

**Audience:** TypeScript developers debugging AI agents.
**Prereqs:** Node 20+. Consumers: `npm install agent-inspect@6.14.0`. Monorepo: `pnpm build` at repo root.
**Website:** [https://agentinspect.vercel.app/](https://agentinspect.vercel.app/)

**Blessed demo starters:**

- [broken-agent-debugging](../examples/starters/broken-agent-debugging/) — intentional tool failure, no API keys
- [coding-agent-debug-loop](../examples/starters/coding-agent-debug-loop/) — MCP inspect + share-checked evidence, no API keys

## Setup (before the call)

```bash
cd examples/starters/broken-agent-debugging
pnpm install && pnpm start
npx agent-inspect list --dir .agent-inspect
```

Copy a `<run-id>` for beats below.

## Beat 1 — Problem (30s)

"Console logs are flat. When an agent picks the wrong tool or a step throws, you can't see parent/child relationships or which step failed first."

## Beat 2 — Capture (45s)

```bash
pnpm start                    # writes failing trace to .agent-inspect/
npx agent-inspect list --dir .agent-inspect
```

Point out: run id, status, duration — **no upload**, metadata-only by default.

## Beat 3 — Inspect (45s)

```bash
npx agent-inspect report <run-id> --dir .agent-inspect
npx agent-inspect view <run-id> --dir .agent-inspect
npx agent-inspect timeline <run-id> --dir .agent-inspect
```

Optional: `npx agent-inspect serve --dir .agent-inspect` for browser viewer.

## Beat 4 — Verify / CI gate (30s)

```bash
npx agent-inspect check <run-id> --dir .agent-inspect
```

Optional flags: `--require-completed`, `--detect-stalls`, `--max-step-duration 30s`.
For CI artifact demos: `npx agent-inspect artifacts <run-id> --dir .agent-inspect -o ./ci-out`.

## Beat 5 — Share-checked evidence (Evidence v2) (45s)

```bash
npx agent-inspect bundle <run-id> --dir .agent-inspect --format html -o ./evidence-out
npx agent-inspect bundle verify ./evidence-out
# lighter alternative:
npx agent-inspect redact <run-id> --dir .agent-inspect --profile share -o safe.jsonl
npx agent-inspect verify-safe <run-id> --dir .agent-inspect
```

"Share-checked evidence is best-effort local policy — not a compliance certification. Safe to attach to a GitHub issue or Slack when assessment allows."

## Beat 6 — MCP coding-agent loop (optional, 45s)

```bash
npx agent-inspect mcp configure --client cursor
cd ../coding-agent-debug-loop
pnpm install && pnpm start && pnpm run inspect-mcp
```

Point to [CODING-AGENT-LOOP.md](./CODING-AGENT-LOOP.md). Stay read-only; do not claim a live partner session unless one is on the call.

## Beat 7 — Fix and diff (optional, 30s)

```bash
pnpm run fixed
npx agent-inspect diff .agent-inspect/<broken-run>.jsonl .agent-inspect/<fixed-run>.jsonl
```

## Beat 8 — Close (15s)

"Starters for AI SDK, OpenAI Agents, LangChain, CI, NestJS harness, and the MCP coding-agent loop are in `examples/starters/`. Fresh repos: `npx agent-inspect init --yes`."

## Alternative opener (zero clone)

```bash
npm install agent-inspect@6.14.0
npx agent-inspect init --yes
node examples/agent-inspect-demo.mjs
npx agent-inspect list --dir .agent-inspect
```

See [FIRST-TRACE-IN-5-MINUTES.md](./FIRST-TRACE-IN-5-MINUTES.md).

## Optional beats

- **VS Code:** F5 from `packages/vscode` (dev host) — Marketplace listing pending
- **Doctor:** `npx agent-inspect doctor` when onboarding fails
- **Framework:** switch to `examples/starters/ai-sdk` for adapter path
- **CI starter:** `examples/starters/ci-eval-redact`

Related: [VIDEO-WALKTHROUGH-SCRIPT.md](./VIDEO-WALKTHROUGH-SCRIPT.md) · [SCREENSHOTS.md](./SCREENSHOTS.md) · [PRE-V7-PILOT-KIT.md](./PRE-V7-PILOT-KIT.md) · [EVIDENCE-FORMAT.md](./EVIDENCE-FORMAT.md)
