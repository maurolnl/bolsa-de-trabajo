import { expect, Page, Request, test } from "@playwright/test";

type Education = {
  title: string;
  status: "completed" | "in-progress";
  education_type:
    | "university"
    | "postgraduate"
    | "high-school-orientation"
    | "tertiary";
  certification?: string;
};

const universityTitles = [
  "Ingenieria",
  "Licenciatura",
  "Tecnicatura",
  "Profesorado",
  "Abogacia",
  "Diseño",
  "Programacion",
  "Contabilidad",
  "Administracion",
  "Otro",
];
const postgraduateTitles = ["Especializacion", "Maestria", "Doctorado", "Otro"];
const schoolOrientations = [
  "Humanidades",
  "Ciencias Sociales",
  "Ciencias Naturales",
  "Ciencias Exactas",
  "Tecnica",
  "Energías Renovables",
  "Otro",
];
const tertiaryTitles = [
  "Tecnicatura en Desarrollo de Software",
  "Tecnicatura en Programacion",
  "Tecnicatura en Ciberseguridad",
  "Tecnicatura en Diseño y Programación de Videojuegos",
  "Tecnicatura en Diseño Gráfico",
  "Tecnicatura en Diseño Web",
  "Tecnicatura en Marketing Digital",
  "Tecnicatura en Administración de Empresas",
  "Tecnicatura en Recursos Humanos",
  "Tecnicatura en Gestión Contable y Financiera",
  "Tecnicatura en Comercio Exterior",
  "Tecnicatura en Traducción e Interpretación",
  "Tecnicatura en Educación / Pedagogía",
  "Tecnicatura en Redacción Profesional",
  "Tecnicatura en Gestión Ambiental",
  "Tecnicatura en Bibliotecología",
  "Otro",
];

const employeeResponse = (education: Education[]) => ({
  id: 10,
  user_id: 1,
  email: "employee@example.com",
  position: "Developer",
  role: "Freelance",
  years_of_experience: "1y",
  certifications: [],
  portfolio_url: null,
  internet_connections: [],
  timezone: "UTC",
  os: "Linux Distribution",
  paid_software: [],
  available_hours_per_day: 4,
  compatible_projects: null,
  incompatible_projects: null,
  files: [],
  education,
});

const setupPage = async (
  page: Page,
  education: Education[] = [],
  onEducationRequest?: (request: Request) => void,
) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("access-token", JSON.stringify("test-token"));
  });

  await page.route("**/auth/me", async (route) => {
    await route.fulfill({
      json: { ID: 1, Email: "employee@example.com", Role: "employee" },
    });
  });

  await page.route(/\/api\/(?:timezones|users\/|employees\/)/, async (route) => {
    const { pathname } = new URL(route.request().url());

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
      await route.fulfill({ json: employeeResponse(education) });
      return;
    }
    if (
      pathname.endsWith("/employees/10/education") &&
      route.request().method() === "PUT"
    ) {
      onEducationRequest?.(route.request());
      await route.fulfill({ status: 200, json: {} });
      return;
    }

    await route.fulfill({ status: 404, json: { error: "Unexpected E2E request" } });
  });

  await page.goto("/main/employee/profile?step=5");
  await expect(page.getByRole("heading", { name: "Titulos academicos" })).toBeVisible();
};

const openCreateForm = async (page: Page) => {
  await page.getByRole("button", { name: "Agregar", exact: true }).click();
  await expect(page.getByRole("combobox", { name: "Título" })).toBeVisible();
};

const selectOption = async (page: Page, field: string, option: string) => {
  await page.getByRole("combobox", { name: field }).click();
  await page.getByRole("option", { name: option, exact: true }).click();
};

const expectTitleCatalog = async (page: Page, expectedTitles: string[]) => {
  await page.getByRole("combobox", { name: "Título" }).click();
  await expect(page.getByRole("option")).toHaveCount(expectedTitles.length);
  for (const title of expectedTitles) {
    await expect(page.getByRole("option", { name: title, exact: true })).toBeVisible();
  }
  await page.keyboard.press("Escape");
};

test("muestra el catálogo correspondiente y reinicia el título al cambiar tipo", async ({
  page,
}) => {
  await setupPage(page);
  await openCreateForm(page);

  await expectTitleCatalog(page, universityTitles);
  await selectOption(page, "Título", "Ingenieria");
  await selectOption(page, "Tipo", "Posgrado");
  await expect(page.getByRole("combobox", { name: "Título" })).toHaveText(
    "Seleccione título",
  );
  await expectTitleCatalog(page, postgraduateTitles);

  await selectOption(page, "Tipo", "Orientación secundaria");
  await expectTitleCatalog(page, schoolOrientations);

  await selectOption(page, "Tipo", "Terciario");
  await expectTitleCatalog(page, tertiaryTitles);
});

