# AgentInspect Canonical Stability and Evidence Roadmap — v6.12.1 to the v7 Decision

**Status:** Active canonical implementation roadmap after the 6.12.1 real-world LangGraph pilots
**Audience:** Maintainers, Cursor implementation sessions, contributors, adapter authors, CI owners, and design partners
**Current published baseline:** `agent-inspect@6.12.1` and the linked public package family
**Persisted trace schema:** `1.0`; legacy v0.1 and v0.2 remain readable
**Roadmap horizon:** `v6.12.2 → v6.12.3 → v6.13.0 → v6.14.0 → v6.14.x validation → conditional v7`
**Primary goal:** Make the flagship local evidence loop correct on real TypeScript/LangGraph agents, then make it dependable in CI, portable as a verified artifact, and useful to coding agents without a collector or hosted account.
**Hard constraint:** No new public package family before the v7 decision. Depth, correctness, and adoption proof take priority over breadth.

---

## 1. Executive product decision

AgentInspect should continue, but it must narrow around one product identity:

> **AgentInspect is the local evidence debugger for TypeScript agents: capture a framework-faithful execution tree, prevent the same trajectory regression in CI, and share a redacted, integrity-verified evidence file—without a collector, account, or default upload. Coding agents can inspect the same evidence locally over MCP.**

The product loop is:

```text
faithful framework capture
        ↓
canonical logical trace facts
        ↓
causal debugging and deterministic checks
        ↓
portable Evidence v2 artifact
        ↓
local coding-agent access over MCP
```

The next releases must not add another broad capability category. They must make this loop correct, consistent, and repeatable on real LangGraph/NestJS systems.

### 1.1 Why the roadmap changes again

The v6.7.4–v6.12.1 program successfully fixed the original real-integration blockers:

- standalone LangGraph traces now complete;
- run status is consistent across major read paths;
- human tool names are captured;
- parent reconciliation is substantially improved;
- `persist` intent is clearer;
- CLI aliases are normalized;
- native SQLite installation is improved;
- Evidence v2 exists and verifies integrity;
- the local MCP coding-agent loop exists;
- the public product identity now emphasizes evidence rather than a hosted platform.

Two external, production-shaped integrations then exposed a narrower downstream defect cluster:

1. completed legacy/LangGraph traces can still fail `check`/gate as incomplete or orphaned;
2. required-tool rules can miss a tool that is visibly present;
3. numeric token-count metadata can be misclassified as raw prompt content.

These are not three unrelated bugs. Two share one architectural cause: semantic consumers operate over row-level lifecycle events instead of one canonical logical event projection.

---

## 2. Current evidence and implementation assessment

### 2.1 What is now trustworthy

The real pilots provide positive evidence for:

- additive, environment-gated integration into mature NestJS applications;
- coexistence with Braintrust, New Relic, Datadog, and existing callbacks;
- CommonJS/ESM interoperability;
- completed standalone LangGraph run envelopes;
- model and token metadata capture;
- human-readable tool identity at capture/render time;
- mostly-correct LangGraph nesting;
- local reporting and diff;
- Evidence v2 directory generation and integrity verification;
- optional SQLite index loading on Node 24 LTS;
- metadata-first, no-default-upload behavior.

### 2.2 What is not yet trustworthy enough for the flagship promise

The following workflow is not yet reliable on real LangGraph traces:

```text
capture
→ check required trajectory
→ gate in CI
→ create share-safe evidence
```

The new pilot findings block it:

| ID | Severity | Finding | Product impact |
| --- | --- | --- | --- |
| N-1 | High | Completed trace is reported as having running/orphan events | False CI failures; TraceContract/gate not dependable |
| N-3 | High | Required tool is reported missing even when present | Core trajectory assertion is unusable |
| N-2 | Medium | Numeric token counts are classified as raw content | Clean metadata traces can become UNSAFE; bundle blocked |

### 2.3 Corrected technical diagnosis

The pilot correctly identifies the symptoms and impact, but the implementation indicates a more general root cause than “LangGraph has multiple roots.”

Multiple top-level nodes are valid. A trace is a forest when a framework emits more than one legitimate root or when relationship fidelity is incomplete. Parentless nodes must not be treated as orphans merely because more than one exists.

The current v0.1 compatibility conversion creates one persisted row for every raw lifecycle row:

```text
step_started   → persisted event with kind TOOL/LLM/... and status running
step_completed → different persisted event with kind LOGIC and terminal status
```

The start row retains the original `stepId`-based `parentId`, while generated persisted `eventId` values use a separate synthetic format. Semantic consumers therefore see:

- a permanently running start row even when the step completed;
- a terminal completion row that lost the original tool/LLM kind and name;
- a parent reference that may point to a step ID rather than a persisted event ID;
- tool identity nested inside legacy metadata rather than at the canonical attribute path.

This explains all of the following without assuming that multiple roots are invalid:

- `run.status` finds “running” events in a completed run;
- `structure.orphan` cannot resolve a legacy step parent;
- `finishedEvents(kind: TOOL)` finds no terminal TOOL event;
- `--required-tool` reports the tool missing;
- different commands disagree because tree renderers and check rules consume different projections.

