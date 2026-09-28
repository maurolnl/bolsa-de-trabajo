import { httpClient } from "@/core/services/httpClient";
import { RecommendationRepository } from "@/features/recommendations/repo/recommendation-repository";

import { mapEmployeeRecommendationsResponse } from "./helpers";
import { EmployeeRecommendationsResponse } from "./types";

export const employeeRecommendationRepositoryRest: Pick<
  RecommendationRepository,
  "listEmployeeRecommendations"
> = {
  // La API ordena por puntaje descendente con la actualización de perfil más reciente como
  // desempate: el frontend no reordena ni filtra. La propiedad del puesto la resuelve el
  // backend contra la identidad del token, y excluye los puestos eliminados lógicamente.
  listEmployeeRecommendations: async (jobPositionId, page) => {
    const { data } = await httpClient.get<EmployeeRecommendationsResponse>(
      `jobs/${jobPositionId}/employee-recommendations`,
      { params: { limit: page.limit, offset: page.offset } },
    );
    return mapEmployeeRecommendationsResponse(data);
  },
};
