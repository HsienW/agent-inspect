import { describe, expect, it } from "vitest";

import { isCredentialSensitiveKey } from "../src/safety/sensitive-key.js";

describe("isCredentialSensitiveKey (6.14.2-5)", () => {
  it("does not flag token configuration fields", () => {
    for (const key of [
      "ls_max_tokens",
      "max_tokens",
      "min_tokens",
      "token_count",
      "token_limit",
      "input_tokens",
      "output_tokens",
      "tokens",
    ]) {
      expect(isCredentialSensitiveKey(key), key).toBe(false);
    }
  });

  it("flags credential token keys", () => {
    for (const key of [
      "token",
      "access_token",
      "refresh_token",
      "idToken",
      "authorization",
      "api_key",
      "password",
    ]) {
      expect(isCredentialSensitiveKey(key), key).toBe(true);
    }
  });
});
