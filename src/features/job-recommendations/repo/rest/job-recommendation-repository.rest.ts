import { httpClient } from "@/core/services/httpClient";

import { RecommendationRepository } from "@/features/recommendations/repo/recommendation-repository";
import { mapJobRecommendationsResponse } from "./helpers";
import { JobRecommendationsResponse } from "./types";

export const jobRecommendationRepositoryRest: Pick<
  RecommendationRepository,
  "listJobRecommendations"
> = {
  // La API ordena por puntaje descendente con la publicación más reciente como desempate y
  // excluye los puestos eliminados del listado y del total: el frontend no reordena ni filtra.
  listJobRecommendations: async (employeeId, page) => {
    const { data } = await httpClient.get<JobRecommendationsResponse>(
      `employees/${employeeId}/job-recommendations`,
      { params: { limit: page.limit, offset: page.offset } },
    );
    return mapJobRecommendationsResponse(data);
  },
};
