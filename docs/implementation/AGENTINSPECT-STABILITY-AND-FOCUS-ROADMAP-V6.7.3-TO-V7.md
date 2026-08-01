# AgentInspect Stability and Focus Roadmap — v6.7.3 to the v7 Decision

**Status:** Canonical product and implementation roadmap proposal after the first mature LangGraph/NestJS production-path integrations  
**Audience:** Maintainers, Cursor implementation sessions, contributors, adapter authors, security reviewers, and design partners  
**Published baseline:** `agent-inspect@6.7.3`  
**Source baseline:** `main` at or after the post-6.7.3 run-status and stats-label fixes  
**Persisted trace schema:** `1.0` remains unchanged  
**Roadmap horizon:** `v6.7.4 → v6.7.5 → v6.8 → v6.9 → v6.10 → v6.11 → v6.12 → conditional v7`  
**Primary goal:** Make AgentInspect a stable, faithful, share-safe, TypeScript-native local evidence debugger for real agent applications before expanding the package family again.  
**Product exit condition:** A real LangGraph application can produce a correct execution tree, pass deterministic trajectory checks, create a share-checked portable evidence artifact, and expose the same evidence to a coding agent over MCP without an account, collector, or default upload.

---

## 1. Executive product decision

AgentInspect should no longer compete for the broad label **AI observability platform**.

It should own a narrower and more defensible job:

> **AgentInspect is the local evidence debugger for TypeScript agents: capture a framework-faithful execution tree, inspect it yourself or through your coding assistant, and produce a redacted, portable evidence artifact—without a collector, account, or default upload.**

The product’s four connected jobs are:

```text
faithful local capture
        ↓
causal execution-tree debugging
        ↓
deterministic regression checks
        ↓
human-readable and coding-agent-readable evidence
```

The headline use cases are:

1. **Debug a real TypeScript/LangGraph run locally.**
2. **Attach a redacted evidence artifact to a PR, incident, support escalation, or audit review.**
3. **Let Cursor, Claude Code, Codex, or another coding assistant inspect that evidence through a local read-only MCP server.**
4. **Convert the discovered failure into a deterministic TraceContract or CI gate.**

These use cases reinforce one another. They are not four separate products.

---

## 2. Why the strategy changes now

AgentInspect has already built a wide package family:

- core tracing and CLI
- readers and writers
- AI SDK, OpenAI Agents, and LangChain adapters
- redaction
- eval utilities
- Vitest and Jest reporters
- harness
- MCP client tracing and MCP server
- guardrails and circuit analysis
- viewer, TUI, and VS Code surfaces
- workspace and SQLite index
- self-hosted Studio
- adapter SDK and plugin conventions
- OpenInference and OTLP file interoperability

The next bottleneck is not missing breadth.

The first serious external integrations exposed quality gaps in the exact surfaces that carry the product promise:

- LangGraph runs can remain incomplete.
- normalized readers can disagree on status.
- tool identity and parent relationships can be lost.
- shorthand check flags can be silently filtered out.
- safety detectors can block clean, metadata-oriented evidence because of false positives.
- `doctor` can contradict itself.
- the Jest reporter can silently produce no artifacts when no trace association exists.
- the optional native SQLite dependency can abort a multi-package install on a current Node release.
- the package family is broad enough that the public identity is diluted.

The correct response is **depth before breadth**.

---

## 3. Competitive position

### 3.1 Markets AgentInspect should not try to win

Do not try to outbuild:

- LangSmith
- Langfuse
- Braintrust
- Phoenix
- MLflow
- Datadog
- Honeycomb
- New Relic
- Promptfoo
- Evalite

Those products already cover broad production observability, hosted evaluation, prompt/output scoring, dataset management, LLM judges, monitoring, and team dashboards.

### 3.2 Adjacent tools validate the need but narrow the niche

Several adjacent categories now cover portions of AgentInspect’s earlier thesis:

- local TypeScript eval runners
- static HTML eval reports
- trace evaluation from OpenTelemetry
- coding-agent access to traces over MCP
- local or self-hosted trace UIs
- framework-native hosted tracing

Therefore AgentInspect cannot rely only on “local,” “MCP,” “eval,” or “HTML report” as isolated differentiators.

### 3.3 The defensible intersection

The strongest remaining intersection is:

```text
TypeScript-native
+ framework-faithful agent trajectory
+ ordinary local files
+ no collector/backend
+ deterministic contracts
+ redaction-first portable evidence
+ coding-agent access over local MCP
```

Competitors may cover two or three of these properties. AgentInspect should make the combined workflow exceptional.

### 3.4 The Playwright-report analogy

The desired evidence artifact should feel like a Playwright HTML report for an agent run:

- generated from local execution
- self-contained
- reviewable offline
- attachable to CI or a pull request
- easy to open
- rich enough to understand the failure
- backed by machine-readable evidence
- not locked behind an account

The analogy is useful, but AgentInspect must remain careful: its redaction and safety checks are best-effort, not compliance certification.

---

## 4. Product boundaries

### 4.1 AgentInspect remains

- local-first
- TypeScript-first
- plain-file first
- metadata-oriented by default
- deterministic by default
- zero-account
- zero-collector
- no-upload by default
- compatible with existing v0.1, v0.2, and schema 1.0 traces
- complementary to hosted observability and eval platforms
- package-scoped for framework-specific dependencies

### 4.2 AgentInspect does not become

- a maintainer-hosted SaaS
- a production APM replacement
- a prompt registry
- a hosted dataset platform
- an LLM-judge platform
- a pricing or billing engine
- a replay engine
- an automatic remediation system
- a public plugin marketplace
- a broad red-team framework
- a default telemetry uploader
- a raw chain-of-thought recorder

### 4.3 No new public package before the v7 decision

The package count is frozen.

All roadmap work must land in existing packages or root subpaths.

In particular, do not add:

- `@agent-inspect/judge`
- `@agent-inspect/context`
- new browser-agent packages
- more official framework adapters
- another dashboard package
- another safety package
- another report package

---

## 5. Product portfolio tiers

The package family remains published, but public focus must be tiered.

### Tier A — Flagship

These surfaces define the product:

```text
agent-inspect
@agent-inspect/langchain
@agent-inspect/mcp-server
@agent-inspect/redact
agent-inspect/checks
```

