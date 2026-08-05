# Roadmap

AgentInspect is the **local evidence debugger and trajectory-test toolkit** for TypeScript AI agents: capture a framework-faithful execution tree, evaluate it with TraceFacts and TraceContract, produce share-checked Evidence v2, and optionally inspect the same local facts over read-only MCP—without a collector, account, or default upload.

**Product loop:** faithful local capture → TraceFacts → deterministic trajectory checks → share-checked portable evidence → local read-only coding-agent access.

This public roadmap describes direction — not a delivery guarantee. See [docs/LIMITATIONS.md](docs/LIMITATIONS.md), [docs/KNOWN-ISSUES.md](docs/KNOWN-ISSUES.md), and [docs/SUPPORT-LEVELS.md](docs/SUPPORT-LEVELS.md).

**Principles:** CLI-first · TypeScript-first · dependency-light · safe-by-default · framework-aware but not framework-locked · no vendor upload by default · no maintainer-hosted SaaS dashboard · depth before breadth.

---

## Current — 6.14.x active maintenance

**Current release on npm:** **6.14.1** (eighteen fixed-group public packages). Persisted schema **1.0**. Node.js **≥ 20**. **MIT**. Actively maintained.

The 6.14 line is actively maintained for correctness, compatibility, documentation, security, and framework evolution. Public positioning / discoverability patch work Published patch **6.14.1**.

| Release | Theme | Status |
| ------- | ----- | ------ |
| **6.7.4**–**6.12.1** | Prior Stability and Focus program | Published |
| **6.12.2** | Logical lifecycle projection for checks | Published |
| **6.12.3** / **6.13.0** | TraceFacts, semantic parity, experimental matchers | Published |
| **6.14.0** | Evidence-first CI / no-egress LC surfaces | Published |
| **6.14.x** | Active maintenance + documentation truth | Active |
| **v7** | Conditional major — assessment only | Not a public marketing focus |

Train state: [docs/implementation/RELEASE-TRAIN-STATE.md](docs/implementation/RELEASE-TRAIN-STATE.md).
Canonical maintainer roadmap: [docs/implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.12.1-TO-V7.md](docs/implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.12.1-TO-V7.md).

Adoption measurement continues internally and is never fabricated on public surfaces.

---

## Later — conditional major

Any future major remains gated on retained real-world evidence and an explicit maintainer readiness assessment. See [docs/implementation/release-trains/V7.0.0-READINESS-ASSESSMENT.md](docs/implementation/release-trains/V7.0.0-READINESS-ASSESSMENT.md).

Candidate themes (not committed): package-tier rationalization only if justified, deeper standards interop, and continued evidence-loop depth — never breadth for its own sake.

---

## Feedback

Issues and discussions welcome. Redact traces before posting.
