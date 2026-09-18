/**
 * Browser/MCP observed-outcome recipe — identity, precondition, and effect matrix.
 *
 * Synthetic in-memory only. Does not prove an independent browser channel or
 * real MCP delivery. Tool-reported success is separate from observed effect.
 */
import path from "node:path";

import { inspectRun, observeOutcome, step } from "agent-inspect";

type Page = "cart" | "checkout" | "unknown";

type BrowserState = {
  page: Page;
};

type Observation = {
  resourceId: string;
  page: Page;
  complete: boolean;
  source: "injected-observer" | "missing" | "failed";
  method: "snapshot";
};

type Gate = "passed" | "failed" | "unknown";

type CaseResult = {
  id: string;
  precondition: Gate | "skipped";
  resourceBinding: Gate | "skipped";
  postcondition: Gate | "skipped";
  toolStatus: "success" | "error";
  gate: Gate;
  note: string;
};

type ScenarioInput = {
  id: string;
  actionResourceId: string;
  observerResourceId: string;
  startPage: Page;
  mutateTo: Page | null;
  toolStatus: "success" | "error";
  observerMode: "ok" | "missing" | "incomplete" | "failed";
  expectedStart: Page;
  expectedAfter: Page;
};

function observe(
  resourceId: string,
  state: BrowserState | null,
  mode: ScenarioInput["observerMode"],
): Observation {
  if (mode === "missing") {
    return {
      resourceId,
      page: "unknown",
      complete: false,
      source: "missing",
      method: "snapshot",
    };
  }
  if (mode === "failed") {
    return {
      resourceId,
      page: "unknown",
      complete: false,
      source: "failed",
      method: "snapshot",
    };
  }
  if (mode === "incomplete" || state === null) {
    return {
      resourceId,
      page: state?.page ?? "unknown",
      complete: false,
      source: "injected-observer",
      method: "snapshot",
    };
  }
  return {
    resourceId,
    page: state.page,
    complete: true,
    source: "injected-observer",
    method: "snapshot",
  };
}

/**
 * Evaluate one synthetic scenario.
 * Preconditions and resource binding are checked before postcondition.
 */
function evaluateScenario(input: ScenarioInput): CaseResult {
  const actionState: BrowserState = { page: input.startPage };
  // Separate observer memory: when resource IDs differ, observer reads a
  // different fixture page that already shows the target (wrong-resource trap).
  const wrongResourceAlreadyTarget: BrowserState = { page: input.expectedAfter };
  const observerReadsSameSurface =
    input.actionResourceId === input.observerResourceId;

  const before = observe(
    input.observerResourceId,
    observerReadsSameSurface ? actionState : wrongResourceAlreadyTarget,
    input.observerMode,
  );

  if (input.mutateTo !== null) {
    actionState.page = input.mutateTo;
  }
  const toolStatus = input.toolStatus;

  const after = observe(
    input.observerResourceId,
    observerReadsSameSurface ? actionState : wrongResourceAlreadyTarget,
    input.observerMode,
  );

  if (
    before.source === "missing" ||
    before.source === "failed" ||
    !before.complete ||
    after.source === "missing" ||
    after.source === "failed" ||
    !after.complete
  ) {
    return {
      id: input.id,
      precondition: "unknown",
      resourceBinding: "unknown",
      postcondition: "unknown",
      toolStatus,
      gate: "unknown",
      note: "observer missing/failed/incomplete — never success",
    };
  }

  // Resource binding before page-value checks so a wrong resource that already
  // shows the target page cannot pass by equality.
  const resourceOk =
    before.resourceId === input.actionResourceId &&
    after.resourceId === input.actionResourceId;
  if (!resourceOk) {
    return {
      id: input.id,
      precondition: "skipped",
      resourceBinding: "failed",
      postcondition: "skipped",
      toolStatus,
      gate: "failed",
      note: "observation resource differs from action target — page-value equality must not pass",
    };
  }

  if (before.page !== input.expectedStart) {
    return {
      id: input.id,
      precondition: "failed",
      resourceBinding: "passed",
      postcondition: "skipped",
      toolStatus,
      gate: "failed",
      note: "invalid starting state — postcondition skipped",
    };
  }

  const transitioned =
    before.page === input.expectedStart && after.page === input.expectedAfter;
  if (!transitioned) {
    return {
      id: input.id,
      precondition: "passed",
      resourceBinding: "passed",
      postcondition: "failed",
      toolStatus,
      gate: "failed",
      note: "tool may report success but observed state unchanged",
    };
  }

  return {
    id: input.id,
    precondition: "passed",
    resourceBinding: "passed",
    postcondition: "passed",
    toolStatus,
    gate: "passed",
    note: "valid start, correct resource, actual transition",
  };
}