### Tier B — Official supported integrations

These remain supported, tested, and documented, but are not the headline:

```text
@agent-inspect/ai-sdk
@agent-inspect/openai-agents
@agent-inspect/harness
@agent-inspect/vitest
@agent-inspect/jest
```

### Tier C — Optional supporting surfaces

These remain maintained but should not dominate the product story:

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

### Tiering rules

- No package is removed during this roadmap.
- No support promise is silently reduced.
- Package deprecation requires usage evidence, migration guidance, and a major-version decision.
- README and website examples should lead with the flagship workflow.
- Optional surfaces should be discoverable without appearing mandatory.
- Fixed-group release policy may be reconsidered only after the stability work and usage audit.

---

## 6. Roadmap overview

| Release | Theme | Outcome |
|---|---|---|
| **v6.7.4** | Real-integration blocker patch | Real LangGraph traces close correctly; check flags execute; current `main` correctness fixes are published |
| **v6.7.5** | Consumer and DX reliability patch | Doctor, native SQLite, reporter diagnostics, CLI consistency, privacy metadata, and renderer parity are fixed |
| **v6.8.0** | LangGraph fidelity contract | Framework-accurate lifecycle, parent relationships, tool identity, persistence semantics, and explicit finalization |
| **v6.8.x** | Reserved fidelity repairs | Only focused regressions discovered by external LangGraph validation |
| **v6.9.0** | Safety precision and share policy | False positives are reduced; bundles are gated on the redacted artifact; findings have category and confidence |
| **v6.9.x** | Reserved safety repairs | Detector and policy corrections only |
| **v6.10.0** | Portable Evidence v2 | A self-contained, integrity-verifiable, share-checked agent evidence artifact becomes the flagship output |
| **v6.11.0** | Local coding-agent debug loop | MCP becomes zero-backend, easy to configure, safe, deterministic trace context for coding assistants |
| **v6.12.0** | Consolidation and stable launch candidate | One product identity, package tiers, compatibility proof, design-partner evidence, and no breadth expansion |
| **v7.0.0** | Conditional major | Only if real breaking consolidation or ecosystem demand warrants it |

---

# 7. v6.7.4 — Real-Integration Blocker Patch

## Goal

Fix the externally reproduced correctness defects that make the flagship LangGraph and CI workflows unusable.

This release is a patch because it restores documented behavior. It does not add a new product surface.

## Why it matters

The current integration can capture useful LangGraph events, but the trace envelope may never close. That turns a successful run into `running`, which cascades into checks, gates, stats, summaries, bundles, and MCP output.

A debugger whose run lifecycle is wrong cannot be marketed.

---

## Scope A — Emit terminal run lifecycle for LangGraph-shaped callbacks

### Required behavior

For each standalone callback invocation:

```text
exactly one run_started
zero or more step lifecycle events
exactly one terminal run_completed
```

Terminal status must be:

```text
success
error
cancelled/interrupted when the framework exposes it
```

### Do not rely on “parentRunId is empty”

The completion algorithm must not assume that an outer LangGraph chain has no `parentRunId`.

Use lifecycle state tracked by actual callback events:

```ts
interface CallbackLifecycleState {
  activeRunIds: Set<string>;
  completedRunIds: Set<string>;
  sawError: boolean;
  finalizationScheduled: boolean;
  finalized: boolean;
}
```

Suggested algorithm:

1. Start the AgentInspect envelope on the first lifecycle event.
2. Add every callback `runId` to `activeRunIds`.
3. Remove the ID on its end/error event.
4. When the active set becomes empty, schedule completion in a deferred microtask.
5. Cancel deferred completion when another lifecycle event starts.
6. Complete once, idempotently.
7. Use explicit error state when any terminal callback reports an error.
8. Preserve the unresolved external parent as metadata; do not let it block the envelope.

### Required edge cases

- plain LangChain root with no parent
- LangGraph semantic parent such as `LangGraph`
- semantic parent such as `__start__`
- nested child with actual run-ID parent
- parallel children
- child ending before parent
- parent ending before a late callback
- callback reused for a second invocation
- error path
- no chain event, only model/tool events
- explicit in-memory mode
- explicit persisted mode

### No fake hierarchy

This patch may close the run while preserving unresolved relationships. Full hierarchy reconciliation belongs to v6.8.0.

---

## Scope B — Publish the current run-status normalization fixes

The already-merged source fixes that make normalized TreeBuilder/explain agree with `list` and `view` must be included in the published patch.

Contract:

```text
completed success → success/ok consistently
completed failure → error consistently
unfinished run → running consistently
```

Commands covered:

```text
list
view
what
explain
timeline
stats
search
report
diff
check
eval
gate
MCP summaries
```

Add one cross-command golden test that opens the same trace through each relevant path and asserts one canonical status.

---

## Scope C — Fix CLI shorthand rule selection

### Current failure mode

CLI flags can construct tool and LLM rules while the default selection still contains only `run.status`. The new rules are then filtered out and produce no findings.

### Correct selection rules

- No explicit rules/options: run only the default run-status check.
- `--required-tool`: select `tool.usage`.
- `--forbidden-tool`: select `tool.usage`.
- `--allowed-model`: select `llm.usage`.
- `--max-total-tokens`: select `llm.usage`.
- `--max-duration-ms`: select `run.duration`.
- `--max-step-duration`: select `run.maxStepDuration`.
- `--require-completed`: select `run.requireCompleted`.
- `--detect-stalls`: select `run.stall`.
- `--fail-on-observation`: select `outcome.status`.
- Explicit `--rule`: select exactly the requested rule IDs plus rules explicitly enabled by shorthand flags, with duplicate IDs removed.
- Configured rule options without `checks.select` must activate their corresponding rule.
- Explicit `checks.select` remains authoritative for config-driven workflows.

### Regression cases

```text
required tool missing → one failure
required tool present → pass
forbidden tool present → one failure
allowed model mismatch → one failure
token budget exceeded → one failure
multiple shorthand flags → all corresponding findings
unknown rule ID → configuration error
```

---

## Scope D — Fix adapter tool identity

### Display-name precedence

Use:

```text
runName
→ metadata.toolName
→ serialized tool name
→ serialized class/id fallback
→ "unknown-tool"
```

