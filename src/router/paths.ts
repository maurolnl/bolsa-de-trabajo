import { UserRoles } from "@/models/User";

export const PATHS = {
  auth: {
    root: "/auth",
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
  },
  main: {
    root: "/main",
    home: "/main/home",
    recipes: "/main/recipes",
    ingredients: {
      root: "/main/ingredients",
      list: "/main/ingredients/list",
      create: "/main/ingredients/create",
      edit: (id: string) => `/main/ingredients/edit/${id}`,
    },
    analytics: "/main/analytics",
  },
};

export type PathPerRole = {
  paths: string[];
  role: UserRoles;
};

export const PATHS_PER_ROLE: PathPerRole[] = [];
