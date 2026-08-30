import { afterEach, describe, expect, it, vi } from "vitest";

const { openBrowserMock, startStudioServerMock, startViewerServerMock } = vi.hoisted(() => ({
  openBrowserMock: vi.fn(async () => ({ ok: true })),
  startStudioServerMock: vi.fn(),
  startViewerServerMock: vi.fn(),
}));

vi.mock("../src/browser-open.js", () => ({
  openInDefaultBrowser: openBrowserMock,
}));

vi.mock("@agent-inspect/viewer", () => ({
  startViewerServer: startViewerServerMock,
}));

vi.mock("@agent-inspect/studio", () => ({
  startStudioServer: startStudioServerMock,
}));

import { serveCommand } from "../src/serve.js";
import { studioCommand } from "../src/studio-cmd.js";

afterEach(() => {
  vi.restoreAllMocks();
  openBrowserMock.mockClear();
  openBrowserMock.mockResolvedValue({ ok: true });
  startStudioServerMock.mockReset();
  startViewerServerMock.mockReset();
});

describe("browser-open host guards", () => {
  it("opens the viewer for a local host", async () => {
    startViewerServerMock.mockResolvedValue({
      host: "127.0.0.1",
      mode: "traces",
      traceDir: ".agent-inspect",
      url: "http://127.0.0.1:7331",
    });

    void serveCommand({ open: true });

    await vi.waitFor(() => {
      expect(openBrowserMock).toHaveBeenCalledWith("http://127.0.0.1:7331");
    });
  });

  it("skips the viewer launcher for a non-local host", async () => {
    startViewerServerMock.mockResolvedValue({
      host: "0.0.0.0",
      mode: "traces",
      traceDir: ".agent-inspect",
      url: "http://0.0.0.0:7331",
    });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    void serveCommand({ host: "0.0.0.0", open: true });

    await vi.waitFor(() => {
      expect(warn).toHaveBeenCalledWith("Skipping browser open for non-local host binding.");
    });
    expect(openBrowserMock).not.toHaveBeenCalled();
  });

  it("opens Studio for a local host", async () => {
    startStudioServerMock.mockResolvedValue({
      host: "localhost",
      url: "http://localhost:7332",
    });

    void studioCommand({ host: "localhost", open: true });

    await vi.waitFor(() => {
      expect(openBrowserMock).toHaveBeenCalledWith("http://localhost:7332");
    });
  });

  it("skips the Studio launcher for a non-local host", async () => {
    startStudioServerMock.mockResolvedValue({
      host: "0.0.0.0",
      url: "http://0.0.0.0:7332",
    });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    void studioCommand({ host: "0.0.0.0", open: true });

    await vi.waitFor(() => {
      expect(warn).toHaveBeenCalledWith("Skipping browser open for non-local host binding.");
    });
    expect(openBrowserMock).not.toHaveBeenCalled();
  });
});
