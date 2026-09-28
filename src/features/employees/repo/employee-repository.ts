import {
  Availability,
  BaseEmployee,
  EducationTitles,
  Location,
  Employee,
  ID,
  Tech,
} from "../models/Employee";
import { DownloadUrl, EmployeeProfile } from "../models/employee-profile";
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

  // Lectura del perfil completo por identificador de empleado. Es distinta de `getById`, que
  // lee el perfil propio por identificador de usuario y devuelve otro contrato: acá los
  // archivos vienen identificados y sin ubicación. La autoriza el backend, que admite al
  // propio empleado y al empleador con recomendación vigente.
  getEmployeeProfileById(employeeId: number): Promise<EmployeeProfile>;

  // Las dos entregas de archivo. Devuelven una URL prefirmada de un solo uso que el llamador
  // MUST consumir en el acto: no se cachea, no se guarda en estado y no se escribe en el DOM.
  getCertificateDownloadUrl(
    employeeId: number,
    fileId: number,
  ): Promise<DownloadUrl>;
  getEducationDocumentDownloadUrl(
    employeeId: number,
    educationId: number,
  ): Promise<DownloadUrl>;
};
