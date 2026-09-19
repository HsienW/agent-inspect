import { readFileSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(path.join(root, "apps/website/package.json"));
const GithubSluggerModule = require("github-slugger");
const GithubSlugger = GithubSluggerModule.default || GithubSluggerModule;

describe("website docs resolve helpers", () => {
  it("github-slugger matches known Trace Contracts punctuation cases", () => {
    const g = new GithubSlugger();
    expect(g.slug("npm / pnpm")).toBe("npm--pnpm");
    expect(g.slug("A/B test")).toBe("ab-test");
    expect(g.slug("Hello World")).toBe("hello-world");
    expect(g.slug("Hello World")).toBe("hello-world-1");
  });

  it("docs-manifest maps five-minute path and full guide", () => {
    const text = readFileSync(
      path.join(root, "apps/website/content/docs-manifest.ts"),
      "utf8",
    );
    expect(text).toMatch(/FIRST-TRACE-IN-5-MINUTES\.md/);
    expect(text).toMatch(/slug:\s*\["getting-started",\s*"guide"\]/);
    expect(text).toMatch(/GETTING-STARTED\.md/);
  });
});
