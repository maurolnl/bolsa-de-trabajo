import { expect, Page, Request, test } from "@playwright/test";

const employerAuthResponse = {
  ID: 1,
  Email: "employer@example.com",
  Role: "employer",
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

const jobPositionResponse = {
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

type SetupOptions = {
  profileStatus?: number;
  profileResponse?: object;
  createStatus?: number;
  createResponse?: object;
  getJobStatus?: number;
  getJobResponse?: object;
  updateStatus?: number;
  updateResponse?: object;
  onCreate?: (request: Request) => void;
  onUpdate?: (request: Request) => void;
};

const setupJobPositions = async (
  page: Page,
  {
    profileStatus = 200,
    profileResponse = employerProfileResponse,
    createStatus = 201,
    createResponse = jobPositionResponse,
    getJobStatus = 200,
    getJobResponse = jobPositionResponse,
    updateStatus = 200,
    updateResponse = jobPositionResponse,
    onCreate,
    onUpdate,
  }: SetupOptions = {},
) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("access-token", JSON.stringify("test-token"));
  });

  let createAttempts = 0;
  let updateAttempts = 0;

  await page.route(
    (url) => url.pathname.startsWith("/api/"),
    async (route) => {
      const request = route.request();
      const { pathname } = new URL(request.url());

      if (pathname.endsWith("/auth/me")) {
        await route.fulfill({ json: employerAuthResponse });
        return;
      }

      if (pathname.endsWith("/timezones")) {
        await route.fulfill({ json: timezonesResponse });
        return;
      }

      if (pathname.endsWith("/users/1/employer")) {
        await route.fulfill({ status: profileStatus, json: profileResponse });
        return;
      }

      if (pathname.endsWith("/employers/20/jobs") && request.method() === "POST") {
        createAttempts += 1;
        onCreate?.(request);
        await route.fulfill({ status: createStatus, json: createResponse });
        return;
      }

      if (pathname.endsWith("/jobs/50") && request.method() === "GET") {
        await route.fulfill({ status: getJobStatus, json: getJobResponse });
        return;
      }

      if (pathname.endsWith("/jobs/50") && request.method() === "PUT") {
        updateAttempts += 1;
        onUpdate?.(request);
        await route.fulfill({ status: updateStatus, json: updateResponse });
        return;
      }

      await route.fulfill({
        status: 404,
        json: { error: "Unexpected E2E request" },
      });
    },
  );

  return {
    createAttempts: () => createAttempts,
    updateAttempts: () => updateAttempts,
  };
};

const selectOption = async (page: Page, field: string, option: string) => {
  await page.getByRole("combobox", { name: field, exact: true }).click();
  await page.getByRole("option", { name: option, exact: true }).click();
};

const fillRequiredFields = async (page: Page) => {
  await page.getByLabel("Posición").fill("Desarrollador backend");
  await selectOption(page, "Rol", "Adjunto");
  await selectOption(page, "Experiencia requerida", "2 a 5 años");
  await selectOption(page, "Nivel educativo pretendido", "Universitario");
  await selectOption(page, "Horas disponibles por día", "6");
  await selectOption(page, "Zona horaria", "America/Argentina/Buenos_Aires");
};

const expectedBody = {
  position: "Desarrollador backend",
  role: "Adjunto",
  required_experience: "2_to_5y",
  required_education_level: "university",
  available_hours_per_day: 6,
  technical_resources: [],
  timezone: "America/Argentina/Buenos_Aires",
};

test("no envía el alta cuando faltan campos obligatorios", async ({ page }) => {
  const { createAttempts } = await setupJobPositions(page);

  await page.goto("/main/employer/jobs/new");
  await expect(page.getByText("Publicá un puesto de trabajo")).toBeVisible();

  await page.getByLabel("Posición").fill("   ");
  await page.getByRole("button", { name: "Publicar puesto", exact: true }).click();

  await expect(page.getByText("Ingrese la posición")).toBeVisible();
  await expect(page.getByText("Debe seleccionar un rol")).toBeVisible();
  await expect(
    page.getByText("Debe seleccionar la experiencia requerida"),
  ).toBeVisible();
  await expect(
    page.getByText("Debe seleccionar el nivel educativo pretendido"),
  ).toBeVisible();
  await expect(
    page.getByText("Debe seleccionar las horas disponibles por día"),
  ).toBeVisible();
  await expect(page.getByText("Debe seleccionar una zona horaria")).toBeVisible();
  expect(createAttempts()).toBe(0);
});

test("publica el puesto con recursos técnicos vacíos como array", async ({
  page,
}) => {
  let requestBody: unknown;
  const { createAttempts } = await setupJobPositions(page, {
    onCreate: (request) => {
      requestBody = request.postDataJSON();
    },
  });

  await page.goto("/main/employer/jobs/new");
  await fillRequiredFields(page);
  await page.getByRole("button", { name: "Publicar puesto", exact: true }).click();

  await expect.poll(() => createAttempts()).toBe(1);
  expect(requestBody).toEqual(expectedBody);
});