For a LangGraph prebuilt tool wrapper:

```text
display: tool:get_navan_rewards
metadata.toolClass: DynamicStructuredTool
metadata.toolCallId: ...
```

Do not discard the implementation class; move it to metadata.

### Tests

- `DynamicStructuredTool` with `runName`
- generic serialized class with metadata tool name
- explicit tool name
- missing names
- multiple distinct tools of the same class
- required-tool checks against displayed identity

---

## Scope E — Publish renderer parity fixes

Include:

- current stats label fix
- timeline no double prefix
- search no double prefix
- report/timeline embedded labels corrected
- filtered search newest-first ordering
- deterministic tie-breaking
- `--limit` keeps most recent filtered matches

Create one shared step-label formatting helper instead of copying the logic across renderers.

---

## Scope F — Lock bundle refusal exit semantics

The current source appears to set a nonzero exit code when a bundle is refused. Add packed CLI regression coverage to prevent future regressions.

Required:

```text
SAFE bundle → exit 0
SAFE WITH WARNINGS → documented policy
UNSAFE without override → exit 1
UNKNOWN without override → nonzero
--allow-unsafe → explicit output and exit 0
invalid input → configuration/read error exit
```

---

## Scope G — External reproduction corpus

Add small, no-key fixtures based on the real integrations:

```text
fixtures/langgraph/plain-root.json
fixtures/langgraph/semantic-parent-langgraph.json
fixtures/langgraph/semantic-parent-start.json
fixtures/langgraph/dynamic-tool-name.json
fixtures/langgraph/parallel-children.json
fixtures/langgraph/error-run.json
```

Do not commit customer metadata or production traces.

---

## v6.7.4 implementation chunks

```text
6.7.4-0  Reproduce every externally reported P0/P1 failure against current main
6.7.4-1  Adapter active-lifecycle completion
6.7.4-2  Run status cross-command golden
6.7.4-3  CLI shorthand rule auto-selection
6.7.4-4  Tool display identity
6.7.4-5  Shared step-label formatter and search ordering
6.7.4-6  Bundle refusal exit-code regression
6.7.4-7  Synthetic LangGraph fixture corpus
6.7.4-8  Packed package and compatibility verification
6.7.4-9  Release readiness
```

## v6.7.4 release gate

- Every LangGraph-shaped fixture has one terminal run completion.
- `view`, `explain`, `check`, `eval`, and `stats` agree on status.
- Tool checks use the real tool name.
- Shorthand checks produce findings.
- No renderer shows `tool:tool:` or `llm:llm:`.
- Filtered search is newest-first.
- Unsafe bundle refusal is nonzero.
- Existing v0.1/v0.2/schema 1.0 readers remain compatible.
- No schema change.
- No new network behavior.

---

# 8. v6.7.5 — Consumer, Native Dependency, and DX Reliability Patch

## Goal

Remove first-minute trust failures and current-runtime installation failures.

---

## Scope A — Fix `doctor` package resolution

### Problem

Resolving `<package>/package.json` fails when package exports do not expose `package.json`, even when the package itself resolves.

### Correct strategy

1. Resolve the package entry point.
2. Confirm the documented import/require path.
3. Locate package metadata by walking from the resolved file to the nearest package manifest when a version is needed.
4. Handle pnpm symlinks, npm layouts, workspaces, dependencies, and devDependencies.
5. Do not classify an installed package as missing merely because `package.json` is not exported.

### Required checks

- root ESM
- root CJS
- root version
- AI SDK adapter
- OpenAI Agents adapter
- LangChain adapter
- MCP server
- redact
- optional Studio/index packages
- monorepo workspace
- packed npm consumer
- package actually absent

### Human output

A missing optional package should be:

```text
SKIPPED
```

unless the user explicitly selected the corresponding framework.

### JSON compatibility

Preserve current JSON fields. Add fields only additively.

---

## Scope B — Make Studio and SQLite packages install on current Node

### Immediate dependency update

Upgrade `better-sqlite3` to a release with current Node 26 prebuild support.

### Clean install matrix

Verify:

```text
Node 20 LTS
Node 22 LTS
Node 24 LTS/current supported line
Node 26 current

Linux x64
macOS arm64/x64 where available
Windows x64
```

### Fail-soft design

Studio is optional. Its native dependency must not make a core-only install fail.

Preferred direction:

- load the SQLite driver only when Studio/index functionality starts
- provide an actionable error if the driver is unavailable
- preserve a filesystem-only read path where practical
- do not silently claim Studio works without persistence
- keep SQLite out of root/core dependencies

A future `node:sqlite` driver may be evaluated, but it cannot replace the Node 20 path in this release.

### Support language

Document exact tested Node versions. Do not equate `engines: >=20` with prebuilt-native support on every future current release.

---

## Scope C — Remove absolute local paths from trace metadata

Do not persist an absolute `traceDir` containing usernames or local filesystem structure in every adapter event.

Allowed alternatives:

```text
traceStorage: "local"
workspaceRelativeTraceDir: ".agent-inspect/langchain"
traceDirHash: optional explicit diagnostic
```

Default: omit the path.

If an absolute path is needed for diagnostics, expose it through local CLI diagnostics, not persisted trace metadata.

---

## Scope D — Improve Jest reporter failure diagnostics

The reporter intentionally needs an explicit test-to-trace association. That limitation must never look like a broken reporter.

When failed tests exist but no trace association is resolved:

- emit one visible reporter diagnostic
- state that the reporter does not instrument the test automatically
- link to the explicit association/helper docs
- optionally write a bounded diagnostic summary
- do not claim a trace artifact was generated
- do not hide or replace the original Jest failure

Add an existing-package helper if it meaningfully reduces setup:

```ts
withAgentInspectJestTrace(...)
```

Do not create another package.

---

## Scope E — Add backward-compatible CLI aliases

Normalize sibling concepts without breaking existing scripts:

```text
--out       alias for --output
--output    alias for --out
--profile   alias for --redaction-profile
--redaction-profile alias for --profile
```

Document one canonical spelling:

```text
--output
--redaction-profile
```

Keep legacy aliases through the current major.

---

## Scope F — Improve first-use recipes

Add a blessed NestJS/LangGraph recipe showing:

