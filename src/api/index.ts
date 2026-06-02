import { EmployeeRepository } from "@/features/employees/repo/employee-repository";
import { userRepositorySupabase } from "@/features/employees/repo/employee-repository.supabase";
import { employeeRepositoryRest } from "@/features/employees/repo/rest/employee-repository.rest";

enum ApiProvider {
  subapase = "supabase",
  dedicated = "dedicated",
}

const serviceProvider =
  import.meta.env.VITE_API_PROVIDER || ("supabase" as ApiProvider);

const getProvider = (provider: ApiProvider) => {
  switch (provider) {
    case ApiProvider.subapase:
      return userRepositorySupabase;
    case ApiProvider.dedicated:
      return employeeRepositoryRest;
    default:
      return employeeRepositoryRest;
  }
};

const employeeRepository: EmployeeRepository = getProvider(serviceProvider);

export { employeeRepository };
