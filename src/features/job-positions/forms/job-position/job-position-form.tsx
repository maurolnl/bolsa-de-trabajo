import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Timezone } from "@/features/employees/repo/types";

import {
  availableHoursPerDayOptions,
  jobRoleOptions,
  requiredEducationLevelOptions,
  requiredExperienceOptions,
} from "./options";
import { jobPositionSchema, JobPositionFormValues } from "./schema";

type JobPositionFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  timezones: Timezone[];
  defaultValues: DefaultValues<JobPositionFormValues>;
  isSubmitting: boolean;
  onSubmit: (values: JobPositionFormValues) => Promise<void>;
  onCancel: () => void;
};

export const JobPositionForm = ({
  title,
  description,
  submitLabel,
  timezones,
  defaultValues,
  isSubmitting,
  onSubmit,
  onCancel,
}: JobPositionFormProps) => {
  const [resourceInput, setResourceInput] = useState("");
  const form = useForm<JobPositionFormValues>({
    mode: "onChange",
    resolver: zodResolver(jobPositionSchema),
    defaultValues,
  });

  const addResource = () => {
    const resource = resourceInput.trim();
    if (!resource) return;

    form.setValue(
      "technicalResources",
      [...form.getValues("technicalResources"), resource],
      { shouldDirty: true, shouldValidate: true },
    );
    setResourceInput("");
  };

  const removeResource = (indexToRemove: number) => {
    form.setValue(
      "technicalResources",
      form
        .getValues("technicalResources")
        .filter((_, index) => index !== indexToRemove),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-5">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posición</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej. Desarrollador backend" />
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
                    <FormLabel>Rol</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione un rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jobRoleOptions.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requiredExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experiencia requerida</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione la experiencia requerida" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {requiredExperienceOptions.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requiredEducationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel educativo pretendido</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione el nivel educativo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {requiredEducationLevelOptions.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableHoursPerDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horas disponibles por día</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? String(field.value) : undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione las horas por día" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableHoursPerDayOptions.map((hours) => (
                          <SelectItem key={hours} value={String(hours)}>
                            {hours}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zona horaria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione una zona horaria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timezones.map((timezone) => (
                          <SelectItem key={timezone.name} value={timezone.name}>
                            {timezone.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="technicalResources"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recursos técnicos</FormLabel>
                    <FormDescription>
                      Campo opcional. Podés agregar recursos libres o dejar la
                      lista vacía.
                    </FormDescription>
                    <div className="flex gap-2">
                      <Input
                        aria-label="Nuevo recurso técnico"
                        value={resourceInput}
                        onChange={(event) => setResourceInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addResource();
                          }
                        }}
                        placeholder="Ej. Notebook con 16GB de RAM"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addResource}
                        disabled={!resourceInput.trim()}
                      >
                        <Plus className="h-4 w-4" />
                        Agregar
                      </Button>
                    </div>
                    {field.value.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((resource, index) => (
                          <Badge
                            key={`${resource}-${index}`}
                            variant="secondary"
                            className="gap-1"
                          >
                            {resource}
                            <button
                              type="button"
                              onClick={() => removeResource(index)}
                              className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">
                                Eliminar recurso {resource}
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
            <CardFooter className="justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <LoadingSpinner size={20} /> : null}
                {submitLabel}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};
