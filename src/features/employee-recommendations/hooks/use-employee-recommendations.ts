import { recommendationRepository } from "@/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";

import { isGenerationInProgress } from "@/features/recommendations/models/recommendation-status";

import { EmployeeRecommendationsPage } from "../models/employee-recommendation";

// El backend acepta `limit` en [1, 100] y responde 400 fuera de ese rango en vez de
// recortar. 20 es su valor por defecto y no hay requisito de que el empleador elija el
// tamaño de página, así que es constante y el 400 de paginación queda inalcanzable.
export const CANDIDATES_PAGE_SIZE = 20;

// Cinco segundos: el mismo intervalo que el sentido del empleado. Sensible para una espera
// que alguien está mirando, y suficientemente espaciado para una consulta que en el backend
// son tres lecturas a la base.
const POLL_INTERVAL_MS = 5_000;

// El backend responde 403 con un mensaje genérico tanto para un rol incorrecto como para un
// puesto ajeno: no distinguirlos es deliberado del lado del servidor y acá tampoco aporta.
export const isForbiddenCandidatesError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 403;

// El 404 cubre el puesto inexistente y el eliminado lógicamente: la resolución de propiedad
// del backend excluye los eliminados, así que los dos llegan igual. El frontend no puede
// observar la diferencia y no la inventa.
export const isMissingJobPositionCandidatesError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 404;

export const employeeRecommendationKeys = {
  // El prefijo permite invalidar todos los tramos cacheados de un puesto —y de todos— de una
  // sola vez cuando el puesto cambia.
  all: ["employee-recommendations"] as const,
  byJobPosition: (jobPositionId: number, offset: number) =>
    ["employee-recommendations", "job-position", jobPositionId, offset] as const,
};

export const useEmployeeRecommendations = (
  jobPositionId: number,
  offset: number,
) => {
  const canQuery = Number.isFinite(jobPositionId) && jobPositionId > 0;

  return useQuery({
    queryKey: employeeRecommendationKeys.byJobPosition(jobPositionId, offset),
    queryFn: () =>
      recommendationRepository.listEmployeeRecommendations(jobPositionId, {
        limit: CANDIDATES_PAGE_SIZE,
        offset,
      }),
    // El identificador sale de la ruta: si no es un número positivo no se pide nada en lugar
    // de pedirse con un identificador inválido. La propiedad del puesto no se decide acá.
    enabled: canQuery,
    // El sondeo se declara acá y no en un `useEffect` con `setInterval`: React Query lo ata
    // al observer, así que el desmontaje de la pantalla lo apaga sin limpieza manual, y el
    // desenlace lo apaga devolviendo `false`.
    refetchInterval: (query) => {
      const data = query.state.data as EmployeeRecommendationsPage | undefined;
      return data && isGenerationInProgress(data.status)
        ? POLL_INTERVAL_MS
        : false;
    },
    // Una pestaña en segundo plano no sondea.
    refetchIntervalInBackground: false,
    // Sin reintento automático: un error tiene que cortar el sondeo y hacerse visible, no
    // repetirse en silencio detrás de una pantalla que sigue diciendo que carga.
    retry: false,
    // Cambiar de página conserva el tramo anterior a la vista en lugar de parpadear a vacío.
    placeholderData: keepPreviousData,
  });
};
