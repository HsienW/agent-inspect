# AgentInspect Canonical Roadmap (permanent)

**Baseline:** `agent-inspect@6.16.0`  
**Roadmap horizon:** `6.16.1 → 6.16.2 → 6.17.0 → 6.17.1 → 6.18.0 → conditional v7`  
**Status:** Active canonical roadmap (permanent path; supersedes version-named roadmap seeds)  
**Primary objective:** Consolidate the repository and public product, improve the evidence/CI developer experience, publish credible technical proof, and keep one maintainable source of truth  
**Persisted trace schema:** remains `1.0`  
**Package policy:** no new public packages before the conditional v7 decision  
**Network policy:** no new default network behavior  
**Product boundary:** local-first and customer-owned; no maintainer-hosted SaaS  
**Technical baseline:** all findings from four real-project verification rounds are resolved at `6.16.0`  
**Named train:** `agentinspect-repository-health-evidence-ux-v6.16-to-pre-v7`

---

## 1. Executive decision

The `6.16.0` verification round is the first round with **zero open product findings** across the two production-shaped TypeScript AI-agent integrations.

Verified outcomes:

```text
Moderate LangGraph / structured-output agent
  capture
  → view / explain
  → deterministic check pass
  → verify-safe SAFE
  → Evidence v2 bundle SAFE
  → bundle verify pass

Deep LangGraph swarm
  capture
  → fully nested execution tree
  → no self-parent / cycle
  → required-tool trajectory gate pass
  → legitimate user-text safety findings remain visible
```

The technical roadmap from `6.7.3` through `6.16.0` achieved its goal:

- LangGraph runs complete;
- tool identity is human-readable;
- nested graph relationships are faithful enough for real swarms;
- logical lifecycle projection prevents false incomplete/orphan findings;
- required-tool checks work;
- token metrics and model token configuration no longer create false safety failures;
- persisted-trace TypeScript APIs are usable;
- Evidence v2 creates integrity-verifiable offline evidence;
- the same facts can be consumed through CLI, test/gate flows, and read-only MCP.

The next phase must therefore **not** add another feature family.

The next phase should make the product:

1. easier to understand;
2. easier to maintain;
3. easier to demonstrate;
4. easier to adopt through framework-native paths;
5. easier to use correctly in CI;
6. harder for public documentation and website content to drift;
7. smaller and healthier as a repository.

The canonical post-`6.16.0` release sequence is:

```text
6.16.1  Repository health, public truth, and documentation cleanup
6.16.2  Canonical docs and website single-source architecture
6.17.0  Trajectory-gate and Evidence v2 workflow UX
6.17.1  Public pilot proof, demos, and content package
6.18.0  Stable niche launch and support-level consolidation
6.18.x  Eight-week adoption and maintenance period
v7      Conditional; scheduled only after retained external use
```

The product identity remains:

> **AgentInspect is the local evidence debugger and trajectory-test toolkit for TypeScript agents: see what the agent did, fail CI when it follows the wrong path, and keep a share-checked artifact—without an account, collector, or default upload.**

The strongest market analogy remains:

> **The Playwright-style evidence report for AI-agent runs.**

---

## 2. Evidence basis

This roadmap is based on four verification rounds across two production-shaped TypeScript agent systems:

- a direct/moderate NestJS + LangGraph / `withStructuredOutput` integration;
- a deeper LangGraph swarm with multiple sub-agents and nested tool/LLM paths.

The integrations were:

- additive;
- environment-gated;
- compatible with existing observability;
- low-friction at the call sites;
- validated under Node 24 LTS;
- verified through actual traces and CLI outputs.

Across the four rounds, eleven findings were reported and fixed:

```text
I-1  optional SQLite / Studio install failure
I-2  missing LangGraph run completion
I-3  implementation class shown instead of tool name
I-4  flattened LangGraph tree
I-5  inconsistent CLI aliases

N-1  multi-root incomplete/orphan false positive
N-2  numeric token metrics flagged as raw content
N-3  required-tool mismatch
N-4  nested swarm self-parent cycle
N-5  persisted-file programmatic API ergonomics
N-6  token configuration key flagged as credential
```

At `6.16.0`:

```text
all eleven findings are resolved;
the moderate-agent gate passes;
the deep-swarm trajectory gate passes;
the moderate-agent Evidence v2 artifact is SAFE without overrides;
the deep-swarm tree renders fully;
programmatic openTraceFile() works.
```

This is sufficient evidence to stop treating capability expansion as the primary roadmap need.

It is **not** yet sufficient evidence to claim broad market adoption, long-term retention, compliance certification, or category leadership.

---

## 3. Product position

### 3.1 Category

AgentInspect is:

> **The local evidence debugger and trajectory-test toolkit for TypeScript AI agents.**

It owns the laptop-to-PR evidence loop:

```text
framework-native capture
        ↓
faithful local execution tree
        ↓
TraceFacts / TraceContract
        ↓
deterministic CI trajectory gate
        ↓
share-checked Evidence v2
        ↓
optional local MCP inspection
```

### 3.2 Strongest product jobs

Ranked by current evidence:

1. **Local inner-loop debugging**
   - inspect one agent run immediately;
   - no account;
   - no collector;
   - no cloud round-trip.

2. **Deterministic trajectory regression gates**
   - assert completion;
   - require or forbid tools;
   - enforce tool order;
   - inspect structure and loops;
   - run without LLM judges or provider keys.

3. **Portable Evidence v2**
   - offline;
   - integrity-verifiable;
   - share-policy-aware;
   - attachable to a pull request, incident, support escalation, or review.

4. **No-egress / regulated development**
   - local files;
   - metadata-first capture;
   - redaction;
   - `verify-safe`;
   - optional customer-owned Studio.

5. **Coding-agent trace access**
   - read-only MCP;
   - same TraceFacts as the CLI;
   - no OpenTelemetry backend required.

