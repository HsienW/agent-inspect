# Active execution plan — v6.17.6 security containment

**Train:** `v6.17.6-security-containment`
**Named:** `agentinspect-feedback-integrity-v6.17.5-to-v6.22`
**Target:** patch `6.17.6` (implementation; publication is a later gate)
**Baseline:** published `6.17.5`
**Authority:** [../ROADMAP.md](../ROADMAP.md) · security master prompt / canonical hardening roadmap (attached)

## Scope

1. Fresh advisory + Studio defect audit (this chunk)
2. Issue #211 published API surface lock
3. Direct dependency remediation (nanoid / Vitest / Vite line)
4. Website + example dependency remediation (Next.js ≥15.5.21, etc.)
5. Shared Studio ingest limits
6. Bundle-upload containment (enforce maxBytes, symlink reject, atomic staging)
7. File-drop symlink/size hardening
8. Streamed GitHub artifact downloads
9. Atomic ingest cleanup
10. Issue #225 no-egress default-workflow harness
11. Evidence v2 docs truth (signing / `sourceHashes` / `createdAt`)
12. Free-text redaction residual coverage
13. Validation gate

## Explicit non-goals

- `requiredOrderMode` / #308/#315 (later minor; REQUEST CHANGES on `"first"` naming)
- Preview capture / #311 (6.18)
- `alternatives.anyOf` / #309 (6.20)
- Detached attestation / skill-refinement handoffs (conditional 6.22)
- Duplicating contributor PRs (#294–#307, #314, #142)
- Version bump / Changeset / publish until release-readiness gate

## Chunks

| Chunk | Status |
| --- | --- |
| `6.17.6-0-audit` | done |
| `6.17.6-1-api-surface` | done |
| `6.17.6-2-direct-deps` | done |
| `6.17.6-3-website-example-deps` | done |
| `6.17.6-4-studio-limits` | done |
| `6.17.6-5-bundle-upload` | pending |
| `6.17.6-6-file-drop` | pending |
| `6.17.6-7-github-stream` | pending |
| `6.17.6-8-ingest-cleanup` | pending |
| `6.17.6-9-no-egress` | pending |
| `6.17.6-10-evidence-docs` | pending |
| `6.17.6-11-redact-residual` | pending |
| `6.17.6-12-validation` | pending |

## 6.17.6-0 audit summary (2026-09-02)

### Provenance

- `agent-inspect@6.17.5` has npm SLSA provenance attestations (`dist.attestations`).

### First-party Studio defects (confirmed still open)

| Defect | Surface | Reachability | Planned chunk |
| --- | --- | --- | --- |
| `ingest.bundleUpload.maxBytes` parsed, not enforced | Studio bundle import | Local Studio / CLI import of untrusted trees | 6.17.6-5 |
| File-drop uses `stat` (follows symlinks); no size limit; full `readFile` | Studio file-drop | Local drop directories | 6.17.6-6 |
| GitHub artifact via `response.arrayBuffer()` full buffer | Studio GitHub ingest | Explicit networked Studio path | 6.17.6-7 |
| Writes to final dest without atomic staging/cleanup | Bundle / drop / GitHub / HTTP | Partial trees on failure | 6.17.6-5/6/8 |

Key paths: `packages/studio/src/registry.ts`, `ingest/bundle-upload.ts`, `ingest/file-drop.ts`, `ingest/github-artifact.ts`, `ingest/http.ts` (HTTP already streams + bounds).

### Dependency advisories (workspace audit; counts ≠ unique vulns)

| Advisory / package | Current | Surface | Prod/dev | Direct/transitive | Patched threshold | Planned remediation |
| --- | --- | --- | --- | --- | --- | --- |
| vitest GHSA-5xrq-8626-4rwp (critical UI RCE) | 2.1.9 | root + `@agent-inspect/vitest` | dev / peer | direct | ≥3.2.6 | 6.17.6-2 Vitest major bump; keep Node test env; no UI/browser mode |
| vite GHSA-fx2h-pf6j-xcff | 5.4.21 via vitest | test tooling | dev | transitive | ≥6.4.3 via Vitest 3 line | Parent Vitest upgrade |
| nanoid 5.x | installed 5.1.11; range `^5.0.9` | root runtime | prod | direct | ≥5.1.16 | Pin/raise range in 6.17.6-2 |
| nanoid 3.x via postcss | 3.3.12 | vite/postcss | dev | transitive | ≥3.3.16 | Prefer parent upgrade; override only if needed + expire |
| brace-expansion 1.x/2.x | various | jest/vitest globs | dev | transitive | ≥1.1.18 / ≥2.1.4 | Prefer parent; override if still open after Vitest/Jest parents |
| js-yaml 3.x/4.x | via changesets | release tooling | dev | transitive | ≥3.15.1 / ≥4.3.1 | Parent `@changesets/*` when available; else justified override |
| ws via ink | 8.20.0 | `@agent-inspect/tui` | prod optional path | transitive | ≥8.21.0 | Parent `ink` upgrade or override |
| next | 15.5.20 | `apps/website` | private website | direct | ≥15.5.21 | 6.17.6-3 |
| sharp via next | 0.34.5 | website | private | transitive | ≥0.35.0 when compatible | 6.17.6-3 with Next |
| postcss via next | 8.4.31 | website | private | transitive | ≥8.5.12 | 6.17.6-3 |
| fast-uri / ip-address | example openai-agents recipe | examples | example-only | transitive | ≥3.1.5 / ≥10.3.1 | 6.17.6-3 examples only |

### Issue ownership (no duplication)

- **#211** maintainer — API surface snapshot (partial today) → 6.17.6-1
- **#225** maintainer — no-egress harness → 6.17.6-9
- Contributor PRs (#294–#307, #314, #315, #142) — review only; do not absorb

### Evidence docs gaps (João)

- `docs/EVIDENCE-FORMAT.md` still implies optional signature shape validation and understates `sourceHashes` / `createdAt` limits → 6.17.6-10

## Stop rule

No Changeset / version bump / publish until `6.17.6-12-validation` and a separate release-readiness authorization.