The correct solution is a canonical logical event projection, not a growing list of LangGraph-specific exceptions.

---

## 3. Final product position

### 3.1 Category

AgentInspect should own:

> **Local, zero-backend evidence debugging for TypeScript agents.**

It should not market itself as a general AI observability platform.

### 3.2 Memorable analogy

> **The Playwright report for AI-agent runs.**

A file you can:

- generate locally;
- open offline;
- inspect causally;
- diff against a baseline;
- validate with deterministic trajectory contracts;
- attach to CI, a PR, an incident, or a customer review;
- verify for integrity and share safety;
- expose locally to a coding assistant over MCP.

### 3.3 Competitive boundary

AgentInspect complements rather than replaces:

- LangSmith, Langfuse, Braintrust, MLflow, Phoenix, Datadog, New Relic, and Honeycomb for hosted/production observability;
- Promptfoo and Evalite for prompt/output evaluation;
- OpenTelemetry/OpenInference for standardized telemetry;
- framework-native tracing systems.

The defensible intersection is:

```text
TypeScript-native
+ zero collector
+ ordinary local evidence files
+ execution-trajectory semantics
+ deterministic CI contracts
+ share-checked portable artifact
+ local coding-agent access
```

### 3.4 Flagship product hierarchy

The public story should prioritize:

1. **Faithful local capture**
2. **Portable Evidence v2**
3. **Deterministic trajectory checks / CI gates**
4. **Local coding-agent access over MCP**

Studio, cohorts, eval heuristics, viewer, TUI, index, guardrails, and extension tooling remain supporting surfaces.

---

## 4. Package and portfolio policy

AgentInspect already has a large linked package family. Do not add another package before the v7 decision.

### 4.1 Flagship surfaces

```text
agent-inspect
@agent-inspect/langchain
@agent-inspect/redact
@agent-inspect/mcp-server
agent-inspect/checks
```

### 4.2 Official supporting integrations

```text
@agent-inspect/ai-sdk
@agent-inspect/openai-agents
@agent-inspect/harness
@agent-inspect/vitest
@agent-inspect/jest
```

### 4.3 Optional supporting surfaces

```text
@agent-inspect/mcp
@agent-inspect/eval
@agent-inspect/guardrails
@agent-inspect/circuit
@agent-inspect/viewer
@agent-inspect/tui
@agent-inspect/index-sqlite
@agent-inspect/studio
@agent-inspect/adapter-sdk
agent-inspect-vscode
```

### 4.4 Portfolio rules through v6.14

- no new public package;
- no new official framework adapter;
- no package removal solely because weekly downloads are low;
- no breaking package consolidation in v6;
- no change to the fixed release group until v7 evidence is reviewed;
- every optional package must remain optional to the core install;
- root/core runtime dependencies remain lean;
- all new work must strengthen the flagship loop.

---

## 5. Canonical release sequence

| Release | Theme | Primary outcome |
| --- | --- | --- |
| **v6.12.2** | Real-pilot semantic blocker patch | Completed real LangGraph traces pass correct checks; tools match; token counts do not trigger raw-content findings |
| **v6.12.3** | Cross-surface semantic parity and pilot evidence | Every command/MCP/evidence path agrees on logical status, identity, hierarchy, and safety |
| **v6.13.0** | Logical Trace Facts and TraceContract stabilization | One supported semantic facts layer powers checks, suites, gates, reporters, and adapters |
| **v6.13.1** | Reserved consumer/regression patch | Used only for post-6.13 packaging, compatibility, or evidence regressions |
| **v6.14.0** | Evidence-first CI and no-egress launch candidate | Evidence v2 becomes the polished flagship; framework on-ramp and MCP loop are fully demonstrated |
| **v6.14.x** | Eight-week stability/adoption period | Bugs, security, compatibility, docs, and real-design-partner blockers only |
| **v7** | Conditional | Only after retained external use justifies a breaking consolidation or new intelligence layer |

---

# 6. v6.12.2 — Real-Pilot Semantic Blocker Patch

## 6.1 Goal

Make `check`, TraceContract, eval, gate, safety verification, Evidence v2, and MCP analysis operate on the logical completed trajectory rather than raw start/end lifecycle rows.

The release is successful when both real pilot shapes can complete this sequence correctly:

```text
capture completed LangGraph run
→ check required tool
→ check run completed
→ safety assessment ignores numeric token counts
→ bundle succeeds after configured redaction
→ bundle verify passes
```

## 6.2 Scope A — Introduce a canonical logical lifecycle projection

### 6.2.1 Preserve raw evidence

Do not remove or rewrite raw persisted rows.

Raw evidence remains available for:

- migration;
- provenance;
- forensic inspection;
- debugging reader/converter behavior;
- exact source-file export.

### 6.2.2 Add logical events for semantic consumers

Introduce an internal projection, for example:

```ts
interface LogicalTraceProjection {
  rawEvents: readonly PersistedInspectEvent[];
  logicalEvents: readonly PersistedInspectEvent[];
  runs: readonly InspectRunTree[];
  diagnostics: readonly TraceProjectionDiagnostic[];
}
```