- lazy development-only import
- environment-gated callback helper
- callbacks array spread
- trace directory
- metadata-only capture
- no production-path change when disabled
- explicit wrapper workaround only for old versions
- current direct path after the adapter fix

---

## v6.7.5 implementation chunks

```text
6.7.5-0  Consumer package-resolution matrix
6.7.5-1  Doctor resolver and diagnostics
6.7.5-2  better-sqlite3 update and Node 26 install evidence
6.7.5-3  Studio/index lazy driver boundary
6.7.5-4  Remove persisted absolute trace paths
6.7.5-5  Jest no-association diagnostics and helper decision
6.7.5-6  CLI aliases and docs
6.7.5-7  NestJS/LangGraph recipe
6.7.5-8  Release readiness
```

## v6.7.5 release gate

- Doctor never contradicts successful module resolution.
- Studio installs on the documented Node/OS matrix.
- Core-only installs remain native-dependency free.
- Traces do not contain the user’s absolute trace directory by default.
- Failed Jest tests without trace associations produce an actionable diagnostic.
- CLI aliases preserve old scripts.
- The NestJS/LangGraph path is copyable and no-key.

---

# 9. v6.8.0 — LangGraph Fidelity and Adapter Contract

## Goal

Promote the LangChain/LangGraph path from “captures useful events” to “faithfully describes lifecycle, identity, and hierarchy.”

This is a minor release because it introduces additive adapter APIs and changes persistence defaults.

---

## Scope A — Define the adapter fidelity contract

Publish the contract in `docs/LANGGRAPH-FIDELITY.md`.

For each standalone invocation:

```text
exactly one envelope start
exactly one terminal envelope
terminal status is correct
every started callback run is terminal or explicitly incomplete
tool identity is human meaningful
model identity is preserved
token metadata is preserved when supplied
parent relationships are explicit, correlated, or visibly unresolved
no relationship is invented from timestamps alone
callback reuse does not mix invocations
persistence is deterministic
```

---

## Scope B — Replace root-ID heuristics with a lifecycle/session model

Maintain per-invocation state:

```ts
interface AdapterInvocationState {
  envelopeRunId: string;
  activeRuns: Map<string, ActiveCallbackRun>;
  endedRuns: Set<string>;
  knownRelationships: Map<string, string>;
  pendingRelationships: PendingRelationship[];
  terminalError?: StructuredError;
  completionGeneration: number;
  finalized: boolean;
}
```

Key rules:

- A callback parent is explicit only when it matches an observed callback `runId`.
- An unobserved parent is an external/semantic parent, not automatically a real node.
- The envelope completes when the invocation has no active lifecycle events after deferred reconciliation.
- Callback reuse creates a new invocation after the previous invocation completes.
- Completion is idempotent.
- Late end events produce diagnostics rather than a second completion.

---

## Scope C — Reconcile LangGraph relationships conservatively

Relationship precedence:

```text
1. exact parent run ID
2. explicit LangGraph metadata relationship
3. unique semantic-name correlation
4. synthetic grouping node with correlated confidence
5. unresolved and visible
```

Use explicit metadata where available:

- `langgraph_node`
- graph step
- checkpoint namespace
- graph/subgraph identity
- tags such as graph-step tags
- task IDs
- tool-call IDs

Do not use timestamps as the only nesting signal.

### Synthetic group rules

A synthetic group node may be created only when:

- several events share the same stable semantic parent label
- no exact parent exists
- grouping improves fidelity
- the node is marked synthetic/correlated
- the raw semantic parent is preserved

---

## Scope D — Expose explicit finalization

Add idempotent methods to `AgentInspectCallback`:

```ts
await callback.flush();
await callback.finalize({ status: "success" });
await callback.close();
```

Use cases:

- serverless shutdown
- unusual framework callback shapes
- explicit tests
- process cleanup

Rules:

- automatic completion remains the normal path
- `finalize` is a fallback, not required boilerplate
- repeated calls are safe
- user-code errors remain authoritative
- finalization failure never replaces the application error

---

## Scope E — Make persistence intent obvious

New default:

```text
traceDir provided + persist omitted → persist true
traceDir absent + persist omitted → in-memory
persist false → explicitly in-memory
persist true → persist to supplied or default trace directory
```

Document the change prominently.

Add an optional construction diagnostic when contradictory options are supplied.

---

## Scope F — Preserve tool identity and implementation identity separately

Canonical fields:

```text
name: tool:<human tool name>
attributes.toolName
attributes.toolClass
attributes.toolCallId
attributes.frameworkRunName
```

Tool contracts and search use `toolName`.

---

## Scope G — Real LangGraph integration fixtures

Add actual no-provider tests using supported LangGraph packages:

- prebuilt ReAct agent with a fake model
- two tools sharing `DynamicStructuredTool`
- streaming invocation
- direct invocation
- subgraph
- parallel node execution
- retry
- error
- interrupt/cancel where exposed
- callback reused across invocations
- LangChain core supported-version matrix

Fixtures must capture the actual callback argument shapes, not only hand-written approximations.

---

## Scope H — Adapter diagnostics

Expose bounded diagnostics for:

- unresolved parent
- late event after finalization
- duplicate start
- end without start
- callback reuse
- persistence failure
- truncation
- unsupported metadata

CLI and MCP summaries should surface the count without dumping internal paths.

---

## v6.8.0 implementation chunks

```text
6.8-0  Fidelity RFC and real callback-shape capture
6.8-1  Per-invocation lifecycle state machine
6.8-2  Callback reuse and deferred completion
6.8-3  Exact and semantic parent reconciliation
6.8-4  Synthetic correlated grouping
6.8-5  Tool identity normalization
6.8-6  Persist-by-intent behavior
6.8-7  flush/finalize/close API
6.8-8  Actual LangGraph no-provider test app
6.8-9  Streaming/subgraph/parallel/error fixture matrix
6.8-10 Adapter diagnostics and docs
6.8-11 NestJS and swarm recipes
6.8-12 Release readiness
```

## v6.8.0 release gate

- Two independent real LangGraph applications pass the fidelity contract.
- Every completed invocation has a terminal envelope.
- Tree depth is correct where explicit relationships exist.
- Unresolved relationships remain visible and qualified.
- Tools display their actual names.
- `traceDir` alone produces a persisted trace.
- Callback reuse does not mix runs.
- No new root dependency.
- No schema break.
- No default upload.

