/**
 * Version-pinned reader/exporter mapping ledger (6.22).
 *
 * Records which external convention version was used and what was lost.
 * Does not bind persisted schema 1.0 to an unstable external convention.
 *
 * @experimental Available through `agent-inspect/readers`.
 */

export type MappingConfidence = "explicit" | "correlated" | "heuristic" | "unknown";

export type MappingLossKind =
  | "none"
  | "dropped"
  | "bounded"
  | "privacy-redacted"
  | "kind-degraded"
  | "unsupported";

/**
 * One source→target mapping row.
 *
 * @experimental
 */
export interface MappingLedgerEntry {
  source: string;
  target: string;
  transformation: string;
  confidence: MappingConfidence;
  loss: MappingLossKind;
  privacyDecision?: string;
}

/**
 * Ledger published by a reader or exporter mapping.
 *
 * @experimental
 */
export interface MappingLedger {
  id: string;
  sourceFormat: string;
  targetFormat: string;
  /** External convention pin (e.g. OTel GenAI / OpenInference version). */
  convention?: {
    name: string;
    version: string;
    specUrl?: string;
  };
  entries: readonly MappingLedgerEntry[];
  knownLosses: readonly string[];
}

/** OpenInference → AgentInspect mapping ledger pin. */
export const OPENINFERENCE_MAPPING_LEDGER: MappingLedger = {
  id: "openinference-to-agent-inspect",
  sourceFormat: "openinference-json",
  targetFormat: "agent-inspect-persisted-1.0",
  convention: {
    name: "OpenInference",
    version: "0.2.x",
    specUrl: "https://github.com/Arize-ai/openinference",
  },
  entries: [
    {
      source: "span.context.span_id",
      target: "eventId / trace.spanId",
      transformation: "hex identity when present",
      confidence: "explicit",
      loss: "none",
    },
    {
      source: "span.context.trace_id",
      target: "trace.traceId",
      transformation: "hex identity when present",
      confidence: "explicit",
      loss: "none",
    },
    {
      source: "span.parent_id",
      target: "parentId",
      transformation: "direct when resolvable in batch",
      confidence: "explicit",
      loss: "none",
    },
    {
      source: "attributes.openinference.span.kind",
      target: "kind",
      transformation: "enumerated kind map with degrade-to-LOGIC",
      confidence: "correlated",
      loss: "kind-degraded",
      privacyDecision: "unknown kinds preserved under bounds as attributes",
    },
    {
      source: "attributes.llm.input_messages / output_messages",
      target: "inputSummary / outputSummary",
      transformation: "bounded summaries only",
      confidence: "heuristic",
      loss: "privacy-redacted",
      privacyDecision: "raw message bodies are not required and may be omitted",
    },
  ],
  knownLosses: [
    "Chain-of-thought / private reasoning fields are never imported as raw content.",
    "Oversized attributes are bounded or marked unsupported.",
    "Unknown OpenInference kinds degrade to LOGIC with a warning.",
  ],
};

/** OTLP JSON → AgentInspect mapping ledger pin. */
export const OTLP_JSON_MAPPING_LEDGER: MappingLedger = {
  id: "otlp-json-to-agent-inspect",
  sourceFormat: "otlp-json",
  targetFormat: "agent-inspect-persisted-1.0",
  convention: {
    name: "OpenTelemetry GenAI semantic conventions",
    version: "1.36.0",
    specUrl: "https://opentelemetry.io/docs/specs/semconv/gen-ai/",
  },
  entries: [
    {
      source: "resourceSpans[].scopeSpans[].spans[]",
      target: "PersistedInspectEvent[]",
      transformation: "one span → one event when mappable",
      confidence: "explicit",
      loss: "none",
    },
    {
      source: "span.attributes[gen_ai.*]",
      target: "attributes / tokenUsage / kind",
      transformation: "pinned GenAI attribute family",
      confidence: "correlated",
      loss: "bounded",
    },
    {
      source: "span.attributes (unknown keys)",
      target: "attributes.* / unsupportedFields",
      transformation: "preserve under bounds or list as unsupported",
      confidence: "unknown",
      loss: "unsupported",
    },
  ],
  knownLosses: [
    "Schema 1.0 is not bound to Development-status OTel GenAI revisions.",
    "Status rewrite to fit a local narrative is forbidden.",
    "Payload bodies may be omitted; digests are optional application metadata.",
  ],
};

export const BUILTIN_MAPPING_LEDGERS: readonly MappingLedger[] = Object.freeze([
  OPENINFERENCE_MAPPING_LEDGER,
  OTLP_JSON_MAPPING_LEDGER,
]);

export function getMappingLedger(id: string): MappingLedger | undefined {
  return BUILTIN_MAPPING_LEDGERS.find((ledger) => ledger.id === id);
}
