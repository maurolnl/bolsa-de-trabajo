import {
  RequiredEducationLevel,
  RequiredExperience,
} from "@/features/job-positions/models/job-position";

// Réplica literal de `JobRecommendation` y `JobRecommendationsResponse` en
// `internal/recommendation/models.go` del backend.
//
// `status` se tipa `string` y no como la unión del modelo: es lo que efectivamente llega por
// la red, y el mapper es el que decide qué hacer con un valor que el frontend no conoce.
export type JobRecommendationResponse = {
  recommendation_id: number;
  job_position_id: number;
  employer_id: number;
  position: string;
  role: string;
  required_experience: RequiredExperience;
  required_education_level: RequiredEducationLevel;
  available_hours_per_day: number;
  timezone: string;
  technical_resources: string[] | null;
  score: number | null;
  published_at: string;
  updated_at: string;
};

export type RecommendationPageResponse = {
  limit: number;
  offset: number;
  total: number;
};

export type JobRecommendationsResponse = {
  status: string;
  items: JobRecommendationResponse[] | null;
  page: RecommendationPageResponse;
};
