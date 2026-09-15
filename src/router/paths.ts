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
    analytics: "/main/analytics",
    employee: {
      profile: "/main/employee/profile",
      home: "/main/employee/home",
    },
    employer: {
      profile: "/main/employer/profile",
      jobs: "/main/employer/jobs",
    },
  },
};

export type PathPerRole = {
  paths: string[];
  role: UserRoles;
};

export const PATHS_PER_ROLE: PathPerRole[] = [];
