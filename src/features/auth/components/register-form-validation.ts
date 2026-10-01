import { z } from "zod";
import { registerCredentialsSchema } from "../schemas/register-credentials";

// Apagado temporal del alta de empleadores, solo en el frontend: el backend sigue
// aceptando el rol. Volver a `true` para reabrirlo.
export const EMPLOYER_REGISTRATION_ENABLED = false;

export const registerFormSchema = registerCredentialsSchema.extend({
  email: z.string().email("Email no válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: z
    .enum(["employee", "employer"], { required_error: "Seleccionar un rol" })
    .refine((role) => EMPLOYER_REGISTRATION_ENABLED || role !== "employer", {
      message: "El registro de empleadores está deshabilitado temporalmente",
    }),
});
