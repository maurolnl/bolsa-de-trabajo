import {
  operatingSystemOptions,
  yearsOfExperienceOptions,
} from "../../forms/utils";
import { Employee, InternetConnection } from "../../models/Employee";
import {
  CreateAvailability,
  CreateEducation,
  CreateEmployee,
  CreateLocation,
  CreateTech,
} from "../employee-repository";
import {
  CreateAvailabilityRequest,
  CreateEducationRequest,
  CreateEmployeeRequest,
  CreateLocationRequest,
  CreateTechRequest,
  EmployeeResponse,
  InternetConnectionSpeedRequest,
  InternetConnectionTypeRequest,
} from "./types";

const mapYearsOfExperience = (
  yearsOfExperience: EmployeeResponse["years_of_experience"],
): Employee["yearsOfExperience"] => {
  const map: Record<
    EmployeeResponse["years_of_experience"],
    (typeof yearsOfExperienceOptions)[number]
  > = {
    less_1y: "Menos de 1 año",
    "1y": "1 año",
    "2_to_5y": "2 a 5 años",
    "5_to_10y": "5 a 10 años",
    more_10y: "Mas de 10 años",
  };

  return map[yearsOfExperience];
};

const mapInternetTypeResponse = (
  type: InternetConnectionTypeRequest,
): InternetConnection["type"] => {
  const map: Record<InternetConnectionTypeRequest, InternetConnection["type"]> =
    {
      fiber: "Fibra",
      wifi: "Aire / Wifi",
      coaxial: "Cable coaxial",
      adsl: "ADSL",
      mobile: "Móvil",
    };

  return map[type];
};

const mapInternetSpeedResponse = (
  speed: InternetConnectionSpeedRequest,
): InternetConnection["speed"] => {
  const map: Record<
    InternetConnectionSpeedRequest,
    InternetConnection["speed"]
  > = {
    less_10mb: "< 10Mbps",
    "20mb": "20Mbps",
    "30mb": "30Mbps",
    "40mb": "40Mbps",
    more_50mb: "> 50Mbps",
  };

  return map[speed];
};

const mapOperatingSystemResponse = (
  operatingSystem: EmployeeResponse["os"],
): Employee["operatingSystem"] => {
  if (!operatingSystem) return null;

  return operatingSystemOptions.includes(
    operatingSystem as (typeof operatingSystemOptions)[number],
  )
    ? (operatingSystem as Employee["operatingSystem"])
    : "Otro";
};

export const getEmployeeMapper = (x: EmployeeResponse): Employee => ({
  id: x.id,
  position: x.position,
  role: x.role,
  yearsOfExperience: mapYearsOfExperience(x.years_of_experience),
  certifications: x.certifications,
  certificationFiles: x.certifications_files,
  portfolioUrl: x.portfolio_url,
  internetConnections: x.internet_connections.map((conn) => ({
    type: mapInternetTypeResponse(conn.type),
    speed: mapInternetSpeedResponse(conn.speed),
  })),
  timezoneCompatibility: x.timezone,
  operatingSystem: mapOperatingSystemResponse(x.os),
  paidSoftware: x.paid_software,
  availableHoursPerDay: x.available_hours_per_day,
  compatibleProjects: x.compatible_projects,
  incompatibleProjects: x.incompatible_projects,
  educationTitles: x.education.map((e) => ({
    ...e,
    type: e.education_type,
    document: e.certification,
  })),
});

export const mapEmployee = (e: CreateEmployee): CreateEmployeeRequest => {
  const yoe: Record<
    (typeof yearsOfExperienceOptions)[number],
    CreateEmployeeRequest["years_of_experience"]
  > = {
    "Menos de 1 año": "less_1y",
    "1 año": "1y",
    "2 a 5 años": "2_to_5y",
    "5 a 10 años": "5_to_10y",
    "Mas de 10 años": "more_10y",
  };
  return {
    position: e.position,
    role: e.role,
    years_of_experience: yoe[e.yearsOfExperience],
    certifications: e.certifications,
    certifications_files: e.certificationFiles,
    portfolio_url: e.portfolioUrl,
  };
};

export const mapEmployeeFormData = (e: CreateEmployee): FormData => {
  const payload = mapEmployee(e);
  const formData = new FormData();

  formData.append("position", payload.position);
  formData.append("role", payload.role);
  formData.append("years_of_experience", payload.years_of_experience);

  if (payload.portfolio_url) {
    formData.append("portfolio_url", payload.portfolio_url);
  }

  payload.certifications.forEach((certification) => {
    formData.append("certifications[]", certification);
  });

  payload.certifications_files.forEach((file) => {
    formData.append("certifications_files", file);
  });

  return formData;
};

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

export const mapEmployeeEducationFormData = (e: CreateEducation): FormData => {
  const payload = mapEmployeeEducation(e);
  const formData = new FormData();

  const education = {
    education_titles: payload.education_titles.map((educationTitle, index) => {
      const document = educationTitle?.document;
      const documentFieldName = document
        ? `education_document_${index}`
        : undefined;

      if (document && documentFieldName) {
        formData.append(documentFieldName, document);
      }

      return {
        title: educationTitle.title,
        status: educationTitle.status,
        type: educationTitle.type,
        document: documentFieldName,
      };
    }),
  };

  formData.append("education", JSON.stringify(education));

  return formData;
};
