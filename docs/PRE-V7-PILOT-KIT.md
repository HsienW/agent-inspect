# Pre-v7 Pilot Kit

**Purpose:** External design-partner and three-team pilot evidence for the **6.12.0** stable launch candidate during the v6.12 adoption checkpoint.
**Do not fabricate results.** Record only real partner outcomes in [implementation/PRE-V7-ADOPTION-EVIDENCE.md](implementation/PRE-V7-ADOPTION-EVIDENCE.md).
**Do not invent partner names, emails, or acceptance rows.** Outreach templates (placeholders only) live in [implementation/ADOPTION-OUTREACH-CHECKLIST.md](implementation/ADOPTION-OUTREACH-CHECKLIST.md) — do not send outreach from this kit automatically.

## What is shipping for partners

| Item | Version / path |
|------|----------------|
| npm | `agent-inspect@6.12.0` (and fixed-group packages) |
| Quickstart | `npx agent-inspect init --yes` → demo → `list` → `verify-safe` |
| Packed E2E (maintainers) | `pnpm run pack:smoke` |
| Demo script | [DEMO-SCRIPT.md](DEMO-SCRIPT.md) |
| Design partner guide | [DESIGN-PARTNER-GUIDE.md](DESIGN-PARTNER-GUIDE.md) |
| Broken-agent starter | `examples/starters/broken-agent-debugging` |
| Coding-agent MCP loop | `examples/starters/coding-agent-debug-loop` · [CODING-AGENT-LOOP.md](CODING-AGENT-LOOP.md) |
| Evidence v2 | `agent-inspect bundle` / `bundle verify` · [EVIDENCE-FORMAT.md](EVIDENCE-FORMAT.md) |
| MCP configure | `npx agent-inspect mcp configure --client cursor` (also claude-code, codex, gemini) |
| CI artifacts | `agent-inspect check` / `artifacts` · `examples/starters/ci-eval-redact` |
| Studio (Beta) | `@agent-inspect/studio` — customer-owned, local |

## Partner trial checklist (copy per team)

1. Install `agent-inspect@6.12.0` on Node ≥ 20.
2. Complete five-minute quickstart (init → one run → verify-safe).
3. Run at least one framework path (AI SDK, OpenAI Agents, or LangChain) **or** observe/manual path.
4. **Evidence path:** create a share-checked bundle and verify integrity:
   ```bash
   npx agent-inspect bundle <run-id> --dir .agent-inspect --format html -o ./evidence-out
   npx agent-inspect bundle verify ./evidence-out
   ```
5. **MCP path (optional but preferred for §19 MCP indicator):** configure a client (dry-run first), then run the coding-agent debug loop starter:
   ```bash
   npx agent-inspect mcp configure --client cursor
   cd examples/starters/coding-agent-debug-loop && pnpm install && pnpm start && pnpm run inspect-mcp
   ```
6. **CI path (optional):** retain `check` / `artifacts` (or `ci-eval-redact` starter) on a PR.
7. Optionally run Studio against a local workspace.
8. Return dated findings: blockers, what worked, whether they will keep using it.

## Blessed demo flows (6.12.0)

| Flow | Starter / commands | Shows |
|------|-------------------|--------|
| Broken → inspect → share | `broken-agent-debugging` + [DEMO-SCRIPT.md](DEMO-SCRIPT.md) | Tree, check, redact, verify-safe |
| Evidence v2 | `bundle` → `bundle verify` | Share-checked offline evidence |
| MCP coding-agent loop | `coding-agent-debug-loop` + `mcp configure` | Read-only inspect → fix → re-inspect → evidence |
| CI retention | `ci-eval-redact` or `check`/`artifacts` in CI | Contract/gate on a PR |

## Evidence required for a strong v7 go input

From the adoption checkpoint / canonical roadmap §19:

- 3–5 design partners with dated findings
- 2–3 retained CI/evidence workflows (external)
- 2 repeated MCP debug loops (external)
- 1 public external integration / case study
- Organic usage that persists beyond release spikes

Empty / `_pending_` ledger rows mean “not yet evidenced,” not product failure.

## Maintainer stop condition

While the adoption checkpoint is active and external rows remain pending:

```text
trainStatus: in-progress (v6.12-adoption-checkpoint)
```

Do **not** schedule or implement v7 until adoption gates in [implementation/release-trains/V7.0.0-READINESS-ASSESSMENT.md](implementation/release-trains/V7.0.0-READINESS-ASSESSMENT.md) are met and a maintainer explicitly authorizes a v7 train.
