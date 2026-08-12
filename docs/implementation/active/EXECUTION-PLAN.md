# Active execution plan — v6.17.0 Evidence UX

**Train:** `v6.17.0-evidence-ux`
**Named:** `agentinspect-repository-health-evidence-ux-v6.16-to-pre-v7`
**Target:** minor `6.17.0`
**Baseline:** published `6.16.2`
**Authority:** [../ROADMAP.md](../ROADMAP.md) §9

## Goal

Additive CLI presets and local Evidence-on-failure workflow without changing default check semantics.

## Scope landed

- `--preset trajectory|safety|comprehensive` on `check`
- `--evidence-on|dir|profile|format` on `check` and `gate`
- `bundle open` (verify then local browser open)
- Vitest reporter `evidenceOn` retention mode
- `init --ci github` trajectory + Evidence scaffold
- CLI / CI docs

## Forbidden

New package; schema break; default upload; silent default check change; fabricating partners.