Or an equivalent internal structure.

A logical event represents one lifecycle entity, not one storage row.

### 6.2.3 Pair legacy lifecycle rows

For v0.1/manual compatibility input:

- pair `run_started` with `run_completed` by `runId`;
- pair `step_started` with `step_completed` by `runId + stepId`;
- retain start name, kind, metadata, identity, parent, and start time;
- retain completion status, end time, duration, and error;
- generate one deterministic logical event ID per run/step;
- preserve source-row event IDs in provenance metadata;
- represent missing start or completion as an explicit incomplete diagnostic.

### 6.2.4 Normalize parent references

Translate legacy `parentId` step IDs into logical parent event IDs.

Rules:

- parentless events are roots, not orphans;
- multiple roots are valid;
- an orphan exists only when a non-empty parent reference cannot resolve;
- `parentMapping: unresolved` / equivalent metadata must remain explicit;
- no timestamp-only nesting;
- no invented parent merely to force one root.

### 6.2.5 Support all formats

The projection must work for:

- v0.1 trace rows;
- v0.2 persisted events;
- schema 1.0 events;
- mixed compatible directories;
- AI SDK events;
- OpenAI Agents events;
- LangChain/LangGraph events;
- OpenInference spans;
- OTLP JSON spans;
- structured-log-derived events.

One-span/one-event formats should pass through without unnecessary transformation.

## 6.3 Scope B — Route semantic consumers through logical events

The following must use the same logical projection:

- deterministic checks;
- TraceContract;
- `eval`;
- suites;
- cohorts;
- gates;
- safety raw-content checks;
- Evidence v2 check summaries;
- first-causal-failure analysis;
- read-only MCP semantic tools.

Renderers may keep raw-row diagnostics available, but public semantic conclusions must come from logical events.

## 6.4 Scope C — Fix completeness semantics

### 6.4.1 Completed lifecycle

A logical event is complete when it has a terminal status or a matched completion row.

A completed run must not fail merely because its raw source contains historical `status: running` start rows.

### 6.4.2 Incomplete lifecycle

Fail only when a logical entity is actually incomplete:

- started but no completion;
- explicit running terminal state;
- invalid lifecycle ordering;
- finalization diagnostic reports active children;
- missing required end time when the contract requires it.

### 6.4.3 Forest semantics

Multiple root nodes are valid by default.

Add an optional rule only if users want to constrain roots:

```ts
structure: {
  maxRoots?: number;
}
```

Do not make `maxRoots: 1` the default.

## 6.5 Scope D — Fix canonical tool identity for semantic checks

### 6.5.1 Canonical identity accessor

Create one utility used by:

- checks;
- search;
- diff;
- reports;
- Evidence v2;
- Studio/viewer;
- MCP tools.

Candidate precedence:

```text
event.attributes.toolName
event.attributes.metadata.toolName
event.attributes.frameworkRunName
event.attributes.metadata.frameworkRunName
event.attributes.runName
event.attributes.metadata.runName
event.attributes.tool
event.attributes.metadata.tool
stripped event.name
toolCallId correlation when available
```

### 6.5.2 Normalize comparison without hiding evidence

Tool contract matching should normalize:

- `tool:get_navan_rewards` → `get_navan_rewards`;
- whitespace;
- exact case policy documented;
- optional aliases configured by the user.

Keep the original display and implementation identity in evidence.

### 6.5.3 Diagnostic output

When a required tool is missing, include the candidate tools that were seen:

```json
{
  "required": "get_navan_rewards",
  "seen": ["get_navan_rewards", "lookup_order"],
  "identitySources": ["metadata.toolName", "event.name"]
}
```

Do not emit only “did not appear.”

## 6.6 Scope E — Fix token-count safety classification

Numeric token usage must not be considered raw prompt/output content.

Recognize canonical metric paths including:

```text
tokenUsage.input
tokenUsage.output
tokenUsage.total
tokenUsage.cached
usage.*
tokens.*
metadata.tokens.*
metadata.tokenUsage.*
gen_ai.usage.*
llm.token_count.*
```

Safety exemption requirements:

- leaf is a known usage-count key;
- value is a finite number;
- ancestor path is a recognized usage container;
- a string under the same path is not automatically exempt;
- raw prompt fields remain blocked.

## 6.7 Scope F — Add anonymized real-pilot fixture corpus

Create synthetic fixtures matching the structural shapes of both pilots without copying production data.

Required fixtures:

```text
langgraph-with-structured-output-multi-root
langgraph-swarm-tool-call
langgraph-completed-v0.1-lifecycle
langgraph-required-tool
langgraph-token-metadata
langgraph-unresolved-scaffolding-root
```

Each fixture must prove:

- run completion;
- logical event count;
- raw versus logical row count;
- no false running finding;
- no false orphan finding;
- required tool passes;
- absent tool fails;
- token counts do not trigger raw-content safety;
- real secrets still fail safety.

## 6.8 Scope G — CLI and evidence behavior

### `check`

- passes correct real completed traces;
- executes requested rules;
- prints logical evidence IDs;
- includes projection diagnostics in JSON.

