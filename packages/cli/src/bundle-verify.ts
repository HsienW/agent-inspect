import path from "node:path";

import { verifyEvidenceDirectory } from "@agent-inspect/core/advanced";

export interface BundleVerifyCommandOptions {
  json?: boolean;
  unexpected?: "fail" | "warn" | "ignore";
}

function writeJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

/**
 * `agent-inspect bundle verify <path>` — integrity check for Evidence v2 directories.
 */
export async function bundleVerifyCommand(
  targetPath: string,
  options: BundleVerifyCommandOptions = {},
): Promise<void> {
  const root = path.resolve(targetPath.trim() || ".");
  const result = await verifyEvidenceDirectory(root, {
    unexpectedFiles: options.unexpected ?? "fail",
  });

  if (options.json) {
    console.log(
      writeJson({
        ok: result.ok,
        status: result.status,
        root: result.root,
        checkedFiles: result.checkedFiles,
        issues: result.issues,
        assessment: result.manifest?.assessment,
        generator: result.manifest?.generator,
      }).trimEnd(),
    );
  } else if (result.ok) {
    console.log(`Evidence verify: pass (${result.checkedFiles} file(s) checked)`);
    console.log(`Root: ${result.root}`);
    if (result.manifest?.assessment?.status) {
      console.log(`Assessment: ${result.manifest.assessment.status}`);
    }
  } else {
    console.error(`Evidence verify: fail (${result.issues.length} issue(s))`);
    console.error(`Root: ${result.root}`);
    for (const issue of result.issues) {
      console.error(`- [${issue.severity}] ${issue.code}: ${issue.message}`);
    }
  }

  if (!result.ok) {
    process.exitCode = 1;
  }
}
