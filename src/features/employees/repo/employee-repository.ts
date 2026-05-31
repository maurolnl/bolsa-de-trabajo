import {
  internetConnectionOptions,
  internetConnectionTypeOptions,
} from "../forms/utils";
import { Timezone } from "./types";

export type BaseEmployee = {
  position: string;
  role: string;
  yearsOfExperience: string;
  certifications: string[];
  certification_files: string[];
  portfolioUrl: string | null;
};

export type Location = {
  timezoneCompatibility: string;
  internetConnections: InternetConnection[];
};

export type InternetConnection = {
  type: (typeof internetConnectionTypeOptions)[number];
  speed: (typeof internetConnectionOptions)[number];
};

export type Tech = {
  operatingSystem: "Windows" | "iOS" | "Linux Distribution" | "Otro";
  paidSoftware: string[];
};

export type Availability = {
  availableHoursPerDay: number;
  compatibleProjects: number;
  incompatibleProjects: number;
};

export type EducationTitles = {
  educationTitles: Education[];
};

export type Education = {
  title: string;
  status: "completed" | "in-progress";
  type: "university" | "postgraduate" | "high-school-orientation" | "tertiary";
  document: File;
};

type ID = {
  employeeID: number;
};
export type Employee = BaseEmployee &
  Location &
  Tech &
  Availability &
  EducationTitles;
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
