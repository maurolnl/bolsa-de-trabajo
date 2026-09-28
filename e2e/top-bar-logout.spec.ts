import { expect, Page, test } from "@playwright/test";

type Role = "employee" | "employer";

const restoreSession = async (page: Page, role: Role) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("access-token", JSON.stringify("test-token"));
  });
  await page.route("**/auth/me", (route) =>
    route.fulfill({
      json: { ID: 1, Email: `${role}@example.com`, Role: role },
    }),
  );
  await page.route(`**/api/users/1/${role}`, (route) =>
    route.fulfill({ status: 200, json: { id: 20, user_id: 1 } }),
  );
  await page.route("**/employers/*/jobs", (route) =>
    route.fulfill({ status: 200, json: [] }),
  );
};

for (const role of ["employee", "employer"] as const) {
  test(`el ${role} cierra sesión desde el avatar de la top bar`, async ({
    page,
  }) => {
    await restoreSession(page, role);
    await page.goto("/main");
    await expect(page).toHaveURL(new RegExp(`/main/${role}/`));

    await page.getByRole("button", { name: "Abrir menú de cuenta" }).click();
    await expect(page.getByText(`${role}@example.com`)).toBeVisible();
    await page.getByRole("menuitem", { name: "Cerrar sesión" }).click();

    await expect(page).toHaveURL(/\/auth\/login/);
    expect(
      await page.evaluate(() => window.localStorage.getItem("access-token")),
    ).toBeNull();
  });
}
