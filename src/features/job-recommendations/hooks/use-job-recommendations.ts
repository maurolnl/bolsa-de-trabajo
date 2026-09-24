import { jobRecommendationRepository } from "@/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";

import {
  JobRecommendationsPage,
  isGenerationInProgress,
} from "../models/job-recommendation";

// El backend acepta `limit` en [1, 100] y responde 400 fuera de ese rango en vez de
// recortar. 20 es su valor por defecto y no hay requisito de que el empleado elija el
// tamaño de página, así que es constante y el 400 de paginación queda inalcanzable.
export const RECOMMENDATIONS_PAGE_SIZE = 20;

// Cinco segundos: sensible para una espera que el empleado está mirando, y suficientemente
// espaciado para una consulta que en el backend son tres lecturas a la base.
const POLL_INTERVAL_MS = 5_000;

// El backend responde 403 con un mensaje genérico tanto para un rol incorrecto como para un
// perfil ajeno: no distinguirlos es deliberado del lado del servidor y acá tampoco aporta.
export const isForbiddenRecommendationsError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 403;

export const jobRecommendationKeys = {
  // El prefijo permite invalidar todos los tramos cacheados de un empleado —y de todos— de
  // una sola vez cuando el perfil cambia.
  all: ["job-recommendations"] as const,
  byEmployee: (employeeId: number, offset: number) =>
    ["job-recommendations", "employee", employeeId, offset] as const,
};

export const useJobRecommendations = (
  employeeId: number | undefined,
  offset: number,
) => {
  const numericEmployeeId = Number(employeeId);
  const canQuery = Number.isFinite(numericEmployeeId) && numericEmployeeId > 0;

  return useQuery({
    queryKey: jobRecommendationKeys.byEmployee(numericEmployeeId, offset),
    queryFn: () =>
      jobRecommendationRepository.listJobRecommendations(numericEmployeeId, {
        limit: RECOMMENDATIONS_PAGE_SIZE,
        offset,
      }),
    // El identificador sale del perfil de empleado y llega indefinido mientras esa consulta
    // no resuelva: sin él no se pide nada en lugar de pedirse con un identificador inválido.
    enabled: canQuery,
    // El sondeo se declara acá y no en un `useEffect` con `setInterval`: React Query lo ata
    // al observer, así que el desmontaje de la pantalla lo apaga sin limpieza manual, y el
    // desenlace lo apaga devolviendo `false`.
    refetchInterval: (query) => {
      const data = query.state.data as JobRecommendationsPage | undefined;
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
