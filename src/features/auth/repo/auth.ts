import { httpClient } from "@/core/services/httpClient";

export type LoginCredentials = {
  email: string;
  password: string;
};

type CurrentUser = {
  id: number;
  email: string;
};

export type LoggedUser = {
  id: number;
  email: string;
  token: string;
  refreshToken: string;
};

export const authRepository = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await httpClient.post("/auth/login", credentials);
    return data as LoggedUser;
  },
  register: async (credentials: LoginCredentials) =>
    httpClient.post("/auth/register", credentials),
  getCurrentUser: async (): Promise<CurrentUser> => {
    const { data } = await httpClient.get("/auth/me");
    return data;
  },
};
