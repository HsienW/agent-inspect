# Implementation docs index

Maintainer-facing docs. **Public adoption docs:** [../README.md](../README.md).

## Active — Stability and Focus (v6.7.3 → v6.12 → conditional v7)

| File | Purpose |
| ---- | ------- |
| [RELEASE-TRAIN-STATE.md](./RELEASE-TRAIN-STATE.md) | Current train status (`v6.7.4-real-integration-blockers`) |
| [CURRENT-TASK.md](./CURRENT-TASK.md) | Active assignment |
| [AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md](./AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md) | **Canonical** product/implementation roadmap |
| [reviews/V6.7.3-STABILITY-AND-FOCUS-BASELINE-AUDIT.md](./reviews/V6.7.3-STABILITY-AND-FOCUS-BASELINE-AUDIT.md) | Source-backed classification of roadmap findings |
| [release-trains/](./release-trains/) | Execution plans + readiness (V6.7.4→V6.12, repair policies, adoption checkpoint, V7 assessment) |
| [CODEX-MAINTAINER-GUIDE.md](./CODEX-MAINTAINER-GUIDE.md) | Agent operating model |

**Published line:** `6.7.3` (eighteen fixed-group packages). Schema **1.0** unchanged. Active development continues through **v6.12**; **v7 not scheduled**.

Named autonomous train: `agentinspect-stability-and-focus-v6.7.3-to-v7-decision`.

## Historical (prior freeze / completed trains)

| File | Purpose |
| ---- | ------- |
| [ROADMAP-V6.4-TO-PRE-V7.md](./ROADMAP-V6.4-TO-PRE-V7.md) | Completed pre-v7 stabilization roadmap (no longer active precedence) |
| [PRE-V7-ADOPTION-EVIDENCE.md](./PRE-V7-ADOPTION-EVIDENCE.md) | External pilot evidence log (do not fabricate) |
| [ROADMAP_V3_5_TO_V7.md](./ROADMAP_V3_5_TO_V7.md) | Completed v3.5→v6.4 trains + long-horizon notes |
| [POST-V3.5-ADOPTION-PLAN.md](./POST-V3.5-ADOPTION-PLAN.md) | Earlier adoption outreach plan |
| [reviews/V6.7.0-PRE-V7-RECONCILIATION-AUDIT.md](./reviews/V6.7.0-PRE-V7-RECONCILIATION-AUDIT.md) | Pre-v7 completion-depth audit |

## Archive

- [ARCHIVE-INDEX.md](./ARCHIVE-INDEX.md)
- [../archive/README.md](../archive/README.md) — historical public + maintainer docs
- [../archive/implementation/](../archive/implementation/) — release trains, roadmaps, agent prompts

## Source-of-truth order

Git state → `AGENTS.md` → state/task files → [Stability and Focus roadmap](./AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md) → active execution plan → RFCs → public `docs/` → historical/archive.
