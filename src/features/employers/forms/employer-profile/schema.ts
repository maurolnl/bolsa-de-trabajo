import { z } from "zod";

const requiredText = (message: string) => z.string().trim().min(1, message);

export const employerProfileSchema = z.object({
  name: requiredText("Ingresar el nombre de la empresa"),
  industry: requiredText("Ingresar la industria"),
  location: requiredText("Ingresar la ubicación"),
  hiringModalities: z.array(
    requiredText("Las modalidades no pueden estar vacías"),
  ),
});

export type EmployerProfileFormValues = z.infer<typeof employerProfileSchema>;
