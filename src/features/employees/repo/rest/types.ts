export type CreateEmployeeRequest = {
  position: string;
  role: string;
  years_of_experience: "less_1y" | "1y" | "2_to_5y" | "5_to_10y" | "more_10y";
  certifications: string[];
  certification_file: File | null;
  portfolio_url: string | null;
};

export type EmployeeResponse = Omit<CreateEmployeeRequest, "certification_file"> &
  CreateLocationRequest &
  GetEducationResponse & {
    id: number;
    user_id: number;
    email: string;
    os: string;
    paid_software: string[] | null;
    available_hours_per_day: number;
    compatible_projects: number | null;
    incompatible_projects: number | null;
    files: { title: string }[];
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
  os?: string;
  paid_software?: string[];
};

export type CreateAvailabilityRequest = {
  available_hours_per_day: number;
  compatible_projects?: number;
  incompatible_projects?: number;
};

export type CreateEducationRequest = {
  education_titles: {
    title: string;
    status: "completed" | "in-progress";
    type:
      | "university"
      | "postgraduate"
      | "high-school-orientation"
      | "tertiary";
    document?: File | string;
  }[];
};
export type GetEducationResponse = {
  education: {
    title: string;
    status: "completed" | "in-progress";
    education_type:
      | "university"
      | "postgraduate"
      | "high-school-orientation"
      | "tertiary";
    certification?: string;
  }[];
};
