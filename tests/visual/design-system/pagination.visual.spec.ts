import { expect, test, type APIRequestContext, type Locator } from "@playwright/test";

const widths = [375, 1280];

async function getStoryId(
  request: APIRequestContext,
  title: string,
  storyId: string,
) {
  const response = await request.get("/index.json");
  expect(response.ok()).toBe(true);
  const index = await response.json() as {
    entries: Record<string, { id: string; title: string; type: string }>;
  };
  const entry = Object.values(index.entries).find(
    (candidate) =>
      candidate.type === "story" &&
      candidate.title === title &&
      candidate.id.endsWith(storyId),
  );

  expect(entry, `Story not found: ${title}/${storyId}`).toBeTruthy();
  return entry!.id;
}

async function expectEqualHeights(locators: Locator[]) {
  const boxes = await Promise.all(locators.map((locator) => locator.boundingBox()));
  const heights = boxes.map((box) => box?.height ?? 0);
  expect(heights.every((height) => height > 0)).toBe(true);
  expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(0.5);
}

test("Pagination standalone alinha números e navegação em desktop e mobile", async ({
  page,
  request,
}) => {
  const storyIds = await Promise.all([
    getStoryId(
      request,
      "Components/Navigation/Pagination",
      "--middle-page",
    ),
    getStoryId(
      request,
      "Components/Navigation/Pagination",
      "--small-page-size",
    ),
    getStoryId(
      request,
      "Components/Navigation/Pagination",
      "--arrow-controls",
    ),
    getStoryId(
      request,
      "Components/Navigation/Pagination",
      "--small-arrow-controls",
    ),
  ]);

  for (const width of widths) {
    await page.setViewportSize({ width, height: 800 });

    for (const storyId of storyIds) {
      await page.goto(`/iframe.html?id=${storyId}&viewMode=story`, {
        waitUntil: "networkidle",
      });

      const pagination = page.locator('nav[aria-label="Paginação"]');
      await expect(pagination).toBeVisible();
      await expectEqualHeights(
        await pagination.locator("button").all(),
      );
    }
  }
});

test("Table alinha paginação default e arrows sem alterar as larguras", async ({
  page,
  request,
}) => {
  const storyIds = await Promise.all([
    getStoryId(
      request,
      "Components/Data Display/Table",
      "--with-pagination",
    ),
    getStoryId(
      request,
      "Components/Data Display/Table",
      "--with-arrow-pagination",
    ),
  ]);

  for (const width of widths) {
    await page.setViewportSize({ width, height: 800 });

    for (const storyId of storyIds) {
      await page.goto(`/iframe.html?id=${storyId}&viewMode=story`, {
        waitUntil: "networkidle",
      });

      const previous = page.getByRole("button", {
        name: "Ir para a página anterior",
      });
      const next = page.getByRole("button", {
        name: "Ir para a próxima página",
      });
      const current = page.locator(
        'div[aria-live="polite"][aria-atomic="true"]',
      );

      await expect(previous).toBeVisible();
      await expect(next).toBeVisible();
      await expect(current).toBeVisible();
      await expect(previous).toBeDisabled();
      await expectEqualHeights([previous, current, next]);
    }
  }
});
