import { mapRecommendationStatus } from "@/features/recommendations/models/recommendation-status";

import {
  EmployeeRecommendation,
  EmployeeRecommendationsPage,
} from "../../models/employee-recommendation";
import {
  EmployeeRecommendationResponse,
  EmployeeRecommendationsResponse,
} from "./types";

// `score` y `portfolio_url` se preservan tal como llegaron. Un `null` en el primero significa
// que nadie calculó la afinidad de ese candidato, y cualquier valor por defecto acá sería un
// puntaje inventado.
export const mapEmployeeRecommendationResponse = (
  recommendation: EmployeeRecommendationResponse,
): EmployeeRecommendation => ({
  recommendationId: recommendation.recommendation_id,
  employeeId: recommendation.employee_id,
  userId: recommendation.user_id,
  position: recommendation.position,
  role: recommendation.role,
  yearsOfExperience: recommendation.years_of_experience,
  certifications: recommendation.certifications ?? [],
  portfolioUrl: recommendation.portfolio_url ?? null,
  score: recommendation.score ?? null,
  createdAt: recommendation.created_at,
  profileUpdatedAt: recommendation.profile_updated_at,
});

export const mapEmployeeRecommendationsResponse = (
  response: EmployeeRecommendationsResponse,
): EmployeeRecommendationsPage => ({
  status: mapRecommendationStatus(response.status),
  items: (response.items ?? []).map(mapEmployeeRecommendationResponse),
  page: {
    limit: response.page.limit,
    offset: response.page.offset,
    total: response.page.total,
  },
});
