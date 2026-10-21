import { expect, test } from "@playwright/test";

test("InputSelect: sections, keyboard selection and focus restoration", async ({ page }) => {
  await page.goto("/iframe.html?id=components-forms-inputselect--grouped&viewMode=story");
  const trigger = page.getByRole("combobox");
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("group", { name: "Planos previdenciários" })).toBeVisible();
  await expect(page.getByRole("group", { name: "Benefícios adicionais" })).toBeVisible();
  await expect(page.getByRole("option")).toHaveCount(5);
  await expect(page.getByRole("option").first()).toBeFocused();
  for (let i = 0; i < 3; i++) await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("option", { name: "Auxílio saúde" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(trigger).toContainText("Auxílio saúde");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("option", { name: "Auxílio saúde" })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("InputSelect: search retains matching sections and counts only options", async ({ page }) => {
  await page.goto("/iframe.html?id=components-forms-inputselect--grouped-searchable&viewMode=story");
  await page.getByRole("combobox").click();
  const search = page.getByRole("textbox");
  await search.fill("saude");
  await expect(page.getByRole("group")).toHaveCount(1);
  await expect(page.getByRole("group", { name: "Benefícios adicionais" })).toBeVisible();
  await expect(page.getByRole("option")).toHaveCount(1);
  await expect(page.getByText("1 resultado encontrado", { exact: true })).toBeAttached();
  await search.fill("beneficios");
  await expect(page.getByRole("option")).toHaveCount(2);
  await search.fill("inexistente");
  await expect(page.getByRole("group")).toHaveCount(0);
  await expect(page.getByRole("option")).toHaveCount(0);
  await expect(page.getByText("Nenhuma opção encontrada", { exact: true }).first()).toBeAttached();
  await search.fill("educacao");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("combobox")).toContainText("Auxílio educação");
});

test("InputSelect: flat lists remain ungrouped", async ({ page }) => {
  await page.goto("/iframe.html?id=components-forms-inputselect--default&viewMode=story");
  await page.getByRole("combobox").click();
  await expect(page.getByRole("group")).toHaveCount(0);
  await expect(page.getByRole("option")).toHaveCount(3);
  await page.getByRole("option", { name: "Plano Especial", exact: true }).click();
  await expect(page.getByRole("combobox")).toContainText("Plano Especial");
});
