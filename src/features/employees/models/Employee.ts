export type BaseEmployee = {
  position: string;
  role: string;
  yearsOfExperience: string;
  certifications: string[];
  certificationFiles: File[];
  portfolioUrl: string | null;
};

export type Location = {
  timezoneCompatibility: string;
  internetConnections: InternetConnection[];
};

export type InternetConnectionSpeed =
  | "< 10Mbps"
  | "20Mbps"
  | "30Mbps"
  | "40Mbps"
  | "> 50Mbps";
export type InternetConnectionType =
  | "Fibra"
  | "Aire / Wifi"
  | "Cable coaxial"
  | "ADSL"
  | "Móvil";

export type InternetConnection = {
  type: InternetConnectionType;
  speed: InternetConnectionSpeed;
};

export type Tech = {
  operatingSystem: "Windows" | "iOS" | "Linux Distribution" | "Otro" | null;
  paidSoftware: string[] | null;
};

export type Availability = {
  availableHoursPerDay: number;
  compatibleProjects: number | null;
  incompatibleProjects: number | null;
};

export type EducationTitles = {
  educationTitles: Education[];
};

export type Education = {
  title: string;
  status: "completed" | "in-progress";
  type: "university" | "postgraduate" | "high-school-orientation" | "tertiary";
  document?: File | string;
};

export type ID = {
  employeeID: number;
};

export type Employee = BaseEmployee &
  Location &
  Tech &
  Availability &
  EducationTitles & {
    id: number;
  };
