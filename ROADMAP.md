# Roadmap

AgentInspect is the **local evidence debugger** for TypeScript agents: capture a framework-faithful execution tree, inspect it yourself or through your coding assistant, prevent the same trajectory regression, and produce a redacted portable evidence artifact—without a collector, account, or default upload.

**Product loop:** faithful local capture → causal debugging → deterministic trajectory checks → share-checked portable evidence → local read-only coding-agent access.

This public roadmap describes direction — not a delivery guarantee. See [docs/LIMITATIONS.md](docs/LIMITATIONS.md), [docs/KNOWN-ISSUES.md](docs/KNOWN-ISSUES.md), and [docs/SUPPORT-LEVELS.md](docs/SUPPORT-LEVELS.md).

**Principles:** CLI-first · TypeScript-first · dependency-light · safe-by-default · framework-aware but not framework-locked · no vendor upload by default · no maintainer-hosted SaaS dashboard · depth before breadth.

---

## Current — canonical stability and evidence (from 6.12.1)

**Current release on npm:** **6.12.1** (eighteen fixed-group public packages). Persisted schema **1.0**. See [CHANGELOG.md](CHANGELOG.md#6121).

**6.12.0** was the consolidation LC; **6.12.1** was presentation. Active work is the **canonical stability and evidence** program: logical TraceFacts foundation, semantic parity, then Evidence-first CI — not calendar wait. Prior eight-week adoption checkpoint is **superseded** (not completed). No new public package before the conditional v7 decision.

| Release | Theme | Status |
| ------- | ----- | ------ |
| **6.7.4**–**6.12.1** | Prior Stability and Focus program | Published |
| **6.12.2** | Real-pilot semantic blocker patch | **Active** |
| **6.12.3** | Cross-surface semantic parity | Planned |
| **6.13.0** | TraceFacts + TraceContract stabilization | Planned |
| **6.13.1** | Reserved corrective patch | Conditional |
| **6.14.0** | Evidence-first CI / no-egress LC | Planned |
| **6.14.x** | Stability and adoption | Planned |
| **v7** | Conditional decision only | Not scheduled |

Train state: [docs/implementation/RELEASE-TRAIN-STATE.md](docs/implementation/RELEASE-TRAIN-STATE.md).
Canonical maintainer roadmap: [docs/implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.12.1-TO-V7.md](docs/implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.12.1-TO-V7.md).

External validation gates remain mandatory where the roadmap requires them — results are never fabricated.

---

## Later — conditional v7

v7 remains gated on retained adoption evidence after the **v6.14.x** stability period and an explicit maintainer readiness assessment. See [docs/implementation/release-trains/V7.0.0-READINESS-ASSESSMENT.md](docs/implementation/release-trains/V7.0.0-READINESS-ASSESSMENT.md).

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
