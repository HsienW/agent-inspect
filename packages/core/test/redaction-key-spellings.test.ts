import { describe, expect, it } from "vitest";

import { redactTraceEventsForReport } from "../src/exporters/redact-export.js";
import { Redactor } from "../src/logs/redactor.js";
import type { TraceEvent } from "../src/types.js";

const SECRET = "zX9qP2vL8mNb4TgH";

describe("Redactor key spellings", () => {
  const redactor = new Redactor();

  it.each(["apiKey", "api_key", "api-key", "API_KEY", "x_api_key", "openai_api_key"])(
    "redacts %s",
    (key) => {
      expect(redactor.redactRecord({ [key]: SECRET })[key]).toBe("[REDACTED]");
    },
  );

  it.each(["access_token", "user_password", "client_secret"])("redacts %s", (key) => {
    expect(redactor.redactRecord({ [key]: SECRET })[key]).toBe("[REDACTED]");
  });

  it.each(["max_tokens", "token_count", "name", "duration_ms"])("keeps %s", (key) => {
    expect(redactor.redactRecord({ [key]: SECRET })[key]).toBe(SECRET);
  });
});

describe("share profile export", () => {
  it("redacts snake and header spellings in metadata", () => {
    const events = [
      {
        event: "run_started",
        runId: "r1",
        ts: 1,
        name: "run",
        metadata: { api_key: SECRET, "x-api-key": SECRET, access_token: SECRET },
      },
    ] as unknown as TraceEvent[];

    const exported = redactTraceEventsForReport(events, {
      redactionProfile: "share",
    }) as unknown as Array<{ metadata: Record<string, unknown> }>;

    expect(exported[0].metadata).toEqual({
      api_key: "[REDACTED]",
      "x-api-key": "[REDACTED]",
      access_token: "[REDACTED]",
    });
  });
});
