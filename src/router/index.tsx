import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import { PATHS } from "./paths";
import { MainLayout } from "@/features/layout/main-layout";
import HomePage from "@/features/main/home-page";
import { MainErrorPage } from "@/features/app/pages/main-error-page";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/ui/loading-screen";

export const router = createBrowserRouter([
  // {
  //   path: "auth/*",
  //   element: (
  //     <Suspense fallback={<div>Loading...</div>}>
  //       <RequireNotLogged>
  //         <Outlet />
  //       </RequireNotLogged>
  //     </Suspense>
  //   ),
  //   children: [
  //     {
  //       path: "login",
  //       element: <LoginPage />,
  //     },
  //     // {
  //     //   path: "register",
  //     //   element: (
  //     //     <RequireNotLogged>
  //     //       <RegisterPage />
  //     //     </RequireNotLogged>
  //     //   ),
  //     // },
  //   ],
  // },
  {
    path: "main/*",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        {/* <RequireAuth noAuth={noAuth}> */}
        <MainLayout>
          <Outlet />
        </MainLayout>
        {/* </RequireAuth> */}
      </Suspense>
    ),
    children: [
      {
        path: "home",
        element: <HomePage />,
        errorElement: <MainErrorPage />,
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
