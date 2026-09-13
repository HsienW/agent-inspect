/**
 * Documented OpenTelemetry GenAI semantic convention reference for OTLP JSON exports.
 * Local mapping only — no OTel SDK dependency in core.
 *
 * Declared `attributes` must match keys the exporter can emit. Do not list
 * prompt/completion bodies here — AgentInspect never exports them on this path.
 */
export const OTEL_GEN_AI_SEMCONV_PIN = {
  /** Human-readable pin label recorded in export metadata and docs. */
  version: "1.36.0",
  /** Public spec URL for maintainers validating attribute names. */
  specUrl: "https://opentelemetry.io/docs/specs/semconv/gen-ai/",
  /** GenAI attribute keys the AgentInspect OTLP JSON exporter may emit. */
  attributes: [
    "gen_ai.operation.name",
    "gen_ai.request.model",
    "gen_ai.usage.input_tokens",
    "gen_ai.usage.output_tokens",
  ],
  /**
   * Non-GenAI attribute key prefixes intentionally emitted alongside GenAI pins.
   * Any other `gen_ai.*` key in export output is an undocumented extension.
   */
  documentedExtensionPrefixes: ["agent_inspect."] as const,
  /** Explicitly never emitted (safety + honesty). */
  neverEmitted: ["gen_ai.prompt", "gen_ai.completion"] as const,
} as const;
