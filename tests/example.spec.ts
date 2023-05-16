import { test } from "@playwright/test";

test("example", async ({ request }) => {
  await request.get("http://localhost:3000");

  // Expect a title "to contain" a substring.
  // await expect(page).toHaveTitle(/Playwright/);
});
