# AgentInspect Canonical Swarm-Stability and Evidence Roadmap

**Baseline:** `agent-inspect@6.14.1`  
**Roadmap horizon:** `6.14.2 → 6.15.0 → 6.16.0 → conditional v7`  
**Status:** Proposed canonical roadmap after the third external real-project verification round  
**Primary objective:** Make the real LangGraph swarm path, deterministic CI gate, safety assessment, Evidence v2 workflow, and persisted-trace TypeScript API dependable before any further product expansion  
**Persisted trace schema:** remains `1.0`  
**Package policy:** no new public packages before the conditional v7 decision  
**Network policy:** no new default network behavior  
**Product boundary:** local-first and customer-owned; no maintainer-hosted SaaS

---

## 1. Executive decision

The third real-project verification round materially improves the product verdict:

- the original LangGraph capture blockers are fixed;
- the earlier check-engine blockers are fixed;
- a moderate, production-shaped LangGraph agent now passes the complete debug → check → gate flow;
- Evidence v2 continues to work as an integrity-verifiable portable artifact;
- the remaining flagship blocker is now isolated to deeper nested LangGraph/swarm relationships;
- two smaller gaps remain in safety precision and programmatic API ergonomics.

The correct response is **not another horizontal expansion train**.

The correct response is a short, bounded stability program:

```text
6.14.2  Critical swarm relationship and safety precision patch
6.14.3  Reserved corrective patch only
6.15.0  LangGraph swarm fidelity and persisted-trace developer API
6.15.1  Consumer and documentation corrective patch, only if needed
6.16.0  Evidence-first CI and external-pilot launch candidate
6.16.x  Eight-week stability and adoption period
v7      Conditional, only after retained external use
```

The product identity remains:

> **AgentInspect is the local evidence debugger and trajectory-test toolkit for TypeScript agents: capture a framework-faithful execution tree, fail CI when the agent follows the wrong path, and produce a share-checked artifact you own—without an account, collector, or default upload.**

The flagship product loop is:

```text
framework-native capture
        ↓
faithful local execution tree
        ↓
deterministic TraceFacts / TraceContract evaluation
        ↓
CI gate with evidence
        ↓
share-checked Evidence v2 artifact
        ↓
local read-only coding-agent access through MCP
```

---

## 2. Source and verification basis

This roadmap is based on:

1. the published `6.14.1` repository and package line;
2. the current `main` implementation of:
   - `@agent-inspect/langchain`,
   - logical lifecycle projection,
   - TraceFacts,
   - TraceContract,
   - deterministic checks,
   - safety scanning,
   - Evidence v2,
   - read-only MCP;
3. two external, production-shaped TypeScript/NestJS/LangGraph integrations:
   - a moderate `withStructuredOutput` / sub-agent path;
   - a deeper LangGraph swarm with multiple nested runnable chains and a real tool call;
4. repeated real-trace verification at `6.7.3`, `6.12.1`, and `6.14.1`;
5. official framework and adjacent-tool behavior:
   - LangChain callback methods expose `runId`, `parentRunId`, `metadata`, `runName`, and tool-call identity;
   - LangGraph explicitly supports nested subgraphs and multi-agent compositions;
   - Playwright demonstrates the value of portable CI trace artifacts;
   - Promptfoo demonstrates the value of local, repository-owned eval and CI workflows, while occupying a different prompt/output-evaluation category.

Relevant references:

