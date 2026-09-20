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
