import { httpClient } from "@/core/services/httpClient";
import {
  getEmployeeMapper,
  mapEmployee,
  mapEmployeeAvailability,
  mapEmployeeEducation,
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
} from "../employee-repository";
import { Timezone } from "../types";

export const employeeRepositoryRest: EmployeeRepository = {
  getAll: async () => {
    const { data } = await httpClient.get("employees");
    return data?.map(getEmployeeMapper) || [];
  },
  getById: async (id: number) => {
    const { data } = await httpClient.get(`employees/${id}`);
    return getEmployeeMapper(data);
  },
  createEmployee: async (e: CreateEmployee) =>
    httpClient.post(`employees`, mapEmployee(e)),
  createLocation: async (e: CreateLocation) =>
    httpClient.post(`employees/${e.employeeID}`, mapEmployeeLocation(e)),
  createTech: async (e: CreateTech) =>
    httpClient.post(`employees/${e.employeeID}`, mapEmployeeTech(e)),
  createAvailability: async (e: CreateAvailability) =>
    httpClient.post(`employees/${e.employeeID}`, mapEmployeeAvailability(e)),
  createEducation: async (e: CreateEducation) =>
    httpClient.post(`employees/${e.employeeID}`, mapEmployeeEducation(e)),
  timezones: async () => {
    const { data } = await httpClient.get("timezones");
    return data as Timezone[];
  },
};
