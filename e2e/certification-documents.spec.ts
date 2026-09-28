import { expect, Page, Request, test } from "@playwright/test";

type Certification = { name: string; document_id: number | null };
type UnassignedFile = { id: number; title: string };

const pdf = (name: string) => ({
  name,
  mimeType: "application/pdf",
  buffer: Buffer.from("%PDF-1.4 test"),
});

const employeeResponse = (
  certifications: Certification[],
  files: UnassignedFile[],
) => ({
  id: 10,
  user_id: 1,
  email: "employee@example.com",
  position: "Developer",
  role: "Freelance",
  years_of_experience: "1y",
  certifications,
  portfolio_url: null,
  internet_connections: [],
  timezone: "UTC",
  os: "Linux Distribution",
  paid_software: [],
  available_hours_per_day: 4,
  compatible_projects: null,
  incompatible_projects: null,
  files,
  education: [],
});

type SetupOptions = {
  certifications?: Certification[];
  files?: UnassignedFile[];
  onEmployeeRequest?: (request: Request) => void;
};

const setupPage = async (page: Page, options: SetupOptions = {}) => {
  const downloadUrls: string[] = [];

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

    if (pathname.endsWith("/timezones")) {
      await route.fulfill({ json: [] });
      return;
    }
    if (pathname.endsWith("/users/1/employee")) {
      await route.fulfill({
        json: employeeResponse(options.certifications ?? [], options.files ?? []),
      });
      return;
    }
    if (pathname.includes("/download-url")) {
      downloadUrls.push(pathname);
      await route.fulfill({
        json: {
          url: "https://bucket.example.com/signed-object",
          expires_at: "2026-09-27T00:05:00Z",
        },
      });
      return;
    }
    if (pathname.endsWith("/employees/10") && route.request().method() === "PUT") {
      options.onEmployeeRequest?.(route.request());
      await route.fulfill({ status: 200, json: {} });
      return;
    }

    await route.fulfill({ status: 404, json: { error: "Unexpected E2E request" } });
  });

  await page.goto("/main/employee/profile?step=1");
  await expect(
    page.getByPlaceholder("Escriba el título de la certificación"),
  ).toBeVisible();

  return { downloadUrls: () => downloadUrls };
};

const addCertification = async (page: Page, name: string) => {
  await page.getByPlaceholder("Escriba el título de la certificación").fill(name);
  await page.getByRole("button", { name: "Agregar", exact: true }).click();
};

const certificationItem = (page: Page, name: string) =>
  page.getByTestId("certification-item").filter({ hasText: name });

// Extrae el JSON del campo `certifications` del cuerpo multipart.
const certificationsField = (body: string) => {
  const match = body.match(/name="certifications"\r\n\r\n(.*)\r\n/);
  return match ? JSON.parse(match[1]) : null;
};

test("cada certificación viaja con su propio PDF", async ({ page }) => {
  let body = "";
  await setupPage(page, {
    onEmployeeRequest: (request) => {
      body = request.postDataBuffer()?.toString("utf8") ?? "";
    },
  });

  await addCertification(page, "Scrum Master");
  await addCertification(page, "AWS Cloud Practitioner");
  await addCertification(page, "ITIL");
  await page.getByLabel("PDF de Scrum Master").setInputFiles(pdf("scrum.pdf"));
  await page.getByLabel("PDF de AWS Cloud Practitioner").setInputFiles(pdf("aws.pdf"));
  await page.getByRole("button", { name: "Siguiente" }).click();

  await expect.poll(() => body).not.toBe("");
  expect(certificationsField(body)).toEqual([
    { name: "Scrum Master", document: "certification_document_0" },
    { name: "AWS Cloud Practitioner", document: "certification_document_1" },
    { name: "ITIL" },
  ]);
  expect(body).toContain('name="certification_document_0"; filename="scrum.pdf"');
  expect(body).toContain('name="certification_document_1"; filename="aws.pdf"');
  expect(body).not.toContain('name="certifications[]"');
  expect(body).not.toContain('name="certifications_file"');
});

test("la edición conserva, reemplaza o quita el PDF de cada certificación", async ({
  page,
}) => {
  let body = "";
  await setupPage(page, {
    certifications: [
      { name: "Scrum Master", document_id: 31 },
      { name: "AWS Cloud Practitioner", document_id: 32 },
      { name: "Kubernetes", document_id: 33 },
      { name: "ITIL", document_id: null },
    ],
    onEmployeeRequest: (request) => {
      body = request.postDataBuffer()?.toString("utf8") ?? "";
    },
  });

  await expect(
    certificationItem(page, "ITIL").getByText("PDF cargado"),
  ).toHaveCount(0);
  await page
    .getByLabel("PDF de AWS Cloud Practitioner")
    .setInputFiles(pdf("aws-nuevo.pdf"));
  await certificationItem(page, "Kubernetes")
    .getByRole("button", { name: "Quitar PDF" })
    .click();
  await page.getByRole("button", { name: "Siguiente" }).click();

  await expect.poll(() => body).not.toBe("");
  expect(certificationsField(body)).toEqual([
    { name: "Scrum Master", document_id: 31 },
    { name: "AWS Cloud Practitioner", document: "certification_document_1" },
    { name: "Kubernetes" },
    { name: "ITIL" },
  ]);
  expect(body).toContain('name="certification_document_1"; filename="aws-nuevo.pdf"');
});

test("el perfil propio descarga el PDF de una certificación y muestra los viejos sin asociar", async ({
  page,
}) => {
  const api = await setupPage(page, {
    certifications: [
      { name: "Scrum Master", document_id: 31 },
      { name: "ITIL", document_id: null },
    ],
    files: [{ id: 7, title: "certificado-viejo.pdf" }],
  });

  await expect(page.getByText("Certificado sin asociar")).toBeVisible();
  await expect(page.getByText("certificado-viejo.pdf")).toBeVisible();

  const popup = page.waitForEvent("popup").catch(() => null);
  await certificationItem(page, "Scrum Master")
    .getByRole("button", { name: "Descargar" })
    .click();
  await popup;

  expect(api.downloadUrls()).toEqual([
    expect.stringContaining("/employees/10/files/31/download-url"),
  ]);
  expect(await page.content()).not.toContain("signed-object");
});

test("rechaza nombres repetidos y archivos que no son PDF", async ({ page }) => {
  let requests = 0;
  await setupPage(page, {
    certifications: [{ name: "Scrum Master", document_id: null }],
    onEmployeeRequest: () => {
      requests += 1;
    },
  });

  await addCertification(page, "scrum master");
  await expect(page.getByText("La certificación ya fue agregada")).toBeVisible();
  await expect(page.getByTestId("certification-item")).toHaveCount(1);

  await page.getByLabel("PDF de Scrum Master").setInputFiles({
    name: "notas.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("no es un pdf"),
  });
  await page.getByRole("button", { name: "Siguiente" }).click();

  await expect(page.getByText("El archivo debe ser un PDF")).toBeVisible();
  expect(requests).toBe(0);
});
