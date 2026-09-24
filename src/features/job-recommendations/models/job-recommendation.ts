import {
  RequiredEducationLevel,
  RequiredExperience,
} from "@/features/job-positions/models/job-position";

// Los cinco estados que la API informa. `none` no es un estado de batch: significa que el
// empleado nunca tuvo una generación solicitada, y por eso el backend lo expone acá pero no
// en el tipo que replica el esquema de la base.
export const RECOMMENDATION_STATUSES = [
  "none",
  "pending",
  "processing",
  "completed",
  "failed",
] as const;

export type RecommendationStatus = (typeof RECOMMENDATION_STATUSES)[number];

// Estados que todavía esperan un desenlace. Son los únicos que justifican volver a consultar.
export const isGenerationInProgress = (status: RecommendationStatus) =>
  status === "pending" || status === "processing";

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

export type RecommendationPageInfo = {
  limit: number;
  offset: number;
  total: number;
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
