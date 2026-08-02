# Package maintenance audit (v6.12)

**Status:** COMPLETE for classification recommendation · **no deprecations in 6.12**  
**Authority:** roadmap §13 Scope F · [POSITIONING-AND-PORTFOLIO.md](./POSITIONING-AND-PORTFOLIO.md) · [SUPPORT-LEVELS.md](./SUPPORT-LEVELS.md)  
**Date:** 2026-08-02 · baseline published line `6.11.0`

## Method (honest limits)

This audit uses **in-repo** signals only: support levels, docs/starters references, CI/pack smoke coverage, and fixed-group release cost. It does **not** claim npm download leadership or private customer counts. Public dependents / issue volume should be refreshed before any v7 deprecation.

## Classification

| Package | Class | Notes |
|---------|-------|-------|
| `agent-inspect` | **flagship** | Schema, CLI, evidence, checks |
| `@agent-inspect/redact` | **flagship** | Share path dependency |
| `@agent-inspect/mcp-server` | **flagship** (Preview maturity) | Coding-agent loop; still Preview in SUPPORT-LEVELS |
| `@agent-inspect/langchain` | **supported** | Flagship adapter path |
| `@agent-inspect/ai-sdk` | **supported** | Official adapter |
| `@agent-inspect/openai-agents` | **supported** | Official adapter |
| `@agent-inspect/vitest` | **supported** | CI reporter |
| `@agent-inspect/jest` | **supported** | CI reporter |
| `@agent-inspect/harness` | **supported** | Fixture runner |
| `@agent-inspect/mcp` | **maintenance** | Client tracing helper; keep linked |
| `@agent-inspect/eval` | **maintenance** | Local heuristics; not PM eval hosting |
| `@agent-inspect/guardrails` | **maintenance** | Deterministic rules |
| `@agent-inspect/circuit` | **maintenance** | Loop/retry analyzers |
| `@agent-inspect/tui` | **maintenance** | Optional terminal UI |
| `@agent-inspect/viewer` | **preview** | Localhost viewer Beta/Preview posture |
| `@agent-inspect/studio` | **preview** | Customer-owned Studio Beta |
| `@agent-inspect/index-sqlite` | **preview** | Native optional index Beta |
| `@agent-inspect/adapter-sdk` | **preview** | Third-party adapters Beta |

No package is **candidate for future deprecation** solely from this audit. Candidates require dependents search + partner use + migration path (v7 gate).

## Fixed-group recommendation

**Keep the eighteen-package fixed group through v6.**

| Factor | Assessment |
|--------|------------|
| Maintenance cost | Acceptable vs. compatibility clarity |
| Version noise | Real, but mitigated by Changesets fixed group |
| Optional download interpretation | Document tiers so optional ≠ equal product |
| Compatibility / provenance | Strong benefit for consumers |
| Upgrade clarity | One version line |

Smaller linked groups or decoupling remain **conditional v7** with migration + CI proof.

## Actions in 6.12

- Present Tier A/B/C publicly (done in positioning + README)
- Do **not** remove or un-link packages
- Refresh this audit during [V6.12-ADOPTION-CHECKPOINT.md](./implementation/release-trains/V6.12-ADOPTION-CHECKPOINT.md)
