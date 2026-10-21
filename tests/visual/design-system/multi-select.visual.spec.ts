import { expect, test } from "@playwright/test";

test("MultiSelect adapta os nomes e o contador à largura sem perder a seleção", async ({ page }) => {
  await page.goto("/iframe.html?id=components-forms-selectmulti--selected-labels&viewMode=story");
  const trigger = page.locator("button[aria-expanded]");
  const visibleNames = trigger.locator(".field-value > span").first();
  const counter = trigger.locator(".field-value > span").filter({ hasText: /^\+\d+$/ });
  const slider = page.getByRole("slider");

  await expect(trigger).toHaveAccessibleDescription(/5 opções selecionadas: Plano Básico, Plano Especial/);
  await slider.press("Home");
  await expect(counter).toHaveText("+4");
  await expect(visibleNames).toHaveText("Plano Básico");
  const narrowWidth = (await trigger.boundingBox())!.width;
  await slider.press("End");
  await expect.poll(async () => (await trigger.boundingBox())!.width).toBeGreaterThan(narrowWidth);
  if ((page.viewportSize()?.width ?? 0) >= 768) {
    await expect.poll(async () => Number((await counter.textContent())?.replace("+", "") ?? 0)).toBeLessThan(4);
  } else {
    // The viewport can still limit the field to one complete label on phones.
    await expect.poll(async () => Number((await counter.textContent())?.replace("+", "") ?? 0)).toBeLessThanOrEqual(4);
  }
  await expect(trigger).toHaveAccessibleDescription(/5 opções selecionadas/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await trigger.click();
  await expect(page.getByRole("checkbox", { checked: true })).toHaveCount(5);
  const firstOption = page.getByRole("checkbox", { name: "Plano Básico", exact: true });
  await firstOption.focus();
  await firstOption.press("Space");
  await expect(firstOption).not.toBeChecked();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(visibleNames).toContainText("Plano Especial");
  await expect(trigger).toHaveAccessibleDescription(/4 opções selecionadas/);

  await page.getByRole("button", { name: "Limpar seleção de Benefícios selecionados" }).click();
  await expect(visibleNames).toHaveText("Selecione");
  await expect(counter).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAccessibleDescription("Nenhuma opção selecionada");
});


test("SelectMulti: sections and global selection limits", async ({ page }) => {
  await page.goto("/iframe.html?id=components-forms-selectmulti--selection-limits&viewMode=story");
  const trigger = page.locator("button[aria-expanded]");
  const clear = page.getByRole("button", { name: /Limpar seleção/ });
  await expect(trigger).toHaveAccessibleDescription(/Selecione de 1 a 3 opções/);
  await expect(clear).toBeDisabled();
  await trigger.click();
  await expect(page.getByRole("group", { name: "Planos previdenciários", exact: true })).toBeVisible();
  await expect(page.getByRole("group", { name: "Benefícios adicionais", exact: true })).toBeVisible();
  const basic = page.getByRole("checkbox", { name: "Plano Básico", exact: true });
  const health = page.getByRole("checkbox", { name: "Auxílio saúde", exact: true });
  const education = page.getByRole("checkbox", { name: "Auxílio educação", exact: true });
  const special = page.getByRole("checkbox", { name: "Plano Especial", exact: true });
  await expect(basic).toBeDisabled();
  await basic.focus();
  await page.keyboard.press("Space");
  await expect(basic).toBeChecked();
  await health.locator("..").click();
  await expect(health).toBeChecked();
  await education.locator("..").click();
  await expect(education).toBeChecked();
  await expect(special).toBeDisabled();
  await special.focus();
  await page.keyboard.press("Space");
  await expect(special).not.toBeChecked();
  await expect(page.getByRole("checkbox", { checked: true })).toHaveCount(3);
  await health.locator("..").click();
  await expect(health).not.toBeChecked();
  await expect(special).toBeEnabled();
  await education.locator("..").click();
  await expect(education).not.toBeChecked();
  await expect(basic).toBeDisabled();
  await basic.focus();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAccessibleDescription(/1 opção selecionada: Plano Básico/);
});

test("SelectMulti: grouped list without limits remains clearable", async ({ page }) => {
  await page.goto("/iframe.html?id=components-forms-selectmulti--grouped&viewMode=story");
  const trigger = page.locator("button[aria-expanded]");
  await trigger.click();
  await page.getByRole("checkbox", { name: "Auxílio saúde", exact: true }).locator("..").click();
  await expect(trigger).toHaveAccessibleDescription(/Auxílio saúde/);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: /Limpar seleção/ }).click();
  await expect(trigger).toHaveAccessibleDescription("Nenhuma opção selecionada");
});


test("SelectMulti: floating menu stays inside viewport near footer and follows scroll", async ({ page }) => {
  await page.goto("/iframe.html?id=components-forms-selectmulti--near-viewport-edge&viewMode=story");
  const trigger = page.locator("button[aria-expanded]");
  await trigger.click();
  const panel = page.locator(`#${await trigger.getAttribute("aria-controls")}`);
  const assertBounds = async () => {
    const rect = (await panel.boundingBox())!;
    expect(rect.x).toBeGreaterThanOrEqual(7);
    expect(rect.y).toBeGreaterThanOrEqual(7);
    expect(rect.x + rect.width).toBeLessThanOrEqual(page.viewportSize()!.width - 7);
    expect(rect.y + rect.height).toBeLessThanOrEqual(page.viewportSize()!.height - 7);
  };
  await expect(panel).toBeVisible();
  await assertBounds();
  await page.evaluate(() => window.scrollBy(0, 80));
  await expect.poll(async () => (await panel.boundingBox())!.y).toBeGreaterThanOrEqual(7);
  await assertBounds();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("SelectMulti: portaled checkboxes remain interactive inside a clipped modal", async ({ page }) => {
  await page.goto("/iframe.html?id=components-forms-selectmulti--inside-modal&viewMode=story");
  await page.getByRole("button", { name: "Abrir seleção em modal" }).click();
  const dialog = page.getByRole("dialog");
  const trigger = dialog.locator("button[aria-expanded]");
  await trigger.click();
  const health = page.getByRole("checkbox", { name: "Auxílio saúde", exact: true });
  await expect(health).toBeVisible();
  await health.locator("..").click();
  await expect(health).toBeChecked();
  await expect(trigger).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.keyboard.press("Tab");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeVisible();
  await page.getByRole("button", { name: "Fechar janela" }).click();
  await expect(dialog).toBeHidden();
});
