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
  // La API devuelve solo los puestos activos del empleador: los eliminados quedan fuera
  // de la colección y el frontend no tiene que filtrarlos.
  listJobPositions: async (employerId) => {
    const { data } = await httpClient.get<JobPositionResponse[]>(
      `employers/${employerId}/jobs`,
    );
    return (data ?? []).map(mapJobPositionResponse);
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
  // La API responde 204 sin cuerpo: no hay nada que mapear.
  deleteJobPosition: async (jobPositionId) => {
    await httpClient.delete(`jobs/${jobPositionId}`);
  },
};
