# Roadmap

AgentInspect is the **local evidence debugger** for TypeScript agents: capture a framework-faithful execution tree, inspect it yourself or through your coding assistant, prevent the same trajectory regression, and produce a redacted portable evidence artifact—without a collector, account, or default upload.

**Product loop:** faithful local capture → causal debugging → deterministic trajectory checks → share-checked portable evidence → local read-only coding-agent access.

This public roadmap describes direction — not a delivery guarantee. See [docs/LIMITATIONS.md](docs/LIMITATIONS.md), [docs/KNOWN-ISSUES.md](docs/KNOWN-ISSUES.md), and [docs/SUPPORT-LEVELS.md](docs/SUPPORT-LEVELS.md).

**Principles:** CLI-first · TypeScript-first · dependency-light · safe-by-default · framework-aware but not framework-locked · no vendor upload by default · no maintainer-hosted SaaS dashboard · depth before breadth.

---

## Current — v6.12 adoption checkpoint

**Current release on npm:** **6.12.0** (eighteen fixed-group public packages). Persisted schema **1.0**. See [CHANGELOG.md](CHANGELOG.md#6120).

**6.12.0** is the published stable launch candidate. Active work is the eight-week adoption checkpoint (docs/evidence only; no fabricated partners). No new public package before the conditional v7 decision.

| Release | Theme | Status |
| ------- | ----- | ------ |
| **6.7.4**–**6.7.5** | Consumer / native / DX reliability | Published |
| **6.8.0** | LangGraph fidelity contract | Published |
| **6.9.0** | Safety precision and share policy | Published |
| **6.10.0** | Portable Evidence v2 | Published |
| **6.11.0** | Local coding-agent debug loop | Published |
| **6.12.0** | Consolidation and stable launch candidate | Published |
| then | Eight-week adoption checkpoint | **Active** |
| **v7** | Conditional decision only | Not scheduled |

Train state: [docs/implementation/RELEASE-TRAIN-STATE.md](docs/implementation/RELEASE-TRAIN-STATE.md).
Canonical maintainer roadmap: [docs/implementation/AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md](docs/implementation/AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md).

External validation gates (real LangGraph/NestJS trials, no-egress evidence, retained CI contracts) are mandatory where the maintainer roadmap requires them — results are never fabricated.

---

## Later — conditional v7

v7 remains gated on retained adoption evidence and an explicit maintainer readiness assessment after the v6.12 adoption checkpoint. See [docs/implementation/release-trains/V7.0.0-READINESS-ASSESSMENT.md](docs/implementation/release-trains/V7.0.0-READINESS-ASSESSMENT.md).

Do not treat exploratory ideas as committed delivery. Do not implement v7 until a named train is authorized.

---

## Explicit non-goals

- Maintainer-hosted SaaS / multi-tenant dashboard
- Production APM replacement
- Default vendor telemetry upload
- Automatic universal framework monkey-patching
- Default replay / cassette execution
- Cost analytics engine
- Raw chain-of-thought capture
- New public packages before the v7 decision (`@agent-inspect/judge`, `@agent-inspect/context`, `@agent-inspect/browser`, etc.)

AgentInspect **complements** LangSmith, Langfuse, Braintrust, Phoenix/OpenInference, OpenTelemetry, and similar platforms. It does not replace their production or eval workflows.
