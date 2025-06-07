import {
  multipleFileValidation,
  urlValidation,
} from "@/core/utils/forms/fileValidation";
import { z } from "zod";
import {
  dedicationTypeOptions,
  haveComputerOptions,
  internetConnectionOptions,
  internetConnectionTypeOptions,
  timeZoneCompatibilityOptions,
  typeOfPaidSoftware,
  yearsOfExperienceOptions,
} from "../utils";

export const newEmployeeProfileSchema = z.object({
  // Step 1: Experience
  role: z
    .array(z.string())
    .min(1, "Debe seleccionar al menos un rol")
    .max(1, "Debe seleccionar solo un rol"),
  yearsOfExperience: z.enum(yearsOfExperienceOptions, {
    required_error: "Debe seleccionar una opción",
    invalid_type_error: "Seleccione una opción válida",
  }),
  certifications: z.string().optional(),
  certificationsFile: multipleFileValidation.optional(),
  projectLinks: urlValidation.optional(),

  internetConnection: z.array(
    z.object({
      speed: z.enum(internetConnectionOptions, {
        required_error: "Debe seleccionar una velocidad de conexión",
        invalid_type_error: "Seleccione una opción válida",
      }),
      type: z.enum(internetConnectionTypeOptions, {
        required_error: "Debe seleccionar un tipo de conexión",
        invalid_type_error: "Seleccione una opción válida",
      }),
    })
  ),
  timeZoneCompatibility: z.enum(timeZoneCompatibilityOptions, {
    required_error: "Debe seleccionar una zona horaria",
    invalid_type_error: "Seleccione una opción válida",
  }),

  // Step 3: Resources
  hasComputer: z.enum(haveComputerOptions, {
    required_error: "Debe indicar si dispone de computadora",
    invalid_type_error: "Seleccione una opción válida",
  }),
  paidSoftware: z.object({
    typeOfPaidSoftware: z.enum(typeOfPaidSoftware, {
      required_error: "Debe seleccionar al menos un tipo de software",
      invalid_type_error: "Seleccione una opción válida",
    }),
    typeOfPaidSoftwareOther: z.string().optional(),
    paidSoftwareCount: z.string().optional(),
  }),

  // Step 4: Availability
  dedicationType: z
    .enum(dedicationTypeOptions, {
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
  universityTitles: z.array(z.string()),
  postgraduateTitles: z.array(z.string()),
  schoolStudiesOrientation: z.array(z.string()),
  tertiaryStudies: z.array(z.string()),
  universityTitleFiles: multipleFileValidation.optional(),
  postgraduateTitleFiles: multipleFileValidation.optional(),
  schoolStudiesOrientationFiles: multipleFileValidation.optional(),
  tertiaryStudyFiles: multipleFileValidation.optional(),
  tertiaryStudyOther: z.string().optional(),
});

export const experienceSchema = newEmployeeProfileSchema.pick({
  role: true,
  yearsOfExperience: true,
  certifications: true,
  certificationsFile: true,
  projectLinks: true,
});

export const locationSchema = newEmployeeProfileSchema.pick({
  internetConnection: true,
  timeZoneCompatibility: true,
});

export const resourcesSchema = newEmployeeProfileSchema.pick({
  hasComputer: true,
  paidSoftware: true,
});

export const availabilitySchema = newEmployeeProfileSchema.pick({
  dedicationType: true,
  flexibleHours: true,
  compatibleProjects: true,
  incompatibleProjects: true,
});

export const educationSchema = newEmployeeProfileSchema.pick({
  universityTitles: true,
  postgraduateTitles: true,
  schoolStudiesOrientation: true,
  tertiaryStudies: true,
  universityTitleFiles: true,
  postgraduateTitleFiles: true,
  schoolStudiesOrientationFiles: true,
  tertiaryStudyFiles: true,
  tertiaryStudyOther: true,
});
