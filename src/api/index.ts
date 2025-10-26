import { UserRepository } from "./repositories/user-repository/user-repository";
import { userRepositorySupabase } from "./repositories/user-repository/user-repository.rest";
import { userRepositoryRest } from "./repositories/user-repository/user-repository.supabase";

const serviceProvider = import.meta.env.VITE_API_PROVIDER || 'supabase';

let userRepository: UserRepository = serviceProvider === "supabase" ? userRepositorySupabase : userRepositoryRest;

export { userRepository }
