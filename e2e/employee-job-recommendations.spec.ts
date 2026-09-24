import { expect, Page, test } from "@playwright/test";

const employeeAuthResponse = {
  ID: 2,
  Email: "employee@example.com",
  Role: "employee",
};

const employerAuthResponse = {
  ID: 1,
  Email: "employer@example.com",
  Role: "employer",
};

const employeeProfileResponse = {
  id: 30,
  user_id: 2,
  position: "Desarrolladora",
  role: "Adjunto",
  years_of_experience: "2_to_5y",
  certifications: [],
  portfolio_url: null,
  timezone: "America/Argentina/Buenos_Aires",
  os: "Linux Distribution",
  paid_software: [],
  available_hours_per_day: 6,
  compatible_projects: 2,
  incompatible_projects: 0,
  internet_connections: [],
  education: [],
  files: [],
  created_at: "2026-09-20T00:00:00Z",
  updated_at: "2026-09-20T00:00:00Z",
};

const employerProfileResponse = {
  id: 20,
  user_id: 1,
  name: "Laburi",
  industry: "Tecnología",
  location: "Buenos Aires",
  hiring_modalities: ["Tiempo completo"],
  created_at: "2026-09-15T00:00:00Z",
  updated_at: "2026-09-15T00:00:00Z",
};

const recommendation = (overrides: Record<string, unknown> = {}) => ({
  recommendation_id: 900,
  job_position_id: 50,
  employer_id: 20,
  position: "Desarrollador backend",
  role: "Adjunto",
  required_experience: "2_to_5y",
  required_education_level: "university",
  available_hours_per_day: 6,
  timezone: "America/Argentina/Buenos_Aires",
  technical_resources: ["Notebook"],
  score: null,
  published_at: "2026-09-19T00:00:00Z",
  updated_at: "2026-09-19T00:00:00Z",
  ...overrides,
});

const page200 = (
  status: string,
  items: object[],
  page: { limit: number; offset: number; total: number } = {
    limit: 20,
    offset: 0,
    total: items.length,
  },
) => ({ status, items, page });

type SetupOptions = {
  authResponse?: object;
  recommendationsStatus?: number;
  // Cada consulta consume el siguiente elemento y el último se repite: así se observa el
  // sondeo sin depender de tiempos.
  responses?: object[];
};

const setup = async (
  page: Page,
  {
    authResponse = employeeAuthResponse,
    recommendationsStatus = 200,
    responses = [page200("completed", [recommendation()])],
  }: SetupOptions = {},
) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("access-token", JSON.stringify("test-token"));
  });

  let attempts = 0;
  const requestedUrls: string[] = [];

  await page.route(
    (url) => url.pathname.startsWith("/api/"),
    async (route) => {
      const request = route.request();
      const { pathname, search } = new URL(request.url());

      if (pathname.endsWith("/auth/me")) {
        await route.fulfill({ json: authResponse });
        return;
      }

      if (pathname.endsWith("/users/2/employee")) {
        await route.fulfill({ json: employeeProfileResponse });
        return;
      }

      if (pathname.endsWith("/users/1/employer")) {
        await route.fulfill({ json: employerProfileResponse });
        return;
      }

      if (pathname.endsWith("/employers/20/jobs")) {
        await route.fulfill({ status: 200, json: [] });
        return;
      }

      if (pathname.endsWith("/employees/30/job-recommendations")) {
        requestedUrls.push(pathname + search);

        if (recommendationsStatus !== 200) {
          attempts += 1;
          await route.fulfill({
            status: recommendationsStatus,
            json: { error: "forbidden" },
          });
          return;
        }

        const index = Math.min(attempts, responses.length - 1);
        attempts += 1;
        await route.fulfill({ status: 200, json: responses[index] });
        return;
      }

      await route.fulfill({
        status: 404,
        json: { error: "Unexpected E2E request" },
      });
    },
  );

  return {
    attempts: () => attempts,
    requestedUrls: () => requestedUrls,
  };
};

