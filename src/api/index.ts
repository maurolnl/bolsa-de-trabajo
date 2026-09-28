import { EmployeeRepository } from "@/features/employees/repo/employee-repository";
import { employeeRepositoryRest } from "@/features/employees/repo/rest/employee-repository.rest";
import { EmployerRepository } from "@/features/employers/repo/employer-repository";
import { employerRepositoryRest } from "@/features/employers/repo/rest/employer-repository.rest";
import { JobPositionRepository } from "@/features/job-positions/repo/job-position-repository";
import { jobPositionRepositoryRest } from "@/features/job-positions/repo/rest/job-position-repository.rest";
import { RecommendationRepository } from "@/features/recommendations/repo/recommendation-repository";
import { jobRecommendationRepositoryRest } from "@/features/job-recommendations/repo/rest/job-recommendation-repository.rest";
import { employeeRecommendationRepositoryRest } from "@/features/employee-recommendations/repo/rest/employee-recommendation-repository.rest";

const employeeRepository: EmployeeRepository = employeeRepositoryRest;
const employerRepository: EmployerRepository = employerRepositoryRest;
const jobPositionRepository: JobPositionRepository = jobPositionRepositoryRest;

// Los dos sentidos de la recomendación comparten interfaz pero no adaptador: cada uno vive
// junto a la feature que lo consume y acá se componen en el único repositorio que el resto de
// la aplicación conoce.
const recommendationRepository: RecommendationRepository = {
  ...jobRecommendationRepositoryRest,
  ...employeeRecommendationRepositoryRest,
};

export {
  employeeRepository,
  employerRepository,
  jobPositionRepository,
  recommendationRepository,
};
