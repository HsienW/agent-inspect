# Adoption outreach checklist (maintainer)

**Checkpoint:** [release-trains/V6.12-ADOPTION-CHECKPOINT.md](./release-trains/V6.12-ADOPTION-CHECKPOINT.md)  
**Baseline:** `agent-inspect@6.12.0`  
**Pilot kit:** [../PRE-V7-PILOT-KIT.md](../PRE-V7-PILOT-KIT.md)

## Hard rules

- **Do not fabricate responses.** Empty ledger rows stay `_pending_` until a real partner replies.
- **Do not invent partner names, emails, or acceptance rows.**
- **Do not send outreach from automation** in this repo — a human maintainer sends messages.
- Record outcomes only in [PRE-V7-ADOPTION-EVIDENCE.md](./PRE-V7-ADOPTION-EVIDENCE.md) after dated, real findings.

## Before outreach

- [ ] Confirm public npm baseline is **6.12.0** (`pnpm run public-truth:check`)
- [ ] Skim [../DESIGN-PARTNER-GUIDE.md](../DESIGN-PARTNER-GUIDE.md) and [../DEMO-SCRIPT.md](../DEMO-SCRIPT.md)
- [ ] Confirm starters build locally: `broken-agent-debugging`, `coding-agent-debug-loop`, `ci-eval-redact`
- [ ] Prepare links only (no fake quotes): website, npm, pilot kit, design partner guide
- [ ] Prefer partners who already use TypeScript AI agents / CI / MCP coding tools

## Outreach steps (human)

1. Identify a real contact (public email, GitHub, or prior relationship) — leave blank if unknown.
2. Personalize `{{partner}}` and `{{date}}` in a template below.
3. Send from the maintainer account; track “sent” privately (not as fabricated ledger success).
4. On reply: schedule demo or point them at the partner trial checklist in the pilot kit.
5. On completed trial: fill a **real** row in the adoption evidence ledger (date, version, workflow, blockers, sign-off).
6. If no reply: leave ledger `_pending_`; do not invent acceptance.

## Template A — cold intro (placeholders only)

```text
Subject: AgentInspect 6.12.0 design-partner trial (local traces, no SaaS)

Hi {{partner}},

I'm the maintainer of AgentInspect — a local-first execution-tree debugger for TypeScript AI agents.
We're in an eight-week adoption checkpoint after publishing 6.12.0 ({{date}} context).

Would you try a short evaluation?
- First trace via init + starter (no API keys for the broken-agent / MCP starters)
- Optional: share-checked evidence (`bundle` / `bundle verify`)
- Optional: MCP coding-agent loop (`mcp configure` + coding-agent-debug-loop starter)
- Optional: retain a CI check/artifacts gate on a PR

Guide: https://github.com/rajudandigam/agent-inspect/blob/main/docs/DESIGN-PARTNER-GUIDE.md
Pilot kit: https://github.com/rajudandigam/agent-inspect/blob/main/docs/PRE-V7-PILOT-KIT.md

No hosted dashboard, no default upload. Happy to do a ~15 minute walkthrough if useful.

Thanks,
{{maintainer_name}}
```

## Template B — follow-up (placeholders only)

```text
Subject: Re: AgentInspect design-partner trial

Hi {{partner}},

Following up from {{date}}. If timing is better later in the checkpoint window, no problem —
I'll leave evidence rows pending until you have real findings (we don't invent partner results).

Happy to answer questions on Evidence v2, MCP configure, or CI artifacts whenever you're ready.

{{maintainer_name}}
```

## Template C — thank-you / record ask (placeholders only)

```text
Subject: Thanks for trying AgentInspect {{date}}

Hi {{partner}},

Thanks for the session. When you can, a short structured note (env, time-to-first-trace,
CI/evidence/MCP tried, blockers, keep-using?) helps our pre-v7 ledger —
template is in the design partner guide.

Only share redacted / share-checked artifacts.

{{maintainer_name}}
```

## After a real reply

- [ ] Date the interaction (do not backdate)
- [ ] Update [PRE-V7-ADOPTION-EVIDENCE.md](./PRE-V7-ADOPTION-EVIDENCE.md) with real fields only
- [ ] Attach or link share-checked evidence if the partner provided it
- [ ] Note blockers honestly; do not soften into a fake sign-off

## Explicit non-goals for this checklist

- Filling the design-partner table with placeholders that look like partners
- Claiming “3–5 design partners” without dated external findings
- Marking adoption-4 / mid-checkpoint complete early
