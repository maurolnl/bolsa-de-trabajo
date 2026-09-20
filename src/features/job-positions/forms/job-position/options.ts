import {
  educationTypeOptions,
  roleOptions,
  yearsOfExperienceOptions,
} from "@/features/employees/forms/utils";
import { educationTypeLabels } from "@/features/employees/forms/new-employee/steps/education-form/constants";

import {
  RequiredEducationLevel,
  RequiredExperience,
} from "../../models/job-position";

type Option<TValue extends string> = {
  value: TValue;
  label: string;
};

// `satisfies` fija estos códigos contra el contrato que ya usa el perfil de empleado: si
// el backend cambia el dominio, el typecheck falla acá en vez de a la primera petición.
export const requiredExperienceValues = [
  "less_1y",
  "1y",
  "2_to_5y",
  "5_to_10y",
  "more_10y",
] as const satisfies readonly RequiredExperience[];

// Las etiquetas se tipan contra las opciones del perfil de empleado para que las dos
// features no terminen mostrando vocabularios distintos para el mismo dominio.
export const requiredExperienceLabels: Record<
  RequiredExperience,
  (typeof yearsOfExperienceOptions)[number]
> = {
  less_1y: "Menos de 1 año",
  "1y": "1 año",
  "2_to_5y": "2 a 5 años",
  "5_to_10y": "5 a 10 años",
  more_10y: "Mas de 10 años",
};

export const requiredExperienceOptions: ReadonlyArray<
  Option<RequiredExperience>
> = requiredExperienceValues.map((value) => ({
  value,
  label: requiredExperienceLabels[value],
}));

export const requiredEducationLevelLabels = educationTypeLabels;

export const requiredEducationLevelOptions: ReadonlyArray<
  Option<RequiredEducationLevel>
> = educationTypeOptions.map((value) => ({
  value,
  label: requiredEducationLevelLabels[value],
}));

export const jobRoleOptions = roleOptions;

// El backend acepta entre 1 y 8 horas por día; el selector expone exactamente ese rango.
export const MIN_AVAILABLE_HOURS_PER_DAY = 1;
export const MAX_AVAILABLE_HOURS_PER_DAY = 8;

export const availableHoursPerDayOptions = Array.from(
  { length: MAX_AVAILABLE_HOURS_PER_DAY - MIN_AVAILABLE_HOURS_PER_DAY + 1 },
  (_, index) => MIN_AVAILABLE_HOURS_PER_DAY + index,
);
