import { EmployeeRepository } from "@/features/employees/repo/employee-repository";
import { employeeRepositoryRest } from "@/features/employees/repo/rest/employee-repository.rest";
import { EmployerRepository } from "@/features/employers/repo/employer-repository";
import { employerRepositoryRest } from "@/features/employers/repo/rest/employer-repository.rest";
import { JobPositionRepository } from "@/features/job-positions/repo/job-position-repository";
import { jobPositionRepositoryRest } from "@/features/job-positions/repo/rest/job-position-repository.rest";

const employeeRepository: EmployeeRepository = employeeRepositoryRest;
const employerRepository: EmployerRepository = employerRepositoryRest;
const jobPositionRepository: JobPositionRepository = jobPositionRepositoryRest;

export { employeeRepository, employerRepository, jobPositionRepository };
