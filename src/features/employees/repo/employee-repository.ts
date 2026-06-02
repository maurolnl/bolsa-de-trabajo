import {
  Availability,
  BaseEmployee,
  EducationTitles,
  Location,
  Employee,
  ID,
  Tech,
} from "../models/Employee";
import { Timezone } from "./types";

export type CreateEmployee = BaseEmployee;
export type CreateLocation = Location & ID;
export type CreateTech = Tech & ID;
export type CreateAvailability = Availability & ID;
export type CreateEducation = EducationTitles & ID;

export type EmployeeRepository = {
  getAll: () => Promise<Employee[]>;
  getById(id: number): Promise<Employee | null>;
  createEmployee(employee: CreateEmployee): Promise<void>;
  createLocation(employee: CreateLocation): Promise<void>;
  createTech(employee: CreateTech): Promise<void>;
  createAvailability(employee: CreateAvailability): Promise<void>;
  createEducation(employee: CreateEducation): Promise<void>;
  timezones: () => Promise<Timezone[]>;
};
