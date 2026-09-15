import { z } from "zod";

const requiredText = (message: string) => z.string().trim().min(1, message);

export const employerProfileSchema = z.object({
  name: requiredText("Ingrese el nombre de la empresa"),
  industry: requiredText("Ingrese la industria"),
  location: requiredText("Ingrese la ubicación"),
  hiringModalities: z.array(
    requiredText("Las modalidades no pueden estar vacías"),
  ),
});

export type EmployerProfileFormValues = z.infer<typeof employerProfileSchema>;
