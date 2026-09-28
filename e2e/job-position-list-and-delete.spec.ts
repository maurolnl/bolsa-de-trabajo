import { expect, Page, Request, test } from "@playwright/test";

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

const timezonesResponse = [
  { name: "America/Argentina/Buenos_Aires", utcOffset: -3, abbreviation: "ART" },
  { name: "Europe/Madrid", utcOffset: 2, abbreviation: "CEST" },
];

const backendJobPosition = {
  id: 50,
  employer_id: 20,
  position: "Desarrollador backend",
  role: "Adjunto",
  required_experience: "2_to_5y",
  required_education_level: "university",
  available_hours_per_day: 6,
  timezone: "America/Argentina/Buenos_Aires",
  technical_resources: ["Notebook"],
  created_at: "2026-09-19T00:00:00Z",
  updated_at: "2026-09-19T00:00:00Z",
};

const frontendJobPosition = {
  ...backendJobPosition,
  id: 51,
  position: "Diseñador de producto",
  role: "Gerente",
  required_experience: "more_10y",
  required_education_level: "tertiary",
  available_hours_per_day: 8,
  technical_resources: [],
};

type SetupOptions = {
  authResponse?: object;
  listStatus?: number;
  listResponses?: object[][];
  deleteStatus?: number;
  deleteResponse?: object;
  onDelete?: (request: Request) => void;
};

// `listResponses` es una cola: cada consulta de la colección consume el siguiente
// elemento y el último se repite. Así se observa el efecto de la invalidación sin
// depender de tiempos.
const setupJobPositions = async (
  page: Page,
  {
    authResponse = employerAuthResponse,
    listStatus = 200,
    listResponses = [[backendJobPosition, frontendJobPosition]],
    deleteStatus = 204,
    deleteResponse,
    onDelete,
  }: SetupOptions = {},
) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("access-token", JSON.stringify("test-token"));
  });

  let listAttempts = 0;
  let deleteAttempts = 0;

  await page.route(
    (url) => url.pathname.startsWith("/api/"),
    async (route) => {
      const request = route.request();
      const { pathname } = new URL(request.url());

      if (pathname.endsWith("/auth/me")) {
        await route.fulfill({ json: authResponse });
        return;
      }

      if (pathname.endsWith("/timezones")) {
        await route.fulfill({ json: timezonesResponse });
        return;
      }

      if (pathname.endsWith("/users/1/employer")) {
        await route.fulfill({ json: employerProfileResponse });
        return;
      }

      if (
        pathname.endsWith("/employers/20/jobs") &&
        request.method() === "GET"
      ) {
        const index = Math.min(listAttempts, listResponses.length - 1);
        listAttempts += 1;

        if (listStatus !== 200) {
          await route.fulfill({
            status: listStatus,
            json: { error: "internal error listing job positions" },
          });
          return;
        }

        await route.fulfill({ status: 200, json: listResponses[index] });
        return;
      }

      // El destino de candidatos dejó de ser una pantalla de continuidad y ahora consulta la
      // API. Acá solo interesa que el listado lleve hasta él; los desenlaces de esa consulta
      // los cubre `employer-candidate-recommendations.spec.ts`.
      if (pathname.endsWith("/jobs/50/employee-recommendations")) {
        await route.fulfill({
          status: 200,
          json: {
            status: "none",
            items: [],
            page: { limit: 20, offset: 0, total: 0 },
          },
        });
        return;
      }

      if (pathname.endsWith("/jobs/50") && request.method() === "DELETE") {
        deleteAttempts += 1;
        onDelete?.(request);
        await route.fulfill({
          status: deleteStatus,
          json: deleteResponse ?? { error: "forbidden" },
        });
        return;
      }

      if (pathname.endsWith("/jobs/50") && request.method() === "GET") {
        await route.fulfill({ status: 200, json: backendJobPosition });
        return;
      }

      await route.fulfill({
        status: 404,
        json: { error: "Unexpected E2E request" },
      });
    },
  );

  return {
    listAttempts: () => listAttempts,
    deleteAttempts: () => deleteAttempts,
  };
};

const cardOf = (page: Page, position: string) =>
  page.getByRole("article", { name: position });

test("lista los puestos activos del empleador", async ({ page }) => {
  await setupJobPositions(page);

  await page.goto("/main/employer/jobs");

  await expect(page.getByText("Mis puestos de trabajo")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Desarrollador backend" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Diseñador de producto" }),
  ).toBeVisible();

  // Las etiquetas se muestran en español, no los códigos del contrato.
  await expect(page.getByText("2 a 5 años")).toBeVisible();
  await expect(page.getByText("Universitario")).toBeVisible();
  await expect(page.getByText("Mas de 10 años")).toBeVisible();
  await expect(page.getByText("Notebook")).toBeVisible();
  await expect(page.getByText("Sin recursos técnicos")).toBeVisible();

  // No se ofrece reapertura de un puesto.
  await expect(page.getByRole("button", { name: /reabrir/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /restaurar/i })).toHaveCount(0);
});