const silent = process.env.AGENT_INSPECT_SILENT === "true";
const traceDir = path.join(process.cwd(), ".agent-inspect-runs");
const resourceId = "browser://fixture/cart-session";
const otherResourceId = "browser://fixture/other-session";

const scenarios: ScenarioInput[] = [
  {
    id: "valid-transition",
    actionResourceId: resourceId,
    observerResourceId: resourceId,
    startPage: "cart",
    mutateTo: "checkout",
    toolStatus: "success",
    observerMode: "ok",
    expectedStart: "cart",
    expectedAfter: "checkout",
  },
  {
    id: "tool-success-no-effect",
    actionResourceId: resourceId,
    observerResourceId: resourceId,
    startPage: "cart",
    mutateTo: null,
    toolStatus: "success",
    observerMode: "ok",
    expectedStart: "cart",
    expectedAfter: "checkout",
  },
  {
    id: "wrong-resource-already-target",
    actionResourceId: resourceId,
    observerResourceId: otherResourceId,
    startPage: "cart",
    mutateTo: null,
    toolStatus: "success",
    observerMode: "ok",
    expectedStart: "cart",
    expectedAfter: "checkout",
  },
  {
    id: "invalid-start",
    actionResourceId: resourceId,
    observerResourceId: resourceId,
    startPage: "checkout",
    mutateTo: "checkout",
    toolStatus: "success",
    observerMode: "ok",
    expectedStart: "cart",
    expectedAfter: "checkout",
  },
  {
    id: "observer-incomplete",
    actionResourceId: resourceId,
    observerResourceId: resourceId,
    startPage: "cart",
    mutateTo: "checkout",
    toolStatus: "success",
    observerMode: "incomplete",
    expectedStart: "cart",
    expectedAfter: "checkout",
  },
];

const results: CaseResult[] = [];

await inspectRun(
  "browser-mcp-observed-outcome-matrix",
  async () => {
    for (const scenario of scenarios) {
      await step.tool(`browser.scenario.${scenario.id}`, async () => {
        const result = evaluateScenario(scenario);
        results.push(result);
        const outcomeStatus =
          result.gate === "passed"
            ? "passed"
            : result.gate === "unknown"
              ? "unknown"
              : "failed";
        await observeOutcome(`checkoutTransition.${scenario.id}`, {
          expectation: `Scenario ${scenario.id}: bound resource transition cart→checkout`,
          status: outcomeStatus,
          method: "snapshot",
          actual: {
            actionResourceId: scenario.actionResourceId,
            observerResourceId: scenario.observerResourceId,
            precondition: result.precondition,
            resourceBinding: result.resourceBinding,
            postcondition: result.postcondition,
            gate: result.gate,
          },
          evidence: {
            toolStatus: result.toolStatus,
            observerBoundary: "injected-snapshot",
            simulation: "in-memory-same-process",
            note: result.note,
          },
        });
        return { status: result.toolStatus, gate: result.gate };
      });
    }
  },
  { silent, traceDir, metadata: { recipe: "browser-mcp-observed-outcomes" } },
);

console.log("browser-observed-outcome-matrix:");
console.log(
  "  note: synthetic in-memory observer; not real browser/MCP delivery",
);
for (const result of results) {
  console.log(
    `  ${result.id}: gate=${result.gate} precondition=${result.precondition} resource=${result.resourceBinding} postcondition=${result.postcondition} tool=${result.toolStatus}`,
  );
  console.log(`    note: ${result.note}`);
}
console.log(
  `classes: ${results.map((result) => `${result.id}:${result.gate}`).join(",")}`,
);