for (const usedTitle of ["Abogacia", "Contabilidad", "Administracion"]) {
  test(`limita ${usedTitle} sin ocultar los demás títulos únicos`, async ({
    page,
  }) => {
    await setupPage(page, [
      {
        title: usedTitle,
        status: "completed",
        education_type: "university",
      },
    ]);
    await openCreateForm(page);

    await page.getByRole("combobox", { name: "Título" }).click();
    await expect(
      page.getByRole("option", { name: usedTitle, exact: true }),
    ).toHaveCount(0);
    for (const availableTitle of [
      "Abogacia",
      "Contabilidad",
      "Administracion",
    ].filter((title) => title !== usedTitle)) {
      await expect(
        page.getByRole("option", { name: availableTitle, exact: true }),
      ).toBeVisible();
    }
  });
}

test("oculta la orientación secundaria cuando ya existe una", async ({ page }) => {
  await setupPage(page, [
    {
      title: "Humanidades",
      status: "completed",
      education_type: "high-school-orientation",
    },
  ]);
  await openCreateForm(page);

  await page.getByRole("combobox", { name: "Tipo" }).click();
  await expect(
    page.getByRole("option", { name: "Orientación secundaria", exact: true }),
  ).toHaveCount(0);
});

test("permite editar la propia entrada única", async ({ page }) => {
  await setupPage(page, [
    { title: "Abogacia", status: "completed", education_type: "university" },
  ]);

  await page.getByRole("button", { name: "Editar Abogacia" }).click();
  await page.getByRole("combobox", { name: "Título" }).click();
  await expect(
    page.getByRole("option", { name: "Abogacia", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Guardar", exact: true }).first().click();
  await expect(page.getByRole("heading", { name: "Abogacia" })).toBeVisible();
});

test("permite repetir títulos sin restricción", async ({ page }) => {
  await setupPage(page, [
    { title: "Ingenieria", status: "completed", education_type: "university" },
  ]);
  await openCreateForm(page);
  await selectOption(page, "Título", "Ingenieria");
  await page.getByRole("button", { name: "Agregar", exact: true }).last().click();

  await expect(page.getByRole("heading", { name: "Ingenieria" })).toHaveCount(2);
});

test("rechaza defensivamente títulos universitarios únicos duplicados", async ({
  page,
}) => {
  await setupPage(page, [
    { title: "Abogacia", status: "completed", education_type: "university" },
    { title: "Abogacia", status: "in-progress", education_type: "university" },
  ]);

  await page.getByRole("button", { name: "Guardar", exact: true }).click();
  await expect(
    page.getByText("Solo puede agregar una formación de Abogacia"),
  ).toBeVisible();
});

test("rechaza defensivamente múltiples orientaciones secundarias", async ({
  page,
}) => {
  await setupPage(page, [
    {
      title: "Humanidades",
      status: "completed",
      education_type: "high-school-orientation",
    },
    {
      title: "Ciencias Sociales",
      status: "in-progress",
      education_type: "high-school-orientation",
    },
  ]);

  await page.getByRole("button", { name: "Guardar", exact: true }).click();
  await expect(
    page.getByText("Solo puede agregar una orientación secundaria"),
  ).toBeVisible();
});

test("rechaza defensivamente títulos fuera del catálogo", async ({ page }) => {
  await setupPage(page, [
    {
      title: "Título histórico inválido",
      status: "completed",
      education_type: "university",
    },
  ]);

  await page.getByRole("button", { name: "Guardar", exact: true }).click();
  await expect(
    page.getByText("Seleccione un título válido para el tipo elegido"),
  ).toBeVisible();
});

test("conserva el contrato multipart al guardar", async ({ page }) => {
  let requestBody = "";
  await setupPage(page, [], (request) => {
    requestBody = request.postDataBuffer()?.toString("utf8") ?? "";
  });
  await openCreateForm(page);
  await selectOption(page, "Tipo", "Terciario");
  await selectOption(page, "Título", "Tecnicatura en Ciberseguridad");
  await selectOption(page, "Estado", "Completado");
  await page.getByLabel("Certificación").setInputFiles({
    name: "certificate.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 test"),
  });
  await page.getByRole("button", { name: "Agregar", exact: true }).last().click();
  await page.getByRole("button", { name: "Guardar", exact: true }).click();

  await expect.poll(() => requestBody).not.toBe("");
  expect(requestBody).toContain('name="education"');
  expect(requestBody).toContain('name="education_document_0"; filename="certificate.pdf"');
  expect(requestBody).toContain(
    JSON.stringify({
      education_titles: [
        {
          title: "Tecnicatura en Ciberseguridad",
          status: "completed",
          type: "tertiary",
          document: "education_document_0",
        },
      ],
    }),
  );
  await expect(page.getByText("Perfil guardado")).toBeVisible();
});
