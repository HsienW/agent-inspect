import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(path.join(root, "apps/website/package.json"));
const GithubSluggerModule = require("github-slugger");
const GithubSlugger = GithubSluggerModule.default || GithubSluggerModule;

test("github-slugger matches known Trace Contracts punctuation cases", () => {
  const g = new GithubSlugger();
  assert.equal(g.slug("npm / pnpm"), "npm--pnpm");
  assert.equal(g.slug("A/B test"), "ab-test");
  assert.equal(g.slug("Hello World"), "hello-world");
  assert.equal(g.slug("Hello World"), "hello-world-1");
});

test("docs-manifest maps five-minute path and full guide", () => {
  const text = readFileSync(
    path.join(root, "apps/website/content/docs-manifest.ts"),
    "utf8",
  );
  assert.match(text, /FIRST-TRACE-IN-5-MINUTES\.md/);
  assert.match(text, /slug:\s*\["getting-started",\s*"guide"\]/);
  assert.match(text, /GETTING-STARTED\.md/);
});
