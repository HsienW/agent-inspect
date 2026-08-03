# Design partner guide

Thank you for trying AgentInspect early. This doc is the **evaluation contract** — what we ask you to try, what we measure, and what we won't do.

**Website:** [https://agentinspect.vercel.app/](https://agentinspect.vercel.app/) · **Docs:** [https://agentinspect.vercel.app/docs/](https://agentinspect.vercel.app/docs/)
**Baseline:** `agent-inspect@6.12.0` (stable launch candidate; adoption checkpoint in progress)

## What we're validating

1. **First trace < 30 minutes** from `npm install` (with `init` + a starter)
2. **First CI check** on a real or fixture trace
3. **Share-checked evidence** — `bundle` / `verify-safe` artifact attached to an issue or PR (not a compliance certification)
4. **MCP coding-agent loop** (optional) — read-only inspect → fix → re-inspect with `@agent-inspect/mcp-server`
5. **Framework fit** — AI SDK, OpenAI Agents, or LangChain path feels native enough

## Your path

| Week | Task | Success signal |
| ---- | ---- | -------------- |
| 1 | Run `init` + one starter | `list` shows a run |
| 1 | `doctor` clean | No failed checks |
| 2 | Wire adapter or `observe()` in your app | Real trace captured |
| 2 | `check` or `artifacts` in CI | Job fails on bad fixture |
| 3 | `bundle` + `bundle verify` (or `redact --profile share` + `verify-safe`) | Comfortable posting evidence externally |
| 3–4 | Optional: `mcp configure` + [coding-agent-debug-loop](../examples/starters/coding-agent-debug-loop/) | Repeated local MCP debug loop |
| 4 | Feedback session | Case study draft or structured notes |

## What we provide

- Starters: [examples/starters/](../examples/starters/README.md) (incl. `broken-agent-debugging`, `coding-agent-debug-loop`, `ci-eval-redact`)
- Evidence format: [EVIDENCE-FORMAT.md](./EVIDENCE-FORMAT.md)
- MCP loop: [CODING-AGENT-LOOP.md](./CODING-AGENT-LOOP.md)
- Office hours async via GitHub Discussions / Issues
- [DEMO-SCRIPT.md](./DEMO-SCRIPT.md) for internal team demos
- Pilot kit overview: [PRE-V7-PILOT-KIT.md](./PRE-V7-PILOT-KIT.md)

## What we ask from you

- **Structured feedback** (template below) — not vague "looks good"
- **Share-checked / redacted artifacts only** — never raw secrets
- Permission to quote anonymously unless you approve public case study

## Feedback template

```markdown
### Environment
- Node version:
- Framework:
- AgentInspect version: (please use 6.12.0)

### First trace
- Time to first trace:
- Blockers:

### CI / evidence
- check / artifacts / bundle used?
- Rules or gates that mattered:
- Attached share-checked evidence? (yes/no)

### MCP (if tried)
- Client (Cursor / Claude Code / Codex / Gemini / other):
- Repeated debug loop? (yes/no):
- Blockers:

### Gaps
- Missing docs:
- Missing framework coverage:
- Would not adopt because:
```

## Metrics (no hidden telemetry)

We track adoption from **public signals** and **your reports** only. See [product/ADOPTION-METRICS.md](./product/ADOPTION-METRICS.md).

## Out of scope for partners

- Hosted dashboards or SaaS
- Custom adapter development on our roadmap without demand gates
- SLAs — this is open-source MIT software
- Treating `verify-safe` / evidence assessment as a compliance certification

## Contact

Open a GitHub issue with label `design-partner` or email the maintainer listed in the repo.
