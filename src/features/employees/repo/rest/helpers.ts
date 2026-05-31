import {
  CreateAvailability,
  CreateEducation,
  CreateEmployee,
  CreateLocation,
  CreateTech,
  Employee,
  InternetConnection,
} from "../employee-repository";
import {
  CreateAvailabilityRequest,
  CreateEducationRequest,
  CreateEmployeeRequest,
  CreateLocationRequest,
  CreateTechRequest,
  InternetConnectionTypeRequest,
} from "./types";

export const getEmployeeMapper = (x: Employee): Employee => ({
  ...x,
});

export const mapEmployee = (e: CreateEmployee): CreateEmployeeRequest => ({
  position: e.position,
  role: e.role,
  years_of_experience:
    e.yearsOfExperience as CreateEmployeeRequest["years_of_experience"],
  certifications: e.certifications,
  certification_files: e.certification_files as unknown as File[],
  portfolio_url: e.portfolioUrl,
});

const mapInternetType = (
  type: InternetConnection["type"],
): InternetConnectionTypeRequest => {
  const map: Record<InternetConnection["type"], InternetConnectionTypeRequest> =
    {
      Fibra: "fiber",
      "Aire / Wifi": "wifi",
      "Cable coaxial": "coaxial",
      ADSL: "adsl",
      Móvil: "mobile",
    };
  return map[type];
};

const mapInternetSpeed = (
  speed: CreateLocation["internetConnections"][number]["speed"],
): CreateLocationRequest["internet_connections"][number]["speed"] => {
  const map: Record<
    string,
    CreateLocationRequest["internet_connections"][number]["speed"]
  > = {
    "< 10Mbps": "less_10mb",
    "20Mbps": "20mb",
    "30Mbps": "30mb",
    "40Mbps": "40mb",
    "> 50Mbps": "more_50mb",
  };
  return map[speed];
};

export const mapEmployeeLocation = (
  e: CreateLocation,
): CreateLocationRequest => ({
  internet_connections: e.internetConnections.map((conn) => ({
    type: mapInternetType(conn.type),
    speed: mapInternetSpeed(conn.speed),
  })),
  timezone: e.timezoneCompatibility,
});

export const mapEmployeeTech = (e: CreateTech): CreateTechRequest => ({
  os: e.operatingSystem,
  paid_software: e.paidSoftware,
});

export const mapEmployeeAvailability = (
  e: CreateAvailability,
): CreateAvailabilityRequest => ({
  available_hours_per_day: e.availableHoursPerDay,
  compatible_projects: e.compatibleProjects,
  incompatible_projects: e.incompatibleProjects,
});

export const mapEmployeeEducation = (
  e: CreateEducation,
): CreateEducationRequest => ({
  education_titles: e.educationTitles.map((edu) => ({
    title: edu.title,
    status: edu.status,
    type: edu.type as CreateEducationRequest["education_titles"][number]["type"],
    document: edu.document,
  })),
});
