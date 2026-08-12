# Cross-platform packed consumer matrix (v6.12)

**Status:** PARTIAL — evidence from maintainer CI + local smoke scripts; not a full OS×Node grid.  
**Authority:** [implementation/ROADMAP.md](./implementation/ROADMAP.md) · [history/RELEASE-HISTORY.md](./history/RELEASE-HISTORY.md)
**Date:** 2026-08-02 · baseline `agent-inspect@6.12.0`

## Method

| Source | What it proves |
|--------|----------------|
| GitHub Actions `CI` / `Publish` on `ubuntu-latest` + Node **22** | typecheck, unit, size, release-train gates |
| `pnpm pack:smoke` (`scripts/package-smoke.mjs` + `packed-quickstart-e2e.mjs`) | packed tarball install, ESM/CJS/TS for core + optional packages, quickstart CLI path |
| `pnpm compat:smoke` (`scripts/compat-smoke.mjs`) | ESM/CJS consumer fixtures, Jest-style CJS, `ts-jest` **Node16**, CLI bin help |

Do **not** infer untested cells as supported.

## Matrix

| Dimension | Claimed target | Evidence | Result |
|-----------|----------------|----------|--------|
| Node 20 | engines `>=20` | engines field; not separately matrixed in CI | **DECLARED** / CI not multi-version |
| Node 22 | CI primary | GHA typecheck/unit/publish | **PASS** |
| Node 24 / 26 | Desired | Not in GHA matrix | **UNTESTED** |
| ESM | Supported | pack + compat smoke | **PASS** (CI Linux) |
| CJS | Supported | pack + compat smoke | **PASS** (CI Linux) |
| TypeScript Node16 / NodeNext | Supported | compat `ts-jest-node16`; docs recommend NodeNext/Node16 | **PASS** (fixture) |
| npm consumer | Supported | pack/compat install via npm tarball | **PASS** |
| pnpm consumer | Supported | monorepo + docs guide; CI uses pnpm | **PASS** (repo) / clean consumer **DOCUMENTED** |
| Linux | Supported | GHA ubuntu | **PASS** |
| macOS | Supported intent | Maintainer local Darwin; not GHA matrix | **PARTIAL** |
| Windows | Supported intent | quickstart script has `win32` shell handling; not GHA matrix | **UNTESTED** in CI |
| Jest 29 / 30 | Reporters packed | pack smoke Jest reporter import | **PARTIAL** (import smoke, not full Jest version matrix) |
| Vitest | Reporters packed | pack smoke Vitest reporter import | **PARTIAL** |

## Retention

Keep this document updated when CI adds OS/Node matrix jobs. Untested cells stay **UNTESTED**, never greenwashed.