### `gate`

- uses the same result as `check`;
- stable exit codes;
- no false green and no false red for the pilot fixtures.

### `bundle`

- safety assessment evaluates the redacted derived artifact where applicable;
- token counts do not block the bundle;
- actual user text/identifiers can still produce warnings or unsafe status according to profile.

### MCP

- causal and contract tools use logical facts;
- raw rows are exposed only through an explicitly named low-level tool, if retained at all;
- default responses remain redacted and bounded.

## 6.9 v6.12.2 implementation chunks

```text
6.12.2-0  Audit reader/check/safety/event-lifecycle assumptions
6.12.2-1  Add logical lifecycle projection types and diagnostics
6.12.2-2  Pair v0.1 run/step lifecycle rows
6.12.2-3  Normalize legacy parent references and forest semantics
6.12.2-4  Route checks/TraceContract through logical events
6.12.2-5  Add canonical tool identity resolver
6.12.2-6  Fix required-tool/order/failure matching
6.12.2-7  Fix token-count raw-content classification
6.12.2-8  Route eval/gate/bundle/MCP semantic paths through logical facts
6.12.2-9  Add real-pilot-shaped regression fixtures
6.12.2-10 Add packed CLI E2E for check → bundle → verify
6.12.2-11 Docs/changelog/known-issues update
6.12.2-12 Release readiness
```

## 6.10 v6.12.2 release gate

- both real-pilot-shaped fixtures pass completion checks;
- required tool passes when present and fails when absent;
- no token-count false positive;
- multiple roots do not imply orphan;
- truly missing parents still fail;
- raw event rows remain accessible for compatibility;
- v0.1/v0.2/schema 1.0 remain readable;
- no schema change;
- no new public package;
- no new default network behavior;
- packed consumer workflow passes.

---

# 7. v6.12.3 — Cross-Surface Semantic Parity and Pilot Evidence Patch

## 7.1 Goal

Ensure that every user-facing surface reaches the same conclusion for the same run.

The following must agree on status, duration, identity, roots, failures, and safety:

```text
list
view
what
explain
stats
timeline
search
report
diff
check
eval
gate
bundle
Evidence v2
MCP
Studio/viewer where applicable
```

## 7.2 Scope A — Define a semantic parity contract

Create a canonical fixture assertion table:

| Fact | Expected |
| --- | --- |
| Run status | success |
| Logical tool name | get_navan_rewards |
| Tool implementation | DynamicStructuredTool |
| Root count | 2 (valid forest) |
| Incomplete logical events | 0 |
| Orphans | 0 |
| Token total | preserved |
| Safety status after share redaction | expected policy result |
| First causal failure | identical across report/MCP |

Every relevant command must be tested against the same table.

## 7.3 Scope B — Handle residual framework scaffolding honestly

A remaining `RunnableLambda` or parser chain may be a valid additional framework root rather than a product defect.

Display choices:

- preserve it as an additional root;
- label it `framework-scaffolding` when evidence supports that classification;
- expose relationship confidence;
- optionally group roots under a non-persisted render-only invocation heading.

Do not write fabricated parent links back into the trace.

## 7.4 Scope C — Add projection diagnostics

Human output should remain concise.

JSON/diagnostic output should include:

```ts
interface TraceProjectionSummary {
  rawEventCount: number;
  logicalEventCount: number;
  pairedLifecycleCount: number;
  incompleteLifecycleCount: number;
  rootCount: number;
  unresolvedParentCount: number;
  identityFallbackCount: number;
  sourceFormat: string;
  projectionVersion: string;
}
```

Add an explicit diagnostic command or flag, for example:

```bash
agent-inspect open <trace> --diagnostics
agent-inspect check <trace> --json
```

Avoid adding another top-level command unless necessary.

## 7.5 Scope D — Record real pilot evidence honestly

Update the adoption evidence ledger to distinguish:

```text
private verified pilot completed
public named case study pending permission
external retained usage pending
```

Do not continue saying “no pilot evidence” if the maintainer has reviewed the supplied artifacts.

Do not claim named customers without permission.

Add an anonymized repository case study:

```text
docs/case-studies/real-langgraph-nestjs-pilot.md
```

It should document:

- additive env-gated integration;
- coexistence with hosted observability;
- before/after 6.7.3 → 6.12.x;
- remaining bugs and their fixes;
- no production trace data;
- no invented adoption claims.

## 7.6 Scope E — Evidence v2 parity

Evidence v2 must show the same:

- run status;
- tool identity;
- causal failure;
- contract results;
- safety result;
- projection warnings.

Add the projection version and source provenance to `evidence.json`.

## 7.7 Scope F — Packed and cross-platform regression

Run the pilot-shaped packed workflow on:

- Node 20;
- Node 22;
- Node 24;
- Linux;
- macOS where available;
- Windows where available;
- ESM;
- CommonJS.

Use real packed tarballs, not workspace imports.

## 7.8 v6.12.3 implementation chunks