---

# 10. v6.9.0 — Safety Precision and Share Policy

## Goal

Make the safe-sharing workflow trustworthy by reducing false positives without weakening real secret/PII detection.

This is a semantic minor release, not a detector-only patch.

---

## Scope A — Separate source risk from exported-artifact safety

A raw local trace may contain identifiers that must not be shared.

A redacted bundle may still be safe to share.

The bundle pipeline must therefore be:

```text
read source
  ↓
record source findings
  ↓
create redacted derived copy
  ↓
verify the derived copy
  ↓
gate bundle output on derived-copy safety
```

Do not refuse a bundle merely because the source contains data that the bundle successfully removes.

Bundle metadata should contain:

```ts
{
  sourceAssessment,
  artifactAssessment,
  redactionSummary
}
```

Only the artifact assessment controls “share-safe” output.

---

## Scope B — Introduce detector category and confidence

Extend findings additively:

```ts
interface SafetyFinding {
  category:
    | "credential"
    | "personal-data"
    | "identifier"
    | "raw-content"
    | "path"
    | "size"
    | "structure";

  confidence: "high" | "medium" | "low";
  detector: string;
  path: string;
  action: string;
  severity: "error" | "warning" | "info";
}
```

Policy defaults:

```text
high-confidence credential leak → error
high-confidence PII leak → error in share/strict
medium-confidence identifier → warning
low-confidence heuristic → info
oversized content → warning/error by configured policy
reader error → UNKNOWN, fail closed
```

---

## Scope C — Make detectors path-aware

### Token usage

Do not classify these as raw prompts:

```text
tokenUsage.input
tokenUsage.output
tokenUsage.total
usage.input_tokens
usage.output_tokens
```

Raw-content detection should use semantic paths, not only the terminal key name.

### Credit-card detector

Require:

- a 13–19 digit candidate after allowed separators
- valid Luhn
- candidate boundaries
- not UUID-like
- not a trace/span/run ID
- not a token count or timestamp path

Use field context to raise or lower confidence.

### Email detector

Do not treat arbitrary filesystem paths as emails merely because a segment contains `@`.

Distinguish:

- plain email value
- URL
- local path
- package specifier
- source-map path

### UUID and identifiers

UUIDs are identifiers, not credit cards.

For share/strict profiles, identifiers may be redacted by key policy without being misclassified as financial data.

### Current-task/user-input metadata

Add documented path/key coverage for framework metadata such as:

```text
currentTask
task
userInput
requestText
conversationText
```

Classify these as raw content or PII-risk fields, not generic metadata.

---

## Scope D — Explain findings

Add:

```bash
agent-inspect scan <trace> --explain
agent-inspect verify-safe <trace> --explain
```

Each finding should state:

- what matched
- why it matters
- confidence
- whether redaction can remove it
- how to override with an explicit custom rule
- whether it blocks bundle generation

Do not print the sensitive matched value.

---

## Scope E — Define safety policy profiles

Keep redaction profiles:

```text
local
share
strict
```

Add explicit verification policies, if needed:

```text
development
share
strict
```

Do not overload redaction and verification concepts in documentation.

---

## Scope F — False-positive regression corpus

Add fixtures for:

- numeric token counts
- UUIDs
- timestamps
- trace IDs
- local paths with `@`
- scoped npm package names
- source-map paths
- real email
- real provider token
- real JWT
- real credit-card test number
- session/user IDs
- current-task text
- already-redacted values
- hashed identifiers
- custom sensitive keys

Expected outcomes must be explicit for local/share/strict.

---

## Scope G — Safety language

Use:

```text
best-effort share check
verified against the configured local policy
redacted artifact
```

Avoid:

```text
certified safe
compliant
guaranteed PII-free
audit certified
```

---

## v6.9.0 implementation chunks

```text
6.9-0  Safety policy RFC and false-positive corpus
6.9-1  Finding category/confidence model
6.9-2  Path-aware raw-content detection
6.9-3  Credit-card/UUID/path/email precision
6.9-4  Framework metadata sensitivity keys
6.9-5  Source-vs-artifact assessment pipeline
6.9-6  Bundle gating on redacted artifact
6.9-7  Explain-findings CLI
6.9-8  Custom override/rule docs
6.9-9  MCP and CI artifact safety parity
6.9-10 Release readiness
```

## v6.9.0 release gate

- The real metadata-only LangGraph fixtures do not produce known false financial/raw-prompt errors.
- Real credential fixtures remain blocked.
- Redacted output can pass when all blocking source content is removed.
- Bundle generation gates the actual artifact, not the raw source.
- MCP, CLI, reporters, and Studio use the same policy engine.
- No compliance claims.
- No hidden network behavior.

---

# 11. v6.10.0 — Portable Evidence v2

## Goal

Make the portable, share-checked evidence artifact the strongest and most polished output in the product.

The desired reaction is:

> “This is the Playwright report for an agent run.”

---

## Scope A — Define an evidence bundle format

Create a versioned evidence-manifest format distinct from the trace schema:

```json
{
  "evidenceFormatVersion": "1.0",
  "generator": {
    "name": "agent-inspect",
    "version": "6.10.0"
  },
  "source": {
    "runIds": [],
    "traceSchemaVersions": [],
    "sourceHashes": []
  },
  "policy": {
    "redactionProfile": "share",
    "verificationPolicy": "share"
  },
  "assessment": {
    "status": "SAFE WITH WARNINGS"
  },
  "files": [
    {
      "path": "evidence.html",
      "sha256": "..."
    }
  ]
}
```

The manifest is not a certification.

---

## Scope B — Self-contained HTML evidence

Generate one offline file containing:

- summary
- execution tree
- timeline/waterfall
- first causal failure
- tool calls
- LLM calls and token metadata
- observed outcomes
- TraceContract/check failures
- circuit and guardrail findings
- baseline/candidate diff when supplied
- safety/redaction findings
- provenance and source versions
- known reader/mapping losses

Requirements:

- no external assets
- no external network
- strict escaping and CSP
- keyboard-accessible navigation
- print-friendly
- bounded embedded data
- no raw prompt/output by default
- opens directly from disk

---

## Scope C — Folder and archive outputs

