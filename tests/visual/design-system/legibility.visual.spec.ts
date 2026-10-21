import { readFileSync, writeFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { DESIGN_SYSTEM_THEMES } from "../../../src/theme-presets";
import { readLegibility, settle } from "./legibility.helpers";

const MODES = ["light", "dark", "high-light", "high-dark"] as const;
const corrections = JSON.parse(readFileSync("docs/correcao-legibilidade/AJUSTES-FUNCIONAIS.json", "utf8"));

for (const theme of DESIGN_SYSTEM_THEMES) test(`${theme}: famílias e estados nos quatro modos`, async ({ page }, info) => {
  test.setTimeout(240_000);
  test.skip(info.project.name === "chromium-mobile", "Matriz completa no desktop; cobertura responsiva em legibility-mobile.");
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/iframe.html?id=laboratory-legibility--light&viewMode=story");
  await expect(page.locator("main.legibility-matrix")).toBeVisible();
  const report = [];
  for (const mode of MODES) {
    const high = mode.startsWith("high");
    await page.evaluate(({ theme, mode }) => {
      Object.assign(document.documentElement.dataset, { dsTheme: theme, colorScheme: mode.endsWith("dark") ? "dark" : "light", contrast: mode.startsWith("high") ? "high" : "normal", contrastTheme: mode.endsWith("dark") ? "dark" : "light" });
    }, { theme, mode });
    await settle(page.locator("main.legibility-matrix"));
    const rows = await readLegibility(page);
    const textFailures = rows.filter(row => !row.disabled && !row.uncertainBackground && row.ratio < row.minimum);
    const borderFailures = rows.filter(row => row.audit === "status" && row.appearance === "outline" && row.borderRatio < 3);
    report.push({ theme, mode, rows, textFailures, borderFailures });
    if (high) {
      expect.soft(textFailures, `${theme}/${mode} texto`).toEqual([]);
      expect.soft(borderFailures, `${theme}/${mode} status outline`).toEqual([]);
    }
    // Common modes are recorded for visual review, not gated by a global ratio.
    for (const button of await page.locator('[data-audit="button"]').all()) {
      for (const state of ["hover", "active"] as const) {
        await button.hover();
        if (state === "active") await page.mouse.down();
        try {
          await settle(button);
          const marker = `audit-${Math.random().toString(36).slice(2)}`;
          await button.evaluate((el, id) => el.id = id, marker);
          const states = await readLegibility(page, `#${marker}`);
          const actual = await button.evaluate(el => {
            const s = getComputedStyle(el);
            return { foreground: s.color, background: s.backgroundColor, color: el.getAttribute("data-color"), variant: el.getAttribute("data-variant") };
          });
          report.push({ theme, mode, state, actual, rows: states });
          if (high) {
            expect.soft(states.filter(row => !row.disabled && row.ratio < row.minimum), `${theme}/${mode}/${state}`).toEqual([]);
          }
        } finally { if (state === "active") await page.mouse.up(); }
      }
    }
    for (const [index, knob] of (await page.locator('.legibility-matrix [role="switch"]:not(:disabled) .switch-knob').all()).entries()) {
      const marker = `knob-${index}`;
      await knob.evaluate((el, id) => el.id = id, marker);
      const rows = await readLegibility(page, `#${marker}`, "background");
      report.push({ theme, mode, state: "switch-knob", rows });
      if (high) expect.soft(rows[0]?.ratio, `${theme}/${mode}/${marker}`).toBeGreaterThanOrEqual(3);
      const icon = knob.locator("svg");
      if (await icon.count()) {
        const iconId = `icon-${index}`;
        await icon.evaluate((el, id) => el.id = id, iconId);
        const rows = await readLegibility(page, `#${iconId}`, "color");
        report.push({ theme, mode, state: "switch-icon", rows });
        if (high) expect.soft(rows[0]?.ratio, `${theme}/${mode}/${iconId}`).toBeGreaterThanOrEqual(3);
      }
    }
    for (const [index, icon] of (await page.locator('#legibility-forms .field-keyboard-focus-ring svg').all()).entries()) {
      const marker = `field-icon-${index}`;
      await icon.evaluate((el, id) => el.id = id, marker);
      const rows = await readLegibility(page, `#${marker}`, "color");
      report.push({ theme, mode, state: "field-icon", rows });
      if (high && rows.length) expect.soft(rows[0].ratio, `${theme}/${mode}/${marker}`).toBeGreaterThanOrEqual(3);
    }
    // A changed functional snapshot must never pull placeholders into this fix.
    expect(Object.keys(corrections.overrides[theme][mode]).filter(key => key.includes("placeholder"))).toEqual([]);
  }
  expect(errors).toEqual([]);
  const reportPath = info.outputPath("measurements.json");
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  await info.attach(`legibility-${theme}`, { path: reportPath, contentType: "application/json" });
});
