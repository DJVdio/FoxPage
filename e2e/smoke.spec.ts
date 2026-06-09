import { test, expect } from "@playwright/test";

// Skip the one-time CRT boot animation so tests start at the app immediately.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("foxpage_booted", "1");
    } catch {
      // ignore
    }
  });
});

test("home lists the app library", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("APP.LIBRARY")).toBeVisible();
  await expect(page.getByText("小游戏")).toBeVisible();
});

test("search filters the library, including nested apps", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder(/SEARCH/).fill("snake");
  await expect(page.getByText("贪吃蛇")).toBeVisible();
  await expect(page.getByText("计时器")).toHaveCount(0);
});

test("command palette opens and launches an app", async ({ page }) => {
  await page.goto("/");
  // Wait until the client shell has hydrated (the settings control is mounted in
  // the same shell as the palette's global key listener).
  await expect(page.getByRole("button", { name: "settings" })).toBeVisible();

  await page.keyboard.press("ControlOrMeta+k");
  const input = page.getByPlaceholder(/V.A.T.S/);
  await expect(input).toBeVisible();
  await input.fill("converter");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/apps\/converter/);
});

test("phosphor skin switch re-skins the CRT", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "settings" }).click();
  await page.getByRole("button", { name: "AMBER" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-phosphor", "amber");
});

test("unit converter computes a result", async ({ page }) => {
  await page.goto("/apps/converter");
  await expect(page.getByText("RESULT")).toBeVisible();
  // default: 1 m → km = 0.001
  await expect(page.getByText("0.001")).toBeVisible();
});
