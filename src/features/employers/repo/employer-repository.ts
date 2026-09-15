import { CreateEmployer, Employer } from "../models/employer";

export type EmployerRepository = {
  getByUserId(userId: number): Promise<Employer>;
  createEmployer(employer: CreateEmployer): Promise<void>;
};
