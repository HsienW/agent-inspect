# AgentInspect Canonical Roadmap (permanent)

**Baseline:** `agent-inspect@6.17.4`
**Roadmap horizon:** `6.17.5 → 6.18.0 → 6.19.0 → 6.20.0 → conditional 6.21.0`
**Status:** Active canonical roadmap (permanent path; supersedes version-named roadmap seeds)
**Primary objective:** Close capability-truth gaps, keep release integrity green, make framework preview capture useful without weakening local-first safety, support arbitrary persisted agent-event sources through the existing reader architecture, and make deterministic contracts flexible enough for legitimate alternate agent paths
**Persisted trace schema:** remains `1.0`
**Package policy:** no new public packages before the conditional v7 decision
**Network policy:** no new default network behavior
**Product boundary:** local-first and customer-owned; no maintainer-hosted SaaS
**Named train:** `agentinspect-feedback-integrity-v6.17.5-to-v6.21`

---

## 1. Executive decision

The `6.16.0`–`6.17.4` line delivered repository health, Evidence UX, and public proof. External feedback and source review now identify **bounded correctness and capability-truth** work—not a platform expansion.

The canonical release sequence is:

```text
6.17.5  Release integrity, visible capability truth, and bounded correctness patch  (ACTIVE)
6.17.6  Reserved corrective patch only

6.18.0  Adapter capture capabilities and bounded preview parity
6.18.1  Reserved adapter compatibility patch only

6.19.0  External persisted-event reader authoring and TrueForge receipt recipe
6.19.1  Optional design-partner correction/documentation patch

6.20.0  Alternative valid paths and deterministic contract composition
6.20.1  Reserved contract compatibility patch only

6.21.0  Conditional enforcement-evidence conventions
6.21.x  Stability, external verification, and adoption
```

No major version is required. No new trace schema. No TrueForge-specific package. No full-content capture mode. No general temporal/workflow DSL.

The product identity remains:

> **AgentInspect is the local evidence debugger and trajectory-test toolkit for TypeScript agents: see what the agent did, fail CI when it follows the wrong path, and keep a share-checked artifact—without an account, collector, or default upload.**

---

## 2. Active train — v6.17.5 release integrity

**Goal:** Restore repository green status and make current adapter limitations impossible to misunderstand. Small, corrective, and safe.

### 2.1 Public-truth atomicity

- Root `package.json` version is authoritative for mechanical surfaces.
- `pnpm public-truth:sync` updates README / ROADMAP / docs README / PUBLIC-PRODUCT-FACTS / website product metadata / AI assets / demo provenance version fields.
- Claim ledger uses a **claim-content digest** so patch bumps do not require fabricated human attestation when claim text is unchanged.
- Changesets Version Packages runs sync before public-truth validation.

### 2.2 Demo verification fail-closed

`demo:verify` must fail with `AI_DEMO_VERIFY_CLI_MISSING` when the CLI artifact required for Evidence verification is absent. No silent skip.

### 2.3 Tail truncation recovery

When a watched file shrinks below the saved offset, reset offset, clear partial-line buffer, keep the session active. Do not claim full inode-aware rotation unless implemented.

### 2.4 Visible preview capability truth

AI SDK and OpenAI Agents accept `capture: "preview"` but persist metadata-only. Emit one visible `AI_ADAPTER_PREVIEW_NOT_AVAILABLE` warning per instance. **Do not** implement preview capture in 6.17.5.

### 2.5 TraceContract ordering documentation

`tools.requiredOrder` expands to adjacent pair checks comparing **first occurrences**. Document; do not change the algorithm.

### 2.6 Stale wording cleanup

Replace obsolete “evolves during v1.x” current-API wording with support-level language. Do not rewrite historical changelogs.

---

## 3. Later trains (planned / conditional)

| Release | Theme | Notes |
| --- | --- | --- |
| **6.18.0** | Bounded preview parity for AI SDK + OpenAI Agents | Shared capability diagnostics; metadata-only remains default |
| **6.19.0** | Custom `TraceReader` authoring + TrueForge receipt recipe | Transform is not the first stage for foreign event envelopes |
| **6.20.0** | `alternatives.anyOf` contract composition | Deterministic alternate valid paths |
| **6.21.0** | Conditional enforcement-evidence conventions | Only if external recipe proves need |

Historical `6.16.x`–`6.17.1` repository-health and Evidence UX work remains summarized in [history/ROADMAP-HISTORY.md](../history/ROADMAP-HISTORY.md) and Git tags.

---

## 4. Non-negotiable boundaries

- Persisted schema remains `1.0`; v0.1 and v0.2 traces remain readable
- No new public package; no root/core framework dependency leak
- No account, collector, hosted service, default upload, or hidden telemetry
- Metadata-only remains the default adapter capture mode
- Instrumentation failures never replace application failures
- Evidence v2 integrity semantics remain compatible
