import { describe, expect, it } from "vitest";

import { assertEvidenceRelativePath, buildZipArchive } from "../../src/evidence/index.js";

describe("evidence zip archive (6.10-6)", () => {
  it("builds a store-method zip with traversal-safe paths", () => {
    const archive = buildZipArchive([
      { path: "evidence.html", content: "<html></html>\n" },
      { path: "evidence.json", content: "{}\n" },
    ]);
    expect(archive.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))).toBe(true);
    expect(archive.includes(Buffer.from("evidence.html"))).toBe(true);
    expect(archive.includes(Buffer.from("evidence.json"))).toBe(true);
    expect(() => assertEvidenceRelativePath("../x")).toThrow();
    expect(() =>
      buildZipArchive([
        { path: "a.txt", content: "1" },
        { path: "a.txt", content: "2" },
      ]),
    ).toThrow(/Duplicate/);
  });
});
