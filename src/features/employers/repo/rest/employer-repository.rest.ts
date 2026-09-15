import { httpClient } from "@/core/services/httpClient";

import { EmployerRepository } from "../employer-repository";

export const employerRepositoryRest: EmployerRepository = {
  getByUserId: async (userId) => {
    const { data } = await httpClient.get(`users/${userId}/employer`);
    return data;
  },
};
