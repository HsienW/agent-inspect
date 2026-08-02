# Positioning and portfolio (v6.12)

**Status:** canonical public-identity + portfolio contract for AgentInspect **6.12+**  
**Authority:** Stability and Focus roadmap §13 · [V6.12.0-EXECUTION-PLAN.md](./implementation/release-trains/V6.12.0-EXECUTION-PLAN.md)

## One-sentence product identity

> **The local evidence debugger for TypeScript agents—faithful execution trees, deterministic regression checks, share-checked evidence, and coding-agent access without a collector or account.**

Use this sentence consistently in README, website, and pitch surfaces. Do not lead with Studio, PM evals, “18 packages,” generic observability, LLM judges, or a plugin ecosystem.

## Hero flow

```text
1. Capture one real run
2. Find the causal failure
3. Ask your coding agent to inspect it
4. Lock the fix with a contract
5. Attach the share-checked evidence
```

## Portfolio tiers

Canonical maturity labels live in [SUPPORT-LEVELS.md](./SUPPORT-LEVELS.md). Public presentation order:

| Tier | Role | Packages / surfaces |
|------|------|---------------------|
| **A — Flagship** | Default story | `agent-inspect` (schema, readers/writers, CLI), share redaction, deterministic checks, portable evidence, MCP coding-agent loop |
| **B — Official integrations** | Documented adapters/reporters | `@agent-inspect/langchain`, `@agent-inspect/ai-sdk`, `@agent-inspect/openai-agents`, Vitest/Jest reporters, `@agent-inspect/harness` |
| **C — Optional supporting** | Secondary; not above-the-fold equals | `@agent-inspect/viewer`, `@agent-inspect/studio`, `@agent-inspect/index-sqlite`, `@agent-inspect/adapter-sdk`, eval/guardrails/circuit/mcp client helpers |

Do not present all eighteen fixed-group packages as equal products above the fold. They remain **version-linked** for compatibility; presentation ≠ package deletion.

## Install kits (copyable)

### LangGraph local-debug kit

```bash
npm install -D agent-inspect @agent-inspect/langchain @agent-inspect/mcp-server
```

### Core portable-evidence kit

```bash
npm install -D agent-inspect @agent-inspect/redact
```

### Other adapters

Document AI SDK and OpenAI Agents on their own adoption pages ([AI-SDK-ADOPTION.md](./AI-SDK-ADOPTION.md), [OPENAI-AGENTS-LOCAL.md](./OPENAI-AGENTS-LOCAL.md)) — not as equal hero install lines.

## Fixed-group release model (audit outcome for 6.12)

**Decision for 6.12:** keep the eighteen-package fixed group through v6.

Rationale (see [PACKAGE-MAINTENANCE-AUDIT.md](./PACKAGE-MAINTENANCE-AUDIT.md)):

- Compatibility and provenance stay clear for consumers
- Optional packages must not leak into root/core runtime deps
- Decoupling / smaller linked groups remain a **conditional v7** question with migration + CI proof

## Boundaries

| In scope | Out of scope |
|----------|--------------|
| Local capture, inspect, contracts, share-checked evidence, MCP read-only loop | Hosted SaaS/APM, default upload |
| Honest tiered packaging presentation | Removing packages in 6.12 |
| Complementary handoff to OTel/OpenInference tools | Replacing LangSmith/Langfuse/eval platforms |

Related: [COMPARE.md](./COMPARE.md) · [SUPPORT-LEVELS.md](./SUPPORT-LEVELS.md) · [CODING-AGENT-LOOP.md](./CODING-AGENT-LOOP.md) · [NETWORK-BEHAVIOR.md](./NETWORK-BEHAVIOR.md)
