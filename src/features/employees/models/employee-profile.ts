// El perfil completo leído por identificador de empleado. Es un modelo aparte de `Employee`
// —el perfil propio leído por identificador de usuario— porque su contrato es distinto: los
// archivos vienen identificados y sin ubicación, y el correo solo viaja para el propio dueño.
export type EmployeeProfileFile = {
  id: number;
  title: string;
};

// `certificationDocumentId` nulo significa que el título no tiene documento: es lo que decide
// si se ofrece la descarga.
export type EmployeeProfileEducation = {
  educationType: string;
  title: string;
  status: string;
  certificationDocumentId: number | null;
};

export type EmployeeProfileInternetConnection = {
  type: string;
  speed: string;
};

export type EmployeeProfile = {
  id: number;
  userId: number;
  email: string | null;
  position: string;
  role: string;
  yearsOfExperience: string;
  certifications: string[];
  portfolioUrl: string | null;
  timezone: string;
  os: string;
  paidSoftware: string[];
  availableHoursPerDay: number;
  compatibleProjects: number | null;
  incompatibleProjects: number | null;
  internetConnections: EmployeeProfileInternetConnection[];
  education: EmployeeProfileEducation[];
  files: EmployeeProfileFile[];
  createdAt: string;
  updatedAt: string;
};

// La URL prefirmada nunca se guarda: este tipo describe el valor que atraviesa el handler del
// clic y se consume en el acto.
export type DownloadUrl = {
  url: string;
  expiresAt: string;
};
