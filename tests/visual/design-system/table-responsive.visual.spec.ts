import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("tabela adaptativa usa o contêiner e mantém semântica acessível", async ({ page }) => {
  await page.goto(
    "/iframe.html?id=components-data-display-table--responsive-adaptive&viewMode=story",
    { waitUntil: "networkidle" },
  );

  const root = page.locator("#storybook-root");
  await expect(root).toBeVisible();
  await expect(root.locator('[data-responsive-mode="adaptive"]')).toBeVisible();

  const axeResults = await new AxeBuilder({ page })
    .include("#storybook-root")
    .analyze();

  expect(
    axeResults.violations,
    axeResults.violations
      .map((violation) => `${violation.id}: ${violation.help}`)
      .join("\n"),
  ).toEqual([]);
});

test("filtro da tabela abre como diálogo, fecha com Escape e devolve foco", async ({ page }) => {
  await page.goto(
    "/iframe.html?id=components-data-display-table--filterable&viewMode=story",
    { waitUntil: "networkidle" },
  );

  const trigger = page.getByRole("button", {
    name: "Filtrar ou ordenar por Status",
  });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Filtros da coluna Status" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();

  const axeResults = await new AxeBuilder({ page })
    .include("#storybook-root")
    .analyze();

  expect(
    axeResults.violations,
    axeResults.violations
      .map((violation) => `${violation.id}: ${violation.help}`)
      .join("\n"),
  ).toEqual([]);
});