### 3.3 Company-tier fit

| Company tier | Primary AgentInspect value |
| --- | --- |
| Solo / startup | Zero-account, zero-collector local debugging |
| Small team | CI trajectory gate + Evidence v2 attached to PRs |
| Medium team | Local evidence layer alongside existing hosted observability |
| Enterprise / regulated | No-default-egress debugging and customer-owned evidence review |

### 3.4 Competitive boundary

AgentInspect does not compete as:

- a production APM;
- hosted trace retention;
- prompt management;
- dataset management;
- online LLM evaluation;
- billing/cost analysis;
- a maintainer-hosted dashboard.

It complements those systems.

The distinctive intersection is:

```text
local
+ no account
+ TypeScript-native
+ execution-trajectory checks
+ portable verified evidence
```

---

## 4. Hard non-goals through v6.18

Do not add:

- a new public package;
- a new official framework adapter;
- a new trace schema;
- hosted SaaS;
- managed trace storage;
- prompt registry;
- dataset platform;
- LLM-as-judge platform;
- provider pricing engine;
- replay;
- automatic remediation;
- browser-agent package;
- context-optimization package;
- another Studio feature train;
- marketplace automation.

The next work is consolidation, evidence UX, public proof, and adoption readiness.

---

## 5. Current repository-health findings

The `6.16.0` repository is technically mature, but its documentation and maintenance surface has accumulated substantial historical weight.

### 5.1 Public-truth drift

Current examples include:

- root package and README at `6.16.0`, while `docs/README.md` still reports an older release;
- README status text referring to the prior `6.15` maintenance line;
- `SUPPORT-LEVELS.md` referring to an older `6.14.x` line;
- duplicate or stale `Unreleased` sections in the root changelog;
- active API documentation containing v1-era wording and outdated support notes;
- shipped proposals still listed as active planning.

### 5.2 Multiple canonical roadmaps remain active

The active `docs/implementation/` directory contains multiple large, superseded roadmap documents:

```text
AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md
AGENTINSPECT-CANONICAL-ROADMAP-V6.12.1-TO-V7.md
AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md
```

Historical material belongs in Git history and a compact history index, not beside the active roadmap.

### 5.3 Completed release trains remain in the active tree

`docs/implementation/release-trains/` contains plans and readiness files from many completed releases.

This creates:

- search noise;
- AI-assistant confusion;
- broken source-of-truth ordering;
- unnecessary review burden;
- stale instructions being mistaken for current work.

### 5.4 Archive sprawl does not meaningfully reduce maintenance cost

Moving old documents into `docs/archive/` keeps them in the current checkout, search index, AI context, and repository tree.

Git history and release tags already preserve the full historical content.

The repository needs a **history summary**, not a copy of every completed prompt, plan, issue body, and checklist.

### 5.5 Stale issue drafts remain committed

`.github/ISSUE_DRAFTS/` still contains early issue specifications for work that shipped long ago.

These should not be part of the current contributor surface.

### 5.6 OS metadata is committed

A tracked `.DS_Store` exists even though it is ignored.

It should be removed from Git.

### 5.7 Proposals are not classified correctly

Many shipped RFCs remain in `docs/proposals/`, while the proposal index calls them active planning with targets from earlier major versions.

Long-lived decisions should become short architecture decision records. Completed design documents should not remain active proposals.

### 5.8 Website documentation duplicates repository documentation

The website currently maintains:

- a manual page registry;
- a manual navigation structure;
- a large React switch containing duplicated documentation content;
- a separate product metadata file;
- manually generated AI-readable assets.

This creates multiple sources of truth.

There is also duplicate/alias content such as separate `contracts` and `trace-contracts` pages.

### 5.9 npm package documentation selection is not intentional enough

The root `files` list publishes many documents, but some flagship current guides are missing while internal/adoption-oriented documents are included.

The npm tarball should include a deliberate, minimal user reference set.

---

# 6. Repository-health policy

Starting with `6.16.1`, the following repository rules become canonical.

## 6.1 One canonical roadmap

Keep one stable path:

```text
docs/implementation/ROADMAP.md
```

Update this file in place.

Do not create another version-named full roadmap for every train.

Historical milestones belong in:

```text
docs/history/ROADMAP-HISTORY.md
```

## 6.2 One active release state

Keep:

```text
docs/implementation/RELEASE-TRAIN-STATE.md
docs/implementation/CURRENT-TASK.md
docs/implementation/active/
```

The `active/` directory may contain:

```text
one execution plan
one release-readiness document
one current audit when required
```

After publication:

- extract lasting decisions;
- update release history;
- delete the completed plan from the active tree.

Git history preserves the full file.

## 6.3 No full archive of completed operational documents

Keep a compact history:

```text
docs/history/
  README.md
  ROADMAP-HISTORY.md
  RELEASE-HISTORY.md
  DECISION-HISTORY.md
  PILOT-HISTORY.md
```

Do not keep every completed:

- Cursor prompt;
- autonomous plan;
- release train;
- readiness report;
- issue draft;
- contributor issue body;
- temporary audit.

## 6.4 Decisions, not stale proposals

Use:

```text
docs/decisions/
  ADR-0001-local-first.md
  ADR-0002-schema-1.0.md
  ADR-0003-evidence-v2.md
  ADR-0004-tracefacts.md
  ADR-0005-no-default-network.md
  ADR-0006-fixed-package-group.md
  ADR-0007-package-tiers.md
```

A shipped RFC should be:

1. summarized into an ADR;
2. removed from active proposals;
3. retained through Git history.

Only genuinely open questions remain in `docs/proposals/`.

## 6.5 Public docs remain stable by URL

Do not mass-rename public documents without redirects or link stubs.

Internal implementation and historical docs can be deleted or consolidated more aggressively.

## 6.6 No duplicate website documentation source

Canonical content must live in one place.

