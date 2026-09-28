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

// ============================== Perfil por identificador de empleado ==============================

// Réplica literal de `EmployeeProfileResponse` y `DownloadURLResponse` en
// `internal/employee/models.go` del backend.
//
// Es un tipo aparte de `EmployeeResponse` a propósito: el perfil direccionado por usuario
// sigue devolviendo el `object_key` del documento de educación, y unificarlos rompería ese
// contrato. Acá ningún archivo viaja con su ubicación, solo el identificador con el que se
// pide su entrega.
//
// `email` es opcional porque el backend lo omite cuando quien lee no es el propio empleado:
// una recomendación habilita a evaluar a un candidato dentro de la plataforma, no a
// contactarlo por fuera de ella.
export type ProfileFileResponse = {
  id: number;
  title: string;
};

// `certification_document_id` nulo significa que el título no tiene documento asociado. La
// ausencia de documento y un documento con identificador cero son cosas distintas.
export type ProfileEducationResponse = {
  education_type: string;
  title: string;
  status: string;
  certification_document_id: number | null;
};

export type EmployeeProfileResponse = {
  id: number;
  user_id: number;
  email?: string;
  position: string;
  role: string;
  years_of_experience: string;
  certifications: string[] | null;
  portfolio_url?: string;
  timezone: string;
  os: string;
  paid_software: string[] | null;
  available_hours_per_day: number;
  compatible_projects: number | null;
  incompatible_projects: number | null;
  internet_connections:
    | {
        type: string;
        speed: string;
      }[]
    | null;
  education: ProfileEducationResponse[] | null;
  files: ProfileFileResponse[] | null;
  created_at: string;
  updated_at: string;
};

// Sin bucket ni clave de objeto: la URL ya es el único acceso.
export type DownloadUrlResponse = {
  url: string;
  expires_at: string;
};
