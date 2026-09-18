import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const stories = [
  ["button", "design-system-button--flat-primary"],
  ["notice", "design-system-notice--warning-default"],
  ["input-formik", "design-system-input-formik--filled"],
  ["table", "design-system-table--striped-compact"],
] as const;

const themes = [
  {
    id: "light-default",
    scheme: "light",
    contrast: "normal",
    tenant: "default",
    fontScale: "default",
    motion: "full",
  },
  {
    id: "dark-default",
    scheme: "dark",
    contrast: "normal",
    tenant: "default",
    fontScale: "default",
    motion: "full",
  },
  {
    id: "light-high-blue-large",
    scheme: "light",
    contrast: "high",
    tenant: "azul1",
    fontScale: "large",
    motion: "reduce",
  },
  {
    id: "dark-high-green-extra-large",
    scheme: "dark",
    contrast: "high",
    tenant: "verde1",
    fontScale: "extra-large",
    motion: "reduce",
  },
] as const;

for (const [component, storyId] of stories) {
  for (const theme of themes) {
    test(`${component} — ${theme.id}`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${storyId}&viewMode=story`, {
        waitUntil: "networkidle",
      });

      const root = page.locator("#storybook-root");
      await expect(root).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(200);

      await page.evaluate(
        ({ scheme, contrast, tenant, fontScale, motion }) => {
          document.documentElement.dataset.colorScheme = scheme;
          document.documentElement.dataset.contrast = contrast;
          document.documentElement.dataset.contrastTheme = scheme;
          document.documentElement.dataset.dsTheme = tenant;
          document.documentElement.dataset.fontScale = fontScale;
          document.documentElement.dataset.motion = motion;
        },
        theme,
      );

      // O decorator pode concluir uma atualização logo após o primeiro
      // render. Reaplicar os atributos depois desse ciclo evita capturas
      // intermitentes com o esquema claro padrão.
      await page.waitForTimeout(200);
      await page.evaluate(
        ({ scheme, contrast, tenant, fontScale, motion }) => {
          document.documentElement.dataset.colorScheme = scheme;
          document.documentElement.dataset.contrast = contrast;
          document.documentElement.dataset.contrastTheme = scheme;
          document.documentElement.dataset.dsTheme = tenant;
          document.documentElement.dataset.fontScale = fontScale;
          document.documentElement.dataset.motion = motion;
        },
        theme,
      );
      await page.waitForTimeout(200);
      await page.evaluate(() => document.fonts.ready);

      const axeResults = await new AxeBuilder({ page })
        .include("#storybook-root")
        .analyze();

      expect(
        axeResults.violations,
        axeResults.violations
          .map((violation) => `${violation.id}: ${violation.help}`)
          .join("\n"),
      ).toEqual([]);

      await expect(root).toHaveScreenshot(`${component}-${theme.id}.png`);
    });
  }
}
