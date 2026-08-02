import { escapeHtml } from "../exporters/helpers.js";

import type { EvidenceManifest, EvidenceSafeStatus } from "./types.js";

export const EVIDENCE_HTML_FILENAME = "evidence.html";

const EVIDENCE_HTML_NOTE =
  "Generated locally by AgentInspect. Share-checked evidence for review — not a compliance or security certification.";

/** View ids reserved for later 6.10 chunks; shell renders stubs except summary. */
export const EVIDENCE_VIEW_IDS = [
  "summary",
  "tree",
  "timeline",
  "causal",
  "tools-llm",
  "outcomes",
  "contracts",
  "circuit",
  "diff",
  "safety",
  "provenance",
] as const;

export type EvidenceViewId = (typeof EVIDENCE_VIEW_IDS)[number];

export interface EvidenceHtmlShellInput {
  title?: string;
  runIds: readonly string[];
  assessmentStatus: EvidenceSafeStatus;
  sourceStatus?: EvidenceSafeStatus;
  redactionProfile: string;
  verificationPolicy: string;
  generatorName: string;
  generatorVersion: string;
  createdAt?: string;
  evidenceFormatVersion?: string;
  /** Optional short summary markdown already safe for display (will be escaped). */
  summaryText?: string;
  /** Bounded check counts (no finding payloads / prompts). */
  checkSummary?: {
    aggregateStatus: EvidenceSafeStatus;
    runs: readonly {
      runId: string;
      status: EvidenceSafeStatus;
      sourceStatus?: EvidenceSafeStatus;
      errors: number;
      warnings: number;
      findings: number;
    }[];
  };
  /** Max chars for embedded JSON payload (default 64 KiB). */
  maxEmbeddedJsonChars?: number;
}

function statusClass(status: string): string {
  if (status === "SAFE") return "st-safe";
  if (status === "SAFE WITH WARNINGS") return "st-warn";
  if (status === "UNSAFE") return "st-unsafe";
  return "st-unknown";
}

