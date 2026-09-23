import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadCountryFlags } from "../../src/data/country-flags-runtime";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

describe("country bundle loading", () => {
  it("keeps core and forms independent from the synchronous flag catalog", () => {
    const core = fs.readFileSync(path.join(root, "src/core.ts"), "utf8");
    const forms = fs.readFileSync(path.join(root, "src/forms.ts"), "utf8");

    expect(core).not.toContain("./countries");
    expect(forms).not.toContain("./countries");
  });

  it("loads all embedded flags through internal package data", async () => {
    const flags = await loadCountryFlags();

    expect(Object.keys(flags)).toHaveLength(250);
    expect(flags.br).toMatch(/^data:image\/svg\+xml;base64,/);
  });

  it("does not define an external flag request mechanism", () => {
    const runtime = fs.readFileSync(
      path.join(root, "src/data/country-flags-runtime.ts"),
      "utf8",
    );

    expect(runtime).not.toMatch(/fetch\s*\(/);
    expect(runtime).not.toMatch(/https?:\/\//);
    expect(runtime).toContain("country-flag-chunks");
  });
});
