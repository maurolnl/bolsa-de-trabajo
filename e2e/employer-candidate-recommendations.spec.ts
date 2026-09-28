import { expect, Page, test } from "@playwright/test";

const employerAuthResponse = {
  ID: 1,
  Email: "employer@example.com",
  Role: "employer",
};

const employeeAuthResponse = {
  ID: 2,
  Email: "employee@example.com",
  Role: "employee",
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

const candidate = (overrides: Record<string, unknown> = {}) => ({
  recommendation_id: 900,
  employee_id: 30,
  user_id: 2,
  position: "Desarrolladora backend",
  role: "Adjunto",
  years_of_experience: "2_to_5y",
  certifications: ["AWS Cloud Practitioner"],
  portfolio_url: null,
  score: null,
  created_at: "2026-09-19T00:00:00Z",
  profile_updated_at: "2026-09-19T00:00:00Z",
  ...overrides,
});

// El perfil completo por identificador de empleado: archivos identificados y sin ubicación,
// y sin `email` porque quien lee es el empleador.
const candidateProfile = (overrides: Record<string, unknown> = {}) => ({
  id: 30,
  user_id: 2,
  position: "Desarrolladora backend",
  role: "Adjunto",
  years_of_experience: "2_to_5y",
  certifications: ["AWS Cloud Practitioner"],
  portfolio_url: "https://portfolio.example.com",
  timezone: "America/Argentina/Buenos_Aires",
  os: "Linux Distribution",
  paid_software: ["Adobe"],
  available_hours_per_day: 6,
  compatible_projects: 2,
  incompatible_projects: 1,
  internet_connections: [{ type: "fiber", speed: "more_50mb" }],
  education: [
    {
      education_type: "university",
      title: "Ingenieria",
      status: "completed",
      certification_document_id: 77,
    },
    {
      education_type: "tertiary",
      title: "Tecnicatura en Programacion",
      status: "in-progress",
      certification_document_id: null,
    },
  ],
  files: [{ id: 55, title: "Certificado AWS" }],
  created_at: "2026-09-20T00:00:00Z",
  updated_at: "2026-09-20T00:00:00Z",
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

const CANDIDATES_PATH = "/main/employer/jobs/50/candidates";

type SetupOptions = {
  authResponse?: object;
  candidatesStatus?: number;
  profileStatus?: number;
  profile?: object;
  downloadStatus?: number;
  // Cada consulta consume el siguiente elemento y el último se repite: así se observa el
  // sondeo sin depender de tiempos.
  responses?: object[];
};

const setup = async (
  page: Page,
  {
    authResponse = employerAuthResponse,
    candidatesStatus = 200,
    profileStatus = 200,
    profile = candidateProfile(),
    downloadStatus = 200,
    responses = [page200("completed", [candidate()])],
  }: SetupOptions = {},
) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("access-token", JSON.stringify("test-token"));
  });

  let attempts = 0;
  let profileRequests = 0;
  const requestedUrls: string[] = [];
  const downloadUrls: string[] = [];

  await page.route(
    (url) => url.pathname.startsWith("/api/"),
    async (route) => {
      const request = route.request();
      const { pathname, search } = new URL(request.url());

      if (pathname.endsWith("/auth/me")) {
        await route.fulfill({ json: authResponse });
        return;
      }

      if (pathname.endsWith("/users/1/employer")) {
        await route.fulfill({ json: employerProfileResponse });
        return;
      }

      if (pathname.endsWith("/users/2/employee")) {
        await route.fulfill({ json: employeeProfileResponse });
        return;
      }

      if (pathname.endsWith("/employers/20/jobs")) {
        await route.fulfill({ status: 200, json: [] });
        return;
      }

      if (pathname.endsWith("/employees/30/job-recommendations")) {
        await route.fulfill({
          status: 200,
          json: page200("none", [], { limit: 20, offset: 0, total: 0 }),
        });
        return;
      }

      if (pathname.includes("/download-url")) {
        downloadUrls.push(pathname);

        if (downloadStatus !== 200) {
          await route.fulfill({
            status: downloadStatus,
            json: { error: "profile access forbidden" },
          });
          return;
        }

        await route.fulfill({
          status: 200,
          json: {
            url: "https://example.invalid/signed-object",
            expires_at: "2026-09-24T12:00:00Z",
          },
        });
        return;
      }

      if (pathname.endsWith("/employees/30")) {
        profileRequests += 1;

        if (profileStatus !== 200) {
          await route.fulfill({
            status: profileStatus,
            json: { error: "profile access forbidden" },
          });
          return;
        }

        await route.fulfill({ status: 200, json: profile });
        return;
      }

      if (pathname.endsWith("/jobs/50/employee-recommendations")) {
        requestedUrls.push(pathname + search);

        if (candidatesStatus !== 200) {
          attempts += 1;
          await route.fulfill({
            status: candidatesStatus,
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
    profileRequests: () => profileRequests,
    requestedUrls: () => requestedUrls,
    downloadUrls: () => downloadUrls,
  };
};

test("lista los candidatos recomendados del puesto", async ({ page }) => {
  await setup(page);

  await page.goto(CANDIDATES_PATH);

  await expect(
    page.getByRole("heading", { name: "Candidatos recomendados" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Desarrolladora backend" }),
  ).toBeVisible();
});

test("no muestra afinidad cuando la API no calculó el puntaje", async ({
  page,
}) => {
  await setup(page);

  await page.goto(CANDIDATES_PATH);

  await expect(
    page.getByRole("heading", { name: "Desarrolladora backend" }),
  ).toBeVisible();
  await expect(page.getByText(/Afinidad/)).toHaveCount(0);
});

test("muestra el puntaje tal como la API lo informó", async ({ page }) => {
  await setup(page, {
    responses: [page200("completed", [candidate({ score: 0.91 })])],
  });

  await page.goto(CANDIDATES_PATH);

  await expect(page.getByText("Afinidad 0.91")).toBeVisible();
});

test("distingue la ausencia de generación de la ausencia de coincidencias", async ({
  page,
}) => {
  await setup(page, {
    responses: [page200("none", [], { limit: 20, offset: 0, total: 0 })],
  });

  await page.goto(CANDIDATES_PATH);

  await expect(
    page.getByRole("heading", {
      name: "Todavía no generamos candidatos para este puesto",
    }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Reintentar" })).toHaveCount(0);
});

test("explica que no hubo coincidencias cuando la generación completó vacía", async ({
  page,
}) => {
  await setup(page, {
    responses: [page200("completed", [], { limit: 20, offset: 0, total: 0 })],
  });

  await page.goto(CANDIDATES_PATH);

  await expect(
    page.getByRole("heading", {
      name: "Todavía no hay candidatos para este puesto",
    }),
  ).toBeVisible();
});

test("presenta una generación fallida como error y no como conjunto vacío", async ({
  page,
}) => {
  await setup(page, {
    responses: [page200("failed", [], { limit: 20, offset: 0, total: 0 })],
  });

  await page.goto(CANDIDATES_PATH);

  await expect(
    page.getByRole("heading", { name: "La generación de candidatos falló" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Reintentar" })).toBeVisible();
});

test("sondea mientras procesa y se detiene al completar", async ({ page }) => {
  const api = await setup(page, {
    responses: [
      page200("processing", [], { limit: 20, offset: 0, total: 0 }),
      page200("completed", [candidate()]),
    ],
  });

  await page.goto(CANDIDATES_PATH);

  await expect(
    page.getByRole("heading", { name: "Estamos preparando los candidatos" }),
  ).toBeVisible();

  // El sondeo trae el desenlace sin que nadie recargue la pantalla.
  await expect(
    page.getByRole("heading", { name: "Desarrolladora backend" }),
  ).toBeVisible({ timeout: 15_000 });

  const afterCompletion = api.attempts();
  await page.waitForTimeout(7_000);
  expect(api.attempts()).toBe(afterCompletion);
});

test("deja de sondear al abandonar la pantalla", async ({ page }) => {
  const api = await setup(page, {
    responses: [page200("processing", [], { limit: 20, offset: 0, total: 0 })],
  });

  await page.goto(CANDIDATES_PATH);
  await expect(
    page.getByRole("heading", { name: "Estamos preparando los candidatos" }),
  ).toBeVisible();

  await page.goto("/main/employer/jobs");
  const afterLeaving = api.attempts();

  await page.waitForTimeout(7_000);
  expect(api.attempts()).toBe(afterLeaving);
});

test("un 403 no ofrece reintentar", async ({ page }) => {
  await setup(page, { candidatesStatus: 403 });

  await page.goto(CANDIDATES_PATH);

  await expect(
    page.getByRole("heading", {
      name: "No pudimos mostrarte estos candidatos",
    }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Reintentar" })).toHaveCount(0);
});

test("un puesto eliminado no permite consultar candidatos", async ({ page }) => {
  const api = await setup(page, { candidatesStatus: 404 });

  await page.goto(CANDIDATES_PATH);

  await expect(
    page.getByRole("heading", { name: "Este puesto ya no está disponible" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Reintentar" })).toHaveCount(0);

  const afterError = api.attempts();
  await page.waitForTimeout(7_000);
  expect(api.attempts()).toBe(afterError);

  await page.getByRole("button", { name: "Volver a mis puestos" }).click();
  await expect(page).toHaveURL(/\/main\/employer\/jobs$/);
});

test("un error de servidor ofrece reintentar y no sondea", async ({ page }) => {
  const api = await setup(page, { candidatesStatus: 500 });

  await page.goto(CANDIDATES_PATH);

  await expect(
    page.getByRole("heading", { name: "No pudimos cargar los candidatos" }),
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
      page200("completed", [candidate()], { limit: 20, offset: 0, total: 45 }),
      page200("completed", [candidate({ recommendation_id: 901 })], {
        limit: 20,
        offset: 20,
        total: 45,
      }),
    ],
  });

  await page.goto(CANDIDATES_PATH);

  await expect(page.getByText("Página 1 de 3")).toBeVisible();
  await page.getByRole("button", { name: "Siguiente" }).click();
  await expect(page.getByText("Página 2 de 3")).toBeVisible();

  const urls = api.requestedUrls();
  expect(urls[0]).toContain("limit=20");
  expect(urls[0]).toContain("offset=0");
  expect(urls.at(-1)).toContain("offset=20");
});

test("el perfil completo se consulta recién al abrirlo", async ({ page }) => {
  const api = await setup(page);

  await page.goto(CANDIDATES_PATH);
  await expect(
    page.getByRole("heading", { name: "Desarrolladora backend" }),
  ).toBeVisible();

  // El listado es útil sin abrir ningún perfil: no se piden los N perfiles del tramo.
  expect(api.profileRequests()).toBe(0);

  await page.getByRole("button", { name: "Ver perfil" }).click();

  await expect(page.getByText("Ingenieria")).toBeVisible();
  expect(api.profileRequests()).toBe(1);
});

test("el perfil muestra las cinco secciones y los archivos disponibles", async ({
  page,
}) => {
  await setup(page);

  await page.goto(CANDIDATES_PATH);
  await page.getByRole("button", { name: "Ver perfil" }).click();

  const profile = page.getByRole("dialog");

  for (const section of [
    "Experiencia",
    "Locación",
    "Recursos",
    "Disponibilidad",
    "Educación",
    "Archivos",
  ]) {
    await expect(
      profile.getByRole("heading", { name: section, exact: true }),
    ).toBeVisible();
  }

  // Los códigos del backend se muestran con las etiquetas que ya usa el empleado.
  await expect(profile.getByText("2 a 5 años")).toBeVisible();
  await expect(profile.getByText("Fibra · > 50Mbps")).toBeVisible();
  await expect(profile.getByText("Universitario")).toBeVisible();
  await expect(profile.getByText("Completado")).toBeVisible();
  await expect(profile.getByText("Certificado AWS")).toBeVisible();
});

test("un título sin documento no ofrece descarga", async ({ page }) => {
  await setup(page);

  await page.goto(CANDIDATES_PATH);
  await page.getByRole("button", { name: "Ver perfil" }).click();

  await expect(page.getByText("Tecnicatura en Programacion")).toBeVisible();
  // Solo el título con documento ofrece descarga: hay uno de los dos.
  await expect(
    page.getByRole("button", { name: "Descargar documento" }),
  ).toHaveCount(1);
});

test("la descarga pide la URL prefirmada en el clic y no la deja en el DOM", async ({
  page,
}) => {
  const api = await setup(page);

  await page.goto(CANDIDATES_PATH);
  await page.getByRole("button", { name: "Ver perfil" }).click();
  await expect(page.getByText("Certificado AWS")).toBeVisible();

  // Nada se pidió antes del clic, y la URL no puede estar en el documento porque todavía no
  // existe.
  expect(api.downloadUrls()).toHaveLength(0);

  const popup = page.waitForEvent("popup").catch(() => null);
  await page.getByRole("button", { name: "Descargar", exact: true }).click();
  await popup;

  expect(api.downloadUrls()).toEqual([
    expect.stringContaining("/employees/30/files/55/download-url"),
  ]);

  // La URL prefirmada no queda en el documento: la descarga es un botón, nunca un `<a href>`.
  const html = await page.content();
  expect(html).not.toContain("signed-object");
});

test("una descarga rechazada se informa y no queda ofrecida como disponible", async ({
  page,
}) => {
  await setup(page, { downloadStatus: 403 });

  await page.goto(CANDIDATES_PATH);
  await page.getByRole("button", { name: "Ver perfil" }).click();
  await page.getByRole("button", { name: "Descargar", exact: true }).click();

  await expect(page.getByText("No pudimos abrir este archivo.")).toBeVisible();
});

test("un perfil no autorizado no afirma si el empleado existe", async ({
  page,
}) => {
  await setup(page, { profileStatus: 403 });

  await page.goto(CANDIDATES_PATH);
  await page.getByRole("button", { name: "Ver perfil" }).click();

  await expect(
    page.getByText("El perfil de este candidato no está disponible."),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Reintentar" })).toHaveCount(0);
});

test("cerrar el perfil conserva el tramo y no vuelve a pedir candidatos", async ({
  page,
}) => {
  const api = await setup(page, {
    responses: [
      page200("completed", [candidate()], { limit: 20, offset: 0, total: 45 }),
    ],
  });

  await page.goto(CANDIDATES_PATH);
  await expect(page.getByText("Página 1 de 3")).toBeVisible();

  const beforeOpening = api.attempts();

  await page.getByRole("button", { name: "Ver perfil" }).click();
  await expect(page.getByText("Ingenieria")).toBeVisible();
  await page.keyboard.press("Escape");

  await expect(page.getByText("Página 1 de 3")).toBeVisible();
  expect(api.attempts()).toBe(beforeOpening);
});

test("un empleado no accede a los candidatos de un puesto", async ({ page }) => {
  await setup(page, { authResponse: employeeAuthResponse });

  await page.goto(CANDIDATES_PATH);

  await expect(page).not.toHaveURL(new RegExp("/candidates$"));
  await expect(
    page.getByRole("heading", { name: "Candidatos recomendados" }),
  ).toHaveCount(0);
});
