import {
  educationStatusLabels,
  educationTypeLabels,
} from "../forms/new-employee/steps/education-form/constants";

// Las etiquetas en español de los códigos que el backend usa en el perfil. Son las mismas que
// ya consumen el onboarding del empleado y el formulario de puestos: el empleador y el
// empleado no deben leer nombres distintos para el mismo dato.
export const yearsOfExperienceLabels: Record<string, string> = {
  less_1y: "Menos de 1 año",
  "1y": "1 año",
  "2_to_5y": "2 a 5 años",
  "5_to_10y": "5 a 10 años",
  more_10y: "Mas de 10 años",
};

export const internetConnectionTypeLabels: Record<string, string> = {
  fiber: "Fibra",
  wifi: "Aire / Wifi",
  coaxial: "Cable coaxial",
  adsl: "ADSL",
  mobile: "Móvil",
};

export const internetConnectionSpeedLabels: Record<string, string> = {
  less_10mb: "< 10Mbps",
  "20mb": "20Mbps",
  "30mb": "30Mbps",
  "40mb": "40Mbps",
  more_50mb: "> 50Mbps",
};

export const educationTypeProfileLabels: Record<string, string> =
  educationTypeLabels;

export const educationStatusProfileLabels: Record<string, string> =
  educationStatusLabels;

// Un código que el frontend no conoce se muestra tal como llegó. Es preferible a `undefined`
// en pantalla: el dato sigue siendo legible y el desajuste con el backend queda a la vista en
// lugar de convertirse en un hueco silencioso.
export const labelFor = (labels: Record<string, string>, code: string) =>
  labels[code] ?? code;
