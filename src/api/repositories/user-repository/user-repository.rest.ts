import { httpClient } from "@/core/services/httpClient";
import { Timezone, User, UserRepository } from "./user-repository";

const getUserMapper = (x: any): User => ({
  ...x,
});

export const userRepositoryRest: UserRepository = {
  getAll: async () => {
    const { data } = await httpClient.get("/api/users");
    return data?.map(getUserMapper) || [];
  },
  getById: async (id: number) => {
    const { data } = await httpClient.get(`/api/users/${id}`);
    return getUserMapper(data);
  },
  create: async (user) => httpClient.post(`/api/users`, { user }),
  timezones: async () => {
    const { data } = await httpClient.get("/api/timezones");
    return data as Timezone[];
  },
};
