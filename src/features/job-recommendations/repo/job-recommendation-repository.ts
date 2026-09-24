import { JobRecommendationsPage } from "../models/job-recommendation";

export type RecommendationPageRequest = {
  limit: number;
  offset: number;
};

// El nombre del método lleva el sujeto del que se piden recomendaciones, no el tipo de lo que
// se devuelve: el endpoint espejo del empleador —`GET /jobs/{id}/employee-recommendations`—
// entra acá como `listEmployeeRecommendations` sin renombrar nada.
export type JobRecommendationRepository = {
  listJobRecommendations(
    employeeId: number,
    page: RecommendationPageRequest,
  ): Promise<JobRecommendationsPage>;
};
