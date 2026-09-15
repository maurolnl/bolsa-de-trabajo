import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-screen";
import { PATHS } from "@/router/paths";

import { useCreateEmployer } from "../../hooks/use-employer";
import {
  employerProfileSchema,
  EmployerProfileFormValues,
} from "./schema";

type EmployerProfileFormProps = {
  userId: number;
};

export const EmployerProfileForm = ({ userId }: EmployerProfileFormProps) => {
  const navigate = useNavigate();
  const createEmployer = useCreateEmployer(userId);
  const [modalityInput, setModalityInput] = useState("");
  const form = useForm<EmployerProfileFormValues>({
    mode: "onChange",
    resolver: zodResolver(employerProfileSchema),
    defaultValues: {
      name: "",
      industry: "",
      location: "",
      hiringModalities: [],
    },
  });

  const addModality = () => {
    const modality = modalityInput.trim();
    if (!modality) return;

    form.setValue(
      "hiringModalities",
      [...form.getValues("hiringModalities"), modality],
      { shouldDirty: true, shouldValidate: true },
    );
    setModalityInput("");
  };

  const removeModality = (indexToRemove: number) => {
    form.setValue(
      "hiringModalities",
      form
        .getValues("hiringModalities")
        .filter((_, index) => index !== indexToRemove),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const handleSubmit = async (values: EmployerProfileFormValues) => {
    try {
      await createEmployer.mutateAsync(values);
      navigate(PATHS.main.employer.jobs, { replace: true });
    } catch {
      // El MutationCache global presenta el error y el formulario conserva sus datos.
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Creá tu perfil de empleador</CardTitle>
          <CardDescription>
            Contanos sobre tu empresa para comenzar a publicar puestos de trabajo.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardContent className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la empresa</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej. Laburi" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industria</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej. Tecnología" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicación</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej. Buenos Aires, Argentina" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hiringModalities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modalidades de contratación</FormLabel>
                    <FormDescription>
                      Podés agregar modalidades libres o dejar la lista vacía.
                    </FormDescription>
                    <div className="flex gap-2">
                      <Input
                        aria-label="Nueva modalidad de contratación"
                        value={modalityInput}
                        onChange={(event) => setModalityInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addModality();
                          }
                        }}
                        placeholder="Ej. Tiempo completo"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addModality}
                        disabled={!modalityInput.trim()}
                      >
                        <Plus className="h-4 w-4" />
                        Agregar
                      </Button>
                    </div>
                    {field.value.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((modality, index) => (
                          <Badge
                            key={`${modality}-${index}`}
                            variant="secondary"
                            className="gap-1"
                          >
                            {modality}
                            <button
                              type="button"
                              onClick={() => removeModality(index)}
                              className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">
                                Eliminar modalidad {modality}
                              </span>
                            </button>
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="justify-end">
              <Button type="submit" disabled={createEmployer.isPending}>
                {createEmployer.isPending ? <LoadingSpinner size={20} /> : null}
                Crear perfil
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};
