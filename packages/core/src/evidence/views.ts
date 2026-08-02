import type { InspectNode, InspectRunTree } from "../types/inspect-event.js";
import { escapeHtml, flattenTree } from "../exporters/helpers.js";

function renderTreeHtml(nodes: InspectNode[], ulClass = "tree"): string {
  if (nodes.length === 0) return "";
  const parts: string[] = [`<ul class="${ulClass}">`];
  for (const n of nodes) {
    const ev = n.event;
    const status = ev.status ?? "?";
    const dur =
      ev.durationMs !== undefined && Number.isFinite(ev.durationMs)
        ? `${ev.durationMs}ms`
        : "-";
    const errClass = ev.status === "error" ? " is-error" : "";
    parts.push(`<li class="tree-node${errClass}">`);
    parts.push(
      `<span class="nm">${escapeHtml(ev.name)}</span> <span class="meta">[${escapeHtml(ev.kind)}] ${escapeHtml(status)} (${escapeHtml(dur)})</span>`,
    );
    if (n.children.length > 0) {
      parts.push(renderTreeHtml(n.children, "tree nested"));
    }
    parts.push("</li>");
  }
  parts.push("</ul>");
  return parts.join("");
}

/**
 * Execution-tree HTML fragment for the Evidence Tree view (already escaped).
 */
export function buildEvidenceTreeViewHtml(trees: readonly InspectRunTree[]): string {
  if (trees.length === 0) {
    return `<p class="muted">No execution trees available.</p>`;
  }
  const parts: string[] = [];
  for (const tree of trees) {
    parts.push(`<article class="run-block">`);
    parts.push(`<h3><code>${escapeHtml(tree.runId)}</code></h3>`);
    if (tree.name) {
      parts.push(`<p class="muted">Name: ${escapeHtml(tree.name)}</p>`);
    }
    parts.push(
      `<p>Status: <strong>${escapeHtml(String(tree.status ?? "unknown"))}</strong>${
        tree.durationMs !== undefined ? ` · ${escapeHtml(String(tree.durationMs))}ms` : ""
      }</p>`,
    );
    parts.push(
      tree.children.length > 0
        ? renderTreeHtml(tree.children)
        : `<p class="muted">No steps recorded.</p>`,
    );
    parts.push(`</article>`);
  }
  return parts.join("\n");
}

function timelineRows(tree: InspectRunTree): {
  name: string;
  kind: string;
  status: string;
  offsetMs: number;
  durationMs: number;
  isError: boolean;
}[] {
  const flat = flattenTree(tree);
  const origin =
    tree.startedAt ??
    flat.reduce<number | undefined>((min, n) => {
      const t = n.event.timestamp;
      if (!Number.isFinite(t)) return min;
      return min === undefined ? t : Math.min(min, t);
    }, undefined) ??
    0;
  return flat
    .filter((n) => n.event.kind !== "RUN")
    .map((n) => {
      const started = Number.isFinite(n.event.timestamp) ? n.event.timestamp : origin;
      const durationMs =
        n.event.durationMs !== undefined && Number.isFinite(n.event.durationMs)
          ? Math.max(0, n.event.durationMs)
          : 0;
      return {
        name: n.event.name,
        kind: n.event.kind,
        status: n.event.status ?? "?",
        offsetMs: Math.max(0, started - origin),
        durationMs,
        isError: n.event.status === "error",
      };
    })
    .sort((a, b) => a.offsetMs - b.offsetMs || a.name.localeCompare(b.name));
}

/**
 * Timeline / waterfall HTML fragment (escaped; no external assets).
 */
export function buildEvidenceTimelineViewHtml(trees: readonly InspectRunTree[]): string {
  if (trees.length === 0) {
    return `<p class="muted">No timeline data available.</p>`;
  }
  const parts: string[] = [];
  for (const tree of trees) {
    const rows = timelineRows(tree);
    const maxEnd = rows.reduce(
      (max, row) => Math.max(max, row.offsetMs + Math.max(row.durationMs, 1)),
      1,
    );
    parts.push(`<article class="run-block">`);
    parts.push(`<h3><code>${escapeHtml(tree.runId)}</code></h3>`);
    if (rows.length === 0) {
      parts.push(`<p class="muted">No step timings recorded.</p>`);
    } else {
      parts.push(`<div class="waterfall" role="list">`);
      for (const row of rows) {
        const left = (row.offsetMs / maxEnd) * 100;
        const width = Math.max(0.8, (Math.max(row.durationMs, 1) / maxEnd) * 100);
        const err = row.isError ? " is-error" : "";
        parts.push(
          `<div class="wf-row${err}" role="listitem"><div class="wf-label"><span class="nm">${escapeHtml(row.name)}</span> <span class="meta">[${escapeHtml(row.kind)}] ${escapeHtml(row.status)} · ${escapeHtml(String(row.durationMs))}ms @+${escapeHtml(String(row.offsetMs))}ms</span></div><div class="wf-track"><span class="wf-bar" style="left:${left.toFixed(2)}%;width:${width.toFixed(2)}%"></span></div></div>`,
        );
      }
      parts.push(`</div>`);
    }
    parts.push(`</article>`);
  }
  return parts.join("\n");
}

