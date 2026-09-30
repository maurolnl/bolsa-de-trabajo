import { expect, Page, test } from "@playwright/test";

const fillCredentials = async (page: Page, email: string) => {
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Contraseña").fill("valid-password");
};

for (const role of [{ label: "Empleado", value: "employee" }] as const) {
  test(`registra una cuenta con rol ${role.value}`, async ({ page }) => {
    let requestBody: unknown;
    await page.route("**/api/auth/register", async (route) => {
      requestBody = route.request().postDataJSON();
      await route.fulfill({ status: 200, json: {} });
    });

    await page.goto("/auth/register");
    await fillCredentials(page, `${role.value}@example.com`);
    await page.getByRole("radio", { name: role.label, exact: true }).click();
    await page.getByRole("button", { name: "Crear cuenta" }).click();

    await expect(page).toHaveURL("/auth/login");
    expect(requestBody).toEqual({
      email: `${role.value}@example.com`,
      password: "valid-password",
      role: role.value,
    });
  });
}

test("no permite registrar empleadores mientras el alta está deshabilitada", async ({
  page,
}) => {
  await page.goto("/auth/register");

  await expect(
    page.getByRole("radio", { name: "Empleador", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByText("El registro de empleadores está deshabilitado temporalmente."),
  ).toBeVisible();
});

test("exige seleccionar un rol antes de registrarse", async ({ page }) => {
  let requestCount = 0;
  await page.route("**/api/auth/register", async (route) => {
    requestCount += 1;
    await route.fulfill({ status: 200, json: {} });
  });

  await page.goto("/auth/register");
  await fillCredentials(page, "without-role@example.com");
  await page.getByRole("button", { name: "Crear cuenta" }).click();

  await expect(page.getByText("Seleccioná un rol")).toBeVisible();
  expect(requestCount).toBe(0);
  await expect(page).toHaveURL("/auth/register");
});

test("rechaza una contraseña menor a ocho caracteres", async ({ page }) => {
  let requestCount = 0;
  await page.route("**/api/auth/register", async (route) => {
    requestCount += 1;
    await route.fulfill({ status: 200, json: {} });
  });

  await page.goto("/auth/register");
  await page.getByLabel("Email").fill("short-password@example.com");
  await page.getByLabel("Contraseña").fill("short");
  await page.getByRole("radio", { name: "Empleado", exact: true }).click();
  await page.getByRole("button", { name: "Crear cuenta" }).click();

  await expect(
    page.getByText("La contraseña debe tener al menos 8 caracteres"),
  ).toBeVisible();
  expect(requestCount).toBe(0);
});
