import { expect, Page, Route, test } from "@playwright/test";

type Role = "employee" | "employer";

const employeeProfile = {
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
  education: [],
};

const restoreSession = async (page: Page, role: Role) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("access-token", JSON.stringify("test-token"));
  });
  await page.route("**/auth/me", (route) =>
    route.fulfill({
      json: { ID: 1, Email: `${role}@example.com`, Role: role },
    }),
  );
  // El destino del empleador es el listado de puestos, que consulta su colección.
  await page.route("**/employers/*/jobs", (route) =>
    route.fulfill({ status: 200, json: [] }),
  );
};

const profilePath = (role: Role) => `/api/users/1/${role}`;

const fulfillProfile = async (
  route: Route,
  role: Role,
  exists: boolean,
) => {
  if (exists) {
    await route.fulfill({
      status: 200,
      json: role === "employee" ? employeeProfile : { id: 20, user_id: 1 },
    });
    return;
  }

  await route.fulfill({
    status: role === "employee" ? 400 : 404,
    json: {
      error:
        role === "employee"
          ? "employee not found"
          : "employer profile not found",
    },
  });
};

for (const scenario of [
  {
    role: "employee",
    exists: false,
    destination: "/main/employee/profile",
  },
  {
    role: "employee",
    exists: true,
    destination: "/main/employee/home",
  },
  {
    role: "employer",
    exists: false,
    destination: "/main/employer/profile",
  },
  {
    role: "employer",
    exists: true,
    destination: "/main/employer/jobs",
  },
] as const) {
  test(`dirige ${scenario.role} con perfil ${scenario.exists ? "existente" : "ausente"}`, async ({
    page,
  }) => {
    await restoreSession(page, scenario.role);
    await page.route(`**${profilePath(scenario.role)}`, (route) =>
      fulfillProfile(route, scenario.role, scenario.exists),
    );

    await page.goto("/main");

    await expect(page).toHaveURL(scenario.destination);
  });
}

test("bloquea el onboarding del rol opuesto", async ({ page }) => {
  await restoreSession(page, "employer");
  await page.route(`**${profilePath("employer")}`, (route) =>
    fulfillProfile(route, "employer", false),
  );

  await page.goto("/main/employee/profile");

  await expect(page).toHaveURL("/main/employer/profile");
});

test("bloquea el onboarding de empleador para un empleado", async ({ page }) => {
  await restoreSession(page, "employee");
  await page.route(`**${profilePath("employee")}`, (route) =>
    fulfillProfile(route, "employee", false),
  );

  await page.goto("/main/employer/profile");

  await expect(page).toHaveURL("/main/employee/profile");
});

test("conserva la ubicación protegida al enviar una sesión anónima al login", async ({
  page,
}) => {
  await page.goto("/main/employer/profile");

  await expect(page).toHaveURL("/auth/login");
  await expect
    .poll(() =>
      page.evaluate(() =>
        JSON.parse(localStorage.getItem("location-after-logout") ?? "null"),
      ),
    )
    .toBe("/main/employer/profile");
});

test("resuelve rol y perfil después del login aunque exista una ubicación guardada", async ({
  page,
}) => {
  await page.route("**/api/auth/login", (route) =>
    route.fulfill({
      json: {
        id: 1,
        email: "employee@example.com",
        role: "employee",
        token: "test-token",
        refreshToken: "refresh-token",
      },
    }),
  );
  await page.route("**/auth/me", (route) =>
    route.fulfill({
      json: { ID: 1, Email: "employee@example.com", Role: "employee" },
    }),
  );
  await page.route(`**${profilePath("employee")}`, (route) =>
    fulfillProfile(route, "employee", false),
  );

  await page.goto("/main/employee/home");
  await expect(page).toHaveURL("/auth/login");
  await page.getByLabel("Email").fill("employee@example.com");
  await page.getByLabel("Password").fill("valid-password");
  await page.getByRole("button", { name: "Login", exact: true }).click();

  await expect(page).toHaveURL("/main/employee/profile");
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("location-after-logout")))
    .toBeNull();
});

test("espera una sesión restaurada antes de ocultar el registro", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("access-token", JSON.stringify("test-token"));
  });
  await page.route("**/auth/me", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    await route.fulfill({
      json: { ID: 1, Email: "employer@example.com", Role: "employer" },
    });
  });
  await page.route(`**${profilePath("employer")}`, (route) =>
    fulfillProfile(route, "employer", false),
  );

  await page.goto("/auth/register");

  await expect(page.getByText("Loading...")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Creá tu cuenta" })).toHaveCount(0);
  await expect(page).toHaveURL("/main/employer/profile");
});

test("espera la consulta de perfil antes de navegar", async ({ page }) => {
  await restoreSession(page, "employer");
  await page.route(`**${profilePath("employer")}`, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    await fulfillProfile(route, "employer", true);
  });

  await page.goto("/main");
  await expect(page).toHaveURL("/main");
  await expect(page.getByText("Loading...")).toBeVisible();
  await expect(page).toHaveURL("/main/employer/jobs");
});

test("mantiene un error recuperable hasta reintentar", async ({ page }) => {
  let attempts = 0;
  await restoreSession(page, "employee");
  await page.route(`**${profilePath("employee")}`, async (route) => {
    attempts += 1;
    if (attempts === 1) {
      await route.fulfill({ status: 500, json: { error: "internal error" } });
      return;
    }
    await fulfillProfile(route, "employee", true);
  });

  await page.goto("/main");

  await expect(page.getByText("No pudimos cargar tu perfil")).toBeVisible();
  await expect(page).toHaveURL("/main");
  await page.getByRole("button", { name: "Reintentar" }).click();
  await expect(page).toHaveURL("/main/employee/home");
});

test("no clasifica un error de autorización como perfil ausente", async ({
  page,
}) => {
  await restoreSession(page, "employee");
  await page.route(`**${profilePath("employee")}`, (route) =>
    route.fulfill({
      status: 403,
      json: { error: "employee not found" },
    }),
  );

  await page.goto("/main");

  await expect(page.getByText("No pudimos cargar tu perfil")).toBeVisible();
  await expect(page).toHaveURL("/main");
});

for (const status of [401, 404] as const) {
  test(`mantiene el error HTTP ${status} de employee como recuperable`, async ({
    page,
  }) => {
    await restoreSession(page, "employee");
    await page.route(`**${profilePath("employee")}`, (route) =>
      route.fulfill({
        status,
        json: { error: "employee not found" },
      }),
    );

    await page.goto("/main");

    await expect(page.getByText("No pudimos cargar tu perfil")).toBeVisible();
    await expect(page).toHaveURL("/main");
  });
}

test("mantiene un error de red como recuperable", async ({ page }) => {
  await restoreSession(page, "employer");
  await page.route(`**${profilePath("employer")}`, (route) => route.abort());

  await page.goto("/main");

  await expect(page.getByText("No pudimos cargar tu perfil")).toBeVisible();
  await expect(page).toHaveURL("/main");
});
