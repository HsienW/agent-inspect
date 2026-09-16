import path from "node:path";

import { inspectRun, observeOutcome, step } from "agent-inspect";

type BrowserState = {
  page: "cart" | "checkout";
};

/** Mutable page owned by the action path (tool side). */
type BrowserActionSurface = {
  state: BrowserState;
  clickCheckout: () => Promise<{ status: "success" }>;
  snapshot: () => BrowserState;
};

/**
 * Separately injected observer with a stable resource identity.
 * It does not share the action surface's mutable reference; callers pass a
 * snapshot function so observation is an explicit boundary.
 */
type BrowserObserver = {
  resourceId: string;
  observe: () => BrowserState;
};

function createActionSurface(initial: BrowserState): BrowserActionSurface {
  const state: BrowserState = { ...initial };
  return {
    state,
    async clickCheckout() {
      // Intentionally does not mutate page — tool success ≠ observed effect.
      return { status: "success" as const };
    },
    snapshot() {
      return { ...state };
    },
  };
}

function createObserver(
  resourceId: string,
  readSnapshot: () => BrowserState,
): BrowserObserver {
  return {
    resourceId,
    observe() {
      return { ...readSnapshot() };
    },
  };
}

const traceDir = path.join(process.cwd(), ".agent-inspect");
const resourceId = "browser://fixture/cart-session";
const action = createActionSurface({ page: "cart" });
// Observer is constructed separately and only receives a snapshot thunk —
// not the action surface object itself.
const observer = createObserver(resourceId, () => action.snapshot());

const expectedPage: BrowserState["page"] = "checkout";
let observedPage: BrowserState["page"] = action.state.page;
let observedStatus: "passed" | "failed" = "failed";

await inspectRun(
  "browser-mcp-observed-outcome-demo",
  async () => {
    const before = observer.observe();
    const actionResult = await step.tool(
      "browser.clickCheckout",
      () => action.clickCheckout(),
    );
    const after = observer.observe();

    const transitioned = before.page === "cart" && after.page === expectedPage;

    observedPage = after.page;
    observedStatus = transitioned ? "passed" : "failed";

    await observeOutcome("checkoutTransition", {
      expectation: "Page transitioned from cart to checkout",
      status: observedStatus,
      method: "snapshot",
      actual: {
        resourceId: observer.resourceId,
        beforePage: before.page,
        afterPage: after.page,
        expectedPage,
      },
      evidence: {
        actionStatus: actionResult.status,
        observerBoundary: "injected-snapshot",
      },
    });
  },
  { silent: true, traceDir },
);

console.log("Browser/MCP observed outcome recipe complete");
console.log(`Trace directory: ${traceDir}`);
console.log(`Resource id: ${resourceId}`);
console.log("Tool action: passed");
console.log("Returned status: success");
console.log(`Expected page: ${expectedPage}`);
console.log(`Observed page: ${observedPage}`);
console.log(`Observed outcome: ${observedStatus}`);
console.log("Try:");
console.log(
  "  npx agent-inspect search --dir ./.agent-inspect --observation failed",
);
