import { spawn } from "node:child_process";

export interface BrowserOpenResult {
  ok: boolean;
  detail?: string;
}

/** Open a URL or file URL in the platform's default browser without waiting for it to exit. */
export function openInDefaultBrowser(target: string): Promise<BrowserOpenResult> {
  const platform = process.platform;
  const command =
    platform === "darwin" ? "open" : platform === "win32" ? "cmd" : "xdg-open";
  const args =
    platform === "win32" ? ["/c", "start", "", target] : [target];

  return new Promise((resolve) => {
    try {
      const child = spawn(command, args, {
        detached: true,
        stdio: "ignore",
        windowsHide: platform === "win32",
      });

      child.once("spawn", () => {
        try {
          child.unref();
          resolve({ ok: true });
        } catch (error) {
          resolve({
            ok: false,
            detail: error instanceof Error ? error.message : String(error),
          });
        }
      });
      child.once("error", (error) => {
        resolve({
          ok: false,
          detail: error instanceof Error ? error.message : String(error),
        });
      });
    } catch (error) {
      resolve({
        ok: false,
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  });
}
