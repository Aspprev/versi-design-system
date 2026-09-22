import { expect, test } from "@playwright/test";

test("catálogo: uma story de cada grupo renderiza sem erros de execução", async ({ page, request }) => {
  test.setTimeout(300_000);
  const response = await request.get("/index.json");
  expect(response.ok()).toBe(true);
  const index = await response.json() as { entries: Record<string, { id: string; title: string; type: string }> };
  const groups = new Map<string, string>();
  for (const entry of Object.values(index.entries)) {
    if (entry.type === "story" && !groups.has(entry.title)) groups.set(entry.title, entry.id);
  }
  expect(groups.size).toBeGreaterThan(30);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const [title, id] of groups) {
    await test.step(title, async () => {
      errors.length = 0;
      await page.goto(`/iframe.html?id=${id}&viewMode=story`, { waitUntil: "networkidle" });
      await expect(page.locator("#storybook-root main")).toBeVisible();
      if (title === "Components/Data Display/Chart/LazyApexChart" || title === "Components/Data Display/Chart") {
        await expect(page.locator(".apexcharts-svg").first()).toBeVisible();
      }
      expect(errors, `${title}: ${errors.join("; ")}`).toEqual([]);
    });
  }
});