test("serializa los recursos técnicos agregados y quitados", async ({ page }) => {
  let requestBody: unknown;
  const { createAttempts } = await setupJobPositions(page, {
    onCreate: (request) => {
      requestBody = request.postDataJSON();
    },
  });

  await page.goto("/main/employer/jobs/new");
  await fillRequiredFields(page);

  await page.getByLabel("Nuevo recurso técnico").fill("Notebook");
  await page.getByRole("button", { name: "Agregar", exact: true }).click();
  await page.getByLabel("Nuevo recurso técnico").fill("Monitor");
  await page.getByRole("button", { name: "Agregar", exact: true }).click();
  await page
    .getByRole("button", { name: "Eliminar recurso Notebook", exact: true })
    .click();

  await page.getByRole("button", { name: "Publicar puesto", exact: true }).click();

  await expect.poll(() => createAttempts()).toBe(1);
  expect(requestBody).toEqual({
    ...expectedBody,
    technical_resources: ["Monitor"],
  });
});

test("muestra el puesto publicado y el estado inicial de recomendaciones", async ({
  page,
}) => {
  await setupJobPositions(page);

  await page.goto("/main/employer/jobs/new");
  await fillRequiredFields(page);
  await page.getByRole("button", { name: "Publicar puesto", exact: true }).click();

  await expect(page.getByText("Publicado", { exact: true })).toBeVisible();
  await expect(page.getByText("Desarrollador backend")).toBeVisible();
  await expect(
    page.getByText("Todavía no hay candidatos recomendados para este puesto."),
  ).toBeVisible();
  await expect(page.getByText("Reabrir")).toHaveCount(0);
});

test("muestra el error del backend y conserva los datos del formulario", async ({
  page,
}) => {
  await setupJobPositions(page, {
    createStatus: 400,
    createResponse: { error: "AvailableHoursPerDay is max" },
  });

  await page.goto("/main/employer/jobs/new");
  await fillRequiredFields(page);
  await page.getByRole("button", { name: "Publicar puesto", exact: true }).click();

  await expect(
    page.getByText("AvailableHoursPerDay is max", { exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Posición")).toHaveValue("Desarrollador backend");
});

test("precarga la edición y envía el conjunto completo de campos", async ({
  page,
}) => {
  let requestBody: unknown;
  const { updateAttempts } = await setupJobPositions(page, {
    onUpdate: (request) => {
      requestBody = request.postDataJSON();
    },
  });

  await page.goto("/main/employer/jobs/50/edit");

  await expect(page.getByText("Editá el puesto de trabajo")).toBeVisible();
  await expect(page.getByLabel("Posición")).toHaveValue("Desarrollador backend");
  await expect(page.getByRole("combobox", { name: "Rol", exact: true })).toHaveText(
    "Adjunto",
  );
  await expect(page.getByText("Notebook")).toBeVisible();

  await page.getByLabel("Posición").fill("Desarrollador senior");
  await page.getByRole("button", { name: "Guardar cambios", exact: true }).click();

  await expect.poll(() => updateAttempts()).toBe(1);
  expect(requestBody).toEqual({
    ...expectedBody,
    position: "Desarrollador senior",
    technical_resources: ["Notebook"],
  });
  await expect(page).toHaveURL("/main/employer/jobs");
});

test("presenta un estado explícito ante un puesto ajeno", async ({ page }) => {
  await setupJobPositions(page, {
    getJobStatus: 403,
    getJobResponse: { error: "forbidden" },
  });

  await page.goto("/main/employer/jobs/50/edit");

  await expect(page.getByText("No podés editar este puesto")).toBeVisible();
  await expect(
    page.getByText("No tenés permiso para editar este puesto."),
  ).toBeVisible();
  await expect(page.getByLabel("Posición")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Reintentar", exact: true }),
  ).toHaveCount(0);
});

test("presenta un estado explícito ante un puesto inexistente", async ({ page }) => {
  await setupJobPositions(page, {
    getJobStatus: 404,
    getJobResponse: { error: "job position not found" },
  });

  await page.goto("/main/employer/jobs/50/edit");

  await expect(page.getByText("El puesto no existe o fue eliminado.")).toBeVisible();
  await expect(page.getByLabel("Posición")).toHaveCount(0);
});

test("redirige al onboarding cuando el empleador todavía no tiene perfil", async ({
  page,
}) => {
  await setupJobPositions(page, {
    profileStatus: 404,
    profileResponse: { error: "employer profile not found" },
  });

  await page.goto("/main/employer/jobs/new");

  await expect(page).toHaveURL("/main/employer/profile");
  await expect(page.getByText("Publicá un puesto de trabajo")).toHaveCount(0);
});
