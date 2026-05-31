import { userRepository } from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateEmployee } from "../repo/employee-repository";

export function useEmployees() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => userRepository.getAll(),
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => userRepository.getById(id),
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

export function useTimezones() {
  return useQuery({
    queryKey: ["timezones"],
    queryFn: () => userRepository.timezones(),
  });
}
