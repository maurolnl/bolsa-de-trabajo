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
  certifications: z.string().optional(),
  projectLinks: z.string().optional(),
  knownRegulations: z.string().optional(),

  // Step 2: Location
  internetConnection: z.enum([
    "< 10Mbps",
    "20Mbps",
    "30Mbps",
    "40Mbps",
    "50Mbps",
    "> 50Mbps",
  ]),
  timeZoneCompatibility: z.enum(["< 1h", "2hs", "3hs", "4hs", "> 5hs"]),

  // Step 3: Resources
  hasComputer: z.enum(["Yes", "No"]),
  paidSoftwareCount: z.string().min(1),

  // Step 4: Availability
  dedicationType: z.enum(["Full Time", "Part time"]).optional(),
  flexibleHours: z.string().refine(
    (val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 1 && num <= 8;
    },
    { message: "Las horas deben estar entre 1 y 8" } //spanish
  ),
  compatibleProjects: z.string().refine(
    (val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 0;
    },
    { message: "No puede ser negativo" } //spanish
  ),
  incompatibleProjects: z.string().refine(
    (val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 0;
    },
    { message: "No puede ser negativo" } //spanish
  ),

  // Step 5: Education
  undergraduateDegree: z.string().optional(),
  bachelorDegree: z.string().optional(),
  specializationDegree: z.string().optional(),
  masterDegree: z.string().optional(),
  phdDegree: z.string().optional(),
  tertiaryDegree: z.string().optional(),
  highSchoolDegree: z.string().optional(),
  relevantAreaDegree: z.string().optional(),
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
