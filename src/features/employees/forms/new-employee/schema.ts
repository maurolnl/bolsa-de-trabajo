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
  roleOptions,
  timeZoneCompatibilityOptions,
  typeOfPaidSoftware,
  yearsOfExperienceOptions,
} from "../utils";

export const newEmployeeProfileSchema = z.object({
  // Step 1: Experience
  role: z.enum(roleOptions, {
    required_error: "Debe seleccionar un rol",
    invalid_type_error: "Seleccione una opción válida",
  }),
  yearsOfExperience: z.enum(yearsOfExperienceOptions, {
    required_error: "Debe seleccionar una opción",
    invalid_type_error: "Seleccione una opción válida",
  }),
  certifications: z.array(z.string()).optional(),
  certificationsFile: multipleFileValidation.optional(),
  projectLinks: urlValidation.optional(),

  // Step 2: Connections
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
    typeOfPaidSoftware: z
      .enum(typeOfPaidSoftware, {
        invalid_type_error: "Seleccione una opción válida",
      })
      .optional(),
    typeOfPaidSoftwareOther: z.string().optional(),
    paidSoftwareCount: z.string().optional(),
  }),

  // Step 4: Availability
  dedicationType: z.enum(dedicationTypeOptions, {
    required_error: "Debe seleccionar un tipo de dedicación",
    invalid_type_error: "Seleccione una opción válida",
  }),
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
  universityTitles: z.array(z.string()).optional(),
  postgraduateTitles: z.array(z.string()).optional(),
  schoolStudiesOrientation: z.array(z.string()).optional(),
  tertiaryStudies: z.array(z.string()).optional(),
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
