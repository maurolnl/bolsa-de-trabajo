import { supabase } from "@/api/clients/supabase-client";
import { Timezone, User } from "./types";
import { CreateEmployee, EmployeeRepository } from "./employee-repository";

const getUserMapper = (x: any): User => ({
  ...x,
});

const userTable = "User";

export const userRepositorySupabase: EmployeeRepository = {
  getAll: async (): Promise<User[]> => {
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
      .insert(user)
      .select()
      .single();
    if (error) throw error;
  },
  timezones: async () => {
    const { data, error } = await supabase.rpc("get_timezones");

    if (error) throw error;

    return data as Timezone[];
  },
};
