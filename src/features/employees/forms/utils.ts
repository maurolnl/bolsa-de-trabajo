export const universityTitles = [
  "Ingenieria",
  "Licenciatura",
  "Tecnicatura",
  "Profesorado",
  "Abogacia",
  "Diseño",
  "Programacion",
  "Contabilidad",
  "Administracion",
  "Otro",
] as const;

export const postgraduateTitles = [
  "Especializacion",
  "Maestria",
  "Doctorado",
  "Otro",
] as const;

export const schoolStudiesOrientation = [
  "Humanidades",
  "Ciencias Sociales",
  "Ciencias Naturales",
  "Ciencias Exactas",
  "Tecnica",
  "Energías Renovables",
  "Otro",
] as const;

export const tertiaryStudies = [
  "Tecnicatura en Desarrollo de Software",
  "Tecnicatura en Programacion",
  "Tecnicatura en Ciberseguridad",
  "Tecnicatura en Diseño y Programación de Videojuegos",
  "Tecnicatura en Diseño Gráfico",
  "Tecnicatura en Diseño Web",
  "Tecnicatura en Marketing Digital",
  "Tecnicatura en Administración de Empresas",
  "Tecnicatura en Recursos Humanos",
  "Tecnicatura en Gestión Contable y Financiera",
  "Tecnicatura en Comercio Exterior",
  "Tecnicatura en Traducción e Interpretación",
  "Tecnicatura en Educación / Pedagogía",
  "Tecnicatura en Redacción Profesional",
  "Tecnicatura en Gestión Ambiental",
  "Tecnicatura en Bibliotecología",
  "Otro",
] as const;

export const educationTypeOptions = [
  "university",
  "postgraduate",
  "high-school-orientation",
  "tertiary",
] as const;

export type EducationType = (typeof educationTypeOptions)[number];

export const educationTitlesByType: Record<EducationType, readonly string[]> = {
  university: universityTitles,
  postgraduate: postgraduateTitles,
  "high-school-orientation": schoolStudiesOrientation,
  tertiary: tertiaryStudies,
};

export const uniqueUniversityTitles = [
  "Abogacia",
  "Contabilidad",
  "Administracion",
] as const;

interface EducationSelection {
  title: string;
  type: EducationType;
}

export const isUniqueUniversityTitle = (title: string) =>
  uniqueUniversityTitles.some((uniqueTitle) => uniqueTitle === title);

export const hasHighSchoolOrientation = (
  educationTitles: readonly EducationSelection[],
) =>
  educationTitles.some(
    ({ type }) => type === "high-school-orientation",
  );

export const isEducationTitleForType = (
  type: EducationType,
  title: string,
) => educationTitlesByType[type].some((option) => option === title);

export const getAvailableEducationTitles = (
  type: EducationType,
  educationTitles: readonly EducationSelection[],
) =>
  educationTitlesByType[type].filter(
    (title) =>
      !isUniqueUniversityTitle(title) ||
      !educationTitles.some((education) => education.title === title),
  );

export const roles = ["Lider de proyecto", "Adjunto", "Aprendiz/Auxiliar"];
export const roleOptions = [
  "Lider de proyecto",
  "Adjunto",
  "Aprendiz/Auxiliar",
  "Freelance",
] as const;

export const yearsOfExperienceOptions = [
  "Menos de 1 año",
  "1 año",
  "2 a 5 años",
  "5 a 10 años",
  "Mas de 10 años",
] as const;

export const internetConnectionOptions = [
  "< 10Mbps",
  "20Mbps",
  "30Mbps",
  "40Mbps",
  "> 50Mbps",
] as const;

export const internetConnectionTypeOptions = [
  "Fibra",
  "Aire / Wifi",
  "Cable coaxial",
  "ADSL",
  "Móvil",
] as const;

export const timeZoneCompatibilityOptions = [
  "< 1h",
  "2hs",
  "3hs",
  "4hs",
  "> 5hs",
] as const;

export const typeOfPaidSoftware = [
  "Edicion de video",
  "Edicion de texto",
  "Microsoft Office",
  "Adobe",
  "Autocad",
  "Otro",
] as const;

export const haveComputerOptions = ["Si", "No"] as const;

export const operatingSystemOptions = [
  "Windows",
  "iOS",
  "Linux Distribution",
  "Otro",
] as const;

export const dedicationTypeOptions = [
  "Full Time (8hs)",
  "Part time (4hs)",
  "Flexible",
] as const;

export const universityTitlesOptions = universityTitles.map((title) => ({
  label: title,
  value: title,
}));

export const postgraduateTitlesOptions = postgraduateTitles.map((title) => ({
  label: title,
  value: title,
}));

export const schoolStudiesOrientationOptions = schoolStudiesOrientation.map(
  (title) => ({
    label: title,
    value: title,
  }),
);

export const tertiaryStudiesOptions = tertiaryStudies.map((title) => ({
  label: title,
  value: title,
}));
