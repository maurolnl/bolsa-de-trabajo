import { CreateJobPosition, JobPosition } from "../../models/job-position";

import { CreateJobPositionRequest, JobPositionResponse } from "./types";

export const mapJobPositionResponse = (
  jobPosition: JobPositionResponse,
): JobPosition => ({
  id: jobPosition.id,
  employerId: jobPosition.employer_id,
  position: jobPosition.position,
  role: jobPosition.role,
  requiredExperience: jobPosition.required_experience,
  requiredEducationLevel: jobPosition.required_education_level,
  availableHoursPerDay: jobPosition.available_hours_per_day,
  timezone: jobPosition.timezone,
  technicalResources: jobPosition.technical_resources ?? [],
  createdAt: jobPosition.created_at,
  updatedAt: jobPosition.updated_at,
});

// La API acepta null y lo normaliza a lista, pero nunca lo devuelve: enviar siempre un
// array deja una sola representación del conjunto vacío a ambos lados del contrato.
export const mapCreateJobPosition = (
  jobPosition: CreateJobPosition,
): CreateJobPositionRequest => ({
  position: jobPosition.position,
  role: jobPosition.role,
  required_experience: jobPosition.requiredExperience,
  required_education_level: jobPosition.requiredEducationLevel,
  available_hours_per_day: jobPosition.availableHoursPerDay,
  technical_resources: jobPosition.technicalResources,
  timezone: jobPosition.timezone,
});
