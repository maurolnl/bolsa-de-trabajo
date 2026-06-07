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
};