test("lista los puestos recomendados del empleado", async ({ page }) => {
  await setup(page);

  await page.goto("/main/employee/home");

  await expect(
    page.getByRole("heading", { name: "Puestos recomendados" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Desarrollador backend" }),
  ).toBeVisible();
});

test("no muestra afinidad cuando la API no calculó el puntaje", async ({
  page,
}) => {
  await setup(page);

  await page.goto("/main/employee/home");

  await expect(
    page.getByRole("heading", { name: "Desarrollador backend" }),
  ).toBeVisible();
  await expect(page.getByText(/Afinidad/)).toHaveCount(0);
});

test("muestra el puntaje tal como la API lo informó", async ({ page }) => {
  await setup(page, {
    responses: [page200("completed", [recommendation({ score: 0.85 })])],
  });

  await page.goto("/main/employee/home");

  await expect(page.getByText("Afinidad 0.85")).toBeVisible();
});

test("distingue la ausencia de generación de la ausencia de coincidencias", async ({
  page,
}) => {
  await setup(page, {
    responses: [page200("none", [], { limit: 20, offset: 0, total: 0 })],
  });

  await page.goto("/main/employee/home");

  await expect(
    page.getByRole("heading", { name: "Todavía no generamos tus recomendaciones" }),
  ).toBeVisible();
});

test("explica que no hubo coincidencias cuando la generación completó vacía", async ({
  page,
}) => {
  await setup(page, {
    responses: [page200("completed", [], { limit: 20, offset: 0, total: 0 })],
  });

  await page.goto("/main/employee/home");

  await expect(
    page.getByRole("heading", { name: "Todavía no hay puestos para vos" }),
  ).toBeVisible();
});

test("presenta una generación fallida como error y no como conjunto vacío", async ({
  page,
}) => {
  await setup(page, {
    responses: [page200("failed", [], { limit: 20, offset: 0, total: 0 })],
  });

  await page.goto("/main/employee/home");

  await expect(
    page.getByRole("heading", {
      name: "La generación de tus recomendaciones falló",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Todavía no hay puestos para vos" }),
  ).toHaveCount(0);
});

test("sondea mientras procesa y se detiene al completar", async ({ page }) => {
  const api = await setup(page, {
    responses: [
      page200("processing", [], { limit: 20, offset: 0, total: 0 }),
      page200("completed", [recommendation()]),
    ],
  });

  await page.goto("/main/employee/home");

  await expect(
    page.getByRole("heading", { name: "Estamos preparando tus recomendaciones" }),
  ).toBeVisible();

  // El sondeo trae el desenlace sin que nadie recargue la pantalla.
  await expect(
    page.getByRole("heading", { name: "Desarrollador backend" }),
  ).toBeVisible({ timeout: 15_000 });

  const afterCompletion = api.attempts();
  await page.waitForTimeout(7_000);
  expect(api.attempts()).toBe(afterCompletion);
});

test("deja de sondear al abandonar la pantalla", async ({ page }) => {
  const api = await setup(page, {
    responses: [page200("processing", [], { limit: 20, offset: 0, total: 0 })],
  });

  await page.goto("/main/employee/home");
  await expect(
    page.getByRole("heading", { name: "Estamos preparando tus recomendaciones" }),
  ).toBeVisible();

  await page.goto("/main/employee/profile");
  const afterLeaving = api.attempts();

  await page.waitForTimeout(7_000);
  expect(api.attempts()).toBe(afterLeaving);
});

test("un 403 no ofrece reintentar", async ({ page }) => {
  await setup(page, { recommendationsStatus: 403 });

  await page.goto("/main/employee/home");

  await expect(
    page.getByRole("heading", {
      name: "No pudimos mostrarte estas recomendaciones",
    }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Reintentar" })).toHaveCount(0);
});

test("un error de servidor ofrece reintentar y no sondea", async ({ page }) => {
  const api = await setup(page, { recommendationsStatus: 500 });

  await page.goto("/main/employee/home");

  await expect(
    page.getByRole("heading", {
      name: "No pudimos cargar tus recomendaciones",
    }),
  ).toBeVisible();

  const afterError = api.attempts();
  await page.waitForTimeout(7_000);
  expect(api.attempts()).toBe(afterError);
});

test("pide el tramo con limit y offset dentro del rango de la API", async ({
  page,
}) => {
  const api = await setup(page, {
    responses: [
      page200("completed", [recommendation()], {
        limit: 20,
        offset: 0,
        total: 40,
      }),
      page200("completed", [recommendation({ recommendation_id: 901 })], {
        limit: 20,
        offset: 20,
        total: 40,
      }),
    ],
  });

  await page.goto("/main/employee/home");
  await expect(page.getByText("Página 1 de 2")).toBeVisible();
  await expect(page.getByRole("button", { name: "Anterior" })).toBeDisabled();

  await page.getByRole("button", { name: "Siguiente" }).click();

  await expect(page.getByText("Página 2 de 2")).toBeVisible();
  await expect(page.getByRole("button", { name: "Siguiente" })).toBeDisabled();

  expect(api.requestedUrls()).toContain(
    "/api/employees/30/job-recommendations?limit=20&offset=0",
  );
  expect(api.requestedUrls()).toContain(
    "/api/employees/30/job-recommendations?limit=20&offset=20",
  );
});

test("el detalle se abre sin pedir el puesto a la API", async ({ page }) => {
  const api = await setup(page);

  await page.goto("/main/employee/home");
  await page.getByRole("button", { name: "Ver detalle" }).click();

  await expect(
    page.getByRole("dialog").getByText("America/Argentina/Buenos_Aires"),
  ).toBeVisible();

  // Ningún pedido a `/jobs/50`: esa lectura está reservada al empleador y respondería 403.
  expect(api.requestedUrls().some((url) => url.includes("/jobs/"))).toBe(false);
});

test("un empleador no accede a las recomendaciones del empleado", async ({
  page,
}) => {
  await setup(page, { authResponse: employerAuthResponse });

  await page.goto("/main/employee/home");

  await expect(page).toHaveURL(/\/main\/employer\//);
});