The website should render or generate from repository Markdown/MDX rather than manually reimplementing the same content in React components.

## 6.7 Documentation lifecycle metadata

Every public guide should have frontmatter or manifest metadata:

```yaml
title:
description:
section:
order:
slug:
status:
lastReviewed:
owners:
aliases:
npm:
```

The build must detect stale or orphaned content.

---

# 7. v6.16.1 — Repository Health and Public Truth Patch

## 7.1 Goal

Make the repository easier to maintain and ensure every public surface accurately describes `6.16.0`.

This is primarily a documentation, repository, and packaging patch.

Runtime behavior should not change except for tiny diagnostics or generated metadata corrections required to keep public truth consistent.

---

## 7.2 Public-truth corrections

Update:

- root README;
- `docs/README.md`;
- `ROADMAP.md`;
- `CHANGELOG.md`;
- `docs/SUPPORT-LEVELS.md`;
- `docs/API.md`;
- package READMEs;
- website product facts;
- AI-readable assets;
- npm descriptions where applicable.

Specific corrections:

```text
Current release = 6.16.0
Current maintenance line = 6.16.x
Schema = 1.0
Node = >=20
No open pilot findings at the 6.16 verification point
Private/anonymized pilot validation completed
Long-term retention evidence remains pending
```

Do not claim:

- named customer adoption without permission;
- compliance certification;
- broad production fleet use;
- general observability replacement.

---

## 7.3 Root changelog cleanup

Requirements:

- one `Unreleased` section at the top;
- remove duplicated `Unreleased` blocks;
- remove already-published 6.16 material from `Unreleased`;
- preserve published release entries;
- remove stale patch-candidate notes that already shipped;
- keep Changesets-generated package changelogs untouched unless they are factually wrong.

---

## 7.4 Active implementation cleanup

Create:

```text
docs/implementation/ROADMAP.md
docs/implementation/active/
```

Move the current roadmap content into the stable `ROADMAP.md`.

For superseded canonical roadmaps:

- replace well-linked files with a short superseded stub, or;
- delete them after updating all links.

Stub example:

```md
# Superseded roadmap

This roadmap was completed and superseded by [ROADMAP.md](./ROADMAP.md).

Historical content remains available in Git history at tag `<tag>`.
```

Remove from the active implementation directory:

- completed version-specific roadmaps;
- old adoption plans;
- old release-train summaries;
- completed audits that have been distilled into history or case studies.

---

## 7.5 Release-train cleanup

Keep only:

```text
README.md
active current plan
active release-readiness
conditional v7 assessment
```

Delete completed release-train documents after:

1. recording their release in `RELEASE-HISTORY.md`;
2. preserving any lasting decisions in ADRs;
3. updating links;
4. validating docs.

Do not move hundreds of completed files into another in-repo archive.

---

## 7.6 Archive cleanup

Collapse `docs/archive/` into compact history.

Delete:

- applied issue batches;
- completed contributor hygiene runbooks;
- old public-doc copies;
- historical prompts;
- superseded release trains;
- temporary agent instructions;
- old first-publish checklists.

Retain only concise indexes and Git references.

---

## 7.7 Stale issue-draft cleanup

Delete:

```text
.github/ISSUE_DRAFTS/
```

Before deletion:

- confirm any still-relevant idea exists as a live GitHub issue or current roadmap item;
- do not recreate already-shipped work;
- preserve contributor guidance in current issue templates and contributor docs.

---

## 7.8 OS and generated-file cleanup

Remove tracked:

```text
.DS_Store
```

Add repository checks preventing:

```text
.DS_Store
Thumbs.db
*.orig
*.rej
temporary exported traces
local DB files
generated screenshots outside approved locations
```

---

## 7.9 Proposal cleanup

Audit every file under `docs/proposals/`.

Classify each as:

```text
open
accepted-not-yet-shipped
shipped
rejected
superseded
```

Actions:

- open → keep in `docs/proposals/`;
- accepted-not-yet-shipped → keep with a current target;
- shipped → summarize into ADR, then delete proposal;
- rejected/superseded → summarize only if historically important, then delete.

Rewrite `docs/proposals/README.md` so it contains no ancient “active planning” targets.

---

## 7.10 API and code-comment truth pass

Replace stale references such as:

```text
may evolve during v1.x
published in v1.8
private/unpublished
persist defaults from old versions
```

with current support-level language.

The code comment should state the support level, not a historical release train.

Example:

```ts
/**
 * @beta Available through `agent-inspect/checks`.
 * Additive changes may ship in minors; breaking changes require a future major.
 */
```

---

## 7.11 npm tarball documentation manifest

Create:

```text
docs/PACKAGE-DOCS-MANIFEST.json
```

Recommended root tarball docs:

```text
README.md
LICENSE
SECURITY.md
CHANGELOG.md

docs/GETTING-STARTED.md
docs/FIRST-TRACE-IN-5-MINUTES.md
docs/API.md
docs/CLI.md
docs/SCHEMA.md
docs/MIGRATION.md
docs/LIMITATIONS.md
docs/KNOWN-ISSUES.md
docs/ADAPTERS.md
docs/LANGGRAPH.md
docs/TRACE-FACTS.md
docs/TRACE-CONTRACTS.md
docs/EVIDENCE-FORMAT.md
docs/BUNDLES.md
docs/SAFE-TRACE-SHARING.md
docs/NETWORK-BEHAVIOR.md
docs/CODING-AGENT-LOOP.md
docs/SUPPORT-LEVELS.md
```

Do not publish maintainer roadmaps, outreach plans, demo scripts, or design-partner internal docs in the root npm tarball.

Add a validator ensuring package `files` matches the manifest.

---

## 7.12 Repository-health validator

Add:

```bash
pnpm repo:health
```

Checks:

