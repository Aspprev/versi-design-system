import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { readLegibility, settle } from "./legibility.helpers";
import { contrastRatio } from "../../helpers/contrast";

const generics = JSON.parse(readFileSync("docs/brand-accents/GENERICOS.json", "utf8")).themes.map((theme: { id: string }) => theme.id) as string[];
const clients = ["custom2178", "custom2156", "custom2140", "custom2133", "custom2170", "custom2162", "custom2157"];
const pairs = JSON.parse(readFileSync("docs/brand-accents/PAIRS.json", "utf8")).pairs;
const normalize = (value: string) => value.replace(/\s/g, "");
const colors = (page: Page): Promise<Record<string, string>> => page.locator('.brand-example-charts .apexcharts-line-series .apexcharts-series[seriesName]').evaluateAll(nodes => Object.fromEntries(nodes.map(node => [node.getAttribute("seriesName"), getComputedStyle(node.querySelector(".apexcharts-line")!).stroke])));
async function mode(page: Page, theme: string, value: string) {
  await page.evaluate(({ theme, value }) => {
    document.body.className = ""; document.body.removeAttribute("data-ds-theme");
    Object.assign(document.documentElement.dataset, { dsTheme: theme, colorScheme: value.endsWith("dark") ? "dark" : "light", contrast: value.startsWith("high") ? "high" : "normal", contrastTheme: value.endsWith("dark") ? "dark" : "light" });
  }, { theme, value });
  await expect(page.locator(".brand-example-charts .apexcharts-canvas")).toHaveCount(2);
  const expected = await page.locator("body").evaluate(el => getComputedStyle(el).getPropertyValue("--chart-1").replace(/\s/g, ""));
  await expect.poll(async () => (await colors(page))["Contribuições"]?.match(/[\d.]+/g)?.slice(0, 3).join(",")).toBe(expected);
  await settle(page.locator(".brand-accent-examples"));
}

for (const theme of [...clients, ...generics]) test(`${theme}: brand details, stable categories and contrast modes`, async ({ page }, info) => {
  test.skip(info.project.name === "chromium-mobile", "Desktop matrix; responsive smoke below.");
  test.setTimeout(180_000);
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.goto("/iframe.html?id=themes-brandaccents--light&viewMode=story");
  await expect(page.locator(".brand-accent-examples")).toBeVisible();
  const reports = [];
  for (const value of ["light", "dark", "high-light", "high-dark"]) {
    await mode(page, theme, value);
    const measured = await page.locator("body").evaluate(el => {
      const s = getComputedStyle(el);
      return Object.fromEntries([1, 2, 3].flatMap(n => ["", "-soft", "-content", "-border"].map(suffix => `--brand-accent-${n}${suffix}`).concat(`--chart-brand-accent-${n}`)).map(key => [key, s.getPropertyValue(key).trim()]));
    });
    for (const pair of pairs.filter((row: { theme: string; mode: string }) => row.theme === theme && row.mode === value)) {
      for (const [suffix, name] of [["", "reference"], ["-soft", "soft"], ["-content", "content"], ["-border", "border"]]) expect(normalize(measured[`--brand-accent-${pair.accent}${suffix}`])).toBe(normalize(pair[name]));
      expect(normalize(measured[`--chart-brand-accent-${pair.accent}`])).toBe(normalize(pair.chart));
    }
    const content = await readLegibility(page, ".brand-accent-examples");
    reports.push({ theme, mode: value, measured, content });
    if (value.startsWith("high")) {
      expect.soft(content.filter(row => !row.disabled && !row.uncertainBackground && row.ratio < row.minimum)).toEqual([]);
      for (let n = 0; n < 3; n++) {
        const icon = await readLegibility(page, `.brand-detail-card:nth-child(${n + 1}) .brand-icon-example svg`, "color");
        expect(icon.every(row => row.ratio >= 3)).toBe(true);
      }
      const ink = await colors(page);
      const surface = await page.locator("body").evaluate(el => getComputedStyle(el).getPropertyValue("--surface-card-semantic"));
      for (const color of Object.values(ink)) {
        const channels = color.match(/[\d.]+/g)!;
        expect(Number(channels[3] ?? 1)).toBe(1);
        expect(contrastRatio(channels.slice(0, 3).join(","), surface)).toBeGreaterThanOrEqual(3);
      }
    }
    const before = await colors(page);
    expect(Object.keys(before)).toHaveLength(6);
    await page.getByRole("button", { name: "Filtrar categorias" }).click();
    await expect.poll(async () => Object.keys(await colors(page)).length).toBe(4);
    await page.getByRole("button", { name: "Reordenar categorias" }).click();
    await settle(page.locator(".brand-accent-examples"));
    const after = await colors(page);
    for (const key of Object.keys(after)) expect(after[key]).toBe(before[key]);
    await page.getByRole("button", { name: "Reordenar categorias" }).click();
    await page.getByRole("button", { name: "Filtrar categorias" }).click();
    await expect.poll(async () => Object.keys(await colors(page)).length).toBe(6);
    const gradient = await page.locator(".brand-gradient-example").evaluate(el => getComputedStyle(el).backgroundImage);
    expect(gradient !== "none").toBe(["custom2133", "custom2157"].includes(theme) && !value.startsWith("high"));
  }
  expect(errors).toEqual([]);
  await info.attach("brand-details", { body: JSON.stringify(reports), contentType: "application/json" });
});

