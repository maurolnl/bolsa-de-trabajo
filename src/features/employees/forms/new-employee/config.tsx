import {
  availabilitySchema,
  educationSchema,
  experienceSchema,
  locationSchema,
  resourcesSchema,
} from "./schema";
import { ExperienceForm } from "./steps/experience-form";
import { LocationForm } from "./steps/location-form";
import { ResourcesForm } from "./steps/resources-form";
import { AvailabilityForm } from "./steps/availability-form";
import { EducationForm } from "./steps/education-form";

export const steps = [
  {
    id: "step-1",
    title: "Experiencia",
    component: <ExperienceForm />,
    schema: experienceSchema,
  },
  {
    id: "step-2",
    title: "Locación",
    component: <LocationForm />,
    schema: locationSchema,
  },
  {
    id: "step-3",
    title: "Recursos, Herramientas y Dispositivos",
    component: <ResourcesForm />,
    schema: resourcesSchema,
  },
  {
    id: "step-4",
    title: "Disponibilidad y flexibilidad horaria",
    component: <AvailabilityForm />,
    schema: availabilitySchema,
  },
  {
    id: "step-5",
    title: "Educación",
    component: <EducationForm />,
    schema: educationSchema,
  },
];
