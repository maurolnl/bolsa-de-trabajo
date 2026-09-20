import { jobPositionRepository } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  CreateJobPosition,
  UpdateJobPosition,
} from "../models/job-position";

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

// Invalidar el detalle además de la colección evita que una edición abierta en otra
// pestaña siga sirviendo desde caché un puesto que ya no existe.
export const useDeleteJobPosition = (employerId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobPositionId: number) =>
      jobPositionRepository.deleteJobPosition(jobPositionId),
    onSuccess: async (_data, jobPositionId) => {
      await queryClient.invalidateQueries({
        queryKey: jobPositionKeys.detail(jobPositionId),
      });
      await queryClient.invalidateQueries({
        queryKey: jobPositionKeys.byEmployer(employerId),
      });
    },
  });
};
