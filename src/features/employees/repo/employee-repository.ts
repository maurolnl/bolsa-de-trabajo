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
export type UpdateEmployee = BaseEmployee & ID;
export type CreateLocation = Location & ID;
export type UpdateLocation = CreateLocation;
export type CreateTech = Tech & ID;
export type UpdateTech = CreateTech;
export type CreateAvailability = Availability & ID;
export type UpdateAvailability = CreateAvailability;
export type CreateEducation = EducationTitles & ID;
export type UpdateEducation = CreateEducation;

export type EmployeeRepository = {
  getAll: () => Promise<Employee[]>;
  getById(id: number): Promise<Employee | null>;
  createEmployee(employee: CreateEmployee): Promise<void>;
  updateEmployee(employee: UpdateEmployee): Promise<void>;
  createLocation(employee: CreateLocation): Promise<void>;
  updateLocation(employee: UpdateLocation): Promise<void>;
  createTech(employee: CreateTech): Promise<void>;
  updateTech(employee: UpdateTech): Promise<void>;
  createAvailability(employee: CreateAvailability): Promise<void>;
  updateAvailability(employee: UpdateAvailability): Promise<void>;
  createEducation(employee: CreateEducation): Promise<void>;
  updateEducation(employee: UpdateEducation): Promise<void>;
  timezones: () => Promise<Timezone[]>;
};
