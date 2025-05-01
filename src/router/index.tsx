import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import { PATHS } from "./paths";
import { MainLayout } from "@/features/layout/main-layout";
import HomePage from "@/features/main/home-page";
import { MainErrorPage } from "@/features/app/pages/main-error-page";
import { LoginPage } from "@/features/auth/pages/login-page";
import {
  RequireAuth,
  RequireNotLogged,
} from "@/features/app/components/auth-guard";
import { Suspense } from "react";
import IngredientsPage from "@/features/ingredients/pages/ingredients";
import CreateIngredientPage from "@/features/ingredients/pages/create-ingredient";
import { LoadingScreen } from "@/components/ui/loading-screen";

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
      // {
      //   path: "register",
      //   element: (
      //     <RequireNotLogged>
      //       <RegisterPage />
      //     </RequireNotLogged>
      //   ),
      // },
    ],
  },
  {
    path: "main/*",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <RequireAuth>
          <MainLayout>
            <Outlet />
          </MainLayout>
        </RequireAuth>
      </Suspense>
    ),
    children: [
      {
        path: "home",
        element: <HomePage />,
        errorElement: <MainErrorPage />,
      },
      {
        path: "recipes",
        element: <div>Recipes</div>,
        errorElement: <MainErrorPage />,
      },
      {
        path: "ingredients",
        errorElement: <MainErrorPage />,
        children: [
          {
            path: "list",
            errorElement: <MainErrorPage />,
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <IngredientsPage />
              </Suspense>
            ),
          },
          {
            path: "create",
            element: <CreateIngredientPage />,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to={PATHS.main.home} />,
        errorElement: <MainErrorPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to={PATHS.main.home} />,
  },
]);
