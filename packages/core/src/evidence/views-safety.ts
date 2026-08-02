import { escapeHtml, flattenTree } from "../exporters/helpers.js";
import type { InspectRunTree } from "../types/inspect-event.js";

import type { EvidenceCheckFindingSummary } from "./views-contract.js";
import type { EvidenceSafeStatus, EvidenceSourceHash } from "./types.js";

export interface EvidenceSafetyViewInput {
  artifactStatus: EvidenceSafeStatus | string;
  sourceStatus?: EvidenceSafeStatus | string;
  redactionProfile: string;
  verificationPolicy: string;
  redaction?: {
    totalFindings: number;
    runs: readonly { runId: string; findings: number; detectors: string[] }[];
  };
  findingSummaries?: readonly EvidenceCheckFindingSummary[];
}

export interface EvidenceProvenanceViewInput {
  generatorName: string;
  generatorVersion: string;
  evidenceFormatVersion: string;
  createdAt?: string;
  runIds: readonly string[];
  traceSchemaVersions: readonly string[];
  sourceHashes: readonly EvidenceSourceHash[];
  packagedFiles: readonly { path: string; role?: string }[];
  note?: string;
}

/**
 * Safety / redaction view: artifact vs source status + detector summary (no raw secrets).
 */
export function buildEvidenceSafetyViewHtml(input: EvidenceSafetyViewInput): string {
  const findingRows =
    (input.findingSummaries ?? []).length === 0
      ? `<p class="muted">No safety findings on the redacted artifact.</p>`
      : `<table>
  <thead><tr><th>runId</th><th>severity</th><th>category</th><th>detector</th><th>action</th><th>message</th></tr></thead>
  <tbody>${(input.findingSummaries ?? [])
    .map((f) => {
      const msg =
        f.message.length > 160 ? `${f.message.slice(0, 160)}…` : f.message;
      return `<tr><td><code>${escapeHtml(f.runId)}</code></td><td>${escapeHtml(f.severity)}</td><td>${escapeHtml(f.category ?? "—")}</td><td>${escapeHtml(f.detector ?? "—")}</td><td>${escapeHtml(f.action ?? "—")}</td><td>${escapeHtml(msg)}</td></tr>`;
    })
    .join("")}</tbody>
</table>`;

  const redactionBlock =
    input.redaction === undefined
      ? `<p class="muted">No redaction report attached.</p>`
      : `<p>Total redaction findings: <strong>${input.redaction.totalFindings}</strong></p>
<ul>${input.redaction.runs
          .map(
            (run) =>
              `<li><code>${escapeHtml(run.runId)}</code>: ${run.findings} finding(s); detectors: ${escapeHtml(run.detectors.join(", ") || "none")}</li>`,
          )
          .join("")}</ul>`;

  return `<p>Artifact status: <strong>${escapeHtml(String(input.artifactStatus))}</strong>
  ${
    input.sourceStatus !== undefined
      ? ` · Source status: <strong>${escapeHtml(String(input.sourceStatus))}</strong>`
      : ""
  }</p>
<p>Redaction profile: <code>${escapeHtml(input.redactionProfile)}</code> · Verification: <code>${escapeHtml(input.verificationPolicy)}</code></p>
<h3>Redaction</h3>
${redactionBlock}
<h3>Safety findings (artifact)</h3>
${findingRows}
<p class="muted">Best-effort local verification only — not a compliance certification. Gate sharing on artifact status.</p>`;
}

/**
 * Provenance / mapping view: generator, schema versions, source hashes, packaged roles.
 */
