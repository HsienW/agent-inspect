<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/rajudandigam/agent-inspect/main/docs/assets/agent-inspect-logo-dark.svg?sanitize=true">
    <img src="https://raw.githubusercontent.com/rajudandigam/agent-inspect/main/docs/assets/agent-inspect-logo.svg?sanitize=true" width="240" alt="AgentInspect">
  </picture>
</p>

<h1 align="center">agent-inspect</h1>

<p align="center">
  <strong>Debug and regression-test TypeScript AI agents from local evidence.</strong>
</p>

<p align="center">
  AgentInspect captures framework-faithful execution trees, evaluates them with deterministic TraceFacts and TraceContract rules, creates integrity-verifiable Evidence v2, and lets coding assistants inspect the same local facts over read-only MCP—without a collector, account, or default upload.
</p>

<p align="center">
  <em>See what your agent did. Prove the fix. Keep the evidence.</em>
</p>

<p align="center">
  <sub>No account · no collector · no default upload · metadata-only by default</sub>
</p>

<p align="center">
  <a href="https://agentinspect.vercel.app/">Website</a> ·
  <a href="https://agentinspect.vercel.app/docs/">Docs</a> ·
  <a href="https://www.npmjs.com/package/agent-inspect">npm</a> ·
  <a href="https://github.com/rajudandigam/agent-inspect">GitHub</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/agent-inspect"><img src="https://img.shields.io/npm/v/agent-inspect.svg" alt="npm version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT license"></a>
  <a href="package.json"><img src="https://img.shields.io/badge/node-%3E%3D20-brightgreen" alt="Node.js >= 20"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-strict-3178c6" alt="TypeScript"></a>
</p>

```bash
npm install agent-inspect
```

## Four pillars

| Pillar | What you get |
| ------ | ------------ |
| **Capture faithfully** | Framework-aware execution trees and local JSONL you own |
| **Test behavior deterministically** | TraceFacts, TraceContract, checks, suites, gates, and experimental Vitest/Jest matchers |
| **Produce portable evidence** | Offline Evidence v2 with integrity verification and share-policy disclosure |
| **Debug with coding assistants locally** | Read-only MCP over the same TraceFacts — no collector required |

```text
1. Capture one real run
2. Find the causal failure
3. Ask your coding agent to inspect it
4. Lock the fix with a contract
5. Attach the share-checked evidence
```

<p align="center">
  <img src="https://raw.githubusercontent.com/rajudandigam/agent-inspect/main/docs/assets/readme-product-loop.svg?sanitize=true" alt="Capture or import → understand → enforce → verify and bundle → review locally or in customer-owned Studio" width="900">
</p>

## Five-minute path

Commands below match the packed quickstart. Replace `<run-id>` with a value from `list`.

```bash
npm install agent-inspect
npx agent-inspect init --yes
# or: npx agent-inspect init --framework langgraph --yes
node examples/agent-inspect-demo.mjs
npx agent-inspect list --dir .agent-inspect
```

```bash
# After copying a run id from list:
npx agent-inspect report <run-id> --dir .agent-inspect
npx agent-inspect check <run-id> --dir .agent-inspect
npx agent-inspect bundle <run-id> --dir .agent-inspect --profile share
npx agent-inspect verify-safe <run-id> --dir .agent-inspect
npx agent-inspect bundle verify .agent-inspect/bundles/<run-id>
# Optional coding-agent loop (dry-run by default):
npx agent-inspect mcp configure --client cursor
```

