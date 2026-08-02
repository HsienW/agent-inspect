import { describe, expect, it } from "vitest";
import type { Serialized } from "@langchain/core/load/serializable";
import {
  applyToolIdentityAttributes,
  resolveToolIdentity,
} from "../src/tool-identity.js";

function mockSerialized(name: string): Serialized {
  return {
    lc: 1,
    type: "constructor",
    id: ["langchain", "tools", name],
    name,
    kwargs: {},
  };
}

describe("tool identity", () => {
  it("prefers runName and keeps DynamicStructuredTool as toolClass", () => {
    const identity = resolveToolIdentity(
      mockSerialized("DynamicStructuredTool"),
      "get_navan_rewards",
      { toolName: "ignored-when-runName-present" },
      "call-1",
    );
    expect(identity.displayName).toBe("get_navan_rewards");
    expect(identity.toolName).toBe("get_navan_rewards");
    expect(identity.toolClass).toBe("DynamicStructuredTool");
    expect(identity.toolCallId).toBe("call-1");
    expect(identity.frameworkRunName).toBe("get_navan_rewards");
  });

  it("uses metadata.toolName when runName is absent", () => {
    const identity = resolveToolIdentity(mockSerialized("DynamicStructuredTool"), undefined, {
      toolName: "search_docs",
    });
    expect(identity.displayName).toBe("search_docs");
    expect(identity.toolClass).toBe("DynamicStructuredTool");
  });

  it("falls back to unknown-tool when nothing is named", () => {
    const identity = resolveToolIdentity({
      lc: 1,
      type: "not_implemented",
      id: [],
      name: "",
    } as Serialized);
    // Empty name + empty id → type is a weak label; force truly blank via cast.
    const blank = resolveToolIdentity({
      lc: 1,
      type: "",
      id: [],
    } as unknown as Serialized);
    expect(blank.displayName).toBe("unknown-tool");
    expect(identity.displayName).toBe("not_implemented");
  });

  it("distinguishes two tools that share the same class", () => {
    const a = resolveToolIdentity(mockSerialized("DynamicStructuredTool"), "alpha");
    const b = resolveToolIdentity(mockSerialized("DynamicStructuredTool"), "beta");
    expect(a.displayName).toBe("alpha");
    expect(b.displayName).toBe("beta");
    expect(a.toolClass).toBe("DynamicStructuredTool");
    expect(b.toolClass).toBe("DynamicStructuredTool");
  });

  it("applies canonical attributes", () => {
    const attrs: Record<string, unknown> = {};
    applyToolIdentityAttributes(
      attrs,
      resolveToolIdentity(mockSerialized("DynamicStructuredTool"), "calc", {}, "cid"),
    );
    expect(attrs).toMatchObject({
      tool: "calc",
      toolName: "calc",
      toolClass: "DynamicStructuredTool",
      toolCallId: "cid",
      frameworkRunName: "calc",
    });
  });
});