- [LangChain `handleToolStart`](https://reference.langchain.com/javascript/langchain-core/callbacks/base/BaseCallbackHandler/handleToolStart)
- [LangChain `handleChainStart`](https://reference.langchain.com/javascript/langchain-core/callbacks/base/BaseCallbackHandler/handleChainStart)
- [LangGraph subgraphs](https://docs.langchain.com/oss/javascript/langgraph/use-subgraphs)
- [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer-intro)
- [Playwright CI trace guidance](https://playwright.dev/docs/ci-intro)
- [Promptfoo telemetry and local CLI behavior](https://www.promptfoo.dev/docs/configuration/telemetry/)

---

## 3. Current implementation verdict

### 3.1 What is now verified working

The following behaviors are verified in real projects:

- additive, environment-gated LangChain/LangGraph integration;
- TypeScript and CommonJS interoperability;
- coexistence with Braintrust, New Relic, Datadog, and application logging;
- standalone LangGraph run completion;
- human-readable tool names;
- model and token metadata;
- substantially improved parent/child nesting;
- deterministic `explain`;
- multi-root completion/orphan handling in the check engine;
- required-tool matching on moderate and swarm traces;
- numeric token counts no longer triggering the raw-content rule in the check path;
- Evidence v2 generation and integrity verification;
- optional SQLite package installation and runtime loading on verified Node 24 environments.

### 3.2 What remains blocked

The deep swarm path still has three issues:

| ID | Severity | Gap |
| --- | --- | --- |
| **N-4** | High | Nested LangGraph `RunnableSequence` steps can be persisted with `parentId === stepId`, creating a self-cycle, failing `structure.cycle`, and hiding descendants from `view`. |
| **N-6** | Medium | Safety key matching treats fields such as `ls_max_tokens` as credential/token secrets because the key contains the substring `token`, blocking otherwise clean bundles. |
| **N-5** | Low / Beta DX | Programmatic persisted-trace loading and TraceFacts/TraceContract evaluation are difficult to use correctly and produce opaque errors when given a file path or raw v0.1 rows. |

### 3.3 Product wedge status

```text
Moderate single-graph agent:
capture → view → check → gate
STATUS: works

Deep nested LangGraph swarm:
capture → view → check → gate
STATUS: blocked by N-4

Share-safe Evidence v2:
STATUS: works structurally and cryptographically,
        but can be blocked by N-6 false-positive safety classification

Programmatic TraceFacts/TraceContract:
STATUS: Beta; CLI works, direct file-to-API path is not yet ergonomic
```

---

## 4. Product and market focus

### 4.1 Do not compete as a general observability platform

AgentInspect should not expand into:

- hosted production trace retention;
- prompt management;
- dataset hosting;
- online LLM evaluation;
- production alerting;
- team RBAC;
- provider cost billing;
- managed collectors;
- default network upload.

Those categories are already occupied by funded and framework-distributed products.

### 4.2 Do not lead with generic local eval

AgentInspect’s checks and suites matter because they validate **execution trajectories**, not because they replace prompt/output eval runners.

The differentiator is:

```text
framework-faithful execution evidence
+ deterministic trajectory contracts
+ portable share-checked artifact
+ local coding-agent access
```

### 4.3 Evidence v2 remains the strongest human-facing differentiator

The best market analogy remains:

> **The Playwright trace report, for AI-agent runs.**

AgentInspect should make one file useful to:

- the developer debugging locally;
- the reviewer inspecting a pull request;
- the engineer investigating an incident;
- the regulated team proving no-egress handling;
- the coding assistant reading evidence through MCP.

### 4.4 LangGraph swarm fidelity is a product requirement

LangGraph supports nested subgraphs, durable workflows, parallel work, and multi-agent compositions. A local debugger that only works on simple chains cannot claim framework-faithful behavior.

Swarm fidelity is therefore not an edge-case feature. It is part of the core correctness contract.

---

## 5. Portfolio policy

The repository may retain the existing package family, but no new package should be added before v7.

### Tier A — Flagship

```text
agent-inspect
@agent-inspect/langchain
@agent-inspect/redact
@agent-inspect/mcp-server
agent-inspect/checks
```

### Tier B — Official supporting integrations

```text
@agent-inspect/ai-sdk
@agent-inspect/openai-agents
@agent-inspect/harness
@agent-inspect/vitest
@agent-inspect/jest
```

### Tier C — Optional supporting surfaces

```text
@agent-inspect/eval
@agent-inspect/mcp
@agent-inspect/guardrails
@agent-inspect/circuit
@agent-inspect/viewer
@agent-inspect/tui
@agent-inspect/index-sqlite
@agent-inspect/studio
@agent-inspect/adapter-sdk
agent-inspect-vscode
```

Rules through v6:

- no new package;
- no new official framework adapter;
- no package removal in a patch/minor release;
- no physical package consolidation before retained-use evidence;
- no new dashboard/product family;
- package tiers must remain clear in README, website, and package docs.

---

# 6. Release sequence

| Release | Theme | Primary outcome |
| --- | --- | --- |
| **6.14.2** | Swarm correctness and safety precision | No self-parent cycles; clean token configuration no longer blocks evidence |
| **6.14.3** | Reserved corrective patch | Only for defects discovered during 6.14.2 packed/real-project verification |
| **6.15.0** | LangGraph swarm fidelity and persisted-trace developer API | Deep swarms gate correctly; direct TypeScript file-to-TraceFacts/TraceContract path is clear |
| **6.15.1** | Consumer/documentation correction | Only if package, platform, or docs issues remain after 6.15 |
| **6.16.0** | Evidence-first CI and pilot launch candidate | One externally verified end-to-end product story |
| **6.16.x** | Eight-week stability/adoption period | Bugs, compatibility, docs, security, and pilot blockers only |
| **v7** | Conditional | Scheduled only after retained external evidence |

---

# 7. v6.14.2 — Swarm Correctness and Safety Precision Patch

## 7.1 Goal

Fix the two issues that still block the flagship deep-swarm workflow:

```text
N-4  self-referential parent relationship
N-6  token-configuration safety false positive
```

The release must make this flow pass on the anonymized real swarm shape:

```text
capture
→ view full subtree
→ check structure
→ require the real tool
→ gate
→ create Evidence v2
→ bundle verify
```

No new API family, package, or trace schema is required.

---

## 7.2 N-4 root cause

The current LangChain persistence path creates and registers the new step before parent resolution:

```text
create child stepId
register lcRunId → child stepId
register child semantic / LangGraph indexes
resolve parent
```

On nested LangGraph callbacks, an exact or semantic lookup can therefore resolve to the **current child step**, producing:

```text
stepId === parentId
```

The logical projection also needs a defensive rule because legacy or externally imported traces may already contain self-parent relationships.

---

## 7.3 Fix parent resolution ordering

### Required order

Change `onStepStart` to:

```text
1. Prepare invocation
2. Allocate child stepId
3. Resolve parent against indexes containing only previously known steps
4. Reject self-parent if any lookup returns the child stepId
5. Start lifecycle record
6. Persist child start event
7. Register child in exact / semantic / LangGraph indexes
```

The child must never be eligible as its own parent.

### Completion-only synthetic starts

Apply the same rule when an end event arrives without a previously persisted start:

```text
resolve parent before registering the synthesized child step
```

### Resolver defense

Extend parent resolution with an exclusion option:

```ts
interface ParentLookupContext {
  excludeStepId?: string;
}
```

Every lookup must ignore `excludeStepId`.

### Postcondition

After resolution:

```ts
if (resolution.parentStepId === stepId) {
  resolution = {
    confidence: "unresolved",
    parentMapping: "unresolved",
    unresolvedParentRunId: params.lcParentRunId,
    diagnostic: "self-parent-rejected",
  };
}
```

Do not silently preserve a self-edge.

---

## 7.4 Add a capture-level self-parent invariant

Before persisting any step event:

```ts
assertNoSelfParent(stepId, parentId);
```

Behavior:

- never throw into user application code;
- drop the invalid parent edge;
- preserve the original parent reference in bounded metadata;
- increment adapter diagnostics;
- emit a stable diagnostic code.

Recommended code:

```text
AI_LANGGRAPH_SELF_PARENT_REJECTED
```

Recommended bounded metadata:

```json
{
  "parentMapping": "self-parent-rejected",
  "parentConfidence": "unresolved",
  "originalParentRunId": "<bounded>",
  "relationshipWarning": "self-parent"
}
```

Do not include customer payloads or absolute file paths.

---

## 7.5 Add defensive logical-projection normalization

The logical lifecycle projection must protect existing traces.

When parent remapping produces:

```text
nextParent === event.eventId
```

the projection must:

1. remove the logical parent edge;
2. preserve the original parent in projection metadata;
3. emit a diagnostic;
4. keep the event visible as a root;
5. avoid failing the generic cycle rule solely because of this known normalized defect.

Recommended diagnostic:

```text
AI_LOGICAL_SELF_PARENT_REMOVED
```

The raw event remains unchanged and available for audit.

---

## 7.6 Make the tree builder cycle-safe and visibility-first

`view` must never hide a subtree because of a bad relationship.

### Self-parent behavior

If:

```text
parentId === eventId
```

treat the node as a visible root and record a relationship warning.

### General cycle behavior

If a cycle is detected:

- break one edge deterministically;
- prefer breaking the lowest-confidence edge;
- otherwise break the edge whose child appears latest;
- keep every node visible;
- expose a relationship diagnostic;
- never recurse infinitely.

### Tree metadata

Add bounded relationship summary:

```ts
interface RelationshipSummary {
  rootCount: number;
  selfParentCount: number;
  cycleCount: number;
  unresolvedParentCount: number;
  normalizedEdgeCount: number;
}
```

This summary may be shown only in JSON/debug output unless warnings exist.

---

## 7.7 N-6 root cause

The current safety redaction rule classifies a key as sensitive when its normalized name **contains** a sensitive token such as `token`.

That means:

```text
ls_max_tokens
max_tokens
token_count
```

can be treated like credentials even when they are harmless model configuration or numeric metrics.

This is distinct from the raw-content metric fix delivered earlier.

---

## 7.8 Replace substring-sensitive matching with contextual key classification

### Credential keys

Treat these as credential-sensitive:

```text
token
access_token
accessToken
auth_token
authToken
refresh_token
refreshToken
id_token
idToken
bearer_token
bearerToken
api_token
apiToken
authorization
cookie
api_key
apiKey
password
secret
```

### Non-credential token configuration

Do not classify these as credentials based on key alone:

```text
tokens
max_tokens
min_tokens
ls_max_tokens
token_count
token_limit
token_budget
input_tokens
output_tokens
total_tokens
cached_tokens
prompt_tokens
completion_tokens
```

### Value-sensitive fallback

Even for non-credential keys, real secret patterns must still fail:

```text
Bearer ...
sk-...
ghp_...
JWT
AWS key
private key
```

### Type and value handling

Safe without a key-only credential finding:

- finite numbers;
- booleans;
- null;
- explicit `"undefined"` framework placeholders;
- short enum/config values.

Still inspect strings using high-confidence secret detectors.

---

## 7.9 Unify safety classification across all surfaces

The same key classifier must power:

- `check`;
- `scan`;
- `verify-safe`;
- `bundle`;
- Evidence v2;
- MCP share-safe tools;
- Studio safety status;
- `@agent-inspect/redact` findings where applicable.

Do not maintain a separate bundle-only sensitive-key heuristic.

---

## 7.10 Real-pilot regression fixtures

Add anonymized fixtures modeled on both external projects.

### Moderate structured-output fixture

```text
RunnableSequence
  LLM
parser root
completed run
no tool
```

Expected:

```text
check pass
no incomplete
no orphan
no cycle
token counts safe
```

### Deep swarm fixture

```text
CompiledStateGraph
RunnableLambda scaffolding
nested RunnableSequence
  LLM
  tool:get_navan_rewards
completed run
```

Expected:

```text
no self-parent
full subtree visible
required tool passes
structure.cycle passes
Evidence v2 bundle allowed when no genuine PII is present
```

### Safety fixture

Include:

```json
{
  "ls_max_tokens": "undefined",
  "max_tokens": 4096,
  "metadata": {
    "tokens": {
      "input": 1000,
      "output": 120
    }
  }
}
```

Expected:

```text
no credential finding
no raw-content finding
```

Include real secret controls that must continue to fail.

---

## 7.11 Cross-surface acceptance test

For the deep swarm fixture, compare:

```text
view
report
check
TraceContract
gate
bundle
bundle verify
MCP get_trace_facts
MCP first causal failure
```

They must agree on:

- run status;
- root count;
- absence of self-cycle;
- tool identity;
- token counts;
- safety status;
- Evidence v2 verification.

---

## 7.12 6.14.2 implementation chunks

```text
6.14.2-0  Reproduce N-4/N-6 from anonymized fixtures
6.14.2-1  Parent resolution before child index registration
6.14.2-2  Capture-level self-parent invariant and diagnostics
6.14.2-3  Logical projection self-parent normalization
6.14.2-4  Cycle-safe, visibility-first tree building
6.14.2-5  Contextual sensitive-key classifier
6.14.2-6  Safety parity across check/bundle/MCP/Studio
6.14.2-7  Moderate + deep-swarm regression corpus
6.14.2-8  Packed check→gate→bundle→verify E2E
6.14.2-9  Documentation and known-issues update
6.14.2-10 Release readiness
```

---

## 7.13 6.14.2 release gate

Required:

```text
[ ] No self-parent persisted by @agent-inspect/langchain
[ ] Existing self-parent traces normalize without hiding nodes
[ ] Deep swarm view shows nested LLM and tool
[ ] structure.cycle passes on the pilot-shaped swarm
[ ] --required-tool passes
[ ] ls_max_tokens does not trigger credential/high
[ ] Real credentials still fail
[ ] Evidence v2 bundle verify passes
[ ] No schema change
[ ] No new package
[ ] No new default network behavior
[ ] v0.1/v0.2/schema 1.0 compatibility passes
```

---

# 8. v6.14.3 — Reserved Corrective Patch

Do not schedule features for `6.14.3`.

Use only when 6.14.2 post-publication verification finds:

- a remaining nested-parent regression;
- OS or package compatibility failure;
- safety regression;
- Evidence v2 packaging defect;
- MCP parity issue;
- documentation command drift;
- upstream LangChain compatibility issue.

Otherwise skip to `6.15.0`.

---

# 9. v6.15.0 — LangGraph Swarm Fidelity and Persisted-Trace Developer API

## 9.1 Goal

Make deep LangGraph graphs an explicitly supported fidelity class and make the programmatic API as usable as the CLI.

This release resolves N-5 and turns the external pilot shapes into permanent conformance requirements.

---

## 9.2 Define LangGraph fidelity classes

Document and test:

### Class A — Simple chain

```text
one chain
one LLM
optional parser
```

### Class B — Tool-calling agent

```text
agent / sequence
LLM
tool
optional retry
```

### Class C — Structured-output chain

```text
sequence
LLM
parser
multiple root-level framework scaffolds allowed
```

### Class D — Nested subgraph

```text
graph
subgraph
nested sequence
LLM/tool
```

### Class E — Swarm / multi-agent

```text
supervisor or swarm
multiple sub-agents
handoff
nested tool calls
parallel/sequential branches
```

Support claims must state which classes are verified.

---

## 9.3 Add parent invariants to adapter conformance

Every official adapter output should satisfy:

```text
parentId !== eventId
no parent cycle
parent references valid event or is explicitly unresolved/external
all nodes remain visible
terminal operations have terminal status
tool identity is human-meaningful
```

Add conformance fixtures for:

- self-parent;
- two-node cycle;
- unresolved external parent;
- multiple valid roots;
- synthetic group;
- nested subgraph;
- concurrent branches.

---

## 9.4 Resolve residual scaffolding conservatively

Do not force every `RunnableLambda` under the graph root merely for aesthetics.

Policy:

```text
explicit callback parent
→ use it

unique LangGraph metadata relationship
→ correlate with correlated confidence

unique semantic relationship
→ correlate with correlated confidence

ambiguous relationship
→ keep as root and expose diagnostic
```

Correctness and visibility are more important than a cosmetically single-root tree.

---

## 9.5 Programmatic persisted-trace API

### Current problem

The reader API expects a structured `TraceInput`, and `buildTraceFacts` expects normalized persisted events.

Passing:

```ts
readTrace("./run.jsonl")
```

or raw v0.1 rows creates opaque runtime errors.

### Add explicit convenience APIs

From `agent-inspect/readers`:

```ts
openTraceFile(path: string, options?): Promise<TraceReadResult>;
openTraceDirectory(path: string, options?): Promise<TraceReadResult>;
openTraceText(content: string, options?): Promise<TraceReadResult>;
```

Keep existing `openTrace(TraceInput)` unchanged.

### Runtime input guard

If a caller passes an unsupported bare value to `readTrace` or `openTrace`, throw:

```text
AI_TRACE_INPUT_INVALID:
Expected { type: "file", path }, { type: "directory", path },
{ type: "string", content }, { type: "buffer", content }, or { type: "stdin" }.
For a file path, use openTraceFile(path).
```

Never expose `Invalid value used as weak map key`.

---

## 9.6 Improve TraceFacts input ergonomics

Support:

```ts
buildTraceFacts(readResult);
buildTraceFacts(readResult.events);
```

Use overloads:

```ts
function buildTraceFacts(
  input: TraceReadResult | readonly PersistedInspectEvent[],
): TraceFacts;
```

If the caller passes raw v0.1 `TraceEvent[]`, throw a clear message:

```text
AI_TRACE_FACTS_INPUT_NOT_NORMALIZED:
TraceFacts requires TraceReadResult or PersistedInspectEvent[].
Use openTraceFile() to normalize a JSONL trace first.
```

---

## 9.7 Add high-level contract evaluation helper

From `agent-inspect/checks`:

```ts
evaluateTraceContractRead(
  read: TraceReadResult,
  contract: TraceContract,
  options?: { runId?: string },
): TraceCheckResult;
```

Optionally add an async convenience in `agent-inspect/readers` or `/advanced`:

```ts
evaluateTraceFile(
  path: string,
  contract: TraceContract,
  options?: TraceReadOptions & { runId?: string },
): Promise<TraceCheckResult>;
```

Do not add file I/O to the pure low-level rule engine.

---

## 9.8 Programmatic quickstart

Document one canonical path:

```ts
import { openTraceFile } from "agent-inspect/readers";
import {
  buildTraceFacts,
  defineTraceContract,
  evaluateTraceContractRead,
} from "agent-inspect/checks";

const read = await openTraceFile("./.agent-inspect/run.jsonl");
const facts = buildTraceFacts(read);

const contract = defineTraceContract({
  run: { requireCompleted: true },
  tools: { required: ["get_navan_rewards"] },
});

const result = evaluateTraceContractRead(read, contract);

console.log({
  runCount: read.runs.length,
  logicalEvents: facts.logicalEvents.length,
  status: result.status,
});
```

Add equivalent CommonJS and NodeNext examples.

---

## 9.9 Error and diagnostic contract

Programmatic errors should include stable codes:

```text
AI_TRACE_INPUT_INVALID
AI_TRACE_FORMAT_UNSUPPORTED
AI_TRACE_FORMAT_AMBIGUOUS
AI_TRACE_FACTS_INPUT_NOT_NORMALIZED
AI_TRACE_CONTRACT_RUN_SELECTION_REQUIRED
AI_TRACE_RELATIONSHIP_SELF_PARENT
AI_TRACE_RELATIONSHIP_CYCLE
```

Error messages must include a remediation hint.

---

## 9.10 Semantic parity matrix

For every verified fidelity class, assert parity across:

```text
CLI view
CLI check
CLI gate
programmatic TraceFacts
programmatic TraceContract
Evidence v2
MCP
Studio
```

The same trace must produce the same:

- status;
- tool list;
- token totals;
- root count;
- relationship diagnostics;
- contract result;
- safety result.

---

## 9.11 Support-level decision

Do not automatically promote TraceFacts or TraceContract from Beta.

Promotion requires:

```text
[ ] moderate agent real-project verification
[ ] deep swarm real-project verification
[ ] persisted-file API verification
[ ] Vitest/Jest matcher verification
[ ] one external CI use
[ ] no high-severity semantic defect open
```

The release may strengthen Beta without calling it Stable.

---

## 9.12 6.15.0 implementation chunks

```text
6.15-0  LangGraph fidelity-class RFC
6.15-1  Parent/cycle adapter conformance expansion
6.15-2  Nested subgraph and swarm fixture suite
6.15-3  Residual scaffolding diagnostics
6.15-4  openTraceFile/openTraceDirectory/openTraceText
6.15-5  TraceFacts overload and runtime validation
6.15-6  TraceContract read-result convenience helper
6.15-7  Stable error codes and remediation
6.15-8  CommonJS/ESM/NodeNext consumer examples
6.15-9  Cross-surface semantic parity matrix
6.15-10 External pilot rerun
6.15-11 Docs and support-level review
6.15-12 Release readiness
```

---

## 9.13 6.15.0 release gate

```text
[ ] All fidelity classes A–E have deterministic fixtures
[ ] Deep swarm check and gate pass
[ ] Programmatic file-to-TraceFacts path works
[ ] Programmatic file-to-TraceContract path works
[ ] No opaque WeakMap/type errors
[ ] CLI/API/MCP/Evidence semantics agree
[ ] CommonJS and ESM consumers pass
[ ] Node 20/22/24 verified
[ ] No schema change
[ ] No new package
[ ] No new default network behavior
```

---

# 10. v6.15.1 — Consumer and Documentation Corrective Patch

Reserve `6.15.1` for:

- package export corrections;
- TypeScript declaration issues;
- CommonJS/NodeNext incompatibility;
- reader convenience API defects;
- docs-command mismatch;
- LangChain upstream-version compatibility;
- pilot-discovered corrective fixes.

Skip if unnecessary.

---

# 11. v6.16.0 — Evidence-First CI and External-Pilot Launch Candidate

## 11.1 Goal

Turn the corrected technical implementation into one credible, externally proven product story.

No new package or feature family is introduced.

---

## 11.2 Canonical flagship scenario

Ship one no-key deterministic scenario based on the real pilot shapes:

```text
support/rewards agent
→ nested LangGraph sequence
→ LLM metadata
→ tool:get_navan_rewards
→ expected observed outcome
→ intentional broken variant
→ fixed variant
```

Include:

- moderate graph variant;
- deep swarm variant;
- TraceContract;
- suite/gate config;
- Evidence v2 bundle;
- MCP debug instructions.

---

## 11.3 One complete CI flow

Document and test:

```bash
# Capture
npm run agent:broken

# Inspect
npx agent-inspect view <run> --dir .agent-inspect
npx agent-inspect explain <run> --dir .agent-inspect

# Gate
npx agent-inspect check <run> \
  --dir .agent-inspect \
  --required-tool get_navan_rewards \
  --require-completed

# Evidence
npx agent-inspect bundle <run> \
  --dir .agent-inspect \
  --profile share

npx agent-inspect bundle verify \
  .agent-inspect/bundles/<run>

# Compare after fix
npm run agent:fixed
npx agent-inspect diff <broken> <fixed>
```

CI output should retain:

```text
Evidence v2 directory or ZIP
check JSON
contract result
human Markdown summary
optional JUnit
```

---

## 11.4 Framework-first onboarding

The primary docs should lead with:

```text
LangChain / LangGraph
AI SDK
OpenAI Agents
```

before manual instrumentation.

The LangGraph guide should show the exact real-project pattern:

```ts
export function buildAgentInspectCallbacks(name: string) {
  if (process.env.AGENT_INSPECT !== "1") return [];

  return [
    new AgentInspectCallback({
      runName: name,
      traceDir: ".agent-inspect/langchain",
    }),
  ];
}
```

Use:

```ts
callbacks: [
  ...existingCallbacks,
  ...buildAgentInspectCallbacks("copywriter"),
]
```

---

## 11.5 No-egress evidence policy

Add a documented policy object:

```ts
export const localEvidencePolicy = {
  capture: "metadata-only",
  allowNetwork: false,
  evidenceProfile: "strict",
  failOnUnsafeArtifact: true,
};
```

This is a product configuration pattern, not a compliance certification.

Document:

- local capture boundary;
- framework metadata risks;
- user-input fields such as `currentTask`;
- redaction profiles;
- `verify-safe`;
- optional network surfaces;
- Evidence v2 integrity versus privacy assessment.

---

## 11.6 Publish the pilot evidence honestly

With permission, publish the case study.

If names cannot be public, publish an anonymized technical study:

```text
two production-grade NestJS/LangGraph applications
three verification rounds
original blockers
check-engine blockers
deep-swarm regression
final fixes
before/after evidence
```

Distinguish:

```text
private external pilot completed
public attribution approved / not approved
30-day retention pending
```

Do not fabricate customer names or retention.

---

## 11.7 Product presentation

Lead with:

> **The Playwright-style evidence debugger for TypeScript agents.**

Supporting line:

> Capture what the agent did, fail CI when it follows the wrong path, and attach a share-checked artifact—without an account, collector, or default upload.

Do not lead with:

- package count;
- Studio;
- broad observability;
- generic eval;
- dashboard features.

---

## 11.8 Package presentation

### Flagship

```text
agent-inspect
@agent-inspect/redact
@agent-inspect/mcp-server
```

### Framework integrations

```text
@agent-inspect/langchain
@agent-inspect/ai-sdk
@agent-inspect/openai-agents
```

### Testing and optional surfaces

Everything else.

Physical package consolidation remains a possible v7 decision only.

---

## 11.9 6.16.0 implementation chunks

```text
6.16-0  Pilot-derived flagship scenario
6.16-1  Moderate graph golden path
6.16-2  Deep swarm golden path
6.16-3  CI TraceContract/gate workflow
6.16-4  Evidence v2 failed-run artifact workflow
6.16-5  MCP coding-agent walkthrough
6.16-6  Framework-first docs and init guidance
6.16-7  No-egress evidence policy docs
6.16-8  Public/anonymized pilot case study
6.16-9  Website/README/product presentation
6.16-10 Packed consumer E2E
6.16-11 External pilot acceptance
6.16-12 Release readiness
```

---

## 11.10 6.16.0 release gate

```text
[ ] Moderate agent passes end-to-end
[ ] Deep swarm passes end-to-end
[ ] Required-tool gate passes
[ ] No false cycle/orphan/incomplete finding
[ ] Evidence v2 bundle is created and verified
[ ] Safety classifier does not block clean model config
[ ] Genuine user text / PII remains detectable
[ ] Programmatic persisted-trace API works
[ ] MCP returns the same facts as CLI
[ ] At least two external pilot reruns complete
[ ] One CI workflow retains AgentInspect evidence
[ ] No unresolved high-severity fidelity or safety defect
```

---

# 12. v6.16.x — Eight-Week Stability and Adoption Period

After `6.16.0`, stop feature development for eight weeks.

## Allowed work

- security fixes;
- correctness fixes;
- compatibility updates;
- LangChain/LangGraph upstream compatibility;
- package/export fixes;
- documentation;
- performance regressions;
- accessibility;
- pilot blockers.

## Blocked work

- new package;
- new official adapter;
- new dashboard;
- hosted service;
- replay;
- LLM judge;
- context optimization;
- browser-agent package;
- new trace schema;
- major package restructuring.

---

# 13. Adoption evidence before v7

## Required activation evidence

```text
10 unrelated teams complete a useful trace
5 teams complete the framework-native quickstart
median time to first useful trace < 5 minutes
```

## Required retention evidence

```text
5 teams active after 30 days
3 teams retain AgentInspect checks/contracts in CI
2 teams repeatedly create Evidence v2 artifacts
```

## Required technical evidence

```text
2 real LangChain/LangGraph projects
1 deep swarm project
1 repeated MCP coding-agent workflow
1 external adapter or extension
no open high-severity fidelity/safety bug
```

## Directional metrics

Track:

- non-release-day core downloads;
- `@agent-inspect/langchain` attach rate;
- `@agent-inspect/mcp-server` usage;
- public dependents;
- repeat bundle generation;
- external issues and compatibility reports.

NPM downloads alone are not proof of retention.

---

# 14. Conditional v7 decision

v7 is not automatically the next version.

## Possible v7 work if evidence justifies it

- physical package consolidation;
- release-group changes;
- Stable TraceFacts contract;
- Stable TraceContract contract;
- Stable Evidence v2 format;
- Stable MCP tool interface;
- deprecation of unused package surfaces.

## Do not pre-commit v7 to

- hosted SaaS;
- LLM intelligence plugins;
- context optimization;
- browser-agent packages;
- replay;
- automatic remediation;
- production APM behavior.

---

# 15. Cross-cutting regression matrix

Every release in this roadmap must preserve:

## Trace compatibility

```text
v0.1 read
v0.2 read
schema 1.0 read/write
mixed directories
non-destructive migration
malformed final JSONL line
```

## LangGraph fidelity

```text
simple chain
structured output
tool agent
nested subgraph
swarm
parallel branch
multiple valid roots
unresolved semantic parent
self-parent input
two-node cycle input
callback reuse
flush/finalize/close
```

## Checks and contracts

```text
required tool
forbidden tool
tool order
run completion
duration
token budget
observed outcome
orphan
cycle
incomplete
MCP tool rule
```

## Safety

```text
API key
authorization header
cookie
email
user ID
currentTask
UUID
file path with @
ls_max_tokens
max_tokens
numeric token counts
real secret under a metric-looking key
```

## Evidence v2

```text
directory
HTML
ZIP
integrity verification
tampered file
missing file
unsafe artifact
safe artifact
source trace removed after generation
```

## Consumer matrix

```text
Node 20
Node 22
Node 24
current Node evidence
Linux
macOS
Windows
ESM
CommonJS
NodeNext
Node16
Jest
Vitest
```

## MCP

```text
list runs
trace facts
first causal failure
required-tool contract
safe evidence
bounded output
redaction
malformed trace
self-parent normalized trace
```

---

# 16. Standard release validation

Runtime releases must run:

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

Focused validation:

```bash
pnpm --filter @agent-inspect/langchain test
pnpm --filter @agent-inspect/mcp-server test
pnpm --filter @agent-inspect/redact test
pnpm --filter @agent-inspect/vitest test
pnpm --filter @agent-inspect/jest test
```

Security/correctness corpus:

```text
self-parent
cycle
path traversal
XSS
secret detection
token-config false positives
Evidence v2 tampering
MCP result redaction
```

---

# 17. Cursor execution model

Each implementation prompt must begin with:

```text
Phase 0 — Audit current state
```

Required audit:

- current version;
- branch/HEAD;
- clean/dirty working tree;
- current behavior;
- affected packages;
- public API impact;
- schema impact;
- safety impact;
- existing tests;
- exact files planned;
- compatibility risks.

Each chunk must specify:

- goal;
- why;
- in scope;
- out of scope;
- acceptance criteria;
- files to inspect;
- tests to add;
- validation commands;
- final report structure;
- no version/publish/tag action unless explicitly authorized.

Chunk rules:

- one commit-sized concern;
- no unrelated cleanup;
- no automatic version bump;
- release readiness separated from implementation;
- publication remains a manual gate;
- real-pilot fixtures must be anonymized;
- no customer data committed.

Final chunk report:

```text
audit summary
files created
files modified
behavior changed
tests added
commands run
results
deviations
remaining risks
compatibility confirmation
security confirmation
no-publish confirmation
recommended next chunk
```

---

# 18. Documentation updates

Required docs:

```text
README.md
ROADMAP.md
CHANGELOG.md
docs/LANGGRAPH-FIDELITY.md
docs/TRACE-FACTS.md
docs/TRACE-CONTRACTS.md
docs/SAFE-TRACE-SHARING.md
docs/BUNDLES.md
docs/CODING-AGENT-LOOP.md
docs/NESTJS.md
docs/KNOWN-ISSUES.md
docs/SUPPORT-LEVELS.md
docs/API.md
docs/CLI.md
```

Add:

```text
docs/PROGRAMMATIC-TRACE-ANALYSIS.md
docs/case-studies/langgraph-pilot.md
examples/recipes/langgraph-swarm-gate/
examples/recipes/persisted-trace-contract/
```

Public docs must clearly distinguish:

- raw events;
- logical events;
- TraceFacts;
- rendered tree;
- TraceContract result;
- source trace safety;
- derived Evidence v2 safety.

---

# 19. Explicit non-goals

This roadmap does not add:

- a new package;
- a new framework adapter;
- a new trace schema;
- hosted SaaS;
- prompt management;
- dataset management;
- LLM judge;
- provider pricing;
- replay;
- automatic fixes;
- browser-agent SDK;
- context optimizer;
- broader Studio investment.

Studio remains optional and supporting.

---

# 20. Final release order

Execute in this order:

```text
1. 6.14.2 — self-parent + safety precision
2. Real-project verification on both pilot shapes
3. 6.14.3 only if corrective work is required
4. 6.15.0 — swarm fidelity + programmatic persisted-trace API
5. Real-project and consumer matrix verification
6. 6.15.1 only if corrective work is required
7. 6.16.0 — Evidence-first CI and public pilot launch candidate
8. 6.16.x — eight-week stability/adoption period
9. v7 decision only after mandatory gates
```

---

# 21. Final product-owner conclusion

The third pilot round is a strong positive signal.

AgentInspect has moved from:

```text
interesting local trace tool with serious integration gaps
```

to:

```text
credible local evidence debugger whose moderate-agent CI wedge works,
with one deep-swarm relationship regression and two bounded quality gaps
```

The highest-return work is now extremely clear:

1. prevent self-parent edges at capture time;
2. normalize malformed legacy relationships without hiding evidence;
3. make safety key classification context-aware;
4. make persisted-file programmatic APIs obvious and typed;
5. permanently test deep LangGraph swarm shapes;
6. turn the successful pilot into the launch proof.

The product position should remain:

> **The Playwright-style local evidence debugger for TypeScript agents: faithful execution trees, deterministic trajectory gates, share-checked evidence, and local coding-agent access—without an account or collector.**
