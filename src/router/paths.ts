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
      jobsNew: "/main/employer/jobs/new",
      jobsEdit: (jobPositionId: number | string) =>
        `/main/employer/jobs/${jobPositionId}/edit`,
      jobsCandidates: (jobPositionId: number | string) =>
        `/main/employer/jobs/${jobPositionId}/candidates`,
    },
  },
};

export type PathPerRole = {
  paths: string[];
  role: UserRoles;
};

export const PATHS_PER_ROLE: PathPerRole[] = [];
