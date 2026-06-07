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

export const educationTypeOptions = [
  "university",
  "postgraduate",
  "high-school-orientation",
  "tertiary",
] as const;

export const educationStatusOptions = ["in-progress", "completed"] as const;

const educationDocumentSchema = z.union([z.instanceof(File), z.string()]);

export const experienceSchema = z.object({
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
  certificationFiles: multipleFileValidation.optional(),
  portfolioUrl: urlValidation.optional(),
});

export const locationSchema = z.object({
  internetConnections: z.array(
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
  timezoneCompatibility: z
    .string({
      required_error: "Debe seleccionar una zona horaria",
      invalid_type_error: "Seleccione una opción válida",
    })
    .min(1, "Debe seleccionar una zona horaria"),
});

export const resourcesSchema = z
  .object({
    hasComputer: z.enum(haveComputerOptions, {
      required_error: "Debe indicar si dispone de computadora",
      invalid_type_error: "Seleccione una opción válida",
    }),
    operatingSystem: z.enum(operatingSystemOptions).optional(),
    paidSoftware: z.array(z.string()).optional(),
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

export const availabilitySchema = z.object({
  dedicationType: z.enum(dedicationTypeOptions, {
    required_error: "Debe seleccionar un tipo de dedicación",
    invalid_type_error: "Seleccione una opción válida",
  }),
  availableHoursPerDay: z
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
});

export const educationTitleSchema = z.object({
  title: z.string().min(1, "Debe ingresar un título"),
  type: z.enum(educationTypeOptions, {
    required_error: "Debe seleccionar un tipo",
    invalid_type_error: "Seleccione una opción válida",
  }),
  status: z.enum(educationStatusOptions, {
    required_error: "Debe seleccionar un estado",
    invalid_type_error: "Seleccione una opción válida",
  }),
  document: educationDocumentSchema.optional(),
});

export const educationSchema = z.object({
  educationTitles: z.array(educationTitleSchema).default([]),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;

export type LocationFormValues = z.infer<typeof locationSchema>;

export type ResourcesFormValues = z.infer<typeof resourcesSchema>;

export type AvailabilityFormValues = z.infer<typeof availabilitySchema>;

export type EducationTitleFormValues = z.infer<typeof educationTitleSchema>;

export type EducationFormValues = z.infer<typeof educationSchema>;