function viewLabel(id: EvidenceViewId): string {
  switch (id) {
    case "summary":
      return "Summary";
    case "tree":
      return "Tree";
    case "timeline":
      return "Timeline";
    case "causal":
      return "Causal failure";
    case "tools-llm":
      return "Tools / LLM";
    case "outcomes":
      return "Outcomes";
    case "contracts":
      return "Contracts / checks";
    case "circuit":
      return "Circuit / guardrails";
    case "diff":
      return "Diff";
    case "safety":
      return "Safety / redaction";
    case "provenance":
      return "Provenance";
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

/**
 * Encode JSON for embedding in HTML without breaking out of a script/pre context.
 * Escapes `<` so `</script>` cannot appear in payload text.
 */
export function encodeEmbeddedEvidenceJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}

function buildEmbeddedPayload(input: EvidenceHtmlShellInput): Record<string, unknown> {
  return {
    evidenceFormatVersion: input.evidenceFormatVersion ?? "1.0",
    generator: {
      name: input.generatorName,
      version: input.generatorVersion,
    },
    createdAt: input.createdAt,
    runIds: [...input.runIds],
    assessment: {
      status: input.assessmentStatus,
      ...(input.sourceStatus !== undefined ? { sourceStatus: input.sourceStatus } : {}),
    },
    policy: {
      redactionProfile: input.redactionProfile,
      verificationPolicy: input.verificationPolicy,
    },
    checkSummary: input.checkSummary,
  };
}

/**
 * Build a self-contained offline `evidence.html` shell (no external assets/network).
 * View panels beyond Summary are stubs filled in later 6.10 chunks.
 */
export function buildEvidenceHtmlShell(input: EvidenceHtmlShellInput): string {
  if (input.runIds.length === 0) {
    throw new Error("Evidence HTML shell requires at least one run id.");
  }

  const maxChars = input.maxEmbeddedJsonChars ?? 64 * 1024;
  let embedded = encodeEmbeddedEvidenceJson(buildEmbeddedPayload(input));
  if (embedded.length > maxChars) {
    embedded = encodeEmbeddedEvidenceJson({
      truncated: true,
      evidenceFormatVersion: input.evidenceFormatVersion ?? "1.0",
      runIds: [...input.runIds],
      assessment: { status: input.assessmentStatus },
      note: "Embedded payload truncated to bound; open evidence.json / trace files for full detail.",
    });
  }

  const title = escapeHtml(input.title ?? "AgentInspect evidence");
  const runList = input.runIds
    .map((id) => `<li><code>${escapeHtml(id)}</code></li>`)
    .join("");
  const summaryBody =
    input.summaryText !== undefined && input.summaryText.trim() !== ""
      ? `<pre class="summary-md">${escapeHtml(input.summaryText)}</pre>`
      : `<p class="muted">Open <code>summary.md</code> in this bundle for the full text summary.</p>`;

  const checkRows =
    input.checkSummary?.runs
      .map(
        (run) =>
          `<tr><td><code>${escapeHtml(run.runId)}</code></td><td class="${statusClass(run.status)}">${escapeHtml(run.status)}</td><td>${run.errors}</td><td>${run.warnings}</td><td>${run.findings}</td></tr>`,
      )
      .join("") ?? "";

  const nav = EVIDENCE_VIEW_IDS.map(
    (id) =>
      `<a class="nav-link" href="#view-${id}" data-view="${id}">${escapeHtml(viewLabel(id))}</a>`,
  ).join("\n");

  const stubPanels = EVIDENCE_VIEW_IDS.filter((id) => id !== "summary")
    .map(
      (id) => `  <section id="view-${id}" class="panel" hidden>
    <h2>${escapeHtml(viewLabel(id))}</h2>
    <p class="muted">This view will be filled in a later AgentInspect 6.10 release. The shell is offline-ready.</p>
  </section>`,
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"/>
<meta name="referrer" content="no-referrer"/>
<title>${title}</title>
<style>
:root{--bg:#f7f7f5;--fg:#1a1a1a;--muted:#5c5c5c;--line:#d8d8d4;--accent:#0b5fff;--safe:#0a7a3e;--warn:#9a6700;--unsafe:#b42318;--unknown:#5c5c5c}
*{box-sizing:border-box}
body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;background:var(--bg);color:var(--fg);line-height:1.5}
a{color:var(--accent)}
header{padding:1.25rem 1.5rem;border-bottom:1px solid var(--line);background:#fff}
header h1{margin:0 0 .35rem;font-size:1.35rem}
.note{margin:0;color:var(--muted);font-size:.92rem;max-width:52rem}
.layout{display:grid;grid-template-columns:14rem 1fr;min-height:70vh}
nav{padding:1rem;border-right:1px solid var(--line);background:#fff}
nav .nav-link{display:block;padding:.4rem .55rem;margin:0 0 .2rem;border-radius:.35rem;text-decoration:none;color:inherit}
nav .nav-link:hover,nav .nav-link:focus{background:#eef3ff;outline:2px solid var(--accent);outline-offset:1px}
main{padding:1.25rem 1.5rem}
.panel[hidden]{display:none}
.badge{display:inline-block;padding:.15rem .55rem;border-radius:.3rem;font-size:.85rem;font-weight:600}
.st-safe{color:var(--safe)}.st-warn{color:var(--warn)}.st-unsafe{color:var(--unsafe)}.st-unknown{color:var(--unknown)}
table{border-collapse:collapse;width:100%;max-width:48rem;background:#fff}
th,td{border:1px solid var(--line);padding:.4rem .55rem;text-align:left;vertical-align:top}
th{background:#f0f0ec}
.summary-md,pre.data{white-space:pre-wrap;word-break:break-word;background:#fff;border:1px solid var(--line);padding:.75rem;max-width:52rem}
.muted{color:var(--muted)}
ul.runs{margin:.4rem 0 1rem;padding-left:1.2rem}
@media print{
  nav{display:none}
  .layout{display:block}
  .panel[hidden]{display:block!important;page-break-before:always}
  header{border:0}
}
@media (max-width:720px){
  .layout{grid-template-columns:1fr}
  nav{border-right:0;border-bottom:1px solid var(--line);display:flex;flex-wrap:wrap;gap:.25rem}
}
</style>
</head>
<body>
<header>
  <h1>${title}</h1>
  <p class="note">${escapeHtml(EVIDENCE_HTML_NOTE)}</p>
</header>
<div class="layout">
<nav aria-label="Evidence views">
${nav}
</nav>
<main id="main">
  <section id="view-summary" class="panel" tabindex="-1">
    <h2>Summary</h2>
    <p>Artifact status: <span class="badge ${statusClass(input.assessmentStatus)}">${escapeHtml(input.assessmentStatus)}</span>
    ${
      input.sourceStatus !== undefined
        ? ` · Source status: <span class="badge ${statusClass(input.sourceStatus)}">${escapeHtml(input.sourceStatus)}</span>`
        : ""
    }</p>
    <p>Profile: <code>${escapeHtml(input.redactionProfile)}</code> · Verification: <code>${escapeHtml(input.verificationPolicy)}</code></p>
    <p>Generator: <code>${escapeHtml(input.generatorName)}@${escapeHtml(input.generatorVersion)}</code>
    ${input.createdAt ? ` · Created: <code>${escapeHtml(input.createdAt)}</code>` : ""}</p>
    <h3>Runs</h3>
    <ul class="runs">${runList}</ul>
    ${
      checkRows
        ? `<h3>Check summary</h3>
    <table>
      <thead><tr><th>runId</th><th>artifact</th><th>errors</th><th>warnings</th><th>findings</th></tr></thead>
      <tbody>${checkRows}</tbody>
    </table>`
        : ""
    }
    <h3>Text summary</h3>
    ${summaryBody}
  </section>
${stubPanels}
</main>
</div>
<script type="application/json" id="ai-evidence-data">${embedded}</script>
<script>
(function(){
  var links=document.querySelectorAll("nav .nav-link");
  var panels=document.querySelectorAll("main .panel");
  function show(id){
    for(var i=0;i<panels.length;i++){
      var p=panels[i];
      var on=p.id==="view-"+id;
      if(on){p.removeAttribute("hidden");}else{p.setAttribute("hidden","");}
    }
    for(var j=0;j<links.length;j++){
      var a=links[j];
      if(a.getAttribute("data-view")===id){a.setAttribute("aria-current","page");}
      else{a.removeAttribute("aria-current");}
    }
  }
  for(var k=0;k<links.length;k++){
    links[k].addEventListener("click",function(ev){
      var id=ev.currentTarget.getAttribute("data-view");
      if(!id)return;
      ev.preventDefault();
      if(history.replaceState){history.replaceState(null,"","#view-"+id);}
      show(id);
      var panel=document.getElementById("view-"+id);
      if(panel)panel.focus();
    });
  }
  var hash=(location.hash||"").replace(/^#view-/,"");
  var initial="summary";
  for(var n=0;n<links.length;n++){
    if(links[n].getAttribute("data-view")===hash){initial=hash;break;}
  }
  show(initial);
})();
</script>
</body>
</html>
`;
}

/**
 * Convenience: build shell fields from an EvidenceManifest (views still stubbed).
 */
export function buildEvidenceHtmlShellFromManifest(
  manifest: EvidenceManifest,
  extras?: Partial<Pick<EvidenceHtmlShellInput, "summaryText" | "checkSummary" | "title">>,
): string {
  return buildEvidenceHtmlShell({
    title: extras?.title,
    runIds: manifest.source.runIds,
    assessmentStatus: manifest.assessment.status,
    sourceStatus: manifest.assessment.sourceStatus,
    redactionProfile: manifest.policy.redactionProfile,
    verificationPolicy: manifest.policy.verificationPolicy,
    generatorName: manifest.generator.name,
    generatorVersion: manifest.generator.version,
    createdAt: manifest.createdAt,
    evidenceFormatVersion: manifest.evidenceFormatVersion,
    summaryText: extras?.summaryText,
    checkSummary: extras?.checkSummary,
  });
}