```text
6.12.3-0  Define semantic parity fixture table
6.12.3-1  Add shared parity assertions for CLI renderers
6.12.3-2  Add projection diagnostics to JSON surfaces
6.12.3-3  Align Evidence v2 and MCP facts
6.12.3-4  Add framework-scaffolding/root display policy
6.12.3-5  Add anonymized pilot case study and evidence ledger update
6.12.3-6  Add packed/cross-platform pilot workflow
6.12.3-7  Public truth and support-level review
6.12.3-8  Release readiness
```

## 7.9 v6.12.3 release gate

- one fixture produces identical semantic facts across all flagship surfaces;
- Evidence v2 and MCP use the same facts as `check`;
- raw and logical event counts are visible in diagnostics;
- pilot evidence is recorded without overclaiming;
- no package or schema expansion.

---

# 8. v6.13.0 — Logical Trace Facts and TraceContract Stabilization

## 8.1 Goal

Turn the internal logical projection into a documented, supported semantic foundation for checks, suites, gates, reporters, adapters, and external extensions.

This release should move TraceContract from Beta toward Supported only if the real-pilot contract workflow passes end to end.

## 8.2 Scope A — Define `TraceFacts`

Add a stable or supported API under `agent-inspect/checks` or `agent-inspect/readers`:

```ts
interface TraceFacts {
  format: string;
  run: LogicalRun;
  events: readonly LogicalTraceEvent[];
  roots: readonly LogicalTraceEvent[];
  tools: readonly LogicalToolEvent[];
  llms: readonly LogicalLlmEvent[];
  observations: readonly LogicalOutcomeEvent[];
  diagnostics: readonly TraceProjectionDiagnostic[];
  sourceFiles: readonly string[];
}
```

Do not expose implementation maps or mutable objects.

## 8.3 Scope B — Define lifecycle and forest semantics

Document:

- raw row versus logical event;
- valid multiple-root forest;
- terminal status resolution;
- incomplete lifecycle;
- unresolved parent;
- synthetic grouping;
- relationship confidence;
- source provenance;
- lossy import diagnostics.

Do not require one root per run.

## 8.4 Scope C — Stabilize TraceContract identity and evidence

### Tools

Support:

- required;
- forbidden;
- allowed;
- order;
- max calls;
- per-tool max calls;
- aliases;
- optional toolCallId requirements.

### LLMs

Support:

- allowed providers/models;
- max calls;
- token budgets;
- finish reasons;
- generation after retrieval/guardrail where evidence exists.

### Structure

Support:

- require completed;
- allowed root count only when explicitly configured;
- max depth;
- max parallel width;
- no unresolved parents;
- minimum confidence.

### Outcomes

Support:

- required observed outcomes;
- fail on failed/unknown;
- expected method;
- evidence required.

### Safety

Support:

- required redaction profile;
- no unsafe findings;
- no raw content;
- bounded evidence.

Every finding must include event/run evidence.

## 8.5 Scope D — Add Vitest and Jest matchers

Ship the previously missing matchers through existing packages.

Example:

```ts
await expectTrace(trace).toSatisfyTraceContract(contract);
await expectTrace(trace).toUseTool("get_navan_rewards");
await expectTrace(trace).not.toUseTool("delete_account");
```

Requirements:

- no model call;
- no network call;
- preserve original test failure;
- clear first failure;
- link to Evidence v2 artifact when reporters are enabled;
- work in ESM and CommonJS where the package claims support.

## 8.6 Scope E — Unify suite/gate semantics

Suites and gates must consume `TraceFacts` and TraceContract rather than maintain parallel matching logic.

Ensure:

- missing evidence cannot pass;
- fresh execution versus stored trace is explicit;
- contract result is identical in CLI, reporter, Evidence v2, MCP, and Studio;
- exit codes are stable.

## 8.7 Scope F — Adapter conformance based on logical facts

Official adapters should pass the same conformance cases:

```text
completed run
failed run
tool identity
tool ordering
streaming LLM
token usage
multiple roots
unresolved parent
observed outcome
share-safe artifact
```

The adapter SDK should expose these fixtures without changing the adapter contract unnecessarily.

## 8.8 Scope G — Performance and compatibility

Measure projection/check overhead for:

- 100 events;
- 1,000 events;
- 10,000 events;
- large mixed-format directories.

Projection must remain local, deterministic, and bounded.

## 8.9 v6.13.0 implementation chunks

```text
6.13-0  TraceFacts and lifecycle semantics RFC
6.13-1  Supported logical event and run fact types
6.13-2  Tool/LLM/outcome fact indexes
6.13-3  TraceContract v2 normalization and aliases
6.13-4  Structure/forest/confidence rules
6.13-5  Vitest matchers
6.13-6  Jest matchers
6.13-7  Suite/gate migration to TraceFacts
6.13-8  Adapter conformance migration
6.13-9  Performance/compatibility evidence
6.13-10 Docs, migration, support-level decision
6.13-11 Release readiness
```

## 8.10 v6.13.0 release gate

- real LangGraph contract passes/fails correctly;
- TraceContract result is identical across CLI/test/MCP/evidence;
- matchers ship and are documented;
- multiple roots are formally supported;
- adapter conformance uses logical facts;
- no trace schema break;
- no new package.

