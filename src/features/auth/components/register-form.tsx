import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

import { registerFormSchema } from "./register-form-validation";

export type RegisterFormType = z.infer<typeof registerFormSchema>;

type Props = {
  isSubmitting: boolean;
  onSubmit: (values: RegisterFormType) => Promise<void>;
};

const roleOptions = [
  {
    value: "employee",
    label: "Empleado",
    description: "Quiero crear mi perfil y encontrar oportunidades.",
  },
  {
    value: "employer",
    label: "Empleador",
    description: "Quiero representar a una empresa y publicar búsquedas.",
  },
] as const;

export const RegisterForm = ({ isSubmitting, onSubmit }: Props) => {
  const form = useForm<RegisterFormType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  autoComplete="email"
                  placeholder="nombre@ejemplo.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  autoComplete="new-password"
                  placeholder="Ingresá una contraseña"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>¿Cómo vas a usar Laburi.to?</FormLabel>
              <FormControl>
                <RadioGroup
                  className="grid gap-3 sm:grid-cols-2"
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  {roleOptions.map((option) => (
                    <div
                      className={cn(
                        "flex gap-3 rounded-lg border p-4 transition-colors hover:bg-accent",
                        field.value === option.value &&
                          "border-primary bg-accent",
                      )}
                      key={option.value}
                    >
                      <RadioGroupItem
                        aria-label={option.label}
                        className="mt-1 shrink-0"
                        id={`role-${option.value}`}
                        value={option.value}
                      />
                      <label
                        className="cursor-pointer"
                        htmlFor={`role-${option.value}`}
                      >
                        <span className="block font-medium">{option.label}</span>
                        <span className="mt-1 block text-sm text-muted-foreground">
                          {option.description}
                        </span>
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>
    </Form>
  );
};
