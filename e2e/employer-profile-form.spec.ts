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

type SetupOptions = {
  getProfileStatus?: number;
  getProfileResponse?: object;
  postEmployerStatus?: number;
  postEmployerResponse?: object;
  onGetProfile?: (request: Request) => void;
  onPostEmployer?: (request: Request) => void;
};

const setupEmployerProfile = async (
  page: Page,
  {
    getProfileStatus = 404,
    getProfileResponse = { error: "employer profile not found" },
    postEmployerStatus,
    postEmployerResponse,
    onGetProfile,
    onPostEmployer,
  }: SetupOptions = {},
) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("access-token", JSON.stringify("test-token"));
  });

  await page.route("**/auth/me", async (route) => {
    await route.fulfill({ json: employerAuthResponse });
  });

  // Todo test que termine en el área de puestos consulta la colección del empleador.
  await page.route("**/employers/*/jobs", async (route) => {
    await route.fulfill({ status: 200, json: [] });
  });

  let getAttempts = 0;
  let postAttempts = 0;

  await page.route(/\/api\/(?:auth\/me|users\/|employers$)/, async (route) => {
    const { pathname } = new URL(route.request().url());

    if (pathname.endsWith("/auth/me")) {
      await route.fulfill({ json: employerAuthResponse });
      return;
    }

    if (pathname.endsWith("/users/1/employer")) {
      getAttempts += 1;
      onGetProfile?.(route.request());
      await route.fulfill({
        status: getProfileStatus,
        json: getProfileResponse,
      });
      return;
    }

    if (pathname === "/api/employers" && route.request().method() === "POST") {
      postAttempts += 1;
      onPostEmployer?.(route.request());

      if (postEmployerStatus === undefined) {
        await route.continue();
        return;
      }

      await route.fulfill({
        status: postEmployerStatus,
        body: JSON.stringify(postEmployerResponse),
      });
      return;
    }

    await route.fulfill({ status: 404, json: { error: "Unexpected E2E request" } });
  });

  return {
    getAttempts: () => getAttempts,
    postAttempts: () => postAttempts,
    onGetProfile,
    onPostEmployer,
  };
};

const fillRequiredFields = async (page: Page) => {
  await page.getByLabel("Nombre de la empresa").fill("Laburi");
  await page.getByLabel("Industria").fill("Tecnología");
  await page.getByLabel("Ubicación").fill("Buenos Aires, Argentina");
};

const addModality = async (page: Page, value: string) => {
  await page.getByLabel("Nueva modalidad de contratación").fill(value);
  await page.getByRole("button", { name: "Agregar", exact: true }).click();
};

const removeModality = async (page: Page, name: string) => {
  await page
    .getByRole("button", { name: `Eliminar modalidad ${name}`, exact: true })
    .click();
};

const submitForm = async (page: Page) => {
  await page.getByRole("button", { name: "Crear perfil", exact: true }).click();
};

test("valida campos obligatorios con espacios y no envía POST", async ({ page }) => {
  const { postAttempts } = await setupEmployerProfile(page);

  await page.goto("/main/employer/profile");
  await expect(page.getByText("Creá tu perfil de empleador")).toBeVisible();

  await page.getByLabel("Nombre de la empresa").fill("   ");
  await page.getByLabel("Industria").fill("   ");
  await page.getByLabel("Ubicación").fill("   ");
  await submitForm(page);

  await expect(page.getByText("Ingrese el nombre de la empresa")).toBeVisible();
  await expect(page.getByText("Ingrese la industria")).toBeVisible();
  await expect(page.getByText("Ingrese la ubicación")).toBeVisible();
  await expect(page).toHaveURL("/main/employer/profile");
  expect(postAttempts()).toBe(0);
});

test("acepta modalidades vacías y envía el payload exacto sin user_id", async ({
  page,
}) => {
  let requestBody: unknown;
  const { postAttempts } = await setupEmployerProfile(page, {
    postEmployerStatus: 201,
    postEmployerResponse: {},
    onPostEmployer: (request) => {
      requestBody = request.postDataJSON();
    },
  });

  await page.goto("/main/employer/profile");
  await fillRequiredFields(page);
  await submitForm(page);

  await expect.poll(() => postAttempts()).toBe(1);
  expect(requestBody).toEqual({
    name: "Laburi",
    industry: "Tecnología",
    location: "Buenos Aires, Argentina",
    hiring_modalities: [],
  });
  expect(requestBody).not.toHaveProperty("user_id");
});

test("serializa agregar y quitar modalidades como string[]", async ({ page }) => {
  let requestBody: unknown;
  const { postAttempts } = await setupEmployerProfile(page, {
    postEmployerStatus: 201,
    postEmployerResponse: {},
    onPostEmployer: (request) => {
      requestBody = request.postDataJSON();
    },
  });

  await page.goto("/main/employer/profile");
  await fillRequiredFields(page);
  await addModality(page, "Tiempo completo");
  await addModality(page, "Medio tiempo");

  await page.getByLabel("Nueva modalidad de contratación").fill("   ");
  await expect(page.getByRole("button", { name: "Agregar", exact: true })).toBeDisabled();

  await removeModality(page, "Tiempo completo");
  await expect(page.getByText("Tiempo completo")).toHaveCount(0);

  await submitForm(page);

  await expect.poll(() => postAttempts()).toBe(1);
  expect(requestBody).toEqual({
    name: "Laburi",
    industry: "Tecnología",
    location: "Buenos Aires, Argentina",
    hiring_modalities: ["Medio tiempo"],
  });
});

