export type CreateEmployeeRequest = {
  position: string;
  role: string;
  years_of_experience: "less_1y" | "1y" | "2_to_5y" | "5_to_10y" | "more_10y";
  certifications: string[];
  certification_files: File[];
  portfolio_url: string | null;
};

export type InternetConnectionTypeRequest =
  | "fiber"
  | "wifi"
  | "coaxial"
  | "adsl"
  | "mobile";
export type InternetConnectionSpeedRequest =
  | "less_10mb"
  | "20mb"
  | "30mb"
  | "40mb"
  | "more_50mb";

export type CreateLocationRequest = {
  internet_connections: {
    type: InternetConnectionTypeRequest;
    speed: InternetConnectionSpeedRequest;
  }[];
  timezone: string;
};

export type CreateTechRequest = {
  os: string | null;
  paid_software: string[] | null;
};

export type CreateAvailabilityRequest = {
  available_hours_per_day: number;
  compatible_projects: number | null;
  incompatible_projects: number | null;
};

export type CreateEducationRequest = {
  education_titles: {
    title: string;
    status: "completed" | "in-progress";
    type:
      | "iniversity"
      | "postgraduate"
      | "high-school-orientation"
      | "tertiary";
    document: File;
  }[];
};
