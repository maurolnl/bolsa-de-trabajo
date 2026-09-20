import { employerRepository } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { CreateEmployer, Employer } from "../models/employer";

export const employerKeys = {
  employer: (userId: number) => ["employers", userId] as const,
};

// El backend responde 404 cuando la cuenta todavía no creó su perfil de empleador. Esa
// ausencia es un estado esperado del flujo, no un error de comunicación.
export const isMissingEmployerProfileError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 404;

const getEmployerProfile = async (userId: number): Promise<Employer | null> => {
  try {
    return await employerRepository.getByUserId(userId);
  } catch (error) {
    if (isMissingEmployerProfileError(error)) return null;
    throw error;
  }
};

// Comparte la query key con la resolución de navegación: las pantallas que necesitan el
// identificador del empleador leen el perfil ya cacheado en vez de consultarlo otra vez.
export const useEmployerProfile = (userId: number) =>
  useQuery({
    queryKey: employerKeys.employer(userId),
    queryFn: () => getEmployerProfile(userId),
    enabled: Number.isFinite(userId),
  });

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
