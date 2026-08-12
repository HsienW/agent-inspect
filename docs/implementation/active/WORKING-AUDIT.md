# Working audit — 6.16.1 repository disposition

**Chunk:** `6.16.1-0`  
**Date:** 2026-08-12  
**HEAD at audit:** `7a169d4`

## Size baselines

| Metric | Value |
|--------|-------|
| Worktree (incl. node_modules / build) | ~1.4G |
| `apps/` | ~126M (mostly `node_modules` / `.next`) |
| `packages/` | ~23M |
| `.git` | ~21M (count-objects pack ~5.33 MiB + loose) |
| `docs/` | ~4.4M |
| `examples/` | ~1.5M |
| `.github/` | ~200K |
| `scripts/` | ~204K |
| Tracked `.DS_Store` | yes (root) |

```text
git count-objects -vH
  count: 2831
  size: 12.34 MiB
  in-pack: 11922
  packs: 5
  size-pack: 5.33 MiB
```

**Interpretation:** Current-tree docs/archive/plans are the search/context burden. `.git` (~21M) is modest; history rewrite is **not** required after cleanup. Re-measure after deletions in `6.16.1-13`.

### Largest tracked files (bytes)

| Bytes | Path |
|------:|------|
| 265482 | `pnpm-lock.yaml` |
| 171966 | `fixtures/performance/perf-large.jsonl` |
| 166151–57k | `docs/assets/demos/*.gif` (many) |
| 90870 | `packages/core/src/checks/index.ts` |
| 60k / 54k / 42k / 39k / 32k | superseded roadmaps (delete candidates) |

## Counts

| Category | Files |
|----------|------:|
| `docs/archive/**` | 147 |
| `.github/ISSUE_DRAFTS/**` | 23 |
| `docs/implementation/release-trains/**` | 96 |
| `docs/proposals/**` | 41 |
| `docs/implementation/*.md` (top-level) | 17 |

## Disposition — `docs/implementation/` top-level

| Path | Disposition |
|------|-------------|
| `ROADMAP.md` | **KEEP** — permanent canonical |
| `CURRENT-TASK.md` | **KEEP** |
| `RELEASE-TRAIN-STATE.md` | **KEEP** |
| `README.md` | **KEEP** |
| `active/**` | **KEEP** |
| `AGENTINSPECT-CANONICAL-ROADMAP-V6.12.1-TO-V7.md` | **DELETE** after ROADMAP-HISTORY note |
| `AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md` | **DELETE** after ROADMAP-HISTORY note |
| `AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md` | **DELETE** after ROADMAP-HISTORY note |
| `ROADMAP-V6.4-TO-PRE-V7.md` | **DELETE** after ROADMAP-HISTORY note |
| `ROADMAP_V3_5_TO_V7.md` | **DELETE** after ROADMAP-HISTORY note |
| `ARCHIVE-INDEX.md` | **DELETE** with archive |
| `AGENT-HANDOFF-PROMPT.md` | **DELETE** after AGENTS consolidation |
| `CODEX-MAINTAINER-GUIDE.md` | **DELETE** after AGENTS consolidation |
| `CODEX-LOCAL-ENVIRONMENT.md` | **DELETE** after AGENTS consolidation |
| `ADOPTION-OUTREACH-CHECKLIST.md` | **DELETE** (Git history) |
| `POST-V3.5-ADOPTION-PLAN.md` | **DELETE** after history note |
| `PRE-V7-ADOPTION-EVIDENCE.md` | Compact into `docs/history/PILOT-HISTORY.md` then **DELETE** |
| `VISUAL-DEMO-AUDIT.md` | **DELETE** or fold into 6.17.1 later; delete now if superseded |

## Disposition — `docs/implementation/release-trains/`

| Path | Disposition |
|------|-------------|
| Entire directory (96 files, V3.5→V6.16) | Summarize in `docs/history/RELEASE-HISTORY.md` then **DELETE** entire tree |
| `reviews/` under implementation | Summarize key audits into history/ADR then **DELETE** completed reviews |

## Disposition — `docs/archive/`

| Path | Disposition |
|------|-------------|
| Entire tree (147 files) | **DELETE** — Git history is the archive |

## Disposition — `.github/ISSUE_DRAFTS/`

| Path | Disposition |
|------|-------------|
| Entire tree (23 shipped/stale drafts) | **DELETE** |

## Disposition — OS / editor

| Path | Disposition |
|------|-------------|
| `.DS_Store` (tracked) | **DELETE** + ensure gitignore |
| Other editor metadata | Delete if tracked |

## Disposition — `docs/proposals/`

| Path | Disposition |
|------|-------------|
| Shipped design docs (AI SDK, CI reporters, Evidence, TraceFacts, MCP, Studio, etc.) | Extract ADR-0001…0008 (+ extras as needed) then **DELETE** originals |
| `README.md` proposals index | Replace with pointer to `docs/decisions/` |
| Still-open RFCs (if any true open) | Keep only if still actionable; otherwise history |

## Disposition — agent guidance elsewhere

| Path | Disposition |
|------|-------------|
| Duplicate Cursor/Codex prompts under docs/ | **DELETE** after consolidation into `AGENTS.md` / skills |
| `.cursor/skills` for this repo | **KEEP** / trim to non-duplicative |

## Expected deletion/merge counts (approx.)

| Batch | ~Files removed |
|-------|---------------:|
| release-trains + reviews | ~100+ |
| docs/archive | ~147 |
| ISSUE_DRAFTS | ~23 |
| version-named roadmaps + handoffs | ~12 |
| shipped proposals | ~35–40 |
| OS junk | ≥1 |
| examples/scripts/assets (later chunk) | TBD after audit |

**Expected current-tree docs reduction:** ~1–2MB+ of Markdown noise; primary win is contributor/AI context and search clarity, not `.git` pack size.

## Inbound-reference risk

High-inbound public URLs under `docs/*.md` (API, CLI, SCHEMA, TRACE-*, etc.) must **KEEP**.  
Internal links to `docs/archive/**`, `release-trains/**`, version-named roadmaps, and `ISSUE_DRAFTS` will be repaired in `6.16.1-12` after deletions. Prefer delete + fix over stubs unless a public URL needs a redirect.

## Unclassified historical operational files

None remaining after this table: every candidate category has a disposition.

## Next chunk

`6.16.1-1` — Correct public version/status/product truth (no soft-launch / “waiting for adoption” language).
