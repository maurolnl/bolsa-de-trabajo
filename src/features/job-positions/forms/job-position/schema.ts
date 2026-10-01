import {
  educationTypeOptions,
  roleOptions,
} from "@/features/employees/forms/utils";
import { z } from "zod";

import {
  MAX_AVAILABLE_HOURS_PER_DAY,
  MIN_AVAILABLE_HOURS_PER_DAY,
  requiredExperienceValues,
} from "./options";

const requiredText = (message: string) => z.string().trim().min(1, message);

export const jobPositionSchema = z.object({
  position: requiredText("Ingresar la posición"),
  role: z.enum(roleOptions, {
    required_error: "Seleccionar un rol",
    invalid_type_error: "Opción no válida",
  }),
  requiredExperience: z.enum(requiredExperienceValues, {
    required_error: "Seleccionar la experiencia requerida",
    invalid_type_error: "Opción no válida",
  }),
  requiredEducationLevel: z.enum(educationTypeOptions, {
    required_error: "Seleccionar el nivel educativo pretendido",
    invalid_type_error: "Opción no válida",
  }),
  availableHoursPerDay: z
    .number({
      required_error: "Seleccionar las horas disponibles por día",
      invalid_type_error: "Opción no válida",
    })
    .int("Las horas disponibles deben ser un número entero")
    .min(
      MIN_AVAILABLE_HOURS_PER_DAY,
      `Las horas disponibles deben ser al menos ${MIN_AVAILABLE_HOURS_PER_DAY}`,
    )
    .max(
      MAX_AVAILABLE_HOURS_PER_DAY,
      `Las horas disponibles no pueden superar ${MAX_AVAILABLE_HOURS_PER_DAY}`,
    ),
  timezone: z
    .string({
      required_error: "Seleccionar una zona horaria",
      invalid_type_error: "Opción no válida",
    })
    .trim()
    .min(1, "Seleccionar una zona horaria"),
  technicalResources: z.array(
    requiredText("Los recursos técnicos no pueden estar vacíos"),
  ),
});

export type JobPositionFormValues = z.infer<typeof jobPositionSchema>;
