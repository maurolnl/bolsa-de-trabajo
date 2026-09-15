import { employerRepository } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreateEmployer } from "../models/employer";

export const employerKeys = {
  employer: (userId: number) => ["employers", userId] as const,
};

export const useCreateEmployer = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employer: CreateEmployer) =>
      employerRepository.createEmployer(employer),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: employerKeys.employer(userId),
      }),
  });
};
