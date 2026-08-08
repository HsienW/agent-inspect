/**
 * Mirrors `packages/core/src/safety/sensitive-key.ts` for dependency-light
 * @agent-inspect/redact consumers. Keep both copies in sync (6.14.2 parity).
 */

export function normalizeSensitiveKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9_]/g, "");
}

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

function isTokenCredentialKey(normalized: string): boolean {
  if (NON_CREDENTIAL_TOKEN_CONFIG_KEYS.has(normalized)) return false;
  if (normalized === "token") return true;
  if (normalized.endsWith("tokens")) return false;
  return normalized.endsWith("token");
}

export function isCredentialSensitiveKey(
  key: string | undefined,
  sensitiveKeys: readonly string[],
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
    if (normalized.endsWith(`_${s}`) || normalized.startsWith(`${s}_`)) return true;
  }
  return false;
}