test("muestra el estado vacío cuando no hay puestos", async ({ page }) => {
  await setupJobPositions(page, { listResponses: [[]] });

  await page.goto("/main/employer/jobs");

  await expect(page.getByText("Todavía no publicaste puestos")).toBeVisible();
  await page.getByRole("button", { name: "Publicar puesto" }).click();
  await expect(page).toHaveURL(/\/main\/employer\/jobs\/new$/);
});

test("muestra el error del listado con reintento", async ({ page }) => {
  await setupJobPositions(page, { listStatus: 500 });

  await page.goto("/main/employer/jobs");

  await expect(page.getByText("No pudimos cargar tus puestos")).toBeVisible();
  await expect(page.getByRole("button", { name: "Reintentar" })).toBeVisible();
  await expect(page.getByText("Todavía no publicaste puestos")).toHaveCount(0);
});

test("cancelar la confirmación no elimina el puesto", async ({ page }) => {
  const { deleteAttempts } = await setupJobPositions(page);

  await page.goto("/main/employer/jobs");
  await cardOf(page, "Desarrollador backend")
    .getByRole("button", { name: "Eliminar", exact: true })
    .click();

  await expect(
    page.getByText('¿Eliminar "Desarrollador backend"?'),
  ).toBeVisible();
  await expect(page.getByText("Esta acción no se revierte.")).toBeVisible();

  await page.getByRole("button", { name: "Cancelar" }).click();

  await expect(
    page.getByRole("heading", { name: "Desarrollador backend" }),
  ).toBeVisible();
  expect(deleteAttempts()).toBe(0);
});

test("confirmar elimina el puesto y lo saca del listado", async ({ page }) => {
  const { deleteAttempts } = await setupJobPositions(page, {
    listResponses: [
      [backendJobPosition, frontendJobPosition],
      [frontendJobPosition],
    ],
  });

  await page.goto("/main/employer/jobs");
  await cardOf(page, "Desarrollador backend")
    .getByRole("button", { name: "Eliminar", exact: true })
    .click();
  await page.getByRole("button", { name: "Eliminar puesto" }).click();

  await expect.poll(() => deleteAttempts()).toBe(1);
  await expect(
    page.getByRole("heading", { name: "Desarrollador backend" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Diseñador de producto" }),
  ).toBeVisible();
});

test("un 403 al eliminar refresca el listado en lugar de reintentar", async ({
  page,
}) => {
  const { listAttempts } = await setupJobPositions(page, {
    deleteStatus: 403,
    listResponses: [
      [backendJobPosition, frontendJobPosition],
      [frontendJobPosition],
    ],
  });

  await page.goto("/main/employer/jobs");
  await expect.poll(() => listAttempts()).toBe(1);

  await cardOf(page, "Desarrollador backend")
    .getByRole("button", { name: "Eliminar", exact: true })
    .click();
  await page.getByRole("button", { name: "Eliminar puesto" }).click();

  await expect.poll(() => listAttempts()).toBeGreaterThan(1);
  await expect(
    page.getByRole("heading", { name: "Desarrollador backend" }),
  ).toHaveCount(0);
});

test("abre la edición del puesto desde el listado", async ({ page }) => {
  await setupJobPositions(page);

  await page.goto("/main/employer/jobs");
  await cardOf(page, "Desarrollador backend")
    .getByRole("button", { name: "Editar" })
    .click();

  await expect(page).toHaveURL(/\/main\/employer\/jobs\/50\/edit$/);
});

test("abre los candidatos recomendados del puesto", async ({ page }) => {
  await setupJobPositions(page);

  await page.goto("/main/employer/jobs");
  await cardOf(page, "Desarrollador backend")
    .getByRole("button", { name: "Ver candidatos" })
    .click();

  await expect(page).toHaveURL(/\/main\/employer\/jobs\/50\/candidates$/);
  await expect(
    page.getByRole("heading", {
      name: "Todavía no generamos candidatos para este puesto",
    }),
  ).toBeVisible();
});

test("un empleado no accede al listado ni a los candidatos", async ({
  page,
}) => {
  await setupJobPositions(page, { authResponse: employeeAuthResponse });

  await page.goto("/main/employer/jobs");
  await expect(page).not.toHaveURL(/\/main\/employer\/jobs$/);

  await page.goto("/main/employer/jobs/50/candidates");
  await expect(page).not.toHaveURL(/\/candidates$/);
});
