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

  await input.click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "2026" }).click();
  await expect(dialog).toBeHidden();

  await input.click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "2027" }).click();
  await expect(dialog).toBeHidden();
  await expect(input).toHaveValue("2027");

  const viewport = page.viewportSize();
  await page.mouse.click(
    (viewport?.width ?? 1280) - 2,
    (viewport?.height ?? 720) - 2,
  );
  await expect(dialog).toBeHidden();

  await input.click();
  await expect(dialog).toBeVisible();
  await page.mouse.click(
    (viewport?.width ?? 1280) - 2,
    (viewport?.height ?? 720) - 2,
  );
  await expect(dialog).toBeHidden();

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

test("DatePicker por mês inicia no modo mensal e sinaliza limites", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=components-forms-datepicker--month-selection&viewMode=story",
    { waitUntil: "networkidle" },
  );

  const input = page.getByRole("combobox", { name: "Mês de referência" });
  await expect(input).toHaveValue("07/2024");
  await input.click();

  const dialog = page.getByRole("dialog", { name: "Selecionar mês" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("group", { name: "Meses do calendário" }),
  ).toBeVisible();

  const months = dialog.locator('[data-calendar-option="true"]');
  const january = months.nth(0);
  await expect(january).toBeDisabled();
  await expect(january).toHaveClass(/opacity-30/);

  const august = months.nth(7);
  await expect(august).toBeEnabled();
  await august.click();
  await expect(input).toHaveValue("08/2024");
});