```text
one canonical implementation roadmap
one active release plan
no tracked OS metadata
no stale issue drafts
no public docs linking into removed archive
no stale hard-coded release version
no duplicate Unreleased changelog headings
no active proposal with a shipped target
no public document missing from the content manifest
no website doc missing from canonical docs
no npm package doc outside the package docs manifest
no active v1.x/v2.x wording in current API docs or code comments
```

Add `repo:health` to:

```text
docs:check
prepublish:checks
CI
```

---

## 7.13 6.16.1 implementation chunks

```text
6.16.1-0   Complete repository inventory and disposition
6.16.1-1   Correct public version/status/product truth
6.16.1-2   Clean root changelog and support-level language
6.16.1-3   Establish stable roadmap and active-plan structure
6.16.1-4   Summarize and delete completed release trains/roadmaps
6.16.1-5   Delete archive, stale issue drafts, OS/editor artifacts
6.16.1-6   Convert shipped proposals to ADRs and delete originals
6.16.1-7   Consolidate agent/Cursor/Codex maintainer instructions
6.16.1-8   Remove stale API/code-comment release-era language
6.16.1-9   Audit, merge, and delete stale examples/READMEs/scripts/assets
6.16.1-10  Add npm package-docs manifest and shrink tarball docs
6.16.1-11  Add repo:health validator and CI wiring
6.16.1-12  Repair links, imports, AI assets, and website references
6.16.1-13  Measure cleanup result and review rendered public surfaces
6.16.1-14  Release readiness and publication
```

---

## 7.14 6.16.1 release gate

```text
[ ] One canonical roadmap
[ ] One active release plan
[ ] No tracked .DS_Store
[ ] No stale .github/ISSUE_DRAFTS
[ ] docs/README reports 6.16.x correctly
[ ] README has no stale 6.15 maintenance wording
[ ] SUPPORT-LEVELS has current line
[ ] One Unreleased changelog section
[ ] Proposals index reflects actual status
[ ] No current public docs point to deleted files
[ ] npm tarball contains the intended current docs
[ ] repo:health passes
[ ] docs:check passes
[ ] package smoke passes
[ ] No trace schema or runtime behavior change
```

---

# 8. v6.16.2 — Canonical Documentation and Website Single-Source Patch

## 8.1 Goal

Eliminate duplicated website/repository documentation and establish one generated content pipeline.

---

## 8.2 Canonical content source

Use repository Markdown or MDX as the source of truth.

Recommended:

```text
docs/
  *.md or *.mdx
  content-manifest.json
```

The website build should read the canonical docs directly.

Do not maintain a second prose copy in:

```text
apps/website/lib/doc-content.tsx
```

---

## 8.3 Documentation manifest

Create a machine-readable manifest or frontmatter-derived index.

Example:

```json
{
  "slug": "trace-contracts",
  "source": "docs/TRACE-CONTRACTS.md",
  "title": "Trace contracts",
  "description": "Deterministic trajectory expectations",
  "section": "Prevent regressions",
  "order": 30,
  "status": "beta",
  "aliases": ["/docs/contracts"],
  "lastReviewed": "2026-08-11"
}
```

The manifest drives:

- website navigation;
- previous/next links;
- metadata;
- sitemap;
- canonical URLs;
- redirects;
- docs search;
- `llms.txt`;
- `llms-full.txt`;
- API/CLI package map;
- docs index.

---

## 8.4 Replace manual website docs rendering

Retire:

- the manually maintained `docPages` list;
- the giant switch in `doc-content.tsx`;
- duplicate summary pages where canonical markdown exists.

Use a markdown/MDX rendering pipeline in the website package.

Dependencies must remain website-only.

Requirements:

- code highlighting;
- headings and TOC;
- callouts;
- internal link rewriting;
- safe HTML handling;
- static generation;
- no runtime CMS;
- no external docs service.

---

## 8.5 Remove duplicate aliases as content

Do not keep both:

```text
/contracts
/trace-contracts
```

as separate content entries.

Choose one canonical route and redirect the alias.

Do the same for any other duplicate/legacy slug.

---

## 8.6 Generate product metadata

Make:

```text
docs/product/PUBLIC-PRODUCT-FACTS.json
```

the canonical machine-readable source.

Generate or import from it:

- website `product` metadata;
- README status snippets where practical;
- npm package descriptions/checks;
- AI manifests;
- public-truth validation.

Avoid manually maintaining the version in both TypeScript and Markdown.

The canonical version still comes from `package.json`; the product facts validator must verify equality.

---

## 8.7 Generate AI-readable assets

Generate:

```text
llms.txt
llms-full.txt
/ai/product.json
/ai/packages.json
/ai/cli.json
/ai/docs.json
Agent Skill metadata
```

from canonical sources.

Do not hand-edit generated artifacts.

---

## 8.8 Add local docs search

Generate a static search index during the website build.

Search should cover only public docs.

Do not index:

- implementation plans;
- release-train files;
- archive/history;
- private adoption ledgers;
- internal audits.

No external search service is required.

---

## 8.9 Website route and content tests

Add tests for:

- every manifest page renders;
- every nav link resolves;
- every alias redirects;
- every sitemap entry exists;
- every canonical URL is unique;
- no duplicate page title/slug;
- no internal maintainer docs are public;
- no stale version string;
- no unsafe raw HTML rendering;
- no broken code sample reference.

---

## 8.10 Docs ownership and freshness

Add:

```text
lastReviewed
owner
status
```

to public content metadata.

`docs:check` should warn when a key document has not been reviewed across a configured number of minor releases.

Priority docs:

```text
Getting started
LangGraph
TraceFacts
TraceContract
Evidence v2
Safe sharing
MCP
Network behavior
Support levels
Comparison
```

---

## 8.11 Website information architecture

Top-level navigation:

```text
Product
Docs
Integrations
Evidence
CI
Security / no-egress
Case study
GitHub
```

Docs task groups:

```text
Start
Capture
Debug
Test trajectories
Create evidence
Share safely
Use MCP
Integrate frameworks
Self-host
Reference
Contribute
```

Do not organize public docs by release history.

---

## 8.12 6.16.2 implementation chunks

```text
6.16.2-0  Canonical content architecture RFC
6.16.2-1  Public docs frontmatter/manifest
6.16.2-2  Markdown/MDX website renderer
6.16.2-3  Generated navigation and previous/next
6.16.2-4  Alias redirects and canonical URLs
6.16.2-5  Product facts generation
6.16.2-6  AI assets generation
6.16.2-7  Static docs search
6.16.2-8  Website/docs route validation
6.16.2-9  Remove manual duplicate content
6.16.2-10 Accessibility, metadata, sitemap, and build verification
6.16.2-11 Release readiness
```

---

## 8.13 6.16.2 release gate

```text
[ ] Root docs are the single prose source
[ ] Website renders canonical docs
[ ] Manual doc-content switch removed
[ ] Manual duplicate page registry removed or generated
[ ] Alias routes redirect
[ ] Product facts are generated/validated
[ ] llms and AI assets are generated
[ ] Public search excludes internal docs
[ ] website:typecheck passes
[ ] website:build passes
[ ] docs:check passes
[ ] repo:health passes
[ ] No runtime package behavior change
```

---

# 9. v6.17.0 — Trajectory Gate and Evidence v2 Workflow UX

## 9.1 Goal

Make the two strongest product wedges obvious and one-command friendly:

```text
trajectory gate
portable Evidence v2
```

This release may add small, additive CLI capabilities. It must not change the underlying semantics or add a new package.

---

## 9.2 Add explicit check presets

### Problem

A default comprehensive check can legitimately fail on captured user text even when the trajectory itself is correct.

Users need to distinguish:

```text
Did the agent follow the right path?
```

from:

```text
Is this artifact safe to share?
```

### Presets

Add:

```bash
agent-inspect check <run> --preset trajectory
agent-inspect check <run> --preset safety
agent-inspect check <run> --preset comprehensive
```

#### `trajectory`

Includes:

- run completion/status;
- structure;
- cycles/orphans;
- required/forbidden tool rules;
- ordering;
- LLM/model/token budgets when configured;
- outcomes;
- guardrail/circuit facts when configured.

Excludes share-safety findings.

#### `safety`

Includes:

- raw-content paths;
- secrets;
- sensitive metadata;
- redaction markers;
- oversized attributes;
- evidence safety policy.

#### `comprehensive`

Includes both.

### Compatibility

Do not silently change the existing default in v6.

Document the canonical CI recommendation:

```bash
agent-inspect check <run> --preset trajectory
agent-inspect verify-safe <run>
```

A future major may reconsider the default only with migration guidance.

---

## 9.3 Add evidence-on-failure workflow

Add options to `check`, `gate`, and test reporters:

```text
--evidence-on fail|always|never
--evidence-dir <path>
--evidence-profile local|share|strict
--evidence-format directory|html|zip
```

Recommended CI use:

```bash
agent-inspect gate \
  --suite agent-inspect.suite.ts \
  --evidence-on fail \
  --evidence-profile share \
  --evidence-format zip
```

Rules:

- no upload;
- artifact remains local;
- print exact path;
- include check/contract findings;
- include safety status;
- do not call Evidence SAFE when assessment is unknown;
- do not suppress the original failure exit code.

---

## 9.4 Add Evidence v2 open UX

Add one additive path:

```bash
agent-inspect bundle open <path>
```

or:

```bash
agent-inspect bundle <run> --open
```

Behavior:

- verify manifest first;
- open the local HTML artifact through the platform browser;
- no server required;
- no network;
- clear fallback path if OS open is unavailable;
- never execute untrusted scripts.

Keep `bundle verify` separate and authoritative.

---

## 9.5 Improve CI scaffolding

Enhance:

```bash
agent-inspect init --framework langgraph --ci github
```

Generated workflow should:

1. run the agent fixture;
2. run the trajectory preset;
3. create Evidence v2 on failure;
4. run `verify-safe`;
5. upload the local artifact using the CI provider’s standard artifact action;
6. avoid provider keys for the deterministic fixture.

Add GitLab and generic CI documentation, but do not create provider-specific packages.

---

## 9.6 Framework metadata safety guidance

Add explicit recipes for LangChain/LangGraph metadata fields that may contain user text:

```text
currentTask
task
userId
sessionId
request metadata
```

Document:

- metadata-only does not mean PII-free;
- how to redact fields;
- how to avoid attaching them;
- how to use `strict` for externally shared evidence;
- why a trajectory check may pass while `verify-safe` correctly fails.

No weakening of safety defaults.

---

## 9.7 Improve CLI summary language

On a trajectory-preset pass with safety findings elsewhere, report:

```text
Trajectory: PASS
Share safety: not evaluated
Run verify-safe before sharing.
```

On comprehensive checks:

```text
Trajectory: PASS
Share safety: FAIL
```

This prevents users from treating all findings as the same class of failure.

---

## 9.8 Evidence manifest enhancements

Additive Evidence v2 metadata:

```json
{
  "checkPreset": "trajectory",
  "trajectoryStatus": "pass",
  "safetyStatus": "safe",
  "sourceFramework": "langgraph",
  "fidelityClass": "swarm"
}
```

Do not change Evidence v2 integrity semantics.

---

## 9.9 6.17.0 implementation chunks

```text
6.17-0  Check-preset RFC and compatibility decision
6.17-1  Trajectory/safety/comprehensive presets
6.17-2  CLI human/JSON output separation
6.17-3  Evidence-on-failure integration
6.17-4  Reporter Evidence v2 integration
6.17-5  Bundle open UX
6.17-6  GitHub CI scaffold update
6.17-7  Generic/GitLab CI docs
6.17-8  Framework metadata safety recipes
6.17-9  Evidence manifest additive metadata
6.17-10 Moderate + swarm packed E2E
6.17-11 Docs and migration notes
6.17-12 Release readiness
```

