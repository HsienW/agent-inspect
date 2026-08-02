import path from "node:path";

/**
 * Validates a relative evidence/bundle path: no absolute paths, no `..`, POSIX separators.
 * Returns the normalized POSIX relative path.
 */
export function assertEvidenceRelativePath(relativePath: string): string {
  if (typeof relativePath !== "string" || relativePath.trim() === "") {
    throw new Error("Evidence file path must be a non-empty relative path.");
  }
  const trimmed = relativePath.trim().replaceAll("\\", "/");
  if (path.isAbsolute(trimmed) || trimmed.startsWith("/")) {
    throw new Error(`Evidence file path must be relative: ${relativePath}`);
  }
  const parts = trimmed.split("/").filter((part) => part !== "");
  if (parts.length === 0) {
    throw new Error(`Evidence file path must be relative: ${relativePath}`);
  }
  for (const part of parts) {
    if (part === "." || part === "..") {
      throw new Error(`Evidence file path must not contain "." or "..": ${relativePath}`);
    }
  }
  return parts.join("/");
}
