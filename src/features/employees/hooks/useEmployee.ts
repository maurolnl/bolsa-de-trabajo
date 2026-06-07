import { employeeRepository } from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

const keys = {
  employees: ["employees"],
  employee: (id: number) => ["employees", id],
  timezones: ["timezones"],
};

export function useEmployees() {
  return useQuery({
    queryKey: keys.employees,
    queryFn: () => employeeRepository.getAll(),
  });
}

export function useEmployee(id: number) {
  return useQuery({
    queryKey: keys.employee(id),
    queryFn: () => employeeRepository.getById(id),
  });
}

export function useCreateEmployee(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser: CreateEmployee) =>
      employeeRepository.createEmployee(newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.employee(id) });
    },
  });
}

export function useUpdateEmployee(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employee: UpdateEmployee) =>
      employeeRepository.updateEmployee(employee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.employee(id) });
    },
  });
}

export function useCreateLocation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newLocation: CreateLocation) =>
      employeeRepository.createLocation(newLocation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.employee(id) });
    },
  });
}

export function useUpdateLocation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (location: UpdateLocation) =>
      employeeRepository.updateLocation(location),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.employee(id) });
    },
  });
}

export function useCreateTech(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTech: CreateTech) =>
      employeeRepository.createTech(newTech),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.employee(id) });
    },
  });
}

export function useUpdateTech(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tech: UpdateTech) => employeeRepository.updateTech(tech),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.employee(id) });
    },
  });
}

export function useCreateAvailability(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAvailability: CreateAvailability) =>
      employeeRepository.createAvailability(newAvailability),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.employee(id) });
    },
  });
}

export function useUpdateAvailability(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (availability: UpdateAvailability) =>
      employeeRepository.updateAvailability(availability),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.employee(id) });
    },
  });
}

export function useCreateEducation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEducation: CreateEducation) =>
      employeeRepository.createEducation(newEducation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.employee(id) });
    },
  });
}

export function useUpdateEducation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (education: UpdateEducation) =>
      employeeRepository.updateEducation(education),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.employee(id) });
    },
  });
}

export function useTimezones() {
  return useQuery({
    queryKey: keys.timezones,
    queryFn: () => employeeRepository.timezones(),
  });
}
