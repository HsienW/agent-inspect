# Website P04 preview review checklist

Baseline: `agent-inspect@6.31.0` · no npm bump for this change set.

## Local validation already run

- [x] `pnpm website:typecheck`
- [x] `pnpm website:build` (static export)
- [x] `pnpm website:crawl` (3163 local href/src refs OK)
- [x] `node --test scripts/website-docs-resolve.test.mjs`

## Preview checks (maintainer / Vercel)

1. Open `/docs/getting-started/` — five-minute path from `FIRST-TRACE-IN-5-MINUTES.md`.
2. Confirm commands use `--preset trajectory`, `bundle --out ./evidence`, `bundle verify ./evidence`.
3. Open `/docs/getting-started/guide/` — full `GETTING-STARTED.md`.
4. From Trace Contracts TOC, click formerly broken anchors (punctuation headings such as `npm / pnpm` → `#npm--pnpm`).
5. Follow a relative `.md` link that should land on a docs route; follow a repo-only doc → GitHub blob.
6. Fetch `/docs/getting-started.md` and `/docs/getting-started/guide.md` — Markdown bodies match the HTML sources (not Flight `index.txt`).
7. Homepage hero: version/license readable as text chips with images blocked / CSP unchanged.
8. Light + dark + narrow viewport smoke: home → five-minute path → Trace Contracts → back/forward → deep-link refresh.
9. Do **not** merge PR #372 Lucide/Next majors as part of this hotfix.

## After approve

- Deploy website only (no Changesets / Trusted Publish).
- Then authorize **6.31.1** for P01–P03.
