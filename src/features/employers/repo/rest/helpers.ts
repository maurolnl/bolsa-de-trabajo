import { CreateEmployer, Employer } from "../../models/employer";

import { CreateEmployerRequest, EmployerResponse } from "./types";

export const mapEmployerResponse = (employer: EmployerResponse): Employer => ({
  id: employer.id,
  userId: employer.user_id,
  name: employer.name,
  industry: employer.industry,
  location: employer.location,
  hiringModalities: employer.hiring_modalities,
  createdAt: employer.created_at,
  updatedAt: employer.updated_at,
});

export const mapCreateEmployer = (
  employer: CreateEmployer,
): CreateEmployerRequest => ({
  name: employer.name,
  industry: employer.industry,
  location: employer.location,
  hiring_modalities: employer.hiringModalities,
});
