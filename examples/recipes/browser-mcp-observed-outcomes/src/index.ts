import path from "node:path";

import { inspectRun, observeOutcome, step } from "agent-inspect";

type BrowserState = {
  page: "cart" | "checkout";
};

const browserState: BrowserState = {
  page: "cart",
};

const traceDir = path.join(process.cwd(), ".agent-inspect");

function snapshotBrowserState(): BrowserState {
  return { ...browserState };
}

async function clickCheckout() {
  return { status: "success" as const };
}

const expectedPage: BrowserState["page"] = "checkout";
let observedPage: BrowserState["page"] = browserState.page;
let observedStatus: "passed" | "failed" = "failed";

await inspectRun(
  "browser-mcp-observed-outcome-demo",
  async () => {
    const before = snapshotBrowserState();
    const actionResult = await step.tool(
      "browser.clickCheckout",
      clickCheckout
    );
    const after = snapshotBrowserState();

    const transitioned = before.page === "cart" && after.page === expectedPage;

    observedPage = after.page;
    observedStatus = transitioned ? "passed" : "failed";

    await observeOutcome("checkoutTransition", {
      expectation: "Page transitioned from cart to checkout",
      status: observedStatus,
      method: "snapshot",
      actual: {
        beforePage: before.page,
        afterPage: after.page,
        expectedPage,
      },
      evidence: {
        actionStatus: actionResult.status,
      },
    });
  },
  { silent: true, traceDir }
);

console.log("Browser/MCP observed outcome recipe complete");
console.log(`Trace directory: ${traceDir}`);
console.log("Tool action: passed");
console.log("Returned status: success");
console.log(`Expected page: ${expectedPage}`);
console.log(`Observed page: ${observedPage}`);
console.log(`Observed outcome: ${observedStatus}`);
console.log("Try:");
console.log(
  "  npx agent-inspect search --dir ./.agent-inspect --observation failed"
);
