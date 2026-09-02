/**
 * No-egress network denial guard for AgentInspect default-workflow harnesses.
 *
 * Intentional exceptions (must stay empty for default local workflows):
 * - none
 *
 * Surfaces that may use network only when explicitly enabled are listed in
 * docs/NETWORK-BEHAVIOR.md and docs/NO-EGRESS-POLICY.md — they are out of
 * scope for this default-workflow harness.
 */

import http from "node:http";
import https from "node:https";
import net from "node:net";

const DENIED = "AI_NO_EGRESS: unexpected network I/O during default local workflow";

/**
 * @typedef {{ attempts: Array<{ api: string; target: string }> }} NoEgressState
 */

/**
 * @returns {NoEgressState & { restore: () => void }}
 */
export function installNoEgressGuard() {
  /** @type {NoEgressState["attempts"]} */
  const attempts = [];

  const record = (api, target) => {
    attempts.push({ api, target: String(target) });
    const error = new Error(`${DENIED} via ${api} → ${target}`);
    error.name = "NoEgressError";
    throw error;
  };

  const originalFetch = globalThis.fetch;
  const originalHttpRequest = http.request;
  const originalHttpGet = http.get;
  const originalHttpsRequest = https.request;
  const originalHttpsGet = https.get;
  const originalNetConnect = net.connect;
  const originalCreateConnection = net.createConnection;

  globalThis.fetch = function deniedFetch(input, init) {
    const target =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input && typeof input === "object" && "url" in input
            ? String(input.url)
            : String(input);
    return record("fetch", target);
  };

  http.request = function deniedHttpRequest(...args) {
    return record("http.request", summarizeHttpArgs(args));
  };
  http.get = function deniedHttpGet(...args) {
    return record("http.get", summarizeHttpArgs(args));
  };
  https.request = function deniedHttpsRequest(...args) {
    return record("https.request", summarizeHttpArgs(args));
  };
  https.get = function deniedHttpsGet(...args) {
    return record("https.get", summarizeHttpArgs(args));
  };
  net.connect = function deniedNetConnect(...args) {
    return record("net.connect", summarizeNetArgs(args));
  };
  net.createConnection = function deniedCreateConnection(...args) {
    return record("net.createConnection", summarizeNetArgs(args));
  };

  return {
    attempts,
    restore() {
      globalThis.fetch = originalFetch;
      http.request = originalHttpRequest;
      http.get = originalHttpGet;
      https.request = originalHttpsRequest;
      https.get = originalHttpsGet;
      net.connect = originalNetConnect;
      net.createConnection = originalCreateConnection;
    },
  };
}

function summarizeHttpArgs(args) {
  const first = args[0];
  if (typeof first === "string" || first instanceof URL) return String(first);
  if (first && typeof first === "object") {
    const host = first.host || first.hostname || "";
    const path = first.path || first.pathname || "";
    return `${host}${path}`;
  }
  return "unknown";
}

function summarizeNetArgs(args) {
  const first = args[0];
  if (typeof first === "number") {
    const second = args[1];
    return typeof second === "string" ? `${second}:${first}` : `port:${first}`;
  }
  if (typeof first === "string") return first;
  if (first && typeof first === "object") {
    const host = first.host || first.hostname || "";
    const port = first.port ?? "";
    return `${host}:${port}`;
  }
  return "unknown";
}
