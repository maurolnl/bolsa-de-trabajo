import { CreateJobPosition, JobPosition, UpdateJobPosition } from "../models/job-position";

export type JobPositionRepository = {
  createJobPosition(
    employerId: number,
    jobPosition: CreateJobPosition,
  ): Promise<JobPosition>;
  getJobPosition(jobPositionId: number): Promise<JobPosition>;
  updateJobPosition(
    jobPositionId: number,
    jobPosition: UpdateJobPosition,
  ): Promise<JobPosition>;
};
