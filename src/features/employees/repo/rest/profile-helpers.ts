import {
  DownloadUrl,
  EmployeeProfile,
} from "../../models/employee-profile";
import { DownloadUrlResponse, EmployeeProfileResponse } from "./types";

// Los códigos del backend se preservan tal como llegan: la traducción a etiquetas en español
// es una decisión de presentación y vive en `utils/profile-labels.ts`, donde un código
// desconocido se muestra en lugar de desaparecer. Mapear acá obligaría a elegir un valor de
// reemplazo antes de saber en qué contexto se va a mostrar.
export const mapEmployeeProfileResponse = (
  profile: EmployeeProfileResponse,
): EmployeeProfile => ({
  id: profile.id,
  userId: profile.user_id,
  email: profile.email ?? null,
  position: profile.position,
  role: profile.role,
  yearsOfExperience: profile.years_of_experience,
  certifications: profile.certifications ?? [],
  portfolioUrl: profile.portfolio_url ?? null,
  timezone: profile.timezone,
  os: profile.os,
  paidSoftware: profile.paid_software ?? [],
  availableHoursPerDay: profile.available_hours_per_day,
  compatibleProjects: profile.compatible_projects,
  incompatibleProjects: profile.incompatible_projects,
  internetConnections: (profile.internet_connections ?? []).map((connection) => ({
    type: connection.type,
    speed: connection.speed,
  })),
  education: (profile.education ?? []).map((education) => ({
    educationType: education.education_type,
    title: education.title,
    status: education.status,
    certificationDocumentId: education.certification_document_id,
  })),
  files: (profile.files ?? []).map((file) => ({
    id: file.id,
    title: file.title,
  })),
  createdAt: profile.created_at,
  updatedAt: profile.updated_at,
});

export const mapDownloadUrlResponse = (
  response: DownloadUrlResponse,
): DownloadUrl => ({
  url: response.url,
  expiresAt: response.expires_at,
});
