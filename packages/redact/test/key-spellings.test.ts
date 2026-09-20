import { describe, expect, it } from "vitest";

import { redact } from "../src/index.js";

const SECRET = "zX9qP2vL8mNb4TgH";

describe("@agent-inspect/redact key spellings", () => {
  it.each(["apiKey", "api_key", "api-key", "API_KEY", "x_api_key", "openai_api_key"])(
    "redacts %s",
    (key) => {
      expect(redact({ [key]: SECRET }).value).toEqual({ [key]: "[REDACTED]" });
    },
  );

  it.each(["max_tokens", "prompt_tokens", "name"])("keeps %s", (key) => {
    expect(redact({ [key]: SECRET }).value).toEqual({ [key]: SECRET });
  });
});