---

## 9.10 6.17.0 release gate

```text
[ ] trajectory preset passes moderate real-project shape
[ ] trajectory preset passes deep swarm shape
[ ] safety preset catches currentTask/task
[ ] comprehensive reports both classes clearly
[ ] evidence-on-fail retains original failure status
[ ] Evidence v2 path is printed and verifiable
[ ] bundle open is local-only
[ ] generated CI workflow uses no provider key for fixtures
[ ] no existing CLI behavior silently changes
[ ] no new package
[ ] no new default network behavior
```

---

# 10. v6.17.1 — Public Pilot Proof, Demos, and Content Patch

## 10.1 Goal

Turn the four-round real-project validation into credible public proof and make the product easy to understand in under three minutes.

This is a docs, website, example, and presentation patch.

No new runtime feature family.

---

## 10.2 Expand the anonymized case study

Replace the thin current case study with a substantive public-safe version.

Include:

```text
Context
Integration pattern
Four verification rounds
Eleven findings
Before/after behavior
Moderate-agent result
Deep-swarm result
CI trajectory gate
Evidence v2 result
No-egress boundary
What remains unclaimed
```

Public-safe facts:

- two production-shaped NestJS/LangGraph systems;
- additive env-gated integration;
- existing observability remained in place;
- eleven issues were identified across four rounds;
- all eleven were resolved by 6.16.0;
- moderate and deep-swarm trajectory gates passed;
- Evidence v2 passed on a clean moderate trace;
- legitimate captured user text remained subject to safety review.

Do not name organizations or publish private trace content without permission.

---

## 10.3 Create a public pilot timeline

Visual:

```text
6.7.3
capture blockers found
    ↓
6.12.1
capture fixed; check blockers found
    ↓
6.14.1
moderate gate passed; swarm self-cycle found
    ↓
6.16.0
moderate + swarm gates passed; zero open findings
```

Use this as proof of:

- real-world validation;
- technical responsiveness;
- regression depth.

Do not frame bugs as marketing spectacle. Frame them as an evidence-backed hardening process.

---

## 10.4 Publish sanitized sample artifacts

Add synthetic/anonymized:

```text
examples/evidence/moderate-agent/
examples/evidence/langgraph-swarm/
```

Each should contain:

- source fixture;
- trace;
- check result;
- Evidence v2 HTML;
- manifest;
- verify result;
- screenshot.

All artifacts must pass:

```bash
agent-inspect bundle verify
agent-inspect verify-safe
```

No real customer data.

---

## 10.5 Demo suite

### 60–90 second demo

```text
run broken agent
view tree
check fails required tool
run fixed agent
check passes
open Evidence v2
```

### Three-minute technical demo

Add:

```text
LangGraph callback integration
TraceFacts
TraceContract
CI evidence
MCP get_trace_facts
```

### Ten-minute deep dive

Add:

```text
moderate graph
deep swarm
safety/redaction
Evidence integrity
comparison with hosted observability and prompt evals
```

Scripts must use actual shipped commands.

---

## 10.6 Deterministic demo asset generation

Create:

```bash
pnpm demo:generate
pnpm demo:verify
```

Generate:

- terminal text;
- SVG/PNG screenshots where practical;
- Evidence v2 sample;
- JSON output;
- expected result snapshots.

Do not hand-edit generated terminal output.

CI must detect stale demo assets.

---

## 10.7 Website proof and use-case pages

Add:

```text
/case-study/langgraph
/use-cases/local-agent-debugging
/use-cases/trajectory-gates
/use-cases/portable-evidence
/use-cases/no-egress
/integrations/langgraph
```

Homepage priority:

1. debug locally;
2. gate trajectories;
3. keep evidence;
4. optional MCP.

MCP remains a secondary workflow, not the primary hero promise.

---

## 10.8 Audience-specific content

### Startup / solo

Message:

```text
Get the first faithful trace without an account or collector.
```

### Small team

Message:

```text
Fail CI when the agent follows the wrong path and attach the evidence.
```

### Medium team

Message:

```text
Use AgentInspect beside LangSmith, Langfuse, Braintrust, or APM tooling for the local/CI evidence loop.
```

### Regulated / no-egress

Message:

```text
Keep traces local, redact before sharing, and review customer-owned evidence.
```

Do not make compliance-certification claims.

---

## 10.9 Comparison content

Create a job-based comparison rather than a feature-count battle.

Compare:

```text
console.log
AgentInspect
prompt/output eval runner
hosted observability platform
OpenTelemetry directly
```

Dimensions:

```text
local setup
framework execution tree
trajectory gates
portable artifact
share-safety
production fleet monitoring
hosted collaboration
```

Avoid frequently changing download counts in evergreen docs.

---

## 10.10 Search and discoverability content

Target phrases grounded in the product:

```text
TypeScript AI agent debugger
LangGraph JS tracing
LangGraph CI testing
AI agent trajectory testing
local LLM observability TypeScript
shareable AI agent trace
no-egress AI agent debugging
MCP trace debugger
```

Add:

- SoftwareApplication structured data;
- HowTo markup for first trace and CI gate;
- TechArticle markup for the case study;
- current Open Graph images;
- canonical links;
- generated sitemap entries.

---

## 10.11 6.17.1 implementation chunks

```text
6.17.1-0  Public-safe pilot fact sheet
6.17.1-1  Full anonymized case study
6.17.1-2  Four-round timeline visual
6.17.1-3  Sanitized moderate Evidence sample
6.17.1-4  Sanitized swarm Evidence sample
6.17.1-5  90-second demo script/assets
6.17.1-6  Three-minute technical demo
6.17.1-7  Deep-dive demo
6.17.1-8  Website proof and use-case pages
6.17.1-9  Comparison/content update
6.17.1-10 SEO/schema/social metadata
6.17.1-11 Demo generation and stale-asset validator
6.17.1-12 Release readiness
```

