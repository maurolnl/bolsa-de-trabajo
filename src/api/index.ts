import { EmployeeRepository } from "@/features/employees/repo/employee-repository";
import { employeeRepositoryRest } from "@/features/employees/repo/rest/employee-repository.rest";

const employeeRepository: EmployeeRepository = employeeRepositoryRest;

export { employeeRepository };
