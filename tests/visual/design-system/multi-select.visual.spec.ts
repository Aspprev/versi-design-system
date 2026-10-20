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
