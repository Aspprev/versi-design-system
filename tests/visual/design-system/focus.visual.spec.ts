import { expect, test, type Locator, type Page } from "@playwright/test";

const themes = ["default", "azul1", "azul2", "azul3", "laranja1", "laranja2", "verde1", "verde2", "verde3", "verde4", "rosa1"];

async function open(page: Page, id: string, scheme: string, contrast: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=colorScheme:${scheme};contrast:${contrast}`, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#storybook-root > *").first()).toBeVisible();
}

async function expectRing(element: Locator) {
  await expect.poll(() => element.evaluate(el => {
    const style = getComputedStyle(el);
    return style.outlineStyle === "solid" && parseFloat(style.outlineWidth) >= 2 && style.outlineColor !== "rgba(0, 0, 0, 0)";
  })).toBe(true);
}

for (const scheme of ["light", "dark"]) for (const contrast of ["normal", "high"]) {
  test.describe(`${scheme}/${contrast}: foco independente de provider`, () => {
    test("checkbox e cards de rádio mostram o controle focado", async ({ page }) => {
      await open(page, "components-forms-checkbox--options", scheme, contrast);
      await page.keyboard.press("Tab");
      const checkbox = page.getByRole("checkbox").first();
      await expect(checkbox).toBeFocused();
      await expectRing(checkbox);
      await expect(page.locator("html")).not.toHaveAttribute("data-focus-navigation", "keyboard");

      await open(page, "components-forms-checkbox--error", scheme, contrast);
      await page.keyboard.press("Tab");
      await expectRing(page.getByRole("checkbox").first());

      await open(page, "components-forms-radiogroup--default", scheme, contrast);
      await page.keyboard.press("Tab");
      await expectRing(page.getByRole("radio").first());

      await open(page, "components-forms-radiocardgroup--plans", scheme, contrast);
      await page.keyboard.press("Tab");
      await expect(page.getByRole("radio").first()).toBeFocused();
      await expectRing(page.locator(".radio-option-focus").first());
    });

    test("campo com erro preserva a borda e ganha foco no contêiner", async ({ page }) => {
      await open(page, "components-forms-inputstandalone--error", scheme, contrast);
      const input = page.getByRole("textbox");
      const control = page.locator(".field-keyboard-focus-ring");
      const border = await control.evaluate(el => getComputedStyle(el).borderColor);
      await page.keyboard.press("Tab");
      await expect(input).toBeFocused();
      await expectRing(control);
      await expect(control).toHaveCSS("border-color", border);
      await expect(input).toHaveAttribute("aria-invalid", "true");
    });

    test("SelectMulti transfere foco para o checkbox visível", async ({ page }) => {
      await open(page, "components-forms-selectmulti--default", scheme, contrast);
      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowDown");
      const checkbox = page.getByRole("checkbox").first();
      await expect(checkbox).toBeFocused();
      await expectRing(checkbox.locator("+ .checkbox-control-proxy"));
      await page.keyboard.press("Escape");
      await expect(page.locator("button[aria-expanded]").first()).toBeFocused();
    });

    test("prefixo e entrada do telefone têm indicadores distintos sem recorte", async ({ page }) => {
      await open(page, "components-forms-inputphone--default", scheme, contrast);
      const prefix = page.locator(".field-inset-focus-ring");
      await page.keyboard.press("Tab");
      await expect(prefix).toBeFocused();
      await expectRing(prefix);
      await expect(prefix).toHaveCSS("outline-offset", "-4px");
      await page.keyboard.press("Tab");
      await expect(page.locator('input[type="tel"]')).toBeFocused();
      await expectRing(page.locator(".field-keyboard-focus-ring"));
    });
  });
}

test("abas usam uma entrada por Tab, setas, Home/End e ignoram desabilitadas", async ({ page }) => {
  await open(page, "components-layout-pagetabsheader--keyboard-navigation", "light", "normal");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("tab", { name: "Visão geral" })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Histórico" })).toBeFocused();
  await expect(page.getByRole("tab", { name: "Histórico" })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "Documentos" })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Visão geral" })).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("tab", { name: "Documentos" })).toBeFocused();
  await page.keyboard.press("Home");
  await expect(page.getByRole("tab", { name: "Visão geral" })).toBeFocused();
  await expect(page.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
});

for (const scheme of ["light", "dark"]) {
  test(`contraste do foco nos presets: ${scheme}`, async ({ page }) => {
    await open(page, "components-actions-button--flat-primary", scheme, "normal");
    await page.keyboard.press("Tab");
    for (const theme of themes) {
      const ratios = await page.evaluate(theme => {
        document.documentElement.dataset.dsTheme = theme;
        const probe = document.createElement("span");
        document.body.append(probe);
        const read = (token: string) => {
          probe.style.backgroundColor = `rgb(var(${token}))`;
          return getComputedStyle(probe).backgroundColor;
        };
        const luminance = (color: string) => {
          const [r, g, b] = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(v => v / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
          return r * 0.2126 + g * 0.7152 + b * 0.0722;
        };
        const ring = luminance(read("--focus-ring"));
        const result = ["--surface-page", "--surface-card-semantic", "--field-surface"].map(token => {
          const background = luminance(read(token));
          return (Math.max(ring, background) + 0.05) / (Math.min(ring, background) + 0.05);
        });
        probe.remove();
        return result;
      }, theme);
      for (const ratio of ratios) expect(ratio, `${scheme}/${theme}`).toBeGreaterThanOrEqual(3);
    }
  });
}