---

## 10.12 6.17.1 release gate

```text
[ ] Case study contains no private names/data
[ ] All stated findings are supported by pilot evidence
[ ] No fabricated retention/customer claim
[ ] Sample Evidence passes verify and safety checks
[ ] Demo commands execute against packed package
[ ] Website uses current product facts
[ ] Homepage prioritizes debug/gate/evidence
[ ] MCP remains optional/secondary
[ ] docs:check, repo:health, website build pass
[ ] No runtime feature expansion
```

---

# 11. v6.18.0 — Stable Niche Launch and Support-Level Consolidation

## 11.1 Goal

Declare a coherent, maintainable product line ready for broad adoption outreach.

The release should consolidate what is already proven, not introduce new surface area.

---

## 11.2 Final product promise

Use one canonical message:

> **See what your TypeScript agent did, fail CI when it follows the wrong path, and keep a share-checked evidence artifact—without an account or collector.**

Supporting category:

> **The local evidence debugger and trajectory-test toolkit for TypeScript agents.**

---

## 11.3 Support-level review

Review every package/surface against:

- unit and E2E tests;
- packed consumer validation;
- docs;
- real-project verification;
- external retention;
- known limitations.

### Recommended state after 6.18 review

#### Stable

```text
core schema/readers/writers
inspection CLI
redaction engine
deterministic checks
```

#### Supported

```text
LangChain/LangGraph adapter fidelity classes A–E
AI SDK adapter
OpenAI Agents adapter
harness
workspace/bundles/outcomes
Evidence v2
```

#### Beta

```text
TraceFacts programmatic API
TraceContract
suites/cohorts/gates
SQLite index
viewer
Studio
adapter SDK
Vitest/Jest TraceContract matchers
```

#### Preview

```text
read-only MCP server
Studio HTTP/GitHub ingestion
external standards round-trip proof
```

Do not promote a surface solely because the implementation is complete.

External retained use is required for Stable/Supported promotion where appropriate.

---

## 11.4 Package-tier presentation

Keep physical packages unchanged in v6.

Present only three portfolio groups publicly:

### Core product

```text
agent-inspect
@agent-inspect/redact
@agent-inspect/mcp-server
```

### Framework and testing integrations

```text
@agent-inspect/langchain
@agent-inspect/ai-sdk
@agent-inspect/openai-agents
@agent-inspect/harness
@agent-inspect/vitest
@agent-inspect/jest
```

### Optional advanced surfaces

Everything else.

Avoid repeating the full package matrix near the top of README.

---

## 11.5 Install kits

Document:

### LangGraph local evidence kit

```bash
npm install agent-inspect @agent-inspect/langchain
```

Optional coding-agent access:

```bash
npm install @agent-inspect/mcp-server
```

### AI SDK kit

```bash
npm install agent-inspect @agent-inspect/ai-sdk
```

### OpenAI Agents kit

```bash
npm install agent-inspect @agent-inspect/openai-agents
```

### CI evidence kit

```bash
npm install agent-inspect
```

Avoid forcing users to understand all eighteen packages.

---

## 11.6 Compatibility and provenance matrix

Publish verified evidence for:

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

LangChain/LangGraph supported versions
AI SDK supported versions
OpenAI Agents supported versions
```

Include:

- npm provenance;
- package integrity;
- tarball smoke;
- native SQLite notes;
- known limitations.

---

## 11.7 Contributor and maintainer health

Add:

```text
docs/MAINTAINER-HEALTH.md
```

Track:

- package maintenance tier;
- last meaningful use;
- test ownership;
- upstream compatibility owner;
- deprecation candidate;
- documentation owner.

No package is removed in v6.

Unused-surface decisions belong in v7 after adoption evidence.

---

## 11.8 Launch assets

Required:

```text
README
website
case study
90-second demo
three-minute demo
sample Evidence v2
CI example
framework quickstarts
comparison page
security/no-egress page
release notes
```

All must use one product vocabulary and current screenshots.

---

## 11.9 6.18.0 implementation chunks

```text
6.18-0  Support-level evidence review
6.18-1  Package portfolio and install kits
6.18-2  Compatibility/provenance matrix
6.18-3  README information hierarchy
6.18-4  Website final product hierarchy
6.18-5  Maintainer-health scorecard
6.18-6  Contributor docs and issue labels
6.18-7  Launch sample/release page
6.18-8  Full packed and website regression
6.18-9  External pilot acceptance rerun
6.18-10 Release readiness
```

---

## 11.10 6.18.0 release gate

```text
[ ] Moderate and deep-swarm golden paths pass
[ ] Trajectory preset and Evidence-on-fail pass
[ ] Evidence v2 samples verify
[ ] No stale public version/status
[ ] One canonical docs source
[ ] One canonical roadmap
[ ] Repository health validator passes
[ ] Compatibility matrix is evidence-backed
[ ] Support levels are honest
[ ] Case study and demos are current
[ ] No unresolved high-severity correctness/safety issue
[ ] No new public package
[ ] No new default network behavior
```

---

# 12. v6.18.x — Eight-Week Adoption and Maintenance Period

After `6.18.0`, stop feature development for eight weeks.

## Allowed

- security fixes;
- correctness fixes;
- upstream adapter compatibility;
- package/export fixes;
- docs;
- website corrections;
- performance regressions;
- accessibility;
- pilot blockers.

## Blocked

- new package;
- new adapter;
- new dashboard;
- replay;
- LLM judge;
- hosted service;
- context optimizer;
- new trace schema;
- broad API redesign.

---

# 13. Adoption evidence before v7

## Activation

```text
10 unrelated teams create a useful trace
5 complete a framework-native quickstart
median time to useful trace < 5 minutes
```

## Retention

```text
5 teams active after 30 days
3 teams retain trajectory checks/contracts in CI
2 teams repeatedly create Evidence v2 artifacts
```

## Ecosystem

```text
2 real LangChain/LangGraph projects
1 deep swarm project
1 repeated MCP coding-agent workflow
1 external adapter or extension
1 public external recipe/article
```

## Product pull

Users request:

- deeper evidence workflows;
- adapter contract stability;
- package consolidation;
- improved trajectory contracts;

rather than only:

- setup support;
- documentation fixes;
- package install help.

NPM downloads remain directional, not proof of retained adoption.

---

# 14. Conditional v7 decision

v7 is not automatic.

Possible v7 work only after adoption evidence:

- package consolidation;
- independent package release groups;
- Stable TraceFacts/TraceContract;
- Stable Evidence v2 format;
- Stable MCP tool contract;
- deprecation/removal of unused package surfaces.

Do not pre-commit v7 to:

- hosted SaaS;
- LLM intelligence;
- context optimization;
- browser agents;
- replay;
- automatic remediation.

---

# 15. Repository disposition matrix

## Keep active

```text
README.md
ROADMAP.md
CHANGELOG.md
SECURITY.md
CONTRIBUTING.md

