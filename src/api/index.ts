import { UserRepository } from "./repositories/user-repository/user-repository";
import { userRepositoryRest } from "./repositories/user-repository/user-repository.rest";
import { userRepositorySupabase } from "./repositories/user-repository/user-repository.supabase";

const serviceProvider = import.meta.env.VITE_API_PROVIDER || "supabase";

const userRepository: UserRepository =
  serviceProvider === "supabase" ? userRepositorySupabase : userRepositoryRest;

export { userRepository };
