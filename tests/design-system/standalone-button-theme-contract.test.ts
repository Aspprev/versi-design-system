import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type TokenRule = {
  selector: string;
  declarations: Array<{ property: string; value: string }>;
};

const registry = JSON.parse(
  readFileSync(resolve(process.cwd(), "tokens/design-system.tokens.json"), "utf8"),
) as { tokens: TokenRule[]; themes: TokenRule[] };

function declaration(rule: TokenRule | undefined, property: string): string | undefined {
  return rule?.declarations.find((item) => item.property === property)?.value;
}

function findRule(rules: TokenRule[], selectorPart: string): TokenRule | undefined {
  return rules.find((rule) => rule.selector.includes(selectorPart));
}

describe("Button plain primary theme contract", () => {
  it.each([
    ["default", ":root", "235, 240, 255"],
    ["azul1", '[data-ds-theme="azul1"]', "235, 240, 255"],
    ["laranja1", '[data-ds-theme="laranja1"]', "255, 235, 215"],
    ["verde1", '[data-ds-theme="verde1"]', "229, 245, 236"],
  ])(
    "mantem action-primary-ghost-background ligado ao primary-5 de %s",
    (_theme, selector, expectedPrimary5) => {
      const rule = selector === ":root"
        ? findRule(registry.tokens, selector)
        : findRule(registry.themes, selector);

      expect(declaration(rule, "--primary-5")).toBe(expectedPrimary5);
      expect(declaration(rule, "--action-primary-ghost-background")).toBe(
        "var(--primary-5)",
      );
    },
  );

  it("redeclara o alias no body e nos presets legados para evitar o congelamento em :root", () => {
    expect(
      declaration(findRule(registry.tokens, "body"), "--action-primary-ghost-background"),
    ).toBe("var(--primary-5)");

    for (const theme of ["azul1", "laranja1", "verde1"]) {
      expect(
        declaration(findRule(registry.tokens, `.${theme}`), "--action-primary-ghost-background"),
      ).toBe("var(--primary-5)");
    }
  });

  it("preserva o override de ghost usado no modo escuro", () => {
    const darkRule = findRule(
      registry.tokens,
      'html[data-color-scheme="dark"]',
    );

    expect(declaration(darkRule, "--action-primary-ghost-background")).toBe(
      "var(--surface-muted)",
    );
  });
});
