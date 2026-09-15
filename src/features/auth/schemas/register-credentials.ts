import { z } from "zod";

export const registerCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["employee", "employer"]),
});

export type RegisterCredentials = z.infer<typeof registerCredentialsSchema>;
