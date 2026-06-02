import { userRepository } from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateAvailability,
  CreateEducation,
  CreateEmployee,
  CreateLocation,
  CreateTech,
} from "../repo/employee-repository";

export function useEmployees() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => userRepository.getAll(),
  });
}

export function useUser(id?: number) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => userRepository.getById(id as number),
    enabled: typeof id === "number" && !Number.isNaN(id),
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser: CreateEmployee) =>
      userRepository.createEmployee(newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newLocation: CreateLocation) =>
      userRepository.createLocation(newLocation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useCreateTech() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTech: CreateTech) =>
      userRepository.createTech(newTech),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useCreateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAvailability: CreateAvailability) =>
      userRepository.createAvailability(newAvailability),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useCreateEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEducation: CreateEducation) =>
      userRepository.createEducation(newEducation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useTimezones() {
  return useQuery({
    queryKey: ["timezones"],
    queryFn: () => userRepository.timezones(),
  });
}
