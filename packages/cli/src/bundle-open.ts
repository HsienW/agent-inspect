import { access, readFile, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { verifyEvidenceDirectory } from "@agent-inspect/core/advanced";

export interface BundleOpenCommandOptions {
  json?: boolean;
  skipVerify?: boolean;
}

function writeJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function resolveHtmlPath(root: string): Promise<string> {
  const candidates = [
    path.join(root, "evidence.html"),
    root.toLowerCase().endsWith(".html") ? root : "",
  ].filter(Boolean);
  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    } catch {
      // try next
    }
  }
  throw new Error(
    `No evidence.html found under ${root}. Pass a bundle directory or .html path.`,
  );
}

function openLocalFile(filePath: string): Promise<{ ok: boolean; detail: string }> {
  const fileUrl = pathToFileURL(filePath).href;
  const platform = process.platform;
  const command =
    platform === "darwin" ? "open" : platform === "win32" ? "cmd" : "xdg-open";
  const args =
    platform === "darwin"
      ? [filePath]
      : platform === "win32"
        ? ["/c", "start", "", filePath]
        : [filePath];

  return new Promise((resolve) => {
    try {
      const child = spawn(command, args, {
        detached: true,
        stdio: "ignore",
      });
      child.on("error", (error) => {
        resolve({
          ok: false,
          detail: `${error instanceof Error ? error.message : String(error)}; open manually: ${fileUrl}`,
        });
      });
      child.unref();
      resolve({ ok: true, detail: fileUrl });
    } catch (error) {
      resolve({
        ok: false,
        detail: `${error instanceof Error ? error.message : String(error)}; open manually: ${fileUrl}`,
      });
    }
  });
}

/**
 * `agent-inspect bundle open <path>` — verify then open local Evidence HTML (no network).
 */
export async function bundleOpenCommand(
  targetPath: string,
  options: BundleOpenCommandOptions = {},
): Promise<void> {
  const root = path.resolve(targetPath.trim() || ".");
  try {
    await access(root);
  } catch {
    const message = `Evidence path not found: ${root}`;
    if (options.json) {
      console.log(writeJson({ ok: false, error: message }).trimEnd());
    } else {
      console.error(`[AgentInspect] ${message}`);
    }
    process.exitCode = 1;
    return;
  }

  let verifyRoot = root;
  try {
    const info = await stat(root);
    if (info.isFile() && root.toLowerCase().endsWith(".html")) {
      verifyRoot = path.dirname(root);
    }
  } catch {
    // handled above
  }

  if (options.skipVerify !== true) {
    const result = await verifyEvidenceDirectory(verifyRoot, {
      unexpectedFiles: "fail",
    });
    if (!result.ok) {
      if (options.json) {
        console.log(
          writeJson({
            ok: false,
            error: "Evidence verify failed",
            root: result.root,
            issues: result.issues,
          }).trimEnd(),
        );
      } else {
        console.error(`Evidence verify: fail (${result.issues.length} issue(s))`);
        for (const issue of result.issues) {
          console.error(`- [${issue.severity}] ${issue.code}: ${issue.message}`);
        }
        console.error("Fix integrity issues or pass --skip-verify (not recommended).");
      }
      process.exitCode = 1;
      return;
    }
  }

  let htmlPath: string;
  try {
    htmlPath = await resolveHtmlPath(
      root.toLowerCase().endsWith(".html") ? path.dirname(root) : root,
    );
    if (root.toLowerCase().endsWith(".html")) {
      htmlPath = root;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (options.json) {
      console.log(writeJson({ ok: false, error: message }).trimEnd());
    } else {
      console.error(`[AgentInspect] ${message}`);
    }
    process.exitCode = 1;
    return;
  }

  // Touch manifest when present so open stays evidence-aware without network.
  try {
    await readFile(path.join(path.dirname(htmlPath), "evidence.json"), "utf-8");
  } catch {
    // html-only open still allowed after verify when sidecar exists elsewhere
  }

  const opened = await openLocalFile(htmlPath);
  if (options.json) {
    console.log(
      writeJson({
        ok: opened.ok,
        path: htmlPath,
        opened: opened.ok,
        detail: opened.detail,
      }).trimEnd(),
    );
  } else if (opened.ok) {
    console.log(`Opened local Evidence: ${htmlPath}`);
    console.log(`URL: ${opened.detail}`);
  } else {
    console.error(`[AgentInspect] Could not open browser automatically.`);
    console.error(`Open this file locally: ${htmlPath}`);
    console.error(opened.detail);
  }

  if (!opened.ok) {
    process.exitCode = 0; // artifact is valid; open failure is non-fatal
  }
}
