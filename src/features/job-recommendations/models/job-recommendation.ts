import {
  RequiredEducationLevel,
  RequiredExperience,
} from "@/features/job-positions/models/job-position";
import {
  RecommendationPageInfo,
  RecommendationStatus,
} from "@/features/recommendations/models/recommendation-status";

// El puesto recomendado llega embebido en la respuesta, así que la tarjeta se arma sin una
// consulta por puesto. `score` es `number | null` y no `number | undefined`: la API lo manda
// explícitamente nulo mientras el algoritmo de indicadores no exista, y colapsarlo a `0`
// sería inventar una afinidad que nadie calculó.
export type JobRecommendation = {
  recommendationId: number;
  jobPositionId: number;
  employerId: number;
  position: string;
  role: string;
  requiredExperience: RequiredExperience;
  requiredEducationLevel: RequiredEducationLevel;
  availableHoursPerDay: number;
  timezone: string;
  technicalResources: string[];
  score: number | null;
  publishedAt: string;
  updatedAt: string;
};

// `status` e `items` son dos datos independientes y no se derivan uno del otro: la API toma
// el estado del batch más reciente y los items del último batch completado, que pueden no ser
// el mismo. Un `processing` con items del conjunto anterior y un `completed` sin items se
// verían iguales si el estado se infiriera de `items.length`.
export type JobRecommendationsPage = {
  status: RecommendationStatus;
  items: JobRecommendation[];
  page: RecommendationPageInfo;
};
