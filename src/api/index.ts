import { EmployeeRepository } from "@/features/employees/repo/employee-repository";
import { employeeRepositoryRest } from "@/features/employees/repo/rest/employee-repository.rest";
import { EmployerRepository } from "@/features/employers/repo/employer-repository";
import { employerRepositoryRest } from "@/features/employers/repo/rest/employer-repository.rest";

const employeeRepository: EmployeeRepository = employeeRepositoryRest;
const employerRepository: EmployerRepository = employerRepositoryRest;

export { employeeRepository, employerRepository };
