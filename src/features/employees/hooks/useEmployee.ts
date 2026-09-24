import { employeeRepository } from "@/api";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { jobRecommendationKeys } from "@/features/job-recommendations/hooks/use-job-recommendations";
import { Employee } from "../models/Employee";
import {
  CreateAvailability,
  CreateEducation,
  CreateEmployee,
  CreateLocation,
  CreateTech,
  UpdateAvailability,
  UpdateEducation,
  UpdateEmployee,
  UpdateLocation,
  UpdateTech,
} from "../repo/employee-repository";

export const employeeKeys = {
  employees: ["employees"],
  employee: (id: number) => ["employees", id],
  timezones: ["timezones"],
};

export function useEmployees() {
  return useQuery({
    queryKey: employeeKeys.employees,
    queryFn: () => employeeRepository.getAll(),
  });
}

export function useEmployee(id: number) {
  return useQuery({
    queryKey: employeeKeys.employee(id),
    queryFn: () => employeeRepository.getById(id),
  });
}

type ErrorResponse = {
  error?: unknown;
};

// El backend responde 400 con este mensaje cuando la cuenta todavía no creó su perfil de
// empleado. Esa ausencia es un estado esperado del flujo, no un error de comunicación.
export const isMissingEmployeeProfileError = (error: unknown) =>
  axios.isAxiosError<ErrorResponse>(error) &&
  error.response?.status === 400 &&
  error.response.data?.error === "employee not found";

export const getEmployeeProfile = async (
  userId: number,
): Promise<Employee | null> => {
  try {
    return await employeeRepository.getById(userId);
  } catch (error) {
    if (isMissingEmployeeProfileError(error)) return null;
    throw error;
  }
};

// Comparte la query key con la resolución de navegación: las pantallas que necesitan el
// identificador del perfil de empleado leen el perfil ya cacheado en vez de consultarlo
// otra vez. Un `data` nulo con la consulta ya resuelta significa que no hay perfil.
export const useEmployeeProfile = (userId: number) =>
  useQuery({
    queryKey: employeeKeys.employee(userId),
    queryFn: () => getEmployeeProfile(userId),
    enabled: Number.isFinite(userId),
  });

// Toda escritura sobre el perfil dispara en el backend la regeneración de las
// recomendaciones del empleado (LAB-34), así que el conjunto cacheado queda viejo en el
// mismo momento. Se invalida por prefijo para alcanzar todos los tramos paginados de una
// vez. Va en `onSuccess` y no en `onSettled`: una escritura fallida no regeneró nada.
const invalidateProfileAndRecommendations = (
  queryClient: QueryClient,
  id: number,
) => {
  void queryClient.invalidateQueries({ queryKey: employeeKeys.employee(id) });
  void queryClient.invalidateQueries({ queryKey: jobRecommendationKeys.all });
};

export function useCreateEmployee(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser: CreateEmployee) =>
      employeeRepository.createEmployee(newUser),
    onSuccess: () => invalidateProfileAndRecommendations(queryClient, id),
  });
}

export function useUpdateEmployee(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employee: UpdateEmployee) =>
      employeeRepository.updateEmployee(employee),
    onSuccess: () => invalidateProfileAndRecommendations(queryClient, id),
  });
}

export function useCreateLocation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newLocation: CreateLocation) =>
      employeeRepository.createLocation(newLocation),
    onSuccess: () => invalidateProfileAndRecommendations(queryClient, id),
  });
}

export function useUpdateLocation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (location: UpdateLocation) =>
      employeeRepository.updateLocation(location),
    onSuccess: () => invalidateProfileAndRecommendations(queryClient, id),
  });
}

export function useCreateTech(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTech: CreateTech) =>
      employeeRepository.createTech(newTech),
    onSuccess: () => invalidateProfileAndRecommendations(queryClient, id),
  });
}

export function useUpdateTech(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tech: UpdateTech) => employeeRepository.updateTech(tech),
    onSuccess: () => invalidateProfileAndRecommendations(queryClient, id),
  });
}

export function useCreateAvailability(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAvailability: CreateAvailability) =>
      employeeRepository.createAvailability(newAvailability),
    onSuccess: () => invalidateProfileAndRecommendations(queryClient, id),
  });
}

export function useUpdateAvailability(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (availability: UpdateAvailability) =>
      employeeRepository.updateAvailability(availability),
    onSuccess: () => invalidateProfileAndRecommendations(queryClient, id),
  });
}

export function useCreateEducation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEducation: CreateEducation) =>
      employeeRepository.createEducation(newEducation),
    onSuccess: () => invalidateProfileAndRecommendations(queryClient, id),
  });
}

export function useUpdateEducation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (education: UpdateEducation) =>
      employeeRepository.updateEducation(education),
    onSuccess: () => invalidateProfileAndRecommendations(queryClient, id),
  });
}

export function useTimezones() {
  return useQuery({
    queryKey: employeeKeys.timezones,
    queryFn: () => employeeRepository.timezones(),
  });
}