test("brand donut selection, custom colors, tooltip and legacy fallback", async ({ page }, info) => {
  test.skip(info.project.name === "chromium-mobile", "Interaction coverage on desktop.");
  await page.goto("/iframe.html?id=themes-brandaccents--light&viewMode=story");
  await mode(page, "custom2133", "light");
  const donut = page.getByRole("group", { name: "Distribuição por categoria de marca" });
  await donut.focus(); await page.keyboard.press("ArrowRight");
  await expect(donut.locator('[aria-live="polite"]').first()).toContainText("Contribuições");
  // Keyboard activation changes data without the existing outside-pointer reset.
  await page.getByRole("button", { name: "Reordenar categorias" }).focus();
  await page.keyboard.press("Space");
  await expect(donut.locator('[aria-live="polite"]').first()).toContainText("Contribuições");
  await donut.focus(); await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Cores personalizadas" }).click();
  await expect.poll(async () => (await colors(page))["Contribuições"]?.match(/[\d.]+/g)?.slice(0, 3).join(",")).toBe("114,82,162");
  await mode(page, "azul1", "high-dark");
  const custom = await colors(page);
  expect(custom["Contribuições"].match(/[\d.]+/g)!.slice(0, 3).join(",")).not.toBe("114,82,162");
  const fallback = await page.locator(".brand-icon-example").first().evaluate(el => ({ background: getComputedStyle(el).backgroundColor, expected: getComputedStyle(document.body).getPropertyValue("--surface-muted").trim() }));
  expect(fallback.background.match(/[\d.]+/g)!.slice(0, 3).join(",")).toBe(normalize(fallback.expected));
  const slice = donut.locator(".apexcharts-pie-series path").first();
  await slice.scrollIntoViewIfNeeded();
  const point = await slice.evaluate(el => {
    const path = el as SVGPathElement;
    const boxes = Array.from(path.ownerSVGElement!.querySelectorAll<SVGPathElement>(".apexcharts-pie-series path")).map(p => p.getBBox());
    const cx = (Math.min(...boxes.map(b => b.x)) + Math.max(...boxes.map(b => b.x + b.width))) / 2;
    const cy = (Math.min(...boxes.map(b => b.y)) + Math.max(...boxes.map(b => b.y + b.height))) / 2;
    const outer = path.getPointAtLength(path.getTotalLength() * .15);
    const p = new DOMPoint(cx + (outer.x - cx) * .85, cy + (outer.y - cy) * .85).matrixTransform(path.getScreenCTM()!);
    return { x: p.x, y: p.y };
  });
  await page.mouse.move(point.x, point.y);
  const tooltip = donut.locator(".apexcharts-tooltip");
  await expect(tooltip).toHaveClass(/apexcharts-active/);
  await settle(tooltip);
  await tooltip.evaluate(el => el.id = "brand-tooltip-audit");
  expect((await readLegibility(page, "#brand-tooltip-audit")).filter(row => row.ratio < row.minimum)).toEqual([]);
});

