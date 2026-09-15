import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

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
            <ContinuityPage
              title="Perfil de empleador"
              description="La creación del perfil de empresa estará disponible próximamente."
            />
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
              description="La gestión de búsquedas laborales estará disponible próximamente."
            />
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
