import { employeeRepository, employerRepository } from "@/api";
import { UserRole } from "@/features/auth/types";
import { employeeKeys } from "@/features/employees/hooks/useEmployee";
import {
  employerKeys,
  isMissingEmployerProfileError,
} from "@/features/employers/hooks/use-employer";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type ErrorResponse = {
  error?: unknown;
};

const isMissingProfileError = (error: unknown, role: UserRole) => {
  if (!axios.isAxiosError<ErrorResponse>(error)) return false;

  if (role === "employee") {
    return (
      error.response?.status === 400 &&
      error.response.data?.error === "employee not found"
    );
  }

  return isMissingEmployerProfileError(error);
};

const getProfile = async (userId: number, role: UserRole) => {
  try {
    if (role === "employee") {
      return await employeeRepository.getById(userId);
    }

    return await employerRepository.getByUserId(userId);
  } catch (error) {
    if (isMissingProfileError(error, role)) return null;
    throw error;
  }
};

export const useProfileExistence = (
  userId: string | number | undefined,
  role: UserRole | null,
) => {
  const numericUserId = Number(userId);
  const canQuery = Boolean(role) && Number.isFinite(numericUserId);

  return useQuery({
    queryKey:
      role === "employee"
        ? employeeKeys.employee(numericUserId)
        : employerKeys.employer(numericUserId),
    queryFn: () => getProfile(numericUserId, role as UserRole),
    enabled: canQuery,
    select: (profile): "missing" | "exists" =>
      profile === null ? "missing" : "exists",
  });
};
