import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const fixturePath = path.join(root, "fixtures/mcp/coding-agent-loop.v1.example.json");

describe("coding-agent-loop RFC contract", () => {
  it("locks flagship tool catalog and causal-failure order", () => {
    const raw = JSON.parse(readFileSync(fixturePath, "utf8")) as {
      codingAgentLoopVersion: string;
      package: string;
      transport: string;
      defaultRedactionProfile: string;
      flagshipTools: string[];
      causalFailureOrder: string[];
      outOfScope: string[];
    };

    expect(raw.codingAgentLoopVersion).toBe("1.0");
    expect(raw.package).toBe("@agent-inspect/mcp-server");
    expect(raw.transport).toBe("stdio");
    expect(raw.defaultRedactionProfile).toBe("share");
    expect(raw.flagshipTools).toEqual([
      "list_recent_runs",
      "list_recent_failures",
      "get_run_summary",
      "get_execution_tree",
      "get_first_causal_failure",
      "get_slowest_path",
      "get_contract_failures",
      "get_failed_observations",
      "compare_runs",
      "create_share_checked_evidence",
      "get_adapter_diagnostics",
      "get_trace_facts",
    ]);
    expect(raw.causalFailureOrder.at(-1)).toBe("no_timing_only_inference");
    expect(raw.outOfScope).toContain("code_modification");
    expect(raw.outOfScope).toContain("default_network_upload");
  });
});
