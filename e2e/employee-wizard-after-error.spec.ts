import { expect, test } from "@playwright/test";

const createdEmployee = {
  id: 10,
  user_id: 1,
  email: "employee@example.com",
  position: "Developer",
  role: "Adjunto",
  years_of_experience: "1y",
  certifications: [],
  portfolio_url: "https://dev.myportfolio.test",
  internet_connections: [],
  timezone: "",
  os: "",
  paid_software: [],
  available_hours_per_day: 0,
  compatible_projects: null,
  incompatible_projects: null,
  files: [],
  education: [],
};

// Un error de mutación dispara el toast global. El toast no debe descartar la caché de
// React Query: el perfil recién creado tiene que llegar al paso siguiente del asistente.
test("avanza el asistente tras corregir un error de creación", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("access-token", JSON.stringify("test-token"));
  });

  let createAttempts = 0;
  let employeeCreated = false;
  let locationRequests = 0;

  await page.route(
    (url) => url.pathname.startsWith("/api/"),
    async (route) => {
      const request = route.request();
      const { pathname } = new URL(request.url());

      if (pathname.endsWith("/auth/me")) {
        await route.fulfill({
          json: { ID: 1, Email: "employee@example.com", Role: "employee" },
        });
        return;
      }
      if (pathname.endsWith("/timezones")) {
        await route.fulfill({
          json: [{ name: "UTC", utcOffset: 0, abbreviation: "UTC" }],
        });
        return;
      }
      if (pathname.endsWith("/users/1/employee")) {
        if (employeeCreated) {
          await route.fulfill({ json: createdEmployee });
        } else {
          await route.fulfill({ status: 400, json: { error: "employee not found" } });
        }
        return;
      }
      if (pathname.endsWith("/employees") && request.method() === "POST") {
        createAttempts += 1;
        if (createAttempts === 1) {
          await route.fulfill({
            status: 500,
            json: { error: "internal error creating employee" },
          });
          return;
        }
        employeeCreated = true;
        await route.fulfill({ status: 201, body: "" });
        return;
      }
      if (pathname.endsWith("/employees/10/location") && request.method() === "PUT") {
        locationRequests += 1;
        await route.fulfill({ status: 200, json: {} });
        return;
      }

      await route.fulfill({ status: 404, json: { error: "Unexpected E2E request" } });
    },
  );

  await page.goto("/main/employee/profile");
  await page.getByPlaceholder("FullStack Developer").fill("Developer");
  await page.getByLabel("Adjunto", { exact: true }).check();
  await page.getByLabel("1 año", { exact: true }).check();

  const portfolio = page.getByPlaceholder("https://www.my-portfolio.com");
  await portfolio.fill("dev.myportfolio.test");
  await page.getByRole("button", { name: "Siguiente", exact: true }).click();
  await expect(
    page.getByText(
      "Las URLs deben empezar con http:// o https:// y separarse por comas",
    ),
  ).toBeVisible();
  expect(createAttempts).toBe(0);

  await portfolio.fill("https://dev.myportfolio.test");
  await page.getByRole("button", { name: "Siguiente", exact: true }).click();
  await expect(page.getByText("Error", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Siguiente", exact: true }).click();
  await expect(page).toHaveURL(/step=2/);

  await page.getByRole("button", { name: "Siguiente", exact: true }).click();
  await expect.poll(() => locationRequests).toBe(1);
  await expect(page).toHaveURL(/step=3/);
});

test("exige la posición pretendida antes de crear el perfil", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("access-token", JSON.stringify("test-token"));
  });

  let createAttempts = 0;
  await page.route(
    (url) => url.pathname.startsWith("/api/"),
    async (route) => {
      const request = route.request();
      const { pathname } = new URL(request.url());

      if (pathname.endsWith("/auth/me")) {
        await route.fulfill({
          json: { ID: 1, Email: "employee@example.com", Role: "employee" },
        });
        return;
      }
      if (pathname.endsWith("/timezones")) {
        await route.fulfill({ json: [] });
        return;
      }
      if (pathname.endsWith("/users/1/employee")) {
        await route.fulfill({ status: 400, json: { error: "employee not found" } });
        return;
      }
      if (pathname.endsWith("/employees") && request.method() === "POST") {
        createAttempts += 1;
        await route.fulfill({ status: 201, body: "" });
        return;
      }

      await route.fulfill({ status: 404, json: { error: "Unexpected E2E request" } });
    },
  );

  await page.goto("/main/employee/profile");
  await page.getByPlaceholder("FullStack Developer").fill("   ");
  await page.getByLabel("Adjunto", { exact: true }).check();
  await page.getByLabel("1 año", { exact: true }).check();
  await page.getByRole("button", { name: "Siguiente", exact: true }).click();

  await expect(page.getByText("Ingresar la posición pretendida")).toBeVisible();
  expect(createAttempts).toBe(0);
  await expect(page).not.toHaveURL(/step=2/);
});