---

# 9. v6.13.1 — Reserved Consumer and Regression Patch

Do not pre-plan feature work.

Use only for:

- package/tarball defect;
- test-runner compatibility;
- Node/OS portability;
- projection regression;
- evidence manifest drift;
- documentation command error;
- external pilot blocker.

Skip if v6.13.0 is clean.

---

# 10. v6.14.0 — Evidence-First CI and No-Egress Launch Candidate

## 10.1 Goal

Make AgentInspect’s differentiated workflow obvious and exceptional:

> A failed TypeScript agent run produces a faithful local execution tree, a deterministic contract failure, and a portable Evidence v2 file that can be reviewed in a PR or by a coding assistant without uploading the trace to a hosted platform.

No new package is introduced.

## 10.2 Scope A — Make Evidence v2 the flagship artifact

Evidence v2 should include:

- run/session identity;
- source adapter/framework/version;
- raw and logical event counts;
- projection version;
- causal failure;
- execution tree;
- timeline;
- tool/model/token facts;
- TraceContract result;
- observed outcomes;
- diff when baseline exists;
- safety findings and redaction disclosure;
- file hashes and integrity result;
- known-loss/import warnings.

The HTML must remain:

- self-contained;
- offline;
- XSS-safe;
- accessible;
- useful without Studio.

## 10.3 Scope B — Evidence-first CI flow

Add a single documented workflow:

```text
agent test fails
→ TraceContract/gate fails
→ Evidence v2 is generated
→ reporter/CI uploads it
→ reviewer opens one HTML file
```

Vitest/Jest reporters should optionally create Evidence v2 for failed associated tests.

GitHub Actions recipe must use synthetic data and no provider key.

## 10.4 Scope C — No-egress policy mode

Add a deterministic policy layer, without compliance claims.

Possible CLI:

```bash
agent-inspect verify-safe <trace> --policy no-egress
agent-inspect doctor --policy no-egress
```

Checks may include:

- no configured remote exporter;
- no cloud explain provider;
- local-only MCP transport/config;
- metadata-safe capture policy;
- share/strict redaction for derived artifacts;
- no raw prompt/output capture;
- network behavior disclosure.

Output must say:

```text
policy satisfied
policy warnings
policy failed
unknown
```

It must not claim HIPAA, PCI, GDPR, SOC 2, or regulatory certification.

## 10.5 Scope D — Framework-native on-ramp

The README and `init` should lead framework users directly to:

```text
AI SDK
OpenAI Agents
LangChain/LangGraph
```

Add a focused LangGraph option:

```bash
agent-inspect init --framework langgraph --ci --mcp
```

Generated output should:

- install/mention only required packages;
- set metadata-first defaults;
- persist locally;
- include `flush/close` guidance where needed;
- include one contract;
- include one Evidence v2 command;
- include MCP configuration as optional.

## 10.6 Scope E — Coding-agent loop over logical facts

The MCP server must use the same TraceFacts and contract results as the CLI.

Flagship tools:

```text
list_runs
get_run_summary
get_execution_tree
find_first_causal_failure
find_tool_calls
get_contract_failures
compare_runs
create_share_safe_evidence
```

Default outputs remain:

- read-only;
- redacted;
- bounded;
- local stdio;
- no raw payload unless an explicitly named low-level tool is enabled.

## 10.7 Scope F — Publish the real pilot story

With appropriate permission, publish one named or anonymized technical case study showing:

```text
6.7.3 findings
→ fixes through 6.12.1
→ N-fixes
→ real LangGraph gate passes
→ Evidence v2 artifact
→ MCP coding-agent inspection
```

Be explicit about:

- existing Braintrust/New Relic/Datadog coexistence;
- no replacement claim;
- local-only evidence;
- bugs found and fixed;
- what remains Beta/Preview.

## 10.8 Scope G — Portfolio simplification without package deletion

Public documentation should present three layers:

### Core workflow

```text
agent-inspect
@agent-inspect/redact
```

### Framework and CI integrations

```text
@agent-inspect/langchain
@agent-inspect/ai-sdk
@agent-inspect/openai-agents
@agent-inspect/vitest
@agent-inspect/jest
@agent-inspect/harness
```

### Optional advanced surfaces

```text
MCP
Studio/index
viewer/TUI/VS Code
eval/guardrails/circuit
adapter SDK
```

Do not lead with “18 packages.”

## 10.9 v6.14.0 implementation chunks

```text
6.14-0  Evidence-first product acceptance contract
6.14-1  Evidence v2 projection/contract/provenance fields
6.14-2  Reporter-generated Evidence v2 on contract failure
6.14-3  No-egress policy checks and docs
6.14-4  LangGraph init/onboarding path
6.14-5  MCP tools migrated to TraceFacts
6.14-6  Real no-key LangGraph gate + evidence recipe
6.14-7  Pilot case study and public evidence update
6.14-8  README/website/package tier simplification
6.14-9  Packed-install and cross-platform golden E2E
6.14-10 Security/accessibility/performance review
6.14-11 Release readiness
```

## 10.10 v6.14.0 release gate

