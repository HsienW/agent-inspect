import { escapeHtml } from "../exporters/helpers.js";
import {
  extractOutcomesFromPersistedEvents,
  renderObservedOutcomesHtml,
  summarizeObservedOutcomes,
} from "../outcomes/index.js";
import { persistedInspectEventsToTraceEvents } from "../persisted/to-trace-event.js";
import { diffTraceEvents, renderRunDiff } from "../diff/index.js";
import type { PersistedInspectEvent } from "../types/persisted-inspect-event.js";

export interface EvidenceCheckFindingSummary {
  runId: string;
  ruleId: string;
  severity: string;
  message: string;
  category?: string;
  detector?: string;
  confidence?: string;
  action?: string;
}

export interface EvidenceContractsViewInput {
  aggregateStatus: string;
  runs: readonly {
    runId: string;
    status: string;
    sourceStatus?: string;
    errors: number;
    warnings: number;
    findings: number;
  }[];
  findingSummaries?: readonly EvidenceCheckFindingSummary[];
}

function boundMessage(message: string, max = 200): string {
  const trimmed = message.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}…`;
}

/**
 * Contracts / checks HTML: aggregate status + bounded finding taxonomy (no evidence payloads).
 */
export function buildEvidenceContractsViewHtml(input: EvidenceContractsViewInput): string {
  const rows = input.runs
    .map(
      (run) =>
        `<tr><td><code>${escapeHtml(run.runId)}</code></td><td>${escapeHtml(run.status)}</td><td>${escapeHtml(run.sourceStatus ?? "—")}</td><td>${run.errors}</td><td>${run.warnings}</td><td>${run.findings}</td></tr>`,
    )
    .join("");

  const findings = input.findingSummaries ?? [];
  const findingRows =
    findings.length === 0
      ? `<p class="muted">No structured check findings recorded for the redacted artifact.</p>`
      : `<table>
  <thead><tr><th>runId</th><th>severity</th><th>rule</th><th>category</th><th>detector</th><th>message</th></tr></thead>
  <tbody>${findings
    .map(
      (f) =>
        `<tr><td><code>${escapeHtml(f.runId)}</code></td><td>${escapeHtml(f.severity)}</td><td><code>${escapeHtml(f.ruleId)}</code></td><td>${escapeHtml(f.category ?? "—")}</td><td>${escapeHtml(f.detector ?? "—")}</td><td>${escapeHtml(boundMessage(f.message))}</td></tr>`,
    )
    .join("")}</tbody>
</table>`;

  return `<p>Aggregate artifact status: <strong>${escapeHtml(input.aggregateStatus)}</strong></p>
<table>
  <thead><tr><th>runId</th><th>artifact</th><th>source</th><th>errors</th><th>warnings</th><th>findings</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
<h3>Finding summaries</h3>
${findingRows}
<p class="muted">TraceContract / check details are best-effort local results — not a compliance certification.</p>`;
}

/**
 * Observed outcomes view from persisted inspect events (redacted artifact).
 */
export function buildEvidenceOutcomesViewHtml(
  runs: readonly { runId: string; events: readonly PersistedInspectEvent[] }[],
): string {
  if (runs.length === 0) {
    return `<p class="muted">No runs available for outcome extraction.</p>`;
  }
  const parts: string[] = [];
  for (const run of runs) {
    const forRun = run.events.filter((event) => event.runId === run.runId);
    const summary = summarizeObservedOutcomes(extractOutcomesFromPersistedEvents(forRun));
    parts.push(`<article class="run-block">`);
    parts.push(`<h3><code>${escapeHtml(run.runId)}</code></h3>`);
    parts.push(renderObservedOutcomesHtml(summary));
    parts.push(`</article>`);
  }
  return parts.join("\n");
}

/**
 * Diff view: when two event sets are supplied, render a local run diff.
 * Otherwise show an empty-state explaining baseline/candidate is optional.
 */
export function buildEvidenceDiffViewHtml(parts?: {
  leftRunId: string;
  rightRunId: string;
  leftEvents: readonly PersistedInspectEvent[];
  rightEvents: readonly PersistedInspectEvent[];
}): string {
  if (
    parts === undefined ||
    parts.leftEvents.length === 0 ||
    parts.rightEvents.length === 0
  ) {
    return `<p class="muted">No baseline/candidate pair was supplied for this evidence bundle. Attach two runs (or a reporter baseline) to populate this view.</p>`;
  }

  try {
    const left = persistedInspectEventsToTraceEvents(
      parts.leftEvents.filter((e) => e.runId === parts.leftRunId),
    );
    const right = persistedInspectEventsToTraceEvents(
      parts.rightEvents.filter((e) => e.runId === parts.rightRunId),
    );
    if (left.length === 0 || right.length === 0) {
      return `<p class="muted">Could not normalize both runs for diff (missing v0.1-compatible events).</p>`;
    }
    const result = diffTraceEvents(left, right);
    const text = renderRunDiff(result, { color: false, verbose: false });
    return `<p>Comparing <code>${escapeHtml(parts.leftRunId)}</code> → <code>${escapeHtml(parts.rightRunId)}</code></p>
<pre class="summary-md">${escapeHtml(text)}</pre>`;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return `<p class="muted">Diff unavailable: ${escapeHtml(message)}</p>`;
  }
}
