import { expect, Page, test } from "@playwright/test";

const submitLogin = async (page: Page) => {
  await page.goto("/auth/login");
  await page.getByLabel("Email").fill("employee@example.com");
  await page.getByLabel("Contraseña").fill("wrong-password");
  await page.getByRole("button", { name: "Ingresar", exact: true }).click();
};

// El backend respondía las credenciales inválidas en texto plano y ahora en JSON en
// inglés; en ambos casos el usuario tiene que ver el motivo en español.
for (const { name, response } of [
  {
    name: "texto plano",
    response: { status: 401, contentType: "text/plain", body: "invalid credentials\n" },
  },
  {
    name: "JSON",
    response: { status: 401, json: { error: "invalid credentials" } },
  },
]) {
  test(`explica las credenciales incorrectas ante un 401 en ${name}`, async ({
    page,
  }) => {
    await page.route("**/api/auth/login", (route) => route.fulfill(response));

    await submitLogin(page);

    await expect(
      page.getByText("Email o contraseña incorrectos", { exact: true }),
    ).toBeVisible();
    await expect(page).toHaveURL("/auth/login");
  });
}

test("mantiene el mensaje genérico ante un error del servidor", async ({ page }) => {
  await page.route("**/api/auth/login", (route) =>
    route.fulfill({ status: 500, json: { error: "internal error" } }),
  );

  await submitLogin(page);

  await expect(page.getByText("internal error", { exact: true })).toBeVisible();
  await expect(page.getByText("Email o contraseña incorrectos")).toHaveCount(0);
});
