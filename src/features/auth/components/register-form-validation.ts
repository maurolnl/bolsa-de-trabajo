import { z } from "zod";
import { registerCredentialsSchema } from "../schemas/register-credentials";

export const registerFormSchema = registerCredentialsSchema.extend({
  email: z.string().email("Ingresá un email válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: z.enum(["employee", "employer"], { required_error: "Seleccioná un rol" }),
});