test("brand details responsive layout", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/iframe.html?id=themes-brandaccents--dark&viewMode=story");
  await expect(page.locator(".brand-detail-card")).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("generic brand pairs preserve chart roles and high contrast neutrals in every host", async ({ page }, info) => {
  test.skip(info.project.name === "chromium-mobile", "Token cascade independent of viewport.");
  await page.setContent("<html><body></body></html>");
  await page.addStyleTag({ content: readFileSync("dist/styles.css", "utf8") + readFileSync("dist/themes.css", "utf8") });
  const failures = await page.evaluate(() => {
    const failures: string[] = [];
    for (const theme of ["default", "azul1", "azul2", "azul3", "laranja1", "laranja2", "verde1", "verde2", "verde3", "verde4", "rosa1"]) for (const mode of ["light", "dark", "high-light", "high-dark"]) for (const host of ["html", "body"]) for (const identity of ["class", "attribute"]) {
      for (const el of [document.documentElement, document.body]) { el.className = ""; el.removeAttribute("data-ds-theme"); }
      Object.assign(document.documentElement.dataset, { colorScheme: mode.endsWith("dark") ? "dark" : "light", contrast: mode.startsWith("high") ? "high" : "normal", contrastTheme: mode.endsWith("dark") ? "dark" : "light" });
      const el = host === "html" ? document.documentElement : document.body;
      if (identity === "class") el.className = theme; else el.dataset.dsTheme = theme;
      const style = getComputedStyle(document.body);
      for (let n = 1; n <= 3; n++) for (const [role, fallback] of [[`--brand-accent-${n}-content`, "--content-primary"], [`--chart-brand-accent-${n}`, `--chart-${n}`], ...(mode.startsWith("high") ? [[`--brand-accent-${n}-soft`, "--surface-muted"], [`--brand-accent-${n}-border`, "--border-default"]] : [])]) {
        if (style.getPropertyValue(role).replace(/\s/g, "") !== style.getPropertyValue(fallback).replace(/\s/g, "")) failures.push(`${theme}/${mode}/${host}/${identity}: ${role}`);
      }
    }
    return failures;
  });
  expect(failures).toEqual([]);
});

test("implicit default and explicit custom identities keep their own brand accents", async ({ page }, info) => {
  test.skip(info.project.name === "chromium-mobile", "Cascade independent of viewport.");
  const proposals = JSON.parse(readFileSync("docs/brand-accents/GENERICOS.json", "utf8")).themes;
  await page.setContent("<html><body></body></html>");
  await page.addStyleTag({ content: readFileSync("dist/styles.css", "utf8") + readFileSync("dist/themes.css", "utf8") });
  for (const value of ["light", "dark", "high-light", "high-dark"]) {
    const expected = proposals.find((theme: { id: string }) => theme.id === "default").variants[value];
    const actual = await page.evaluate(value => {
      for (const el of [document.documentElement, document.body]) { el.className = ""; el.removeAttribute("data-ds-theme"); }
      Object.assign(document.documentElement.dataset, { colorScheme: value.endsWith("dark") ? "dark" : "light", contrast: value.startsWith("high") ? "high" : "normal", contrastTheme: value.endsWith("dark") ? "dark" : "light" });
      const s = getComputedStyle(document.body);
      return Object.fromEntries([1, 2, 3].map(n => [`--brand-accent-${n}`, s.getPropertyValue(`--brand-accent-${n}`).replace(/\s/g, "")]));
    }, value);
    expect(actual).toEqual(Object.fromEntries(Object.entries(expected as Record<string, string>).map(([key, value]) => [key, normalize(value)])));
  }
  const css = readFileSync("dist/themes.css", "utf8");
  expect(css).toContain('data-ds-theme="custom2178"');
  expect(css).toContain('data-ds-theme="custom2140"');
  // The comprehensive 288-context contract additionally protects all custom colors.
});