Support:

```bash
agent-inspect bundle <run> --format directory
agent-inspect bundle <run> --format html
agent-inspect bundle <run> --format zip
```

Keep current directory output compatible.

Archive extraction/import must remain traversal-safe.

---

## Scope D — Evidence integrity verification

Add:

```bash
agent-inspect bundle verify <path>
```

It should verify:

- manifest schema
- file hashes
- missing files
- unexpected files
- safety assessment presence
- source provenance
- generator version
- optional signature metadata if supplied externally

Do not add signing/key infrastructure in this release.

---

## Scope E — CI integration

Reporters and `artifacts` should be able to produce the same evidence format.

On test failure:

```text
evidence.html
evidence.json
trace.jsonl or redacted derived trace
check-results.json
```

Success remains quiet by default.

---

## Scope F — Stable artifact naming

Use safe artifact IDs, not raw run IDs.

Preserve original run IDs only inside the manifest.

---

## Scope G — Evidence review workflow

Document:

```text
capture
→ check
→ redact
→ verify
→ bundle
→ attach to PR/incident
```

Add one deterministic broken/fixed fixture.

---

## v6.10.0 implementation chunks

```text
6.10-0  Evidence format RFC
6.10-1  Manifest and hash engine
6.10-2  Self-contained HTML shell
6.10-3  Tree/timeline/causal-failure views
6.10-4  Contract/diff/outcome views
6.10-5  Safety/provenance views
6.10-6  Directory/html/zip output modes
6.10-7  bundle verify
6.10-8  Reporter/CI integration
6.10-9  Accessibility and XSS corpus
6.10-10 Cross-platform packed E2E
6.10-11 Documentation and demo
6.10-12 Release readiness
```

## v6.10.0 release gate

- One evidence file opens offline on macOS, Windows, and Linux.
- No trace-derived XSS path exists in the regression corpus.
- Hash verification detects modification.
- Redaction and safety status match CLI output.
- CI reporter artifacts use the same format.
- The broken/fixed demo is deterministic.
- No account, server, or collector is needed.

---

# 12. v6.11.0 — Local Coding-Agent Debug Loop

## Goal

Make the local MCP server the easiest way for a coding assistant to inspect a TypeScript agent run without an OpenTelemetry backend.

This is the second flagship differentiator after portable evidence.

---

## Scope A — Add an executable MCP server

The existing package should support:

```bash
npx @agent-inspect/mcp-server --dir .agent-inspect
```

No custom wrapper script should be required.

Add a package `bin` in the existing package; do not create a new package.

---

## Scope B — Add client configuration generation

Add:

```bash
agent-inspect mcp configure --client cursor
agent-inspect mcp configure --client claude-code
agent-inspect mcp configure --client codex
agent-inspect mcp configure --client gemini
```

Behavior:

- dry-run by default when editing user-level configuration
- project-local option
- explicit confirmation before writing
- no network
- no credentials
- clear trace-directory scope
- easy removal

---

## Scope C — Adopt the official MCP SDK/protocol behavior

Replace or harden the hand-written protocol layer using the official MCP SDK where practical.

Support:

- protocol negotiation
- tools/list
- tools/call
- cancellation
- bounded errors
- current protocol version
- resources where useful
- prompts/skills only when they remain read-only

No HTTP transport is required for the flagship path; stdio is sufficient.

---

## Scope D — Curate the coding-agent tool surface

Flagship tools:

```text
list_recent_runs
list_recent_failures
get_run_summary
get_execution_tree
get_first_causal_failure
get_slowest_path
get_contract_failures
get_failed_observations
compare_runs
create_share_checked_evidence
get_adapter_diagnostics
```

Tool outputs must be:

- redacted
- bounded
- deterministic
- source-linked
- explicit about uncertainty
- free of raw local paths by default

---

## Scope E — Add deterministic causal-failure analysis

Define “first causal failure” conservatively:

1. explicit failed/error event
2. failed observed outcome
3. contract failure linked to an event
4. nearest failed ancestor/child relationship
5. no inference when only timing correlation exists

Return evidence IDs and rationale.

Do not present model-generated diagnosis as fact.

---

## Scope F — Add coding-agent skills/instructions

Ship templates inside the repo/package docs for:

- Cursor
- Claude Code
- Codex
- Gemini CLI

Workflow:

```text
run the agent
find latest failed trace
inspect first causal failure
inspect tool path
compare against last success
read contract failure
suggest code fix
rerun the app/test
confirm contract passes
create share-checked evidence
```

The coding assistant applies fixes; AgentInspect remains read-only and does not modify code.

---

## Scope G — Add the flagship recipe

Create:

```text
examples/starters/coding-agent-debug-loop/
```

No provider key required for the default fixture.

Demonstrate:

```text
broken LangGraph-like run
→ MCP inspection
→ deterministic contract failure
→ code/fixture fix
→ passing rerun
→ portable evidence
```

---

## Scope H — MCP privacy and conformance

Follow current MCP security principles:

- explicit user control
- read-only tools
- sanitized outputs
- bounded payloads
- clear local scope
- no hidden prompt sampling
- no tool execution against the target app
- no unredacted evidence by default

Add conformance tests for:

- initialize
- tools/list
- tools/call
- cancellation
- malformed request
- unknown tool
- oversized result
- sensitive trace
- missing trace
- protocol version negotiation

---

## v6.11.0 implementation chunks

```text
6.11-0  Coding-agent loop RFC
6.11-1  MCP package executable
6.11-2  Official SDK/protocol migration
6.11-3  Curated flagship tools
6.11-4  First-causal-failure engine
6.11-5  Safe evidence and contract tools
6.11-6  Client config generator
6.11-7  Cursor/Claude/Codex/Gemini instructions
6.11-8  Flagship no-key recipe
6.11-9  Protocol/privacy conformance corpus
6.11-10 Packed MCP consumer test
6.11-11 Release readiness
```

## v6.11.0 release gate

- A clean project can configure Cursor or Claude Code in under five minutes.
- No collector/backend is required.
- MCP outputs contain no known fixture secrets.
- A coding assistant can identify the deterministic failure evidence.
- The server cannot modify code or execute target tools.
- The debug loop fixture passes end to end.
- Existing MCP consumers remain compatible or have migration guidance.

---

