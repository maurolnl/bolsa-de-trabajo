import {
  RecommendationPageInfo,
  RecommendationStatus,
} from "@/features/recommendations/models/recommendation-status";

// El resumen del candidato llega embebido en la recomendación, así que la tarjeta se arma sin
// consultar el perfil. El perfil completo sí exige una consulta propia: a diferencia del
// sentido empleado → puesto, la API no lo embebe acá.
//
// `score` y `portfolioUrl` son `| null` y no `| undefined`: la API los manda explícitamente
// nulos —el primero mientras el algoritmo de indicadores no exista— y colapsarlos a `0` o a
// cadena vacía sería inventar un dato que nadie cargó.
export type EmployeeRecommendation = {
  recommendationId: number;
  employeeId: number;
  userId: number;
  position: string;
  role: string;
  yearsOfExperience: string;
  certifications: string[];
  portfolioUrl: string | null;
  score: number | null;
  createdAt: string;
  profileUpdatedAt: string;
};

// `status` e `items` son dos datos independientes y no se derivan uno del otro: la API toma
// el estado del batch más reciente y los items del último batch completado, que pueden no ser
// el mismo. Un `processing` con items del conjunto anterior y un `completed` sin items se
// verían iguales si el estado se infiriera de `items.length`.
export type EmployeeRecommendationsPage = {
  status: RecommendationStatus;
  items: EmployeeRecommendation[];
  page: RecommendationPageInfo;
};
