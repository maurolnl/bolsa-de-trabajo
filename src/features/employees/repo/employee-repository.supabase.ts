import { supabase } from "@/api/clients/supabase-client";
import { Timezone } from "./types";
import { Employee } from "../models/Employee";
import {
  CreateEmployee,
  EmployeeRepository,
} from "./employee-repository";

const getUserMapper = (x: unknown): Employee => ({
  ...(x as Employee),
});

const unsupportedOperation = async () => {
  throw new Error("This operation is not supported by the Supabase provider");
};

const unsupportedCreateLocation: EmployeeRepository["createLocation"] = async () => {
  await unsupportedOperation();
};

const unsupportedCreateTech: EmployeeRepository["createTech"] = async () => {
  await unsupportedOperation();
};

const unsupportedCreateAvailability: EmployeeRepository["createAvailability"] = async () => {
  await unsupportedOperation();
};

const unsupportedCreateEducation: EmployeeRepository["createEducation"] = async () => {
  await unsupportedOperation();
};

const getCreateEmployeeMapper = (x: CreateEmployee): Omit<Employee, "id"> => ({
  ...x,
  timezoneCompatibility: "",
  internetConnections: [],
  operatingSystem: null,
  paidSoftware: [],
  availableHoursPerDay: 0,
  compatibleProjects: null,
  incompatibleProjects: null,
  educationTitles: [],
});

const userTable = "User";

export const userRepositorySupabase: EmployeeRepository = {
  getAll: async (): Promise<Employee[]> => {
    const { data, error } = await supabase.from(userTable).select();
    if (error) throw error;
    return data?.map(getUserMapper) || [];
  },
  getById: async (id: number) => {
    const { data, error } = await supabase
      .from(userTable)
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return getUserMapper(data);
  },
  createEmployee: async (user: CreateEmployee) => {
    const { error } = await supabase
      .from(userTable)
      .insert(getCreateEmployeeMapper(user))
      .select()
      .single();
    if (error) throw error;
  },
  createLocation: unsupportedCreateLocation,
  createTech: unsupportedCreateTech,
  createAvailability: unsupportedCreateAvailability,
  createEducation: unsupportedCreateEducation,
  timezones: async () => {
    const { data, error } = await supabase.rpc("get_timezones");

    if (error) throw error;

    return data as Timezone[];
  },
};
