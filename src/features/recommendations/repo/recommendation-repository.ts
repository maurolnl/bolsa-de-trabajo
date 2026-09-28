import { EmployeeRecommendationsPage } from "@/features/employee-recommendations/models/employee-recommendation";
import { JobRecommendationsPage } from "@/features/job-recommendations/models/job-recommendation";

export type RecommendationPageRequest = {
  limit: number;
  offset: number;
};

// El nombre de cada método lleva el sujeto del que se piden recomendaciones, no el tipo de lo
// que se devuelve: `listJobRecommendations` pide las de un empleado y devuelve puestos, y
// `listEmployeeRecommendations` pide las de un puesto y devuelve candidatos.
export type RecommendationRepository = {
  listJobRecommendations(
    employeeId: number,
    page: RecommendationPageRequest,
  ): Promise<JobRecommendationsPage>;
  listEmployeeRecommendations(
    jobPositionId: number,
    page: RecommendationPageRequest,
  ): Promise<EmployeeRecommendationsPage>;
};