Guides: [First trace in 5 minutes](https://agentinspect.vercel.app/docs/getting-started/) · [Golden path](https://github.com/rajudandigam/agent-inspect/blob/main/docs/GOLDEN-PATH.md) · [Coding-agent loop](https://github.com/rajudandigam/agent-inspect/blob/main/docs/CODING-AGENT-LOOP.md)

## Why AgentInspect

**Category:** the local evidence debugger and trajectory-test toolkit for TypeScript AI agents — not a hosted APM, eval host, or prompt registry. Complements LangSmith/Langfuse/Phoenix; owns the laptop → PR loop.

**Proof (public-safe):** Validated against production-shaped NestJS/LangGraph integrations. Fixture-backed across official adapters and packed consumer workflows.

| Mechanism | What you get |
| --------- | ------------ |
| Faithful execution trees | Nested steps, tools, LLMs, status, duration on disk |
| TraceFacts / logical projection | Canonical tool identity and semantic parity without inventing hierarchy |
| Deterministic checks / TraceContract (Beta) | Trajectory expectations without an LLM judge |
| Experimental Vitest/Jest matchers | `toPassTraceContract` · `toHaveRequiredTool` |
| Share-checked Evidence v2 | `bundle` + `bundle verify` with optional TraceFacts semantics |
| Read-only MCP coding-agent loop (Preview) | `get_trace_facts` and related tools over local traces |

## Choose your capture path

| Path | Use when | Start |
| ---- | -------- | ----- |
| **Manual / observe** | Custom nesting or object methods | [Getting started](https://github.com/rajudandigam/agent-inspect/blob/main/docs/GETTING-STARTED.md) |
| **AI SDK** | Vercel AI SDK `generateText` / `streamText` | [`@agent-inspect/ai-sdk`](https://www.npmjs.com/package/@agent-inspect/ai-sdk) |
| **OpenAI Agents** | OpenAI Agents JS | [`@agent-inspect/openai-agents`](https://www.npmjs.com/package/@agent-inspect/openai-agents) |
| **LangChain / LangGraph** | Callbacks / LangGraph | [`@agent-inspect/langchain`](https://www.npmjs.com/package/@agent-inspect/langchain) · `init --framework langgraph` |
| **Structured logs** | Logs already emitted | [Log-to-tree](https://github.com/rajudandigam/agent-inspect/blob/main/docs/LOG-TO-TREE-QUICKSTART.md) |
| **Harness** | Fixture runner for real projects | [`@agent-inspect/harness`](https://www.npmjs.com/package/@agent-inspect/harness) |
| **CI reporters + matchers** | Failed-test artifacts and contracts | [`vitest`](https://www.npmjs.com/package/@agent-inspect/vitest) · [`jest`](https://www.npmjs.com/package/@agent-inspect/jest) |
| **Standards files** | OpenInference / OTLP JSON | [Standards](https://github.com/rajudandigam/agent-inspect/blob/main/docs/STANDARDS.md) |

Blessed starters (no API keys): [examples/starters](https://github.com/rajudandigam/agent-inspect/tree/main/examples/starters) · LangGraph gate/evidence recipe: [langgraph-gate-evidence](https://github.com/rajudandigam/agent-inspect/tree/main/examples/recipes/langgraph-gate-evidence)

## What you can do after capture

**Understand** — `what` / `view` / tree · timeline · report · diff · `buildTraceFacts`

**Prevent regressions** — deterministic checks · TraceContract (Beta) · suites · cohorts · CI gates · Vitest/Jest reporters · experimental matchers (`toPassTraceContract`, `toHaveRequiredTool`)

**Share safely** — redaction profiles · `scan` · `verify-safe` · Evidence v2 bundles · CI artifacts

**Debug with coding assistants** — `@agent-inspect/mcp-server` · `get_trace_facts` · first-causal-failure

**Scale locally** — workspace · optional SQLite index (Beta) · viewer / TUI / VS Code · customer-owned Studio (Beta)

Support labels: [SUPPORT-LEVELS.md](https://github.com/rajudandigam/agent-inspect/blob/main/docs/SUPPORT-LEVELS.md) · Network: [NETWORK-BEHAVIOR.md](https://github.com/rajudandigam/agent-inspect/blob/main/docs/NETWORK-BEHAVIOR.md) · No-egress: [NO-EGRESS-POLICY.md](https://github.com/rajudandigam/agent-inspect/blob/main/docs/NO-EGRESS-POLICY.md)

## Real-world scenarios

| Scenario | Start |
| -------- | ----- |
| Wrong tool / intentional failure | [broken-agent-debugging](https://github.com/rajudandigam/agent-inspect/tree/main/examples/starters/broken-agent-debugging) |
| Coding-agent MCP debug loop | [coding-agent-debug-loop](https://github.com/rajudandigam/agent-inspect/tree/main/examples/starters/coding-agent-debug-loop) · [CODING-AGENT-LOOP](https://github.com/rajudandigam/agent-inspect/blob/main/docs/CODING-AGENT-LOOP.md) |
| CI trajectory gate + Evidence | [ci-eval-redact](https://github.com/rajudandigam/agent-inspect/tree/main/examples/starters/ci-eval-redact) · [langgraph-gate-evidence](https://github.com/rajudandigam/agent-inspect/tree/main/examples/recipes/langgraph-gate-evidence) |
| Safe incident handoff | [Safe sharing](https://github.com/rajudandigam/agent-inspect/blob/main/docs/SAFE-TRACE-SHARING.md) |
| Multi-agent / session retry | [Sessions & outcomes](https://github.com/rajudandigam/agent-inspect/blob/main/docs/SESSIONS-AND-OUTCOMES.md) |
| Customer-owned team review | [Self-hosting](https://github.com/rajudandigam/agent-inspect/blob/main/docs/SELF-HOSTING.md) · Studio (optional) |

## Safety and network behavior

- Traces are **local JSONL** under `.agent-inspect/` (or `AGENT_INSPECT_TRACE_DIR`)
- **Metadata-only by default** — no raw prompts/outputs unless you opt in
- **No hidden upload** — core does not send traces to AgentInspect
- **Customer-owned Studio ingestion** is disabled by default and explicit when enabled
- **MCP server** exposes configured local evidence to the connected client (Preview)
- **Standards export** only when you run/configure it
- Redaction is **best-effort**, not certification — review before posting
- **Not** a chain-of-thought recorder

Details: [Safe sharing](https://github.com/rajudandigam/agent-inspect/blob/main/docs/SAFE-TRACE-SHARING.md) · [Network behavior](https://github.com/rajudandigam/agent-inspect/blob/main/docs/NETWORK-BEHAVIOR.md) · [Security](SECURITY.md)

## Project status

**Current release:** **6.16.1** · schema **1.0** · Node.js **≥ 20** · **MIT** · **actively maintained** (eighteen linked npm packages).

The 6.16 line is actively maintained for correctness, compatibility, documentation, security, and framework evolution.

[Roadmap](ROADMAP.md) · [Changelog](CHANGELOG.md) · [Public product facts](https://github.com/rajudandigam/agent-inspect/blob/main/docs/product/PUBLIC-PRODUCT-FACTS.md)

## What AgentInspect is not

- Hosted SaaS or maintainer-hosted dashboard
- Production APM replacement
- Eval dataset platform or LLM-as-judge by default
- Prompt registry, pricing engine, or replay engine
- Universal standards exporter
- Compliance certification

See [Compare](https://github.com/rajudandigam/agent-inspect/blob/main/docs/COMPARE.md).

<details>
<summary><strong>Package family (18 linked packages · tiered presentation)</strong></summary>

Canonical tiers: [POSITIONING-AND-PORTFOLIO.md](https://github.com/rajudandigam/agent-inspect/blob/main/docs/POSITIONING-AND-PORTFOLIO.md) · [SUPPORT-LEVELS.md](https://github.com/rajudandigam/agent-inspect/blob/main/docs/SUPPORT-LEVELS.md).

### Tier A — Flagship

| Package | Purpose |
| ------- | ------- |
| [`agent-inspect`](https://www.npmjs.com/package/agent-inspect) | Core APIs + CLI + evidence |
| [`@agent-inspect/redact`](https://www.npmjs.com/package/@agent-inspect/redact) | Deterministic redaction |
| [`@agent-inspect/mcp-server`](https://www.npmjs.com/package/@agent-inspect/mcp-server) | Read-only MCP coding-agent loop (Preview) |

### Tier B — Official integrations

### Framework adapters

| Package | Purpose |
| ------- | ------- |
| [`@agent-inspect/ai-sdk`](https://www.npmjs.com/package/@agent-inspect/ai-sdk) | AI SDK telemetry |
| [`@agent-inspect/openai-agents`](https://www.npmjs.com/package/@agent-inspect/openai-agents) | OpenAI Agents processor |
| [`@agent-inspect/langchain`](https://www.npmjs.com/package/@agent-inspect/langchain) | LangChain / LangGraph callbacks |

### Tier B — Testing / evaluation

| Package | Purpose |
| ------- | ------- |
| [`@agent-inspect/harness`](https://www.npmjs.com/package/@agent-inspect/harness) | Fixture runner |
| [`@agent-inspect/eval`](https://www.npmjs.com/package/@agent-inspect/eval) | Local eval heuristics |
| [`@agent-inspect/vitest`](https://www.npmjs.com/package/@agent-inspect/vitest) | Vitest reporter + experimental matchers |
| [`@agent-inspect/jest`](https://www.npmjs.com/package/@agent-inspect/jest) | Jest reporter + experimental matchers |

### Tier C — Optional supporting (Safety)

| Package | Purpose |
| ------- | ------- |
| [`@agent-inspect/redact`](https://www.npmjs.com/package/@agent-inspect/redact) | Deterministic redaction |
| [`@agent-inspect/guardrails`](https://www.npmjs.com/package/@agent-inspect/guardrails) | Deterministic guardrail rules |
| [`@agent-inspect/circuit`](https://www.npmjs.com/package/@agent-inspect/circuit) | Loop / retry / timeout analyzers |

### Tier C — Optional supporting (Developer surfaces)

| Package | Purpose |
| ------- | ------- |
| [`@agent-inspect/viewer`](https://www.npmjs.com/package/@agent-inspect/viewer) | Localhost viewer |
| [`@agent-inspect/tui`](https://www.npmjs.com/package/@agent-inspect/tui) | Optional terminal UI |
| [`@agent-inspect/mcp`](https://www.npmjs.com/package/@agent-inspect/mcp) | MCP client tracing |
| [`@agent-inspect/mcp-server`](https://www.npmjs.com/package/@agent-inspect/mcp-server) | Read-only MCP server (Preview) |

### Tier C — Optional supporting (Team / self-hosted)

| Package | Purpose |
| ------- | ------- |
| [`@agent-inspect/index-sqlite`](https://www.npmjs.com/package/@agent-inspect/index-sqlite) | Optional SQLite index (Beta) |
| [`@agent-inspect/studio`](https://www.npmjs.com/package/@agent-inspect/studio) | Customer-owned Studio (Beta) |

### Tier C — Optional supporting (Extension / interop)

| Package | Purpose |
| ------- | ------- |
| [`@agent-inspect/adapter-sdk`](https://www.npmjs.com/package/@agent-inspect/adapter-sdk) | Third-party adapters (Beta) |

`agent-inspect-vscode` is in-repo (Marketplace not published yet).

</details>

## Documentation

| | Website | Repo |
| - | ------- | ---- |
| Getting started | [docs](https://agentinspect.vercel.app/docs/getting-started/) | [FIRST-TRACE](https://github.com/rajudandigam/agent-inspect/blob/main/docs/FIRST-TRACE-IN-5-MINUTES.md) |
| TraceFacts / contracts | — | [TRACE-FACTS](https://github.com/rajudandigam/agent-inspect/blob/main/docs/TRACE-FACTS.md) · [TRACE-CONTRACTS](https://github.com/rajudandigam/agent-inspect/blob/main/docs/TRACE-CONTRACTS.md) |
| Evidence / MCP / no-egress | — | [EVIDENCE-FORMAT](https://github.com/rajudandigam/agent-inspect/blob/main/docs/EVIDENCE-FORMAT.md) · [CODING-AGENT-LOOP](https://github.com/rajudandigam/agent-inspect/blob/main/docs/CODING-AGENT-LOOP.md) · [NO-EGRESS-POLICY](https://github.com/rajudandigam/agent-inspect/blob/main/docs/NO-EGRESS-POLICY.md) |
| Safe sharing | [safe-sharing](https://agentinspect.vercel.app/docs/safe-sharing/) | [SAFE-TRACE-SHARING](https://github.com/rajudandigam/agent-inspect/blob/main/docs/SAFE-TRACE-SHARING.md) |
| API / CLI | — | [API](docs/API.md) · [CLI](docs/CLI.md) (packed with npm) |
| Full index | — | [docs/README.md](https://github.com/rajudandigam/agent-inspect/blob/main/docs/README.md) |

## Contributing

[CONTRIBUTING.md](https://github.com/rajudandigam/agent-inspect/blob/main/CONTRIBUTING.md) · [Good first issues](https://github.com/rajudandigam/agent-inspect/blob/main/GOOD-FIRST-ISSUES.md) · [Discussions](https://github.com/rajudandigam/agent-inspect/discussions)

**Redact traces before posting issues or PRs.**

```bash
pnpm add agent-inspect
npx agent-inspect doctor
```

Monorepo: `pnpm install && pnpm build && pnpm test`
