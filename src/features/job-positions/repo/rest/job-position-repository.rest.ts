import { httpClient } from "@/core/services/httpClient";

import { JobPositionRepository } from "../job-position-repository";
import { mapCreateJobPosition, mapJobPositionResponse } from "./helpers";
import { JobPositionResponse } from "./types";

export const jobPositionRepositoryRest: JobPositionRepository = {
  createJobPosition: async (employerId, jobPosition) => {
    const { data } = await httpClient.post<JobPositionResponse>(
      `employers/${employerId}/jobs`,
      mapCreateJobPosition(jobPosition),
    );
    return mapJobPositionResponse(data);
  },
  getJobPosition: async (jobPositionId) => {
    const { data } = await httpClient.get<JobPositionResponse>(
      `jobs/${jobPositionId}`,
    );
    return mapJobPositionResponse(data);
  },
  updateJobPosition: async (jobPositionId, jobPosition) => {
    const { data } = await httpClient.put<JobPositionResponse>(
      `jobs/${jobPositionId}`,
      mapCreateJobPosition(jobPosition),
    );
    return mapJobPositionResponse(data);
  },
};
