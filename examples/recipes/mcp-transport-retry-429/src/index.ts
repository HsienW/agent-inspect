import path from "node:path";

import { inspectRun, step } from "agent-inspect";

const silent = process.env.AGENT_INSPECT_SILENT === "true";
const traceDir = path.join(process.cwd(), ".agent-inspect-runs");

type TransportAttempt = {
  operationId: string;
  attemptId: string;
  attemptNumber: number;
  retryOf?: string;
  httpStatus: number;
  serverAdvertisedDelayMs?: number;
  selectedDelayMs?: number;
  delaySource?: "retry-after" | "client-default" | "none";
  terminal: "retryable" | "success" | "failed";
};

async function mockFetch(
  attemptNumber: number,
): Promise<{ status: number; retryAfterMs?: number; body: string }> {
  if (attemptNumber === 1) {
    return { status: 429, retryAfterMs: 25, body: "rate limited" };
  }
  return { status: 200, body: "ok" };
}

const operationId = "op-list-tools-1";
const attempts: TransportAttempt[] = [];

const result = await inspectRun(
  "mcp-transport-retry-429",
  async () => {
    return step(
      "tool:mcp.list_tools",
      async () => {
        const firstId = "attempt-1";
        const first = await mockFetch(1);
        attempts.push({
          operationId,
          attemptId: firstId,
          attemptNumber: 1,
          httpStatus: first.status,
          serverAdvertisedDelayMs: first.retryAfterMs,
          selectedDelayMs: first.retryAfterMs,
          delaySource: "retry-after",
          terminal: "retryable",
        });

        const secondId = "attempt-2";
        const second = await mockFetch(2);
        attempts.push({
          operationId,
          attemptId: secondId,
          attemptNumber: 2,
          retryOf: firstId,
          httpStatus: second.status,
          delaySource: "none",
          terminal: "success",
        });
        return {
          ok: true,
          tools: ["fixture-tool"],
        };
      },
      {
        type: "tool",
        metadata: {
          toolName: "mcp.list_tools",
          operationId,
          transportAttempts: attempts,
        },
      },
    );
  },
  {
    silent,
    traceDir,
    metadata: {
      recipe: "mcp-transport-retry-429",
      operationId,
    },
  },
);

console.log("operationId:", operationId);
console.log(
  "attempts:",
  attempts
    .map(
      (a) =>
        `${a.attemptNumber}:${a.httpStatus}:${a.terminal}${a.retryOf ? `:retryOf=${a.retryOf}` : ""}`,
    )
    .join(","),
);
console.log("final:", (result as { ok?: boolean }).ok === true ? "success" : "failed");
