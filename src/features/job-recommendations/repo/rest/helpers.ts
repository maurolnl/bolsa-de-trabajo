import {
  JobRecommendation,
  JobRecommendationsPage,
  RECOMMENDATION_STATUSES,
  RecommendationStatus,
} from "../../models/job-recommendation";
import { JobRecommendationResponse, JobRecommendationsResponse } from "./types";

// Un estado que el frontend no conoce se trata como «nunca se solicitó una generación», que
// es exactamente lo que hace el backend ante un estado que él tampoco reconoce. Propagarlo
// tal cual metería un sexto valor en una unión de cinco.
const mapRecommendationStatus = (status: string): RecommendationStatus =>
  RECOMMENDATION_STATUSES.includes(status as RecommendationStatus)
    ? (status as RecommendationStatus)
    : "none";

// `score` se preserva tal como llegó. Un `null` significa que nadie calculó la afinidad de
// ese puesto, y cualquier valor por defecto acá sería un puntaje inventado.
export const mapJobRecommendationResponse = (
  recommendation: JobRecommendationResponse,
): JobRecommendation => ({
  recommendationId: recommendation.recommendation_id,
  jobPositionId: recommendation.job_position_id,
  employerId: recommendation.employer_id,
  position: recommendation.position,
  role: recommendation.role,
  requiredExperience: recommendation.required_experience,
  requiredEducationLevel: recommendation.required_education_level,
  availableHoursPerDay: recommendation.available_hours_per_day,
  timezone: recommendation.timezone,
  technicalResources: recommendation.technical_resources ?? [],
  score: recommendation.score ?? null,
  publishedAt: recommendation.published_at,
  updatedAt: recommendation.updated_at,
});

export const mapJobRecommendationsResponse = (
  response: JobRecommendationsResponse,
): JobRecommendationsPage => ({
  status: mapRecommendationStatus(response.status),
  items: (response.items ?? []).map(mapJobRecommendationResponse),
  page: {
    limit: response.page.limit,
    offset: response.page.offset,
    total: response.page.total,
  },
});