docs/README.md
docs/product/PUBLIC-PRODUCT-FACTS.*
docs/implementation/ROADMAP.md
docs/implementation/RELEASE-TRAIN-STATE.md
docs/implementation/CURRENT-TASK.md
docs/implementation/active/*
docs/implementation/V7 readiness assessment
public product/reference docs
current package READMEs
```

## Replace with short superseded stubs when inbound links may exist

```text
older canonical roadmaps
major historical architecture documents
well-linked prior adoption plans
```

## Summarize into ADR/history, then delete

```text
shipped proposals
completed release trains
completed readiness docs
old implementation audits
old autonomous/Cursor/Codex prompts
old first-publication checklists
applied issue batches
applied community runbooks
```

## Delete directly after confirming no live dependency

```text
.DS_Store
.github/ISSUE_DRAFTS/*
temporary OS/editor artifacts
duplicate public docs already merged elsewhere
stale generated outputs
```

## Keep as generated history

```text
root CHANGELOG.md
package CHANGELOG.md files maintained by Changesets
Git tags and GitHub releases
docs/history summaries
```

---

# 16. Cross-cutting validation

Every roadmap release must preserve:

## Technical golden paths

```text
moderate structured-output agent
deep LangGraph swarm
required-tool trajectory gate
Evidence v2 bundle and verify
openTraceFile programmatic path
MCP TraceFacts parity
```

## Documentation

```text
docs commands
links
public truth
AI assets
content manifest
no stale versions
no orphan docs
no active archive links
```

## Website

```text
typecheck
build
all routes
aliases/redirects
sitemap
canonical URLs
search index
no internal docs exposed
```

## Package

```text
ESM
CommonJS
NodeNext
Node16
npm pack
package smoke
linked versions
package docs manifest
```

## Repository health

```text
one roadmap
one active train
no stale issue drafts
no tracked OS metadata
no completed plans in active directories
no shipped proposal marked active
```

---

# 17. Standard validation commands

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
pnpm repo:health
pnpm website:typecheck
pnpm website:build
npm pack --dry-run
git diff --check
```

Focused package checks:

```bash
pnpm --filter @agent-inspect/langchain test
pnpm --filter @agent-inspect/mcp-server test
pnpm --filter @agent-inspect/redact test
pnpm --filter @agent-inspect/vitest test
pnpm --filter @agent-inspect/jest test
```

---

# 18. Cursor execution model

Each implementation prompt must begin with:

```text
Phase 0 — Audit current state
```

Required audit:

- version;
- branch/HEAD;
- working tree;
- current canonical roadmap;
- current active train;
- exact files planned;
- links/inbound references;
- public API impact;
- schema impact;
- packaging impact;
- website impact;
- safety impact;
- validation plan.

Each chunk must specify:

- goal;
- why;
- in scope;
- out of scope;
- files to inspect;
- files to delete/move/update;
- acceptance criteria;
- tests/validators;
- final report;
- no publish/version/tag unless explicitly authorized.

For deletion/cleanup chunks:

1. inventory references;
2. update replacement links;
3. add summary/ADR if needed;
4. delete;
5. run docs/link/repo health checks;
6. report removed files and retained history.

Do not bulk-delete without a generated disposition report.

---

# 19. Final release order

Execute in this order:

```text
1. 6.16.1 — repository health and public truth
2. 6.16.2 — docs/website single source
3. 6.17.0 — trajectory/evidence UX
4. 6.17.1 — public proof, demos, and content
5. 6.18.0 — stable niche launch
6. 6.18.x — eight-week adoption/maintenance
7. v7 decision only after retained-use gates
```

---

# 20. Final product-owner conclusion

At `6.16.0`, AgentInspect no longer needs another capability roadmap.

The technical product is working across:

- a moderate real agent;
- a deep LangGraph swarm;
- deterministic trajectory checks;
- Evidence v2;
- persisted-trace APIs;
- safe-sharing boundaries.

The next risk is not missing functionality.

The next risks are:

```text
repository complexity
documentation drift
website duplication
unclear workflow defaults
insufficient public proof
low framework-adapter attach rate
```

The highest-return plan is therefore:

1. clean the repository aggressively but safely;
2. establish one documentation source;
3. separate trajectory checks from share-safety checks in the UX;
4. generate Evidence v2 automatically for failed CI paths;
5. publish the four-round pilot as honest technical proof;
6. improve demos and framework-first onboarding;
7. enter adoption with a maintainable, evidence-backed product.

The market position should remain:

> **See what your TypeScript agent did, fail CI when it follows the wrong path, and keep a share-checked evidence artifact—without an account or collector.**
