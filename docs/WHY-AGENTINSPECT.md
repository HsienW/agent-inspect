# Why AgentInspect

**Category:** The local evidence debugger and trajectory-test toolkit for TypeScript AI agents.

**Headline:** Debug and regression-test TypeScript AI agents from local evidence.

**Outcome:** See what your agent did. Prove the fix. Keep the evidence.

## When to install

Install AgentInspect when you need to:

1. Capture a **framework-faithful** local execution tree (JSONL you own).
2. Assert **deterministic** trajectory expectations (TraceFacts / TraceContract) without an LLM judge.
3. Produce **portable Evidence v2** for a PR or incident handoff.
4. Let a **coding assistant** inspect the same local facts over read-only MCP.

## When not to install

- You need hosted multi-tenant APM or a maintainer-operated dashboard.
- You need LLM-as-judge eval hosting or a prompt registry as the primary product.
- You need compliance certification (SOC2/HIPAA) from the library itself.

AgentInspect complements platforms like LangSmith, Langfuse, and Phoenix; it owns the laptop → PR evidence loop.

## Four pillars

1. **Capture faithfully** — Framework-aware trees and local JSONL.
2. **Test behavior deterministically** — TraceFacts, TraceContract, checks, suites, gates, matchers.
3. **Produce portable evidence** — Offline Evidence v2 with integrity verification.
4. **Debug with coding assistants locally** — Read-only MCP over the same TraceFacts.

## Proof language (public-safe)

Validated against production-shaped NestJS/LangGraph integrations. Fixture-backed across official adapters and packed consumer workflows.

See [product/PUBLIC-PRODUCT-FACTS.md](./product/PUBLIC-PRODUCT-FACTS.md) and [DECISION-GUIDE.md](./DECISION-GUIDE.md).