test("muestra carga mientras consulta el perfil", async ({ page }) => {
  await setupEmployerProfile(page);
  await page.route("**/users/1/employer", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    await route.fulfill({
      status: 404,
      json: { error: "employer profile not found" },
    });
  });

  await page.goto("/main/employer/profile");

  await expect(page.getByText("Loading...")).toBeVisible();
  await expect(page.getByRole("button", { name: "Crear perfil", exact: true })).toHaveCount(0);
  await expect(page.getByText("Creá tu perfil de empleador")).toBeVisible();
});

test("presenta error recuperable al consultar perfil y permite reintentar", async ({
  page,
}) => {
  let attempts = 0;
  await setupEmployerProfile(page);
  await page.route("**/users/1/employer", async (route) => {
    attempts += 1;
    if (attempts === 1) {
      await route.fulfill({ status: 500, json: { error: "internal error" } });
      return;
    }
    await route.fulfill({ status: 404, json: { error: "employer profile not found" } });
  });

  await page.goto("/main/employer/profile");

  await expect(page.getByText("No pudimos cargar tu perfil")).toBeVisible();
  await expect(page.getByRole("button", { name: "Reintentar", exact: true })).toBeVisible();
  expect(attempts).toBe(1);

  await page.getByRole("button", { name: "Reintentar", exact: true }).click();
  await expect(page.getByText("Creá tu perfil de empleador")).toBeVisible();
  expect(attempts).toBe(2);
});

test("redirige a puestos cuando el perfil de empleador ya existe", async ({ page }) => {
  await setupEmployerProfile(page, {
    getProfileStatus: 200,
    getProfileResponse: employerProfileResponse,
  });

  await page.goto("/main/employer/profile");

  await expect(page).toHaveURL("/main/employer/jobs");
  await expect(page.getByText("Creá tu perfil de empleador")).toHaveCount(0);
});

test("POST 201 invalida el perfil, vuelve a consultar y redirige a puestos", async ({
  page,
}) => {
  let getCount = 0;
  let created = false;
  await setupEmployerProfile(page);
  // El perfil existe recién después del POST: mantener el 404 indefinidamente haría que
  // el área de puestos devolviera al onboarding, como exige el guard de navegación.
  await page.route("**/users/1/employer", async (route) => {
    getCount += 1;

    if (created) {
      await route.fulfill({ status: 200, json: employerProfileResponse });
      return;
    }

    await route.fulfill({
      status: 404,
      json: { error: "employer profile not found" },
    });
  });
  await page.route("**/employers", async (route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }
    created = true;
    await route.fulfill({ status: 201, body: "" });
  });

  await page.goto("/main/employer/profile");
  await fillRequiredFields(page);
  await submitForm(page);

  await expect.poll(() => getCount).toBeGreaterThanOrEqual(2);
  await expect(page).toHaveURL("/main/employer/jobs");
});

test("error de POST conserva valores, ubicación y rehabilita el envío", async ({
  page,
}) => {
  const { postAttempts } = await setupEmployerProfile(page, {
    postEmployerStatus: 500,
    postEmployerResponse: { error: "could not create employer" },
  });

  await page.goto("/main/employer/profile");
  await fillRequiredFields(page);
  await addModality(page, "Remoto");
  await submitForm(page);

  await expect.poll(() => postAttempts()).toBe(1);
  await expect(page).toHaveURL("/main/employer/profile");
  await expect(page.getByLabel("Nombre de la empresa")).toHaveValue("Laburi");
  await expect(page.getByLabel("Industria")).toHaveValue("Tecnología");
  await expect(page.getByLabel("Ubicación")).toHaveValue("Buenos Aires, Argentina");
  await expect(page.getByText("Remoto")).toBeVisible();
  await expect(page.getByRole("button", { name: "Crear perfil", exact: true })).toBeEnabled();
  await expect(
    page.getByText("could not create employer", { exact: true }),
  ).toBeVisible();
});

test("impide el doble envío mientras POST está pendiente", async ({ page }) => {
  let requestCount = 0;
  await setupEmployerProfile(page);
  await page.route("**/employers", async (route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }
    requestCount += 1;
    await new Promise((resolve) => setTimeout(resolve, 700));
    await route.fulfill({ status: 201, body: "" });
  });

  await page.goto("/main/employer/profile");
  await fillRequiredFields(page);

  await submitForm(page);
  await expect(
    page.getByRole("button", { name: "Crear perfil", exact: true }),
  ).toBeDisabled();

  await expect.poll(() => requestCount).toBe(1);
});

test("bloquea el acceso directo de un empleado al formulario de empleador", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("access-token", JSON.stringify("test-token"));
  });
  await page.route("**/auth/me", async (route) => {
    await route.fulfill({
      json: { ID: 1, Email: "employee@example.com", Role: "employee" },
    });
  });
  await page.route("**/users/1/employee", async (route) => {
    await route.fulfill({
      status: 400,
      json: { error: "employee not found" },
    });
  });

  await page.goto("/main/employer/profile");

  await expect(page).toHaveURL("/main/employee/profile");
  await expect(page.getByText("Creá tu perfil de empleador")).toHaveCount(0);
});
