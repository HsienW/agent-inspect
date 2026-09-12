# Dependabot triage (post-6.25 gate)

Refresh PR state before acting. Do not merge grouped majors that raise the root Node floor or combine unrelated toolchain migrations.

| PR | Title theme | Decision |
| --- | --- | --- |
| **#367** | `actions/setup-node` → 7 | Rebase on `main`; verify full commit SHA pin; CI + publish OIDC; merge only if green |
| **#369** | `pnpm/action-setup` → 6 | Rebase/test independently; keep pnpm **9.15.x** pin; do not migrate to pnpm 11+ setup without a separate package-manager plan |
| **#370** | `actions/upload-artifact` → 7 | Rebase; verify artifact names/paths and runner compatibility |
| **#371** | `dependency-review-action` → 5 | Rebase; verify severity/license config and full-SHA pin |
| **#368** | `changesets/action` → 2 | **Defer** — requires dedicated Changesets CLI 3 + workflow input migration |
| **#372** | production-deps group (13) | **Close or split** — includes `nanoid@6`, AI SDK 7, chalk 6 (Node 22), React 19, Next 16, commander 15. Allow only independently tested upgrades. For 6.25.1 allow **nanoid 5.x** only (already current) |
| **#373** | development-deps group (13) | **Close or split** — do not combine TypeScript 7, Vitest 5, Changesets 3, size-limit 13, Tailwind 4, `@types/node` 26 |

## Maintainer actions (manual)

```text
Close #372 with comment: split required; Node 20 floor preserved
Close #373 with comment: split required; dedicated toolchain migrations only
Comment on #368: deferred pending Changesets 3 migration plan
Rebase #367 #369 #370 #371 individually after main advances
```

Cursor does not close these PRs without explicit authorization in the current gate.
