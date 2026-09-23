import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("DatePicker por ano mantém nome, teclado e diálogo acessível", async ({ page }) => {
  await page.goto(
    "/iframe.html?id=components-forms-datepicker--year-selection&viewMode=story",
    { waitUntil: "networkidle" },
  );

  const root = page.locator("#storybook-root");
  await expect(root).toBeVisible();

  const input = page.getByRole("combobox", { name: "Ano de referência" });
  await input.click();

  const dialog = page.getByRole("dialog", { name: "Selecionar ano" });
  await expect(dialog).toBeVisible();

  const yearButton = dialog.getByRole("button", { name: "2025" });
  await yearButton.focus();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByRole("button", { name: "2026" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(input).toBeFocused();

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
