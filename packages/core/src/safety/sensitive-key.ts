/**
 * Contextual sensitive-key classification for safety checks and redaction.
 *
 * Avoids treating model token-configuration fields (ls_max_tokens, max_tokens,
 * token_count, …) as credentials solely because they contain the substring
 * "token". Value-based secret detectors remain separate.
 *
 * @experimental Shared classifier used by checks (6.14.2+); parity across
 * surfaces lands in the same patch train.
 */

export function normalizeSensitiveKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9_]/g, "");
}

/** Model / usage configuration keys that are not credentials by key alone. */
export const NON_CREDENTIAL_TOKEN_CONFIG_KEYS: ReadonlySet<string> = new Set(
  [
    "tokens",
    "max_tokens",
    "min_tokens",
    "ls_max_tokens",
    "token_count",
    "token_limit",
    "token_budget",
    "input_tokens",
    "output_tokens",
    "total_tokens",
    "cached_tokens",
    "prompt_tokens",
    "completion_tokens",
  ].map(normalizeSensitiveKey),
);

export const DEFAULT_CREDENTIAL_SENSITIVE_KEYS = [
  "authorization",
  "cookie",
  "token",
  "access_token",
  "accesstoken",
  "auth_token",
  "authtoken",
  "refresh_token",
  "refreshtoken",
  "id_token",
  "idtoken",
  "bearer_token",
  "bearertoken",
  "api_token",
  "apitoken",
  "apikey",
  "api_key",
  "password",
  "secret",
  "email",
] as const;

function isTokenCredentialKey(normalized: string): boolean {
  if (NON_CREDENTIAL_TOKEN_CONFIG_KEYS.has(normalized)) return false;
  if (normalized === "token") return true;
  // access_token / refreshToken → *token, but not *tokens (max_tokens → maxtokens)
  if (normalized.endsWith("tokens")) return false;
  return normalized.endsWith("token");
}

/**
 * True when the field name looks credential-sensitive under the shared policy.
 */
export function isCredentialSensitiveKey(
  key: string | undefined,
  sensitiveKeys: readonly string[] = DEFAULT_CREDENTIAL_SENSITIVE_KEYS,
): boolean {
  if (!key) return false;
  const normalized = normalizeSensitiveKey(key);
  if (!normalized) return false;
  if (NON_CREDENTIAL_TOKEN_CONFIG_KEYS.has(normalized)) return false;

  for (const sensitive of sensitiveKeys) {
    const s = normalizeSensitiveKey(sensitive);
    if (!s) continue;
    if (s === "token") {
      if (isTokenCredentialKey(normalized)) return true;
      continue;
    }
    if (normalized === s) return true;
    // Boundary-ish match for compound keys (user_password, nested_api_key).
    if (normalized.endsWith(s) || normalized.endsWith(`_${s}`)) return true;
  }
  return false;
}
