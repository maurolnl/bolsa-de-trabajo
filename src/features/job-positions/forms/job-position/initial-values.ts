import { DefaultValues } from "react-hook-form";

import { JobPosition } from "../../models/job-position";
import { jobRoleOptions } from "./options";
import { JobPositionFormValues } from "./schema";

// Los enums y las horas quedan sin valor para que la validación exija una selección
// explícita en vez de aceptar un default arbitrario.
export const emptyJobPositionValues: DefaultValues<JobPositionFormValues> = {
  position: "",
  technicalResources: [],
};

// La API acepta `role` como texto libre, pero el formulario lo restringe al catálogo
// compartido con el perfil de empleado. Un valor fuera de ese catálogo se descarta en vez
// de precargar un select con una opción inexistente.
const toFormRole = (role: string): JobPositionFormValues["role"] | undefined =>
  jobRoleOptions.find((option) => option === role);

export const jobPositionToFormValues = (
  jobPosition: JobPosition,
): DefaultValues<JobPositionFormValues> => ({
  position: jobPosition.position,
  role: toFormRole(jobPosition.role),
  requiredExperience: jobPosition.requiredExperience,
  requiredEducationLevel: jobPosition.requiredEducationLevel,
  availableHoursPerDay: jobPosition.availableHoursPerDay,
  timezone: jobPosition.timezone,
  technicalResources: jobPosition.technicalResources,
});
