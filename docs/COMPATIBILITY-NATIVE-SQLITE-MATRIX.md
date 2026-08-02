# Native SQLite (`@agent-inspect/index-sqlite`) matrix (v6.12)

**Status:** PARTIAL — packed optional smoke rebuilds `better-sqlite3`; full OS×Node native grid not CI-matrixed.  
**Authority:** roadmap §13 Scope D · package Beta per [SUPPORT-LEVELS.md](./SUPPORT-LEVELS.md)  
**Date:** 2026-08-02 · baseline `@agent-inspect/index-sqlite@6.11.0`

## Method

| Source | What it proves |
|--------|----------------|
| `scripts/package-smoke.mjs` optional `@agent-inspect/index-sqlite` check | Pack install + `rebuildNativeDeps: ["better-sqlite3"]` + buildIndex/query on temp traces |
| Package README | Documents Node `>=20`, local-only, JSONL remains source of truth |
| GHA Publish `pack:smoke` | Runs on `ubuntu-latest` Node 22 |

## Matrix

| Dimension | Result | Notes |
|-----------|--------|-------|
| Linux + Node 22 + npm pack | **PASS** (via publish/pack smoke) | Primary CI evidence |
| macOS native prebuild | **PARTIAL** | Maintainer Darwin expected; not GHA |
| Windows native prebuild | **UNTESTED** in CI | Do not claim |
| Node 20 / 24 / 26 native | **UNTESTED** as matrix | engines declare `>=20` only |
| Network / upload | **N/A — none** | Index is local derived cache |

## Claim language

Support statement for docs/website:

> Optional SQLite index is Beta. Cross-platform native install is only claimed where tested (currently CI Linux Node 22 packed smoke). Elsewhere treat as best-effort `better-sqlite3` prebuilds.
