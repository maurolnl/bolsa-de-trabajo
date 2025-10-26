import { supabase } from "@/api/clients/supabase-client";
import { User, UserRepository } from "./user-repository";

const getUserMapper = (x: any): User => ({
  ...x,
})

export const userRepositoryRest: UserRepository = {
  getAll: async () => {
    const { data, error } = await supabase.from('user').select();
    if (error) throw error;
    return data?.map(getUserMapper) || [];
  },
  getById: async (id: number) => {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single();
    if (error) throw error;
    return getUserMapper(data);
  },
  create: async (user) => {
    const { error } = await supabase.from("users").insert(user).select().single();
    if (error) throw error;
  }
}
