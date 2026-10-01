import {
  pdfFileValidation,
  urlValidation,
} from "@/core/utils/forms/fileValidation";
import { z } from "zod";
import {
  dedicationTypeOptions,
  educationTypeOptions,
  haveComputerOptions,
  internetConnectionOptions,
  internetConnectionTypeOptions,
  isEducationTitleForType,
  isUniqueUniversityTitle,
  operatingSystemOptions,
  roleOptions,
  yearsOfExperienceOptions,
} from "../utils";

export { educationTypeOptions } from "../utils";

export const educationStatusOptions = ["in-progress", "completed"] as const;

const educationDocumentSchema = z.union([pdfFileValidation, z.string()]);

export const experienceSchema = z.object({
  position: z
    .string({ required_error: "Ingresar la posición pretendida" })
    .trim()
    .min(1, "Ingresar la posición pretendida"),
  role: z.enum(roleOptions, {
    required_error: "Seleccionar un rol",
    invalid_type_error: "Opción no válida",
  }),
  yearsOfExperience: z.enum(yearsOfExperienceOptions, {
    required_error: "Seleccionar una opción",
    invalid_type_error: "Opción no válida",
  }),
  certifications: z
    .array(
      z.object({
        name: z
          .string()
          .trim()
          .min(1, "El nombre de la certificación no puede estar vacío"),
        documentId: z.number().nullable(),
        document: pdfFileValidation.optional(),
      }),
    )
    .superRefine((certifications, ctx) => {
      const seen = new Set<string>();
      certifications.forEach((certification, index) => {
        const key = certification.name.trim().toLowerCase();
        if (seen.has(key)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "La certificación ya fue agregada",
            path: [index, "name"],
          });
        }
        seen.add(key);
      });
    })
    .optional(),
  portfolioUrl: urlValidation.optional(),
});

export const locationSchema = z.object({
  internetConnections: z.array(
    z.object({
      speed: z.enum(internetConnectionOptions, {
        required_error: "Seleccionar una velocidad de conexión",
        invalid_type_error: "Opción no válida",
      }),
      type: z.enum(internetConnectionTypeOptions, {
        required_error: "Seleccionar un tipo de conexión",
        invalid_type_error: "Opción no válida",
      }),
    }),
  ),
  timezoneCompatibility: z
    .string({
      required_error: "Seleccionar una zona horaria",
      invalid_type_error: "Opción no válida",
    })
    .min(1, "Seleccionar una zona horaria"),
});

export const resourcesSchema = z
  .object({
    hasComputer: z.enum(haveComputerOptions, {
      required_error: "Indicar si hay una computadora disponible",
      invalid_type_error: "Opción no válida",
    }),
    operatingSystem: z.enum(operatingSystemOptions).optional(),
    paidSoftware: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.hasComputer === "Si" && !data.operatingSystem) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["operatingSystem"],
        message: "Seleccionar un sistema operativo",
      });
    }
  });

export const availabilitySchema = z.object({
  dedicationType: z.enum(dedicationTypeOptions, {
    required_error: "Seleccionar un tipo de dedicación",
    invalid_type_error: "Opción no válida",
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
        return !isNaN(num) && num >= 0 && num <= 32767;
      },
      { message: "La cantidad debe estar entre 0 y 32767" },
    )
    .optional(),
  incompatibleProjects: z
    .string()
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num >= 0 && num <= 32767;
      },
      { message: "La cantidad debe estar entre 0 y 32767" },
    )
    .optional(),
});

export const educationTitleSchema = z
  .object({
    title: z.string().min(2, "El título debe tener al menos 2 caracteres"),
    type: z.enum(educationTypeOptions, {
      required_error: "Seleccionar un tipo",
      invalid_type_error: "Opción no válida",
    }),
    status: z.enum(educationStatusOptions, {
      required_error: "Seleccionar un estado",
      invalid_type_error: "Opción no válida",
    }),
    document: educationDocumentSchema.optional(),
  })
  .superRefine(({ title, type }, ctx) => {
    if (!isEducationTitleForType(type, title)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["title"],
        message: "El título no corresponde al tipo elegido",
      });
    }
  });

export const educationSchema = z.object({
  educationTitles: z
    .array(educationTitleSchema)
    .min(1, "Agregar al menos un título académico")
    .superRefine((educationTitles, ctx) => {
      const usedUniqueTitles = new Set<string>();

      educationTitles.forEach(({ title }) => {
        if (!isUniqueUniversityTitle(title)) return;

        if (usedUniqueTitles.has(title)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Solo se permite una formación de ${title}`,
          });
        }

        usedUniqueTitles.add(title);
      });

      if (
        educationTitles.filter(
          ({ type }) => type === "high-school-orientation",
        ).length > 1
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Solo se permite una orientación secundaria",
        });
      }
    }),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;

export type LocationFormValues = z.infer<typeof locationSchema>;

export type ResourcesFormValues = z.infer<typeof resourcesSchema>;

export type AvailabilityFormValues = z.infer<typeof availabilitySchema>;

export type EducationTitleFormValues = z.infer<typeof educationTitleSchema>;

export type EducationFormValues = z.infer<typeof educationSchema>;
