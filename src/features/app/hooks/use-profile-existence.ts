import { employerRepository } from "@/api";
import { UserRole } from "@/features/auth/types";
import {
  employeeKeys,
  getEmployeeProfile,
} from "@/features/employees/hooks/useEmployee";
import {
  employerKeys,
  isMissingEmployerProfileError,
} from "@/features/employers/hooks/use-employer";
import { useQuery } from "@tanstack/react-query";

// Cada feature clasifica la ausencia de su propio perfil: acá solo se elige cuál según el
// rol. Duplicar el criterio dejaría que las dos definiciones se separaran sin que nada lo
// note, y la query key es compartida con las pantallas que leen ese mismo perfil.
const getProfile = async (userId: number, role: UserRole) => {
  if (role === "employee") {
    return getEmployeeProfile(userId);
  }

  try {
    return await employerRepository.getByUserId(userId);
  } catch (error) {
    if (isMissingEmployerProfileError(error)) return null;
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
