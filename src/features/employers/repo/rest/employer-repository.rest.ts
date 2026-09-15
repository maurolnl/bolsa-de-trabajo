import { httpClient } from "@/core/services/httpClient";

import { EmployerRepository } from "../employer-repository";
import { mapCreateEmployer, mapEmployerResponse } from "./helpers";
import { EmployerResponse } from "./types";

export const employerRepositoryRest: EmployerRepository = {
  getByUserId: async (userId) => {
    const { data } = await httpClient.get<EmployerResponse>(
      `users/${userId}/employer`,
    );
    return mapEmployerResponse(data);
  },
  createEmployer: async (employer) => {
    await httpClient.post("employers", mapCreateEmployer(employer));
  },
};
