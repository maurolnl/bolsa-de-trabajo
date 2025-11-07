export const timezones = [
  { id: "UTC", label: "UTC (Coordinated Universal Time)" },
  { id: "America/New_York", label: "Eastern Time (US & Canada)" },
  { id: "America/Miami", label: "Miami (US)" },
  { id: "America/Chicago", label: "Central Time (US & Canada)" },
  { id: "America/Denver", label: "Mountain Time (US & Canada)" },
  { id: "America/Los_Angeles", label: "Pacific Time (US & Canada)" },
  { id: "America/Mexico_City", label: "Mexico City (Mexico)" },
  { id: "America/Bogota", label: "Bogotá (Colombia)" },
  { id: "America/Lima", label: "Lima (Peru)" },
  { id: "America/Santiago", label: "Santiago (Chile)" },
  { id: "America/Caracas", label: "Caracas (Venezuela)" },
  { id: "America/Sao_Paulo", label: "São Paulo (Brazil)" },
  { id: "America/Montevideo", label: "Montevideo (Uruguay)" },
  { id: "America/Buenos_Aires", label: "Buenos Aires (Argentina)" },
  { id: "America/Asuncion", label: "Asunción (Paraguay)" },
  { id: "America/La_Paz", label: "La Paz (Bolivia)" },
  { id: "America/Panama", label: "Panama (Panama)" },
  { id: "America/Guatemala", label: "Guatemala City (Guatemala)" },
  { id: "America/Costa_Rica", label: "San José (Costa Rica)" },
  { id: "America/Havana", label: "Havana (Cuba)" },
  { id: "America/Kingston", label: "Kingston (Jamaica)" },
  { id: "America/Toronto", label: "Toronto (Canada)" },
  { id: "America/Vancouver", label: "Vancouver (Canada)" },
  { id: "Europe/London", label: "London (UK)" },
  { id: "Europe/Berlin", label: "Berlin (Germany)" },
  { id: "Asia/Tokyo", label: "Tokyo (Japan)" },
  { id: "Asia/Singapore", label: "Singapore" },
  { id: "Australia/Sydney", label: "Sydney (Australia)" },
] as const;

export const timezoneOptions = [
  "UTC",
  "America/New_York",
  "America/Miami",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Mexico_City",
  "America/Bogota",
  "America/Lima",
  "America/Santiago",
  "America/Caracas",
  "America/Sao_Paulo",
  "America/Montevideo",
  "America/Buenos_Aires",
  "America/Asuncion",
  "America/La_Paz",
  "America/Panama",
  "America/Guatemala",
  "America/Costa_Rica",
  "America/Havana",
  "America/Kingston",
  "America/Toronto",
  "America/Vancouver",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
] as const;

export const getTimezoneOffset = () => {
  const now = new Date();
  const offsetMinutes = now.getTimezoneOffset();
  const offsetHours = -offsetMinutes / 60;

  console.log(`UTC${offsetHours >= 0 ? "+" : ""}${offsetHours}`);
};