export function buildEvidenceProvenanceViewHtml(input: EvidenceProvenanceViewInput): string {
  const hashes =
    input.sourceHashes.length === 0
      ? `<p class="muted">No source hashes recorded.</p>`
      : `<table>
  <thead><tr><th>runId</th><th>algorithm</th><th>hash</th></tr></thead>
  <tbody>${input.sourceHashes
    .map(
      (h) =>
        `<tr><td><code>${escapeHtml(h.runId)}</code></td><td>${escapeHtml(h.algorithm)}</td><td><code>${escapeHtml(h.hash)}</code></td></tr>`,
    )
    .join("")}</tbody>
</table>`;

  const files =
    input.packagedFiles.length === 0
      ? `<p class="muted">No packaged files listed.</p>`
      : `<ul>${input.packagedFiles
          .map(
            (f) =>
              `<li><code>${escapeHtml(f.path)}</code>${f.role ? ` <span class="meta">(${escapeHtml(f.role)})</span>` : ""}</li>`,
          )
          .join("")}</ul>`;

  return `<p>Generator: <code>${escapeHtml(input.generatorName)}@${escapeHtml(input.generatorVersion)}</code>
  · Evidence format: <code>${escapeHtml(input.evidenceFormatVersion)}</code>
  ${input.createdAt ? ` · Created: <code>${escapeHtml(input.createdAt)}</code>` : ""}</p>
<p>Runs: ${input.runIds.map((id) => `<code>${escapeHtml(id)}</code>`).join(", ")}</p>
<p>Trace schema versions: ${
    input.traceSchemaVersions.length > 0
      ? input.traceSchemaVersions.map((v) => `<code>${escapeHtml(v)}</code>`).join(", ")
      : "<span class=\"muted\">unknown</span>"
  }</p>
<h3>Source hashes (pre-redaction input)</h3>
${hashes}
<h3>Packaged files</h3>
${files}
<p class="muted">${escapeHtml(input.note ?? "Reader/mapping losses are reported elsewhere when present; relationships are never invented without confidence policy.")}</p>`;
}

/**
 * Tools / LLM metadata view: names, kinds, statuses, durations — no prompts/outputs.
 */
export function buildEvidenceToolsLlmViewHtml(trees: readonly InspectRunTree[]): string {
  if (trees.length === 0) {
    return `<p class="muted">No runs available for tool/LLM metadata.</p>`;
  }
  const parts: string[] = [];
  for (const tree of trees) {
    const nodes = flattenTree(tree).filter(
      (n) => n.event.kind === "TOOL" || n.event.kind === "LLM" || n.event.kind === "AGENT",
    );
    parts.push(`<article class="run-block">`);
    parts.push(`<h3><code>${escapeHtml(tree.runId)}</code></h3>`);
    if (nodes.length === 0) {
      parts.push(`<p class="muted">No TOOL/LLM/AGENT events in this run.</p>`);
    } else {
      parts.push(`<table>
  <thead><tr><th>name</th><th>kind</th><th>status</th><th>durationMs</th></tr></thead>
  <tbody>${nodes
    .map((n) => {
      const dur =
        n.event.durationMs !== undefined && Number.isFinite(n.event.durationMs)
          ? String(n.event.durationMs)
          : "—";
      return `<tr><td>${escapeHtml(n.event.name)}</td><td>${escapeHtml(n.event.kind)}</td><td>${escapeHtml(n.event.status ?? "?")}</td><td>${escapeHtml(dur)}</td></tr>`;
    })
    .join("")}</tbody>
</table>`);
    }
    parts.push(`</article>`);
  }
  return parts.join("\n");
}

/**
 * Circuit / guardrails placeholder filled with conservative empty state unless findings supplied.
 */
export function buildEvidenceCircuitViewHtml(parts?: {
  findings?: readonly { runId: string; name: string; status: string; detail?: string }[];
}): string {
  const findings = parts?.findings ?? [];
  if (findings.length === 0) {
    return `<p class="muted">No circuit or guardrail findings were attached to this evidence bundle.</p>`;
  }
  return `<table>
  <thead><tr><th>runId</th><th>name</th><th>status</th><th>detail</th></tr></thead>
  <tbody>${findings
    .map(
      (f) =>
        `<tr><td><code>${escapeHtml(f.runId)}</code></td><td>${escapeHtml(f.name)}</td><td>${escapeHtml(f.status)}</td><td>${escapeHtml(f.detail ?? "—")}</td></tr>`,
    )
    .join("")}</tbody>
</table>`;
}
