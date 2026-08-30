import { EventEmitter } from "node:events";

import { afterEach, describe, expect, it, vi } from "vitest";

const { spawnMock } = vi.hoisted(() => ({
  spawnMock: vi.fn(),
}));

vi.mock("node:child_process", () => ({
  spawn: spawnMock,
}));

import { openInDefaultBrowser } from "../src/browser-open.js";

function mockChildEvent(event: "spawn" | "error", error?: Error) {
  const child = Object.assign(new EventEmitter(), { unref: vi.fn() });
  spawnMock.mockImplementationOnce(() => {
    queueMicrotask(() => child.emit(event, error));
    return child;
  });
  return child;
}

afterEach(() => {
  vi.restoreAllMocks();
  spawnMock.mockReset();
});

describe("openInDefaultBrowser", () => {
  const platformCases: Array<{
    platform: NodeJS.Platform;
    command: string;
    args: string[];
    windowsHide: boolean;
  }> = [
    {
      platform: "darwin",
      command: "open",
      args: ["https://example.test/viewer"],
      windowsHide: false,
    },
    {
      platform: "win32",
      command: "cmd",
      args: ["/c", "start", "", "https://example.test/viewer"],
      windowsHide: true,
    },
    {
      platform: "linux",
      command: "xdg-open",
      args: ["https://example.test/viewer"],
      windowsHide: false,
    },
  ];

  it.each(platformCases)(
    "uses the $platform platform launcher",
    async ({ platform, command, args, windowsHide }) => {
      vi.spyOn(process, "platform", "get").mockReturnValue(platform);
      const child = mockChildEvent("spawn");

      await expect(openInDefaultBrowser("https://example.test/viewer")).resolves.toEqual({
        ok: true,
      });

      expect(spawnMock).toHaveBeenCalledWith(command, args, {
        detached: true,
        stdio: "ignore",
        windowsHide,
      });
      expect(child.unref).toHaveBeenCalledOnce();
    },
  );

  it("returns launch errors without throwing", async () => {
    vi.spyOn(process, "platform", "get").mockReturnValue("linux");
    const child = mockChildEvent("error", new Error("xdg-open unavailable"));

    await expect(openInDefaultBrowser("https://example.test/viewer")).resolves.toEqual({
      ok: false,
      detail: "xdg-open unavailable",
    });
    expect(child.unref).not.toHaveBeenCalled();
  });

  it("returns synchronous spawn failures without throwing", async () => {
    spawnMock.mockImplementationOnce(() => {
      throw new Error("spawn failed");
    });

    await expect(openInDefaultBrowser("https://example.test/viewer")).resolves.toEqual({
      ok: false,
      detail: "spawn failed",
    });
  });
});
