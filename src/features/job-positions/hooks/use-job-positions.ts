import { jobPositionRepository } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import {
  CreateJobPosition,
  UpdateJobPosition,
} from "../models/job-position";

// El backend responde 404 cuando el puesto no existe o fue eliminado, y 403 cuando
// pertenece a otro empleador. Distinguirlos es responsabilidad del contrato, no de las
// pantallas: sin estos predicados cada página necesitaría conocer axios y los códigos.
export const isMissingJobPositionError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 404;

export const isForeignJobPositionError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 403;

// Ninguno de los dos se resuelve reintentando: los dos significan que el estado local
// quedó viejo respecto del backend.
export const isUnavailableJobPositionError = (error: unknown) =>
  isMissingJobPositionError(error) || isForeignJobPositionError(error);

export const jobPositionKeys = {
  byEmployer: (employerId: number) =>
    ["job-positions", "employer", employerId] as const,
  detail: (jobPositionId: number) =>
    ["job-positions", "detail", jobPositionId] as const,
};

export const useJobPosition = (jobPositionId: number) =>
  useQuery({
    queryKey: jobPositionKeys.detail(jobPositionId),
    queryFn: () => jobPositionRepository.getJobPosition(jobPositionId),
    enabled: Number.isFinite(jobPositionId) && jobPositionId > 0,
  });

// El identificador del empleador se deriva del perfil propio y llega indefinido mientras
// esa consulta no resuelva: sin él la colección no se pide en lugar de pedirse con un
// identificador inválido.
export const useEmployerJobPositions = (employerId: number | undefined) =>
  useQuery({
    queryKey: jobPositionKeys.byEmployer(employerId ?? 0),
    queryFn: () => jobPositionRepository.listJobPositions(employerId as number),
    enabled:
      employerId !== undefined &&
      Number.isFinite(employerId) &&
      employerId > 0,
  });

export const useCreateJobPosition = (employerId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobPosition: CreateJobPosition) =>
      jobPositionRepository.createJobPosition(employerId, jobPosition),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: jobPositionKeys.byEmployer(employerId),
      }),
  });
};

export const useUpdateJobPosition = (
  jobPositionId: number,
  employerId: number,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobPosition: UpdateJobPosition) =>
      jobPositionRepository.updateJobPosition(jobPositionId, jobPosition),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: jobPositionKeys.detail(jobPositionId),
      });
      await queryClient.invalidateQueries({
        queryKey: jobPositionKeys.byEmployer(employerId),
      });
    },
  });
};

// La consistencia de la caché es responsabilidad del hook: quien elimina un puesto no
// tiene por qué saber qué claves quedaron viejas. Invalidar el detalle además de la
// colección evita que una edición abierta en otra pestaña siga sirviendo desde caché un
// puesto que ya no existe.
export const useDeleteJobPosition = (employerId: number) => {
  const queryClient = useQueryClient();

  const invalidateCollection = () =>
    queryClient.invalidateQueries({
      queryKey: jobPositionKeys.byEmployer(employerId),
    });

  return useMutation({
    mutationFn: (jobPositionId: number) =>
      jobPositionRepository.deleteJobPosition(jobPositionId),
    onSuccess: async (_data, jobPositionId) => {
      await queryClient.invalidateQueries({
        queryKey: jobPositionKeys.detail(jobPositionId),
      });
      await invalidateCollection();
    },
    // Un puesto inexistente o ajeno significa que la colección cacheada quedó vieja: se
    // resincroniza contra la API en lugar de dejar visible algo que ya no está.
    onError: (error) =>
      isUnavailableJobPositionError(error) ? invalidateCollection() : undefined,
  });
};
