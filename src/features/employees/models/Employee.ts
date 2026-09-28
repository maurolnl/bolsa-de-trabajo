// Cada certificación lleva, a lo sumo, un PDF propio. `documentId` identifica el PDF ya
// cargado que se conserva; `document` es un PDF nuevo que lo reemplaza. Sin ninguno de los
// dos, la certificación queda sin PDF.
export type Certification = {
  name: string;
  documentId: number | null;
  document?: File;
};

// Certificado cargado antes de que cada PDF quedara asociado a su certificación. Se muestra
// y se descarga, pero no se atribuye a ninguna.
export type UnassignedCertificate = {
  id: number;
  title: string;
};

export type BaseEmployee = {
  position: string;
  role: string;
  yearsOfExperience: string;
  certifications: Certification[];
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
    unassignedCertificates: UnassignedCertificate[];
  };
