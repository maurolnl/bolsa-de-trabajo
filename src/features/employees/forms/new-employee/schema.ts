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
  operatingSystemOptions,
  roleOptions,
  yearsOfExperienceOptions,
} from "../utils";
import { timezoneOptions } from "@/lib/timezones";

const newEmployeeProfileSchemaBase = z.object({
  // Step 1: Experience
  position: z.string(),
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
    }),
  ),
  timeZoneCompatibility: z.enum(timezoneOptions, {
    required_error: "Debe seleccionar una zona horaria",
    invalid_type_error: "Seleccione una opción válida",
  }),

  // Step 3: Resources
  hasComputer: z.enum(haveComputerOptions, {
    required_error: "Debe indicar si dispone de computadora",
    invalid_type_error: "Seleccione una opción válida",
  }),
  operatingSystem: z.enum(operatingSystemOptions).optional(),
  paidSoftware: z.array(z.string()).optional(),

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
      { message: "Las horas deben estar entre 1 y 8" },
    )
    .optional(),
  compatibleProjects: z
    .string()
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num >= 0;
      },
      { message: "La cantidad no puede ser negativa" },
    )
    .optional(),
  incompatibleProjects: z
    .string()
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num >= 0;
      },
      { message: "La cantidad no puede ser negativa" },
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

export const newEmployeeProfileSchema = newEmployeeProfileSchemaBase.superRefine(
  (data, ctx) => {
    if (data.hasComputer === "Si" && !data.operatingSystem) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["operatingSystem"],
        message: "Debe seleccionar un sistema operativo",
      });
    }
  },
);

export const experienceSchema = newEmployeeProfileSchemaBase.pick({
  position: true,
  role: true,
  yearsOfExperience: true,
  certifications: true,
  certificationsFile: true,
  projectLinks: true,
});

export const locationSchema = newEmployeeProfileSchemaBase.pick({
  internetConnection: true,
  timeZoneCompatibility: true,
});

export const resourcesSchema = newEmployeeProfileSchemaBase
  .pick({
    hasComputer: true,
    operatingSystem: true,
    paidSoftware: true,
  })
  .superRefine((data, ctx) => {
    if (data.hasComputer === "Si" && !data.operatingSystem) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["operatingSystem"],
        message: "Debe seleccionar un sistema operativo",
      });
    }
  });

export const availabilitySchema = newEmployeeProfileSchemaBase.pick({
  dedicationType: true,
  flexibleHours: true,
  compatibleProjects: true,
  incompatibleProjects: true,
});

export const educationSchema = newEmployeeProfileSchemaBase.pick({
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
