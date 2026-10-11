import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import { verifyBuildSecurity } from "../../scripts/check-build-security.mjs";

const require = createRequire(import.meta.url);
const braces = require("../../vendor/braces-build");

describe("build glob security and compatibility", () => {
  it("checks the patch actually resolved by build dependencies", () => {
    expect(verifyBuildSecurity).not.toThrow();
  });

  it("rejects mixed nesting, unbalanced input and caller-provided deep ASTs", () => {
    const mixed = "{(".repeat(1000) + "x" + ")}".repeat(1000);
    for (const operation of ["compile", "expand", "stringify", "parse"]) {
      expect(() => braces[operation](mixed)).toThrow(/maximum depth/);
      expect(() => braces[operation]("{".repeat(4000))).toThrow(/maximum depth/);
    }
    let ast = { type: "text", value: "x" };
    for (let i = 0; i < 1000; i++) ast = { type: "root", nodes: [ast] } as typeof ast;
    for (const operation of ["compile", "expand", "stringify"]) {
      expect(() => braces[operation](ast)).toThrow(/maximum depth/);
    }
    const cyclic = { type: "root", nodes: [] as unknown[] };
    cyclic.nodes.push(cyclic);
    expect(() => braces.compile(cyclic)).toThrow(/Cyclic/);
  });

  it("preserves normal patterns, boundary nesting and the existing range limit", () => {
    expect(braces.expand("{1..3}")).toEqual(["1", "2", "3"]);
    expect(braces.compile("src/{a,b}/*.tsx")).toBe("src/(a|b)/*.tsx");
    expect(braces.stringify("\\{a,b\\}")).toBe("{a,b}");
    expect(braces.compile("{".repeat(100) + "x" + "}".repeat(100))).toHaveLength(201);
    expect(() => braces.expand("{1..100000}")).toThrow(/range limit/);
    for (let i = 0; i < 100; i++) {
      expect(braces.expand(`folder${i}/{src,test}/**/*.{ts,tsx}`)).toEqual([
        `folder${i}/src/**/*.ts`, `folder${i}/src/**/*.tsx`, `folder${i}/test/**/*.ts`, `folder${i}/test/**/*.tsx`,
      ]);
    }
  });
});
