import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { DESIGN_SYSTEM_THEMES } from "../../../src/theme-presets";
import { contrastRatio } from "../../helpers/contrast";
import { readLegibility, settle } from "./legibility.helpers";

const css = readFileSync("dist/styles.css", "utf8") + readFileSync("dist/themes.css", "utf8");
const consumer = "body { background: rgb(var(--surface-page)); color: rgb(var(--content-primary)); }";
async function distributed(page: Page, layout: string) {
  await page.evaluate(() => document.querySelectorAll('style, link[rel="stylesheet"]').forEach(node => node.remove()));
  await page.addStyleTag({ content: css + consumer + readFileSync(layout, "utf8") });
}
async function mode(page: Page, theme: string, value: string) {
  await page.evaluate(({ theme, value }) => Object.assign(document.documentElement.dataset, { dsTheme:theme, colorScheme:value.endsWith("dark")?"dark":"light", contrast:value.startsWith("high")?"high":"normal", contrastTheme:value.endsWith("dark")?"dark":"light" }), { theme, value });
  await settle(page.locator("main"));
}

for (const theme of DESIGN_SYSTEM_THEMES) {
  test(`${theme}: foco, teclado e portais com CSS distribuído`, async ({ page }, info) => {
    test.skip(info.project.name === "chromium-mobile", "Cobertura completa no desktop; smoke responsivo separado.");
    await page.goto("/iframe.html?id=laboratory-legibility--light&viewMode=story");
    await expect(page.locator("main.legibility-matrix")).toBeVisible();
    await distributed(page, "stories/laboratory/legibility.css");
    for (const value of ["light", "dark", "high-light", "high-dark"]) {
      await mode(page, theme, value);
      const high = value.startsWith("high");
      const controls = [page.getByRole("button", {name:"primary · flat",exact:true}), page.getByLabel("Nome", {exact:true}), page.getByRole("checkbox").first(), page.getByRole("radio").first(), page.getByRole("switch",{name:"primary on",exact:true})];
      for (const control of controls) {
        await page.keyboard.press("Tab"); await control.focus();
        const ring = await control.evaluate(el => {
          const target = el.closest(".radio-option-focus, .field-keyboard-focus-ring") ?? el;
          const s = getComputedStyle(target);
          const parent = getComputedStyle(target.parentElement!);
          return {style:s.outlineStyle,width:parseFloat(s.outlineWidth),color:s.outlineColor,bg:parent.backgroundColor};
        });
        expect(ring.style).toBe("solid"); expect(ring.width).toBeGreaterThanOrEqual(2);
        if (high) {
          const background = await page.locator("body").evaluate(el => getComputedStyle(el).getPropertyValue("--surface-page"));
          expect(contrastRatio(ring.color, background)).toBeGreaterThanOrEqual(3);
        }
      }
      const tab = page.getByRole("tab", {name:"Resumo",exact:true});
      await tab.focus(); await page.keyboard.press("ArrowRight");
      await expect(page.getByRole("tab",{name:"Histórico",exact:true})).toBeFocused();
      await tab.click();
      await page.getByRole("combobox").first().click();
      const option = page.getByRole("option",{name:"Plano adicional",exact:true});
      await expect(option).toBeVisible(); await option.focus(); await settle(option);
      await option.evaluate(el => el.id="audited-option");
      const optionRows = await readLegibility(page,"#audited-option");
      if (high) expect(optionRows.filter(row=>row.ratio<row.minimum)).toEqual([]);
      await option.click();
      const help = page.getByRole("button",{name:"Ajuda contextual",exact:true});
      await help.focus();
      const tooltip = page.getByRole("tooltip");
      await expect(tooltip).toBeVisible();
      await settle(tooltip);
      await tooltip.evaluate(el => el.id="audited-tooltip");
      if (high) expect((await readLegibility(page,"#audited-tooltip")).filter(row=>row.ratio<row.minimum)).toEqual([]);
      await help.blur();
      await page.getByRole("button",{name:"Abrir modal de revisão",exact:true}).click();
      const close = page.getByRole("dialog").getByRole("button",{name:"Concluir revisão"});
      await expect(close).toBeVisible();
      await settle(page.getByRole("dialog"));
      const bodyTheme = await page.locator("body").evaluate(el=>getComputedStyle(el).getPropertyValue("--status-slate-outline-foreground"));
      expect(await close.evaluate(el=>getComputedStyle(el).getPropertyValue("--status-slate-outline-foreground"))).toBe(bodyTheme);
      if (high) expect((await readLegibility(page,'[role="dialog"]')).filter(row=>!row.disabled&&row.ratio<row.minimum)).toEqual([]);
      await close.click(); await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(page.locator('[data-audit="unmapped"]')).toHaveClass(/border-status-slate-outline-border/);
    }
  });

  test(`${theme}: gráficos, seleção, eixos e tooltip com CSS distribuído`, async ({ page }, info) => {
    test.skip(info.project.name === "chromium-mobile", "Cobertura completa no desktop; smoke responsivo separado.");
    test.setTimeout(180_000);
    const errors: string[]=[]; page.on("pageerror",error=>errors.push(error.message));
    await page.goto("/iframe.html?id=themes-clients-custom2133--light&viewMode=story");
    await expect(page.locator("main.client-theme-gallery")).toBeVisible();
    await distributed(page,"stories/themes/client-themes.css");
    for (const value of ["light","dark","high-light","high-dark"]) {
      await mode(page,theme,value);
      await expect(page.locator(".client-theme-charts .apexcharts-canvas")).toHaveCount(2);
      const line=page.locator(".apexcharts-line-series .apexcharts-line").first();
      const series=await page.locator("body").evaluate(el=>getComputedStyle(el).getPropertyValue("--chart-1").replace(/\s/g,""));
      await expect.poll(()=>line.evaluate(el=>getComputedStyle(el).stroke.match(/[\d.]+/g)?.slice(0,3).join(","))).toBe(series);
      await expect(page.locator(".client-theme-charts rect[data-versi-chart-label]")).toHaveCount(3);
      await settle(page.locator("main"));
      if(value.startsWith("high")) {
        const text=await readLegibility(page,"main .client-theme-charts");
        expect.soft(text.filter(row=>!row.disabled&&!row.uncertainBackground&&row.ratio<row.minimum)).toEqual([]);
      }
      const donut=page.getByRole("group",{name:"Distribuição do patrimônio"});
      await donut.focus(); await page.keyboard.press("ArrowRight");
      await expect(donut.locator('[aria-live="polite"]').first()).not.toBeEmpty();
      await page.keyboard.press("Escape");
      const slice=donut.locator(".apexcharts-pie-series path").first();
      const point = await slice.evaluate(el => {
        const path = el as SVGPathElement;
        const boxes = Array.from(path.ownerSVGElement!.querySelectorAll<SVGPathElement>(".apexcharts-pie-series path")).map(p=>p.getBBox());
        const cx = (Math.min(...boxes.map(b=>b.x)) + Math.max(...boxes.map(b=>b.x+b.width))) / 2;
        const cy = (Math.min(...boxes.map(b=>b.y)) + Math.max(...boxes.map(b=>b.y+b.height))) / 2;
        const outer = path.getPointAtLength(path.getTotalLength()*.15);
        const point = new DOMPoint(cx+(outer.x-cx)*.85,cy+(outer.y-cy)*.85).matrixTransform(path.getScreenCTM()!);
        return {x:point.x,y:point.y};
      });
      await page.mouse.move(point.x, point.y);
      const tooltip=donut.locator(".apexcharts-tooltip");
      await expect(tooltip).toHaveClass(/apexcharts-active/);
      await settle(tooltip);
      if(value.startsWith("high")) {
        await tooltip.evaluate(el=>el.id="audited-chart-tooltip");
        expect((await readLegibility(page,"#audited-chart-tooltip")).filter(row=>row.ratio<row.minimum)).toEqual([]);
      }
    }
    expect(errors).toEqual([]);
  });
}

test("inline antigo do portal encobre a correção até ser removido", async ({ page })=>{
  await page.goto("/iframe.html?id=laboratory-legibility--dark&viewMode=story&globals=dsTheme:custom2133");
  await expect(page.locator('[data-audit="unmapped"]')).toBeVisible();
  await distributed(page,"stories/laboratory/legibility.css");
  const token="--status-slate-outline-foreground";
  const clean=await page.locator("body").evaluate((el,key)=>getComputedStyle(el).getPropertyValue(key),token);
  await page.locator("body").evaluate((el,key)=>(el as HTMLElement).style.setProperty(key,"25, 28, 31"),token);
  expect(await page.locator("body").evaluate((el,key)=>getComputedStyle(el).getPropertyValue(key),token)).toBe("25, 28, 31");
  await page.locator("body").evaluate((el,key)=>(el as HTMLElement).style.removeProperty(key),token);
  expect(await page.locator("body").evaluate((el,key)=>getComputedStyle(el).getPropertyValue(key),token)).toBe(clean);
});
