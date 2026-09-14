import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import {
  authRepository,
  LoginCredentials,
  RegisterCredentials,
} from "../repo/auth";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("useAuthContext context must be use inside AuthProvider");

  return context;
};

const keys = {
  user: ["user"],
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) =>
      authRepository.login(credentials),
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) =>
      authRepository.register(credentials),
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: keys.user,
    queryFn: () => authRepository.getCurrentUser(),
  });
};
