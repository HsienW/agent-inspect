/**
 * Validate AI-readable public assets.
 * Run: node scripts/validate-ai-assets.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const version = pkg.version;

const required = [
  "apps/website/public/llms.txt",
  "apps/website/public/llms-full.txt",
  "apps/website/public/skill.md",
  "apps/website/public/ai/product.json",
  "apps/website/public/ai/packages.json",
  "apps/website/public/ai/cli.json",
  "apps/website/public/ai/examples.json",
  "apps/website/public/ai/support.json",
  "apps/website/public/ai/compatibility.json",
  ".agents/skills/agent-inspect/SKILL.md",
  "docs/AI-CODING-ASSISTANT-GUIDE.md",
  "docs/product/PUBLIC-PRODUCT-FACTS.json",
];

for (const rel of required) {
  if (!existsSync(path.join(root, rel))) {
    failures.push(`missing ${rel}`);
  }
}

const product = JSON.parse(
  readFileSync(path.join(root, "apps/website/public/ai/product.json"), "utf8"),
);
if (product.version !== version) {
  failures.push(`ai/product.json version ${product.version} != ${version}`);
}

const skill = readFileSync(path.join(root, ".agents/skills/agent-inspect/SKILL.md"), "utf8");
if (!skill.startsWith("---") || !/name:\s*agent-inspect/.test(skill)) {
  failures.push("SKILL.md missing required frontmatter name");
}
if (!/description:/.test(skill)) {
  failures.push("SKILL.md missing description frontmatter");
}

const llms = readFileSync(path.join(root, "apps/website/public/llms.txt"), "utf8");
for (const ban of [
  /technical launch candidate/i,
  /v7 not scheduled/i,
  /external pilot evidence pending/i,
  /matchers are not shipped/i,
]) {
  if (ban.test(llms)) failures.push(`llms.txt banned phrase ${ban}`);
}

if (!llms.includes(version) && !llms.includes(`6.14`)) {
  // status line includes version via facts
  failures.push("llms.txt should mention current release line");
}

if (failures.length) {
  console.error("[ai-assets:check] failures:\n" + failures.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}

console.log(`[ai-assets:check] OK (version ${version})`);
