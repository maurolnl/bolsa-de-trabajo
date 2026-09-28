// Los cinco estados que la API informa. `none` no es un estado de batch: significa que el
// sujeto nunca tuvo una generación solicitada, y por eso el backend lo expone acá pero no
// en el tipo que replica el esquema de la base.
//
// El estado es el mismo en los dos sentidos de la recomendación —puestos para un empleado y
// candidatos para un puesto— porque describe el batch y no lo que el batch produjo.
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

export type RecommendationPageInfo = {
  limit: number;
  offset: number;
  total: number;
};

// Un estado que el frontend no conoce se trata como «nunca se solicitó una generación», que
// es exactamente lo que hace el backend ante un estado que él tampoco reconoce. Propagarlo
// tal cual metería un sexto valor en una unión de cinco.
export const mapRecommendationStatus = (status: string): RecommendationStatus =>
  RECOMMENDATION_STATUSES.includes(status as RecommendationStatus)
    ? (status as RecommendationStatus)
    : "none";
