import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const expectNoAxeViolations = async (page: Page) => {
  const axeResults = await new AxeBuilder({ page })
    .include("#storybook-root")
    .analyze();

  expect(
    axeResults.violations,
    axeResults.violations
      .map((violation) => `${violation.id}: ${violation.help}`)
      .join("\n"),
  ).toEqual([]);
};

test("SkipLink recebe foco por teclado e preserva o alvo de navegação", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=design-system-accessibilityprimitives--skip-to-content&viewMode=story",
    { waitUntil: "networkidle" },
  );

  const skipLink = page.getByRole("link", { name: "Pular para o conteúdo" });
  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toHaveAttribute("href", "#storybook-main");
  await expect(page.locator("#storybook-main")).toBeVisible();
  await expectNoAxeViolations(page);
});

test("preferência de movimento reduzido elimina transição do DatePicker", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(
    "/iframe.html?id=components-forms-datepicker--year-selection&viewMode=story",
    { waitUntil: "networkidle" },
  );
  await page.locator("html").evaluate((element) => {
    element.dataset.motion = "reduce";
  });

  const input = page.getByRole("combobox", { name: "Ano de referência" });
  await input.click();
  const dialog = page.getByRole("dialog", { name: "Selecionar ano" });
  await expect(dialog).toBeVisible();
  await expect
    .poll(() =>
      dialog.evaluate((element) => Number.parseFloat(getComputedStyle(element).transitionDuration)),
    )
    .toBeLessThanOrEqual(0.001);
  await expectNoAxeViolations(page);
});

test("layout estreito com escala ampliada preserva a11y da tabela adaptive", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(
    "/iframe.html?id=components-data-display-table--responsive-adaptive&viewMode=story",
    { waitUntil: "networkidle" },
  );
  await page.locator("html").evaluate((element) => {
    element.dataset.fontScale = "extra-large";
    element.dataset.motion = "reduce";
  });

  const root = page.locator("#storybook-root");
  await expect(root).toBeVisible();
  await expect(root.locator('[data-responsive-mode="adaptive"]')).toBeVisible();
  await expectNoAxeViolations(page);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(overflow).toBe(false);
});

test("forced colors preserva a11y da tabela adaptive", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(
    "/iframe.html?id=components-data-display-table--responsive-adaptive&viewMode=story",
    { waitUntil: "networkidle" },
  );
  await page.locator("html").evaluate((element) => {
    element.dataset.contrast = "high";
    element.dataset.contrastTheme = "light";
  });

  await expect(page.locator("html")).toHaveAttribute("data-contrast", "high");
  await expect(page.locator('[data-responsive-mode="adaptive"]')).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => window.matchMedia("(forced-colors: active)").matches))
    .toBe(true);
  await expectNoAxeViolations(page);
});

for (const zoom of [2, 4] as const) {
  test(`escala de ${zoom * 100}% mantém reflow da tabela adaptive`, async ({ page }) => {
    await page.setViewportSize({ width: 1280 / zoom, height: 900 });
    await page.goto(
      "/iframe.html?id=components-data-display-table--responsive-adaptive&viewMode=story",
      { waitUntil: "networkidle" },
    );
    await page.locator("html").evaluate((element) => {
      element.dataset.fontScale = "extra-large";
    });

    await expect(page.locator('[data-responsive-mode="adaptive"]')).toBeVisible();
    await expectNoAxeViolations(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflow).toBe(false);
  });
}