# 13. v6.12.0 — Consolidation and Stable Launch Candidate

## Goal

Stop presenting 18 equal products and launch one focused product with a credible quality story.

No new runtime feature family is allowed in this release.

---

## Scope A — Rewrite the public identity

Use one sentence consistently:

> **The local evidence debugger for TypeScript agents—faithful execution trees, deterministic regression checks, share-checked evidence, and coding-agent access without a collector or account.**

README hero flow:

```text
1. Capture one real run
2. Find the causal failure
3. Ask your coding agent to inspect it
4. Lock the fix with a contract
5. Attach the share-checked evidence
```

Do not lead with:

- Studio
- PM evals
- 18 packages
- generic observability
- LLM judges
- plugin ecosystem

---

## Scope B — Publish package tiers

Add one canonical support/portfolio table.

Do not display every package equally above the fold.

Provide copyable install paths:

### LangGraph local-debug kit

```bash
npm install -D agent-inspect @agent-inspect/langchain @agent-inspect/mcp-server
```

### Core portable-evidence kit

```bash
npm install -D agent-inspect @agent-inspect/redact
```

### Other adapters

Document AI SDK and OpenAI Agents separately.

---

## Scope C — Audit the fixed-group release model

Evaluate:

- maintenance cost
- package version noise
- optional package download interpretation
- compatibility benefits
- release provenance
- user upgrade clarity

Possible outcomes:

1. keep the fixed group through v6
2. create smaller linked compatibility groups
3. decouple optional packages in v7

Do not decouple in v6.12 without migration and CI proof.

---

## Scope D — Full compatibility proof

Verify packed consumer behavior:

```text
Node 20 / 22 / 24 / 26
ESM / CJS
NodeNext / Node16
npm / pnpm
Linux / macOS / Windows
Jest 29 / 30
Vitest
better-sqlite3 native packages
MCP stdio
```

Retain actual evidence. Do not infer untested support.

---

## Scope E — Three design-partner tracks

### Track 1 — LangGraph fidelity

A real TS/LangGraph project verifies:

- terminal status
- hierarchy
- tool identity
- contracts
- MCP loop

### Track 2 — No-egress evidence

A privacy-sensitive team verifies:

- local capture
- redaction
- bundle
- integrity verification
- incident/PR sharing

### Track 3 — CI regression

A team retains:

- TraceContract
- check/gate
- reporter artifact
- broken/fixed evidence

---

## Scope F — Product and package maintenance audit

After the design-partner period, classify packages:

```text
flagship
supported
maintenance
preview
candidate for future deprecation
```

No deprecation based solely on raw download counts.

Require:

- public dependents
- direct-import search
- design-partner use
- issue volume
- maintenance cost
- migration path

---

## Scope G — Honest comparison docs

Position AgentInspect as complementary:

```text
local evidence and inner-loop debugging → AgentInspect
production observability → LangSmith/Langfuse/MLflow/Phoenix/APM
prompt/output and red-team eval → Promptfoo/Evalite/other eval tools
generic OTel trace access via MCP → OTel MCP servers
```

The handoff story is:

```text
debug locally with AgentInspect
export OpenInference/OTLP when production tooling is needed
```

---

## Scope H — Launch assets

Create one real, current demo:

```text
LangGraph run fails
→ local tree
→ coding agent reads via MCP
→ contract identifies wrong tool path
→ fixed rerun passes
→ share-checked HTML evidence attached to PR
```

Produce:

- 90-second video
- three-minute technical demo
- screenshots from shipped UI
- one architecture diagram
- one privacy diagram
- one case study
- one migration/upgrade guide
- one design-partner guide

---

## v6.12.0 implementation chunks

```text
6.12-0  Positioning and portfolio RFC
6.12-1  README/website/package hierarchy
6.12-2  Install kits and task-oriented docs
6.12-3  Cross-platform packed matrix
6.12-4  Native SQLite matrix
6.12-5  MCP client matrix
6.12-6  LangGraph design-partner trial
6.12-7  No-egress evidence trial
6.12-8  CI contract trial
6.12-9  Package maintenance audit
6.12-10 Honest comparison and interop docs
6.12-11 Launch demo and artifacts
6.12-12 Release readiness
```

## v6.12.0 release gate

- All P0/P1 real-integration defects are closed.
- LangGraph fidelity is externally verified.
- Safety false-positive corpus passes.
- Portable evidence is used in at least one real PR/incident workflow.
- MCP debug loop is used by at least one external developer.
- One CI contract/gate workflow is retained.
- Package support tiers are public and honest.
- No new package was added.
- No default upload exists.
- No schema break exists.

---

# 14. Conditional v7.0.0

## Do not schedule v7 as a marketing number

A major version is justified only by a real breaking change, such as:

- package-version decoupling
- removal of deprecated root exports
- removal/merge of packages
- stable Evidence format API reset
- adapter API stabilization with breaking cleanup
- MCP protocol/API migration that cannot remain compatible

## v7 entry gates

```text
[ ] 5 unrelated teams use AgentInspect after 30 days
[ ] 3 real LangGraph projects pass the fidelity contract
[ ] 2 teams retain portable evidence in CI/PR/incident workflows
[ ] 2 coding-agent MCP workflows are used repeatedly
[ ] 2 CI TraceContract/gate workflows are retained
[ ] no open critical/high fidelity or safety defect
[ ] package deprecation decisions are evidence-backed
[ ] v7 has a concrete migration document
```

If these gates are not met, continue focused v6 maintenance rather than broadening the product.

---

# 15. Feedback disposition

## Accepted immediately

- LangGraph run completion is a P0.
- Cross-command status must be consistent.
- Tool identity must use actual tool names.
- Parent mapping must be framework-aware and conservative.
- Check shorthand rules must execute.
- Scanner false positives block the portable-evidence value proposition.
- Doctor false negatives are first-use trust failures.
- Absolute local paths should not be persisted by default.
- Studio native dependencies need current-runtime support.
- Jest reporter setup must not fail silently.
- Portable evidence is a stronger differentiator than another dashboard.
- MCP is strategically valuable when it requires no collector.

## Accepted with modification

### “Collapse to three packages”

Do not remove packages immediately.

Instead:

- freeze package count
- lead with the flagship set
- tier the remaining packages
- collect usage evidence
- reserve physical consolidation for a justified major version

