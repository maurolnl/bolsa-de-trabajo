import { createBrowserRouter, Link, Navigate, Outlet } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { PATHS } from "./paths";
import { MainLayout } from "@/features/layout/main-layout";
import { MainErrorPage } from "@/features/app/pages/main-error-page";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { NewEmployeePage } from "@/features/employees/pages/new-employee-page";
import {
  RequireAuth,
  RequireNotLogged,
  RequireRole,
} from "@/features/app/components/auth-guard";
import { LoginPage } from "@/features/auth/pages/login-page";
import { RegisterPage } from "@/features/auth/pages/register-page";
import { MainResolverPage } from "@/features/app/pages/main-resolver-page";
import { ContinuityPage } from "@/features/app/pages/continuity-page";
import { EmployerProfilePage } from "@/features/employers/pages/employer-profile-page";
import { JobPositionCreatePage } from "@/features/job-positions/pages/job-position-create-page";
import { JobPositionEditPage } from "@/features/job-positions/pages/job-position-edit-page";

export const router = createBrowserRouter([
  {
    path: "auth/*",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <RequireNotLogged>
          <Outlet />
        </RequireNotLogged>
      </Suspense>
    ),
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "main/*",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <RequireAuth>
          <MainLayout>
            <Outlet />
          </MainLayout>
        </RequireAuth>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <MainResolverPage />,
        errorElement: <MainErrorPage />,
      },
      {
        path: "employee/profile",
        element: (
          <RequireRole allowedRoles={["employee"]}>
            <NewEmployeePage />
          </RequireRole>
        ),
        errorElement: <MainErrorPage />,
      },
      {
        path: "employee/home",
        element: (
          <RequireRole allowedRoles={["employee"]}>
            <ContinuityPage
              title="Tu espacio de trabajo"
              description="Estamos preparando tus próximas oportunidades laborales."
            />
          </RequireRole>
        ),
        errorElement: <MainErrorPage />,
      },
      {
        path: "employer/profile",
        element: (
          <RequireRole allowedRoles={["employer"]}>
            <EmployerProfilePage />
          </RequireRole>
        ),
        errorElement: <MainErrorPage />,
      },
      {
        path: "employer/jobs",
        element: (
          <RequireRole allowedRoles={["employer"]}>
            <ContinuityPage
              title="Puestos de trabajo"
              description="El listado de puestos estará disponible próximamente. Mientras tanto, ya podés publicar uno nuevo."
              action={
                <Button asChild>
                  <Link to={PATHS.main.employer.jobsNew}>Publicar puesto</Link>
                </Button>
              }
            />
          </RequireRole>
        ),
        errorElement: <MainErrorPage />,
      },
      {
        path: "employer/jobs/new",
        element: (
          <RequireRole allowedRoles={["employer"]}>
            <JobPositionCreatePage />
          </RequireRole>
        ),
        errorElement: <MainErrorPage />,
      },
      {
        path: "employer/jobs/:jobPositionId/edit",
        element: (
          <RequireRole allowedRoles={["employer"]}>
            <JobPositionEditPage />
          </RequireRole>
        ),
        errorElement: <MainErrorPage />,
      },
      {
        path: "home",
        element: <Navigate to={PATHS.main.root} replace />,
        errorElement: <MainErrorPage />,
      },
      {
        path: "*",
        element: <Navigate to={PATHS.main.root} replace />,
        errorElement: <MainErrorPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to={PATHS.main.root} replace />,
  },
]);
