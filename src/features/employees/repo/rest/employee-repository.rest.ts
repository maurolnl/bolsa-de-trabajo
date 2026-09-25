import { httpClient } from "@/core/services/httpClient";
import {
  getEmployeeMapper,
  mapEmployeeAvailability,
  mapEmployeeEducationFormData,
  mapEmployeeFormData,
  mapEmployeeLocation,
  mapEmployeeTech,
} from "./helpers";
import {
  mapDownloadUrlResponse,
  mapEmployeeProfileResponse,
} from "./profile-helpers";
import {
  CreateEmployee,
  CreateLocation,
  CreateTech,
  EmployeeRepository,
  CreateAvailability,
  CreateEducation,
  UpdateAvailability,
  UpdateEducation,
  UpdateEmployee,
  UpdateLocation,
  UpdateTech,
} from "../employee-repository";
import { Timezone } from "../types";
import { DownloadUrlResponse, EmployeeProfileResponse } from "./types";

export const employeeRepositoryRest: EmployeeRepository = {
  getAll: async () => {
    const { data } = await httpClient.get("employees");
    return data?.map(getEmployeeMapper) || [];
  },
  getById: async (userID: number) => {
    const { data } = await httpClient.get(`users/${userID}/employee`);
    return data ? getEmployeeMapper(data) : null;
  },
  createEmployee: async (e: CreateEmployee) =>
    httpClient.post(`employees`, mapEmployeeFormData(e)),
  updateEmployee: async (e: UpdateEmployee) =>
    httpClient.put(`employees/${e.employeeID}`, mapEmployeeFormData(e)),
  createLocation: async (e: CreateLocation) =>
    httpClient.post(
      `employees/${e.employeeID}/location`,
      mapEmployeeLocation(e),
    ),
  updateLocation: async (e: UpdateLocation) =>
    httpClient.put(
      `employees/${e.employeeID}/location`,
      mapEmployeeLocation(e),
    ),
  createTech: async (e: CreateTech) =>
    httpClient.post(`employees/${e.employeeID}/tech`, mapEmployeeTech(e)),
  updateTech: async (e: UpdateTech) =>
    httpClient.put(`employees/${e.employeeID}/tech`, mapEmployeeTech(e)),
  createAvailability: async (e: CreateAvailability) =>
    httpClient.post(
      `employees/${e.employeeID}/availability`,
      mapEmployeeAvailability(e),
    ),
  updateAvailability: async (e: UpdateAvailability) =>
    httpClient.put(
      `employees/${e.employeeID}/availability`,
      mapEmployeeAvailability(e),
    ),
  createEducation: async (e: CreateEducation) =>
    httpClient.post(
      `employees/${e.employeeID}/education`,
      mapEmployeeEducationFormData(e),
    ),
  updateEducation: async (e: UpdateEducation) =>
    httpClient.put(
      `employees/${e.employeeID}/education`,
      mapEmployeeEducationFormData(e),
    ),
  timezones: async () => {
    const { data } = await httpClient.get("timezones");
    return data as Timezone[];
  },
  getEmployeeProfileById: async (employeeId) => {
    const { data } = await httpClient.get<EmployeeProfileResponse>(
      `employees/${employeeId}`,
    );
    return mapEmployeeProfileResponse(data);
  },
  // Las dos entregas devuelven la URL sin almacenarla en ningún lado. Quien las llama la
  // consume dentro del mismo handler: son funciones, no consultas montadas, justamente para
  // que no exista una caché donde la URL pueda sobrevivir al clic.
  getCertificateDownloadUrl: async (employeeId, fileId) => {
    const { data } = await httpClient.get<DownloadUrlResponse>(
      `employees/${employeeId}/files/${fileId}/download-url`,
    );
    return mapDownloadUrlResponse(data);
  },
  getEducationDocumentDownloadUrl: async (employeeId, educationId) => {
    const { data } = await httpClient.get<DownloadUrlResponse>(
      `employees/${employeeId}/education-documents/${educationId}/download-url`,
    );
    return mapDownloadUrlResponse(data);
  },
};
