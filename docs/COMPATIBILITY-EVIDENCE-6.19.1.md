# Compatibility evidence note — 6.19.1 trust restoration

**Date:** 2026-09-11  
**Baseline:** `agent-inspect@6.19.0` on `origin/main` (`b1632ab`) plus this 6.19.1 patch branch  
**Authority:** [COMPATIBILITY-PACKED-MATRIX.md](./COMPATIBILITY-PACKED-MATRIX.md) · this note records only checks actually run for the patch

## What was run (this branch)

| Check | Command | Host | Result |
| ----- | ------- | ---- | ------ |
| Error-message credential redaction | `pnpm exec vitest run packages/core/test/error-message-credential-redaction.test.ts packages/core/test/security-redaction.test.ts` | Maintainer Darwin worktree | PASS |
| Fixed-group README governance (18) | `pnpm package-readmes:check` | Maintainer Darwin worktree | PASS (`18` fixed-group READMEs; unpublished `agent-inspect-vscode` skipped) |
| README coverage unit tests | `pnpm exec vitest run scripts/package-readme-coverage.test.mjs packages/core/test/docs/package-readme-support-rule.test.ts` | Maintainer Darwin worktree | PASS |
| Typecheck | `pnpm typecheck` | Maintainer Darwin worktree | PASS |
| Whitespace / conflict markers | `git diff --check` | Maintainer Darwin worktree | PASS |

## What this note does **not** claim

- No new full OS × Node packed-consumer grid was executed for this patch.
- No fabricated PASS cells for Node 26, Windows, or macOS beyond prior dated matrix rows in [COMPATIBILITY-PACKED-MATRIX.md](./COMPATIBILITY-PACKED-MATRIX.md).
- CI results for the opened PR are authoritative for merge; this note is local maintainer evidence only.

## Related prior evidence

Packed ESM/CJS / subpath smoke history remains in [COMPATIBILITY-PACKED-MATRIX.md](./COMPATIBILITY-PACKED-MATRIX.md) (last dated Windows + Node 24 row: 2026-08-26 against `6.17.3`). Refresh that matrix when a full `pnpm pack:smoke` / `pnpm compat:smoke` grid is re-run intentionally.