function findNodeByEventId(nodes: InspectNode[], eventId: string): InspectNode | undefined {
  for (const node of nodes) {
    if (node.event.eventId === eventId) return node;
    const child = findNodeByEventId(node.children, eventId);
    if (child) return child;
  }
  return undefined;
}

function buildAncestorChain(tree: InspectRunTree, failure: InspectNode): InspectNode[] {
  const chain: InspectNode[] = [failure];
  let parentId = failure.event.parentId;
  const guard = new Set<string>([failure.event.eventId]);
  while (parentId && !guard.has(parentId)) {
    guard.add(parentId);
    const parent = findNodeByEventId(tree.children, parentId);
    if (!parent) break;
    chain.unshift(parent);
    parentId = parent.event.parentId;
  }
  return chain;
}

/**
 * First causal failure view: earliest error by timestamp, with parent chain.
 * Does not invent relationships; if no parentId chain exists, shows the error alone.
 */
export function buildEvidenceCausalFailureViewHtml(
  trees: readonly InspectRunTree[],
): string {
  if (trees.length === 0) {
    return `<p class="muted">No runs available for causal analysis.</p>`;
  }
  const parts: string[] = [];
  for (const tree of trees) {
    parts.push(`<article class="run-block">`);
    parts.push(`<h3><code>${escapeHtml(tree.runId)}</code></h3>`);
    const errors = flattenTree(tree)
      .filter((n) => n.event.status === "error" || n.event.kind === "ERROR")
      .sort((a, b) => a.event.timestamp - b.event.timestamp);
    if (errors.length === 0) {
      parts.push(
        `<p class="muted">No error-status events found. Run status: <strong>${escapeHtml(String(tree.status ?? "unknown"))}</strong>.</p>`,
      );
      parts.push(`</article>`);
      continue;
    }
    const first = errors[0]!;
    const chain = buildAncestorChain(tree, first);
    parts.push(`<p>First error by timestamp:</p>`);
    parts.push(`<ol class="causal-chain">`);
    for (const node of chain) {
      const isTip = node.event.eventId === first.event.eventId;
      const msg =
        typeof node.event.attributes?.message === "string"
          ? node.event.attributes.message
          : typeof node.event.attributes?.error === "string"
            ? node.event.attributes.error
            : undefined;
      parts.push(
        `<li class="${isTip ? "causal-tip" : ""}"><span class="nm">${escapeHtml(node.event.name)}</span> <span class="meta">[${escapeHtml(node.event.kind)}] ${escapeHtml(node.event.status ?? "?")} · ${escapeHtml(node.event.eventId)}</span>${
          msg ? `<div class="causal-msg">${escapeHtml(msg.slice(0, 400))}</div>` : ""
        }</li>`,
      );
    }
    parts.push(`</ol>`);
    if (errors.length > 1) {
      parts.push(
        `<p class="muted">${escapeHtml(String(errors.length - 1))} additional error event(s) not shown in the primary chain.</p>`,
      );
    }
    parts.push(`</article>`);
  }
  return parts.join("\n");
}

/** Extra CSS for tree / timeline / causal panels (inlined into evidence shell). */
export const EVIDENCE_VIEW_CSS = `
ul.tree{list-style:none;padding-left:1rem;margin:.5rem 0}
ul.tree.nested{padding-left:1.25rem;border-left:1px solid var(--line);margin:.25rem 0}
.tree-node.is-error .nm,.wf-row.is-error .nm,.causal-tip .nm{color:var(--unsafe)}
.waterfall{display:flex;flex-direction:column;gap:.45rem;max-width:52rem}
.wf-row{display:grid;grid-template-columns:minmax(10rem,18rem) 1fr;gap:.6rem;align-items:center}
.wf-track{position:relative;height:.7rem;background:#e8e8e4;border-radius:.25rem;overflow:hidden}
.wf-bar{position:absolute;top:0;bottom:0;background:var(--accent);border-radius:.25rem}
.wf-row.is-error .wf-bar{background:var(--unsafe)}
.causal-chain{max-width:44rem}
.causal-msg{margin:.25rem 0 0;color:var(--muted);font-size:.92rem}
.run-block{margin:0 0 1.25rem;padding-bottom:1rem;border-bottom:1px solid var(--line)}
.run-block:last-child{border-bottom:0}
@media (max-width:720px){
  .wf-row{grid-template-columns:1fr}
}
`.trim();
