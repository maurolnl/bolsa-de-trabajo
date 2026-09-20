import { EducationType } from "@/features/employees/forms/utils";
import { CreateEmployeeRequest } from "@/features/employees/repo/rest/types";

// La experiencia requerida y el nivel educativo pretendido de un puesto comparten dominio
// con los del perfil de empleado: derivarlos de esos tipos evita que las dos features se
// separen sin que el typecheck lo note.
export type RequiredExperience = CreateEmployeeRequest["years_of_experience"];
export type RequiredEducationLevel = EducationType;

export type JobPosition = {
  id: number;
  employerId: number;
  position: string;
  role: string;
  requiredExperience: RequiredExperience;
  requiredEducationLevel: RequiredEducationLevel;
  availableHoursPerDay: number;
  timezone: string;
  technicalResources: string[];
  createdAt: string;
  updatedAt: string;
};

// La API reemplaza el puesto entero al editar, por lo que el alta y la edición comparten
// exactamente el mismo cuerpo.
export type CreateJobPosition = Pick<
  JobPosition,
  | "position"
  | "role"
  | "requiredExperience"
  | "requiredEducationLevel"
  | "availableHoursPerDay"
  | "timezone"
  | "technicalResources"
>;

export type UpdateJobPosition = CreateJobPosition;
