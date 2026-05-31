import { httpClient } from "@/core/services/httpClient";

type LoginRequest = {
  email: string;
  password: string;
};

export const authRepository = {
  login: async (credentials: LoginRequest) =>
    httpClient.post("/auth/login", credentials),
  register: async (credentials: LoginRequest) =>
    httpClient.post("/auth/register", credentials),
};
