# Launch demo and artifacts (v6.12)

**Status:** PARTIAL for recorded video assets · **COMPLETE** for scripted reproducible demo path  
**Authority:** roadmap §13 Scope H · [DEMO-SCRIPT.md](./DEMO-SCRIPT.md) · [SCREENSHOTS.md](./SCREENSHOTS.md)

## Narrative (must stay real / fixture-based)

```text
LangGraph-shaped or broken-agent run fails
→ local tree / causal failure
→ coding agent reads via MCP (optional)
→ contract / check identifies wrong tool path
→ fixed rerun passes
→ share-checked HTML evidence attached to PR
```

## Reproducible path (no API keys)

Primary starter: [examples/starters/broken-agent-debugging](../examples/starters/broken-agent-debugging/)  
MCP companion: [examples/starters/coding-agent-debug-loop](../examples/starters/coding-agent-debug-loop/)

```bash
cd examples/starters/broken-agent-debugging
pnpm install && pnpm start
npx agent-inspect list --dir .agent-inspect
npx agent-inspect report <run-id> --dir .agent-inspect
npx agent-inspect check <run-id> --dir .agent-inspect
npx agent-inspect bundle <run-id> --dir .agent-inspect --profile share --format html
npx agent-inspect verify-safe <run-id> --dir .agent-inspect
```

Optional MCP beat: configure client dry-run, then `npx @agent-inspect/mcp-server --dir .agent-inspect`.

Live talk track: [DEMO-SCRIPT.md](./DEMO-SCRIPT.md) (~3 minutes).

## Artifact checklist

| Asset | Status |
|-------|--------|
| 90-second video | **NOT PRODUCED** in-repo (record externally; link when available) |
| Three-minute technical demo | **SCRIPT READY** ([DEMO-SCRIPT.md](./DEMO-SCRIPT.md)) |
| Screenshots / terminal GIFs | **AVAILABLE** ([SCREENSHOTS.md](./SCREENSHOTS.md), `docs/assets/demos/`) |
| Architecture diagram | **AVAILABLE** (product-loop SVG + docs diagrams) |
| Privacy diagram / network doc | **AVAILABLE** ([NETWORK-BEHAVIOR.md](./NETWORK-BEHAVIOR.md)) |
| Case study | **TEMPLATE** ([CASE-STUDY-TEMPLATE.md](./CASE-STUDY-TEMPLATE.md)) — no fabricated partner case |
| Migration/upgrade guide | **AVAILABLE** ([MIGRATION.md](./MIGRATION.md)) |
| Design-partner guide | **AVAILABLE** ([DESIGN-PARTNER-GUIDE.md](./DESIGN-PARTNER-GUIDE.md) · [PRE-V7-PILOT-KIT.md](./PRE-V7-PILOT-KIT.md)) |

Do not invent video URLs or case-study metrics.
