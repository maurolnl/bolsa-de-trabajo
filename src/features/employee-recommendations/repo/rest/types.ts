// Réplica literal de `EmployeeRecommendation` y `EmployeeRecommendationsResponse` en
// `internal/recommendation/models.go` del backend.
//
// `status` y `years_of_experience` se tipan `string` y no como una unión: es lo que
// efectivamente llega por la red, y el mapper —o la capa de presentación— es quien decide qué
// hacer con un valor que el frontend no conoce.
export type EmployeeRecommendationResponse = {
  recommendation_id: number;
  employee_id: number;
  user_id: number;
  position: string;
  role: string;
  years_of_experience: string;
  certifications: string[] | null;
  portfolio_url: string | null;
  score: number | null;
  created_at: string;
  profile_updated_at: string;
};

export type RecommendationPageResponse = {
  limit: number;
  offset: number;
  total: number;
};

export type EmployeeRecommendationsResponse = {
  status: string;
  items: EmployeeRecommendationResponse[] | null;
  page: RecommendationPageResponse;
};
