import { employeeRepository } from "@/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// El backend responde 403 a toda falla de autorización del perfil —perfil ajeno, empleado
// inexistente y empleador sin vínculo de recomendación vigente— con un único mensaje, para
// que nadie pueda enumerar qué empleados existen recorriendo identificadores. El frontend
// respeta esa indistinción.
export const isForbiddenCandidateProfileError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 403;

export const candidateProfileKeys = {
  byEmployee: (employeeId: number) =>
    ["employee-profile", employeeId] as const,
};

// El perfil se consulta al abrir el panel y no junto con la página de candidatos: pedir los N
// perfiles de un tramo serían N peticiones para una pantalla en la que el empleador abre unos
// pocos. `employeeId` indefinido significa que no hay candidato abierto y no se pide nada.
export const useCandidateProfile = (employeeId: number | undefined) =>
  useQuery({
    queryKey: candidateProfileKeys.byEmployee(employeeId ?? 0),
    queryFn: () =>
      employeeRepository.getEmployeeProfileById(employeeId as number),
    enabled:
      employeeId !== undefined &&
      Number.isFinite(employeeId) &&
      employeeId > 0,
    // Un 403 no se resuelve reintentando: la API ya rechazó la lectura por autorización.
    retry: false,
  });