### “Make MCP the only flagship”

MCP is a flagship workflow, but it depends on faithful trace capture and safe evidence. The product must lead with the full local evidence loop.

### “Make bundles the only identity”

Portable evidence is the strongest human-review output, but the debugging tree and MCP loop are the acquisition wedge. Keep one integrated identity.

### “Persist by default”

Adopt the narrower rule:

```text
traceDir supplied + persist omitted → persist
```

Do not make every in-memory callback write to disk.

---

## Rejected or deferred

- broad observability-platform expansion
- a new LLM-judge package
- Studio as the primary hero
- PM/no-code eval expansion
- more adapters
- context optimization
- replay
- cost engine
- hosted cloud
- new package families
- package deprecation based only on noisy download counts

---

# 16. Testing and validation matrix

## LangGraph adapter

- plain root
- semantic external parent
- real parent run ID
- prebuilt ReAct
- direct invoke
- stream
- subgraph
- parallel nodes
- retries
- errors
- interrupts
- callback reuse
- serverless finalize
- multiple distinct DynamicStructuredTool instances

## Cross-command consistency

The same trace must produce the same:

- run status
- duration
- tool identity
- model identity
- token totals
- error count
- tree relationship confidence

Across:

```text
list
view
what
explain
timeline
stats
search
report
diff
check
eval
gate
bundle
MCP
Studio
```

## Safety

- token counts
- UUIDs
- timestamps
- emails
- paths containing `@`
- scoped package names
- JWT
- provider token
- credit-card test value
- session ID
- user ID
- current-task text
- redacted copy
- hashed identifier
- custom key
- oversized nested data

## Portable evidence

- directory
- single HTML
- ZIP
- hash verification
- modified file
- missing file
- malicious HTML
- unsafe run ID
- Windows path
- archive traversal
- offline open
- CI artifact

## MCP

- initialize negotiation
- tools/list
- tools/call
- cancel
- invalid JSON
- unknown tool
- missing trace
- oversized response
- sensitive response
- contract failure
- compare runs
- evidence creation
- multiple clients/config templates

## Consumer compatibility

- Node 20/22/24/26
- Linux/macOS/Windows
- ESM/CJS
- NodeNext/Node16
- npm/pnpm
- Jest/Vitest
- native SQLite
- packed tarballs only

---

# 17. Standard validation commands

Every runtime release must run:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm fixtures:check
pnpm recipes:check
pnpm docs:check
pnpm public-truth:check
pnpm size
pnpm perf:baseline
pnpm pack:smoke
pnpm compat:smoke
pnpm website:typecheck
pnpm website:build
npm pack --dry-run
git diff --check
```

Package-focused validation:

```bash
pnpm --filter @agent-inspect/langchain test
pnpm --filter @agent-inspect/mcp-server test
pnpm --filter @agent-inspect/redact test
pnpm --filter @agent-inspect/jest test
pnpm --filter @agent-inspect/studio test
pnpm --filter @agent-inspect/index-sqlite test
```

Additional release-specific validation:

```text
LangGraph real integration E2E
false-positive safety corpus
packed portable-evidence E2E
MCP protocol/conformance corpus
native SQLite install matrix
cross-command status golden
```

---

# 18. Cursor execution model

Every Cursor prompt must begin with:

```text
Phase 0 — Audit current source and reproduce the issue
```

The audit must include:

- current package version
- current commit
- working-tree status
- published behavior vs main behavior
- exact reproducer
- current tests
- public API impact
- trace schema impact
- safety impact
- compatibility risk

Every implementation prompt must include:

- goal
- rationale
- in scope
- out of scope
- files to inspect
- implementation constraints
- unit tests
- integration tests
- packed-consumer tests
- docs changes
- validation commands
- final report format
- explicit no-publish instruction unless release authorization is given

Chunk rules:

- one commit-sized change at a time
- no unrelated refactor
- no package version bump during feature chunks
- no new public package
- no schema change without explicit RFC
- no network default change
- no next chunk before review

Final chunk report:

```text
audit summary
files changed
behavior changed
tests added
commands run
results
deviations
remaining risks
compatibility confirmation
privacy/security confirmation
no-publish confirmation
recommended next chunk
```

---

# 19. Adoption and go/no-go checkpoint

After v6.12.0, run an eight-week focused adoption period.

Measure:

- non-release-day root downloads
- public dependents
- retained LangGraph integrations
- repeated MCP use
- evidence bundles used in real reviews
- CI contract/gate retention
- external issues about fidelity vs setup
- design-partner continuation
- direct imports of flagship packages

Do not treat linked-package download parity as proof that all packages are equally used.

Success indicators:

```text
3–5 design partners
2–3 retained CI/evidence workflows
2 repeated MCP debug loops
1 public external integration/case study
organic usage that persists beyond release spikes
```

If the indicators do not appear, narrow further to the strongest retained workflow rather than adding features.

---

# 20. Final implementation order

Execute in this order:

```text
1. v6.7.4 — correctness blockers
2. v6.7.5 — consumer, native dependency, and DX reliability
3. v6.8.0 — LangGraph fidelity contract
4. v6.9.0 — safety precision and share policy
5. v6.10.0 — Portable Evidence v2
6. v6.11.0 — local coding-agent debug loop
7. v6.12.0 — portfolio consolidation and stable launch candidate
8. eight-week focused adoption period
9. conditional v7 decision
```

The ordering is deliberate:

```text
correctness
  ↓
fidelity
  ↓
trustworthy safety
  ↓
portable evidence
  ↓
coding-agent access
  ↓
consolidated product story
```

---

# 21. Final product-owner decision

The detailed feedback is valid and materially changes the next roadmap.

AgentInspect should **continue**, but not as a broad observability or eval platform.

It should become excellent at one coherent job:

> **Local evidence debugging for TypeScript agents.**

That requires:

- a faithful LangGraph tree,
- consistent status and tool identity,
- deterministic contracts that actually execute,
- a safety scanner precise enough to trust,
- a polished portable evidence artifact,
- and a zero-backend MCP loop for coding assistants.

The highest-return move is not another package. It is turning the existing core, LangChain adapter, redaction/check pipeline, bundle, and MCP server into one unusually reliable workflow.