- a real-pilot-shaped LangGraph trace passes the expected contract;
- the broken variant fails with useful evidence;
- Evidence v2 opens offline and verifies integrity;
- token counts do not create false unsafe status;
- actual sensitive user input remains caught/redacted;
- CI reporter retains the artifact;
- MCP reports the same causal/contract facts;
- no collector, account, or provider key is required for the golden path;
- no new public package;
- no hidden telemetry or upload.

---

# 11. v6.14.x — Stability and Adoption Period

After v6.14.0, stop feature expansion for at least eight weeks.

## 11.1 Allowed work

- correctness fixes;
- security fixes;
- adapter compatibility;
- package/install fixes;
- test-runner compatibility;
- performance regressions;
- documentation corrections;
- real-design-partner blockers;
- accessibility fixes;
- evidence-format backward-compatible fixes.

## 11.2 Not allowed without a new roadmap decision

- new packages;
- new official adapters;
- LLM judge;
- context optimization;
- replay;
- browser-agent package;
- hosted SaaS;
- semantic search;
- production alerting;
- broad Studio expansion;
- package-family consolidation requiring breaking changes.

---

# 12. Adoption and product validation

## 12.1 Evidence status

The supplied pilots materially satisfy technical validation for:

- real NestJS integration;
- real LangGraph/LangGraph-swarm capture;
- coexistence with existing observability stacks;
- Evidence v2 generation;
- SQLite loading on Node 24;
- additive environment-gated adoption.

They do not automatically establish:

- public named adoption;
- retained use after 30 days;
- public dependents;
- repeated CI gates;
- repeated MCP use.

Record them as:

```text
verified private pilot completed
public case-study permission pending
retention evidence pending
```

## 12.2 Metrics

Do not add hidden telemetry.

Track through:

- design-partner interviews;
- public dependents;
- issue/discussion quality;
- opt-in local usage report;
- package-specific download trends;
- retained CI recipes;
- external evidence bundles/case studies;
- MCP configuration retention.

Treat npm downloads as directional, not as unique users.

## 12.3 Eight-week targets

Before v7 consideration:

```text
10 unrelated teams complete first useful trace
5 teams remain active after 30 days
3 teams retain TraceContract/check/gate in CI
2 teams repeatedly generate Evidence v2
2 real LangGraph/LangChain integrations remain installed
1 team repeatedly uses the MCP coding-agent loop
1 public external case study or integration article
1 external adapter/extension or meaningful recipe
no unresolved high-severity fidelity/safety defect
```

---

# 13. Conditional v7 decision

v7 is not automatically the next release.

## 13.1 What could justify v7

A major release may be justified for:

- breaking package consolidation;
- independent package versioning;
- stable logical trace/evidence contract;
- removal of obsolete root/subpath APIs;
- stable adapter fidelity interface;
- stable MCP/evidence interfaces;
- deprecation/removal of unused package surfaces.

## 13.2 What does not justify v7

Do not create v7 merely to add:

- another adapter;
- another dashboard page;
- an LLM judge;
- context optimization;
- replay;
- a marketplace;
- a hosted service;
- a new schema without adoption need.

## 13.3 Decision outcomes

### Strong adoption

Plan v7 consolidation around the most-used workflow.

### Moderate adoption

Continue v6.x hardening and focus on:

```text
LangGraph local evidence
CI trajectory gates
Evidence v2
MCP coding-agent loop
```

### Weak adoption

Narrow the product to:

> **Deterministic local evidence and CI gates for TypeScript agents.**

Do not compensate for weak adoption by expanding into SaaS or general observability.

---

# 14. Cross-cutting regression matrix

## 14.1 Trace formats

- v0.1 manual lifecycle
- v0.2 persisted
- schema 1.0
- mixed directory
- OpenInference
- OTLP JSON
- malformed final line
- duplicate lifecycle rows
- completion without start
- start without completion

## 14.2 Frameworks

- manual `inspectRun` / `step`
- AI SDK
- OpenAI Agents
- plain LangChain
- LangGraph ReAct
- LangGraph structured output/parser
- LangGraph swarm
- nested subgraph
- streaming
- callback reuse
- callback inside `inspectRun`

## 14.3 Logical semantics

- one root
- multiple valid roots
- resolved parent
- marked unresolved parent
- actual orphan
- cycle
- completed lifecycle
- incomplete lifecycle
- tool identity top-level
- tool identity nested metadata
- tool display alias
- token usage nested metadata

## 14.4 Checks and contracts

- required tool present/absent
- forbidden tool present/absent
- tool ordering
- model/provider
- token limits
- duration
- retries
- observations
- root count opt-in
- unresolved parent policy
- safety policy
- matchers
- stable exit codes

## 14.5 Safety

- numeric token counts
- real raw prompt
- API key
- authorization header
- cookie
- email
- userId/sessionId/currentTask
- UUID
- local file path with `@`
- valid/invalid card candidate
- nested payload
- redacted derived artifact
- Evidence v2 verification

## 14.6 Product surfaces

