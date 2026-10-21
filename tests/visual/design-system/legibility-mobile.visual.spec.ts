import { expect, test } from "@playwright/test";
import { readLegibility, settle } from "./legibility.helpers";

test("matriz e comparação de status permanecem legíveis no celular", async ({ page }) => {
  await page.setViewportSize({width:393,height:852});
  await page.goto("/iframe.html?id=laboratory-legibility--light&viewMode=story");
  await expect(page.locator("main.legibility-matrix")).toBeVisible();
  for (const theme of ["default","custom2133"]) for (const mode of ["light","dark","high-light","high-dark"]) {
    await page.evaluate(({theme,mode})=>Object.assign(document.documentElement.dataset,{dsTheme:theme,colorScheme:mode.endsWith("dark")?"dark":"light",contrast:mode.startsWith("high")?"high":"normal",contrastTheme:mode.endsWith("dark")?"dark":"light"}),{theme,mode});
    await settle(page.locator("main.legibility-matrix"));
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    if(mode.startsWith("high")) expect((await readLegibility(page)).filter(row=>!row.disabled&&!row.uncertainBackground&&row.ratio<row.minimum)).toEqual([]);
  }
  await page.goto("/iframe.html?id=laboratory-legibility--before-after&viewMode=story&globals=dsTheme:custom2133;colorScheme:dark;contrast:normal");
  await expect(page.getByRole("heading",{name:"Depois · componente atual"})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
