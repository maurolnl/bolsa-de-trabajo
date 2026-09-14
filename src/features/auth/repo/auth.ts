import { httpClient } from "@/core/services/httpClient";
import { UserRole } from "../types";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = LoginCredentials & {
  role: UserRole;
};

type CurrentUser = {
  id: number;
  email: string;
  role: UserRole;
};

type CurrentUserResponse = {
  ID: number;
  Email: string;
  Role: unknown;
};

export type LoggedUser = {
  id: number;
  email: string;
  role: UserRole;
  token: string;
  refreshToken: string;
};

const parseUserRole = (role: unknown): UserRole => {
  if (role !== "employee" && role !== "employer") {
    throw new Error("Invalid user role");
  }

  return role;
};

const mapCurrentUser = (user: CurrentUserResponse): CurrentUser => ({
  id: user.ID,
  email: user.Email,
  role: parseUserRole(user.Role),
});

const mapLoggedUser = (user: LoggedUser): LoggedUser => ({
  ...user,
  role: parseUserRole(user.role),
});

export const authRepository = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await httpClient.post("/auth/login", credentials);
    return mapLoggedUser(data);
  },
  register: async (credentials: RegisterCredentials) =>
    httpClient.post("/auth/register", credentials),
  getCurrentUser: async (): Promise<CurrentUser> => {
    const { data } = await httpClient.get("/auth/me");
    return mapCurrentUser(data);
  },
};