- view/what/explain
- stats/timeline/search
- report/diff
- check/eval/gate
- suite/cohort
- bundle/verify
- Jest/Vitest reporters
- MCP server
- viewer/Studio semantic parity

## 14.7 Consumer matrix

- Node 20/22/24/current evidence
- ESM
- CommonJS
- NodeNext
- Node16
- npm
- pnpm
- Linux
- macOS
- Windows
- packed tarballs
- optional peer absent
- SQLite optional package

---

# 15. Standard validation

Every runtime release should run:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm fixtures:check
pnpm recipes:check
pnpm size
pnpm perf:baseline
pnpm pack:smoke
pnpm compat:smoke
pnpm docs:check
pnpm website:typecheck
pnpm website:build
npm pack --dry-run
git diff --check
```

Focused release validation should additionally run:

```text
logical lifecycle projection corpus
real-pilot-shaped LangGraph corpus
check/contract semantic parity corpus
safety false-positive/true-positive corpus
Evidence v2 packed E2E
MCP logical-facts corpus
Jest/Vitest matcher consumer fixtures
```

---

# 16. Cursor execution model

Each release train must be implemented as small, reviewable chunks.

## 16.1 Mandatory Phase 0

Every Cursor prompt starts with:

```text
Phase 0 — Audit before editing
```

Report:

- current package version;
- branch and HEAD;
- working-tree state;
- relevant public APIs;
- relevant source format behavior;
- existing tests;
- exact files planned;
- compatibility risks;
- privacy/network impact;
- whether a schema/API change is required.

## 16.2 Implementation boundaries

Every prompt states:

- goal;
- why it matters;
- in scope;
- out of scope;
- public API impact;
- trace schema impact;
- evidence format impact;
- safety impact;
- files to inspect;
- tests to add;
- validation commands;
- final report format.

## 16.3 Chunk rules

- one commit-sized change per chunk;
- no unrelated cleanup;
- no future-train work;
- no version bump in implementation chunks;
- no publish/tag/push unless explicitly authorized;
- no weakening redaction or no-upload defaults;
- no timestamp-only hierarchy inference;
- release readiness remains a separate pass.

## 16.4 Final chunk report

Each chunk must report:

```text
audit summary
files created
files modified
behavior changed
public API impact
schema/evidence impact
tests added
commands run
results
deviations
remaining risks
compatibility confirmation
privacy/network confirmation
no-publish confirmation
recommended next chunk
```

---

# 17. Documentation plan

Update public documentation around tasks, not package history.

## 17.1 Hero pages

```text
Debug one LangGraph run
Prevent one trajectory regression
Create one portable evidence artifact
Let a coding assistant inspect the evidence
Run in a no-egress environment
```

## 17.2 Required docs

- `docs/LANGGRAPH-FIDELITY.md`
- `docs/TRACE-FACTS.md`
- `docs/TRACE-CONTRACTS.md`
- `docs/EVIDENCE-V2.md`
- `docs/CODING-AGENT-LOOP.md`
- `docs/NO-EGRESS.md`
- `docs/REAL-WORLD-LANGGRAPH-PILOT.md`
- `docs/POSITIONING-AND-PORTFOLIO.md`
- `docs/SUPPORT-LEVELS.md`
- `docs/KNOWN-ISSUES.md`

## 17.3 Public claims

Use:

```text
local evidence debugger
framework-faithful where verified
verified against named fixtures/versions
portable evidence
share-checked / best-effort safety
no default upload
```

Avoid:

```text
production observability replacement
compliance certified
universally safe
all LangGraph structures perfectly nested
all OTel backends supported
automatic root-cause proof
```

---

# 18. Explicit non-goals through the v7 decision

- no maintainer-hosted SaaS;
- no multi-tenant cloud;
- no LLM-as-judge package;
- no prompt registry;
- no dataset platform;
- no provider cost engine;
- no replay/cassette engine;
- no automatic code remediation;
- no new public package;
- no new official framework adapter;
- no context optimization package;
- no browser-agent package;
- no broad Studio expansion;
- no new trace wire schema;
- no hidden telemetry;
- no default network upload.

---

# 19. Final implementation order

Execute in this order:

```text
1. v6.12.2 logical lifecycle / tool identity / token safety blocker patch
2. v6.12.3 semantic parity and real-pilot evidence patch
3. v6.13.0 TraceFacts / TraceContract / matcher stabilization
4. v6.13.1 only if consumer or packaging repair is required
5. v6.14.0 Evidence-first CI and no-egress launch candidate
6. v6.14.x eight-week stability/adoption period
7. v7 decision only after retained external evidence
```

---

# 20. Final roadmap thesis

The next AgentInspect releases should not add more surface area.

They should make one product loop exceptionally dependable:

> **A real TypeScript/LangGraph agent run becomes a faithful local execution tree; one deterministic contract prevents the same trajectory mistake; one portable Evidence v2 file proves what happened; and the same bounded evidence is available to a local coding assistant over MCP.**

That is the sweet spot between `console.log` and a hosted observability/eval platform. It is narrow enough for a solo-maintained open-source project to own, useful alongside incumbent platforms, and differentiated by zero-backend evidence ownership rather than by another dashboard.
