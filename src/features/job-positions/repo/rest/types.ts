import {
  RequiredEducationLevel,
  RequiredExperience,
} from "../../models/job-position";

export type CreateJobPositionRequest = {
  position: string;
  role: string;
  required_experience: RequiredExperience;
  required_education_level: RequiredEducationLevel;
  available_hours_per_day: number;
  technical_resources: string[];
  timezone: string;
};

export type UpdateJobPositionRequest = CreateJobPositionRequest;

export type JobPositionResponse = CreateJobPositionRequest & {
  id: number;
  employer_id: number;
  created_at: string;
  updated_at: string;
};
