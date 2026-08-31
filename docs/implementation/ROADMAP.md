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

`tools.requiredOrder` expands to adjacent pair checks comparing **first occurrences**. Document; do not change the algorithm. GitHub #308 first-occurrence docs/tests land here; strict `requiredOrderMode` implementation is deferred to 6.20.0.

### 2.6 Stale wording cleanup

Replace obsolete “evolves during v1.x” current-API wording with support-level language. Do not rewrite historical changelogs.

### 2.7 Issue reconciliation (chunk 6.17.5-8)

Map GitHub issues #308–#311 to release trains in this roadmap and TraceContract docs. No new runtime APIs in this chunk.

**In scope for 6.17.5 (close or partially close when acceptance passes):**

| Issue | 6.17.5 deliverable | Disposition |
| --- | --- | --- |
| [#310](https://github.com/rajudandigam/agent-inspect/issues/310) | Visible `AI_ADAPTER_PREVIEW_NOT_AVAILABLE`; metadata-only default unchanged | **Recommend close** when acceptance criteria pass |
| [#308](https://github.com/rajudandigam/agent-inspect/issues/308) | First-occurrence docs + `retrieve → generate → retrieve` PASS test | **Stay open** until `requiredOrderMode: "all-occurrences"` ships (6.20.0) |

**Deferred (stay open):**

| Issue | Target release | Notes |
| --- | --- | --- |
| [#311](https://github.com/rajudandigam/agent-inspect/issues/311) | 6.18.0 | Actual bounded preview capture parity |
| [#309](https://github.com/rajudandigam/agent-inspect/issues/309) | 6.20.0 | `alternatives.anyOf` for conditional/shortcut paths |

---

## 2A. Issue traceability (GitHub → release)

```text
#310 → 6.17.5 (close when visible-warning acceptance passes)
#308 → 6.17.5 docs/tests + 6.20.0 requiredOrderMode (stay open until strict mode ships)
#311 → 6.18.0 (stay open)
#309 → 6.20.0 (stay open)
```

---

## 3. Later trains (planned / conditional)

| Release | Theme | GitHub | Notes |
| --- | --- | --- | --- |
| **6.18.0** | Bounded preview parity for AI SDK + OpenAI Agents | #311 | Shared capture contract; metadata-only remains default |
| **6.19.0** | Custom `TraceReader` authoring + TrueForge receipt recipe | — | Transform is not the first stage for foreign event envelopes |
| **6.20.0** | `alternatives.anyOf` + `requiredOrderMode` | #309, #308 | Deterministic alternate valid paths and strict ordering |
| **6.21.0** | Conditional enforcement-evidence conventions | — | Only if external recipe proves need |

### 3.1 v6.18.0 — adapter capture parity (#311)

**Goal:** Make `capture: "preview"` persist bounded, redacted preview fields across AI SDK, OpenAI Agents, and LangChain adapters with shared diagnostics.

**Acceptance (17 bullets):**

1. Shared capture contract documented (metadata-only default; preview opt-in).
2. `capture: "preview"` persists bounded preview fields when source data is available.
3. `capture: "metadata-only"` remains default; no behavior regression.
4. Diagnostics history retained (`lifecycleWarnings`, `lastWarning`).
5. Optional `onDiagnostic` callback for adapter consumers.
6. Bounded preview helper shared across adapters (max chars, field selection).
7. AI SDK adapter parity with shared contract.
8. OpenAI Agents adapter parity with shared contract.
9. LangChain adapter parity with shared contract.
10. Functional `redactionProfile` honored when preview is enabled.
11. Functional `maxPreviewChars` honored when preview is enabled.
12. `AI_CAPTURE_FIELD_UNAVAILABLE` diagnostic when a requested preview field cannot be sourced.
13. Writer flush rules unchanged; preview fields respect serialized-size limits.
14. Conformance tests across all three adapters.
15. No raw full-content persistence by default.
16. No root API leak; capabilities remain on adapter subpaths.
17. Remove or downgrade `AI_ADAPTER_PREVIEW_NOT_AVAILABLE` when preview is actually implemented.

### 3.2 v6.19.0 — external persisted-event readers

**Goal:** Authoring guidance and TrueForge receipt recipe for arbitrary persisted agent-event sources through the existing reader architecture.

- Document custom `TraceReader` authoring patterns.
- TrueForge receipt recipe (no official TrueForge package).
- Transform is not the first stage for foreign event envelopes.

### 3.3 v6.20.0 — alternative valid paths (#309 + #308)

**Goal:** Deterministic contract composition for legitimate alternate agent paths without weakening local-first safety.

**Planned APIs (document only until implementation):**

#### `alternatives.anyOf` (#309)

- Shape: one level of alternative path groups; each group is a deterministic valid path.
- Evaluation: contract passes when **one** alternative group fully satisfies its rules.
- Constraints: no nested `anyOf`, no predicates, no runtime branching DSL.

#### `requiredOrderMode` (#308)

| Mode | Semantics |
| --- | --- |
| `"first-occurrence"` (default, shipped) | Adjacent pair checks on first occurrence of each listed tool among present tools |
| `"all-occurrences"` (planned) | Every listed tool must appear in sequence for all occurrences, not just first hits |

**Contributor note:** @HsienW volunteered on #308 for `requiredOrderMode` implementation. API shape requires maintainer approval before external PR lands.

### 3.4 v6.21.0 — conditional enforcement evidence

Conditional on TrueForge validation proving need. Enforcement-evidence conventions only; no new hosted service.

Historical `6.16.x`–`6.17.1` repository-health and Evidence UX work remains summarized in [history/ROADMAP-HISTORY.md](../history/ROADMAP-HISTORY.md) and Git tags.

---

## 4. Non-negotiable boundaries

- Persisted schema remains `1.0`; v0.1 and v0.2 traces remain readable
- No new public package; no root/core framework dependency leak
- No account, collector, hosted service, default upload, or hidden telemetry
- Metadata-only remains the default adapter capture mode
- Instrumentation failures never replace application failures
- Evidence v2 integrity semantics remain compatible
