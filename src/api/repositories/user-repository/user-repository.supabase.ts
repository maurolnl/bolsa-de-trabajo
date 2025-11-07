import { supabase } from "@/api/clients/supabase-client";
import { Timezone, User, UserRepository } from "./user-repository";

const getUserMapper = (x: any): User => ({
  ...x,
});

const userTable = "User";

export const userRepositorySupabase: UserRepository = {
  getAll: async () => {
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
  create: async (user) => {
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
