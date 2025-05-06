import {
  multipleFileValidation,
  urlValidation,
} from "@/core/utils/forms/fileValidation";
import { z } from "zod";

export const newEmployeeProfileSchema = z.object({
  // Step 1: Experience
  yearsLeadingProjects: z
    .string()
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num >= 1 && num <= 8;
      },
      { message: "Los años no pueden ser negativos" }
    )
    .optional(),
  yearsAsAssistant: z
    .string()
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num >= 0;
      },
      { message: "Los años no pueden ser negativos" }
    )
    .optional(),
  yearsAsApprentice: z
    .string()
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num >= 0;
      },
      { message: "Los años no pueden ser negativos" }
    )
    .optional(),
  certifications: multipleFileValidation.optional(),
  projectLinks: urlValidation.optional(),
  knownRegulations: multipleFileValidation.optional(),

  // Step 2: Location
  internetConnection: z.enum(
    ["< 10Mbps", "20Mbps", "30Mbps", "40Mbps", "50Mbps", "> 50Mbps"],
    {
      required_error: "Debe seleccionar una velocidad de conexión",
      invalid_type_error: "Seleccione una opción válida",
    }
  ),
  timeZoneCompatibility: z.enum(["< 1h", "2hs", "3hs", "4hs", "> 5hs"], {
    required_error: "Debe seleccionar una zona horaria",
    invalid_type_error: "Seleccione una opción válida",
  }),

  // Step 3: Resources
  hasComputer: z.enum(["Yes", "No"], {
    required_error: "Debe indicar si dispone de computadora",
    invalid_type_error: "Seleccione una opción válida",
  }),
  paidSoftwareCount: z.string().min(1, "Debe ingresar la cantidad de software"),

  // Step 4: Availability
  dedicationType: z
    .enum(["Full Time", "Part time"], {
      required_error: "Debe seleccionar un tipo de dedicación",
      invalid_type_error: "Seleccione una opción válida",
    })
    .optional(),
  flexibleHours: z
    .string()
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num >= 1 && num <= 8;
      },
      { message: "Las horas deben estar entre 1 y 8" }
    )
    .optional(),
  compatibleProjects: z
    .string()
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num >= 0;
      },
      { message: "La cantidad no puede ser negativa" }
    )
    .optional(),
  incompatibleProjects: z
    .string()
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num >= 0;
      },
      { message: "La cantidad no puede ser negativa" }
    )
    .optional(),

  // Step 5: Education
  undergraduateDegree: multipleFileValidation.optional(),
  bachelorDegree: multipleFileValidation.optional(),
  specializationDegree: multipleFileValidation.optional(),
  masterDegree: multipleFileValidation.optional(),
  phdDegree: multipleFileValidation.optional(),
  tertiaryDegree: multipleFileValidation.optional(),
  highSchoolDegree: multipleFileValidation.optional(),
  relevantAreaDegree: multipleFileValidation.optional(),
});

export const experienceSchema = newEmployeeProfileSchema.pick({
  yearsLeadingProjects: true,
  yearsAsAssistant: true,
  yearsAsApprentice: true,
  certifications: true,
  projectLinks: true,
  knownRegulations: true,
});

export const locationSchema = newEmployeeProfileSchema.pick({
  internetConnection: true,
  timeZoneCompatibility: true,
});

export const resourcesSchema = newEmployeeProfileSchema.pick({
  hasComputer: true,
  paidSoftwareCount: true,
});

export const availabilitySchema = newEmployeeProfileSchema.pick({
  dedicationType: true,
  flexibleHours: true,
  compatibleProjects: true,
  incompatibleProjects: true,
});

export const educationSchema = newEmployeeProfileSchema.pick({
  undergraduateDegree: true,
  bachelorDegree: true,
  specializationDegree: true,
  masterDegree: true,
  phdDegree: true,
  tertiaryDegree: true,
  highSchoolDegree: true,
  relevantAreaDegree: true,
});
