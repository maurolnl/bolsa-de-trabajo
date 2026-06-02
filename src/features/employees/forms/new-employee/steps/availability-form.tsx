import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-screen";
import { TypographyH3 } from "@/components/ui/typography/typography-h3";
import { dedicationTypeOptions } from "../../utils";
import { availabilitySchema, AvailabilityFormValues } from "../schema";
import { StepFormProps } from "./types";

type DedicationType = (typeof dedicationTypeOptions)[number];

export const AvailabilityForm = ({
  isLoading,
  isFirstStep,
  onPrevious,
  onSubmit,
}: StepFormProps<AvailabilityFormValues>) => {
  const form = useForm<AvailabilityFormValues>({
    mode: "onChange",
    resolver: zodResolver(availabilitySchema),
  });

  const { control, watch, setValue, setError } = form;

  const isFlexibleDedication = watch("dedicationType") === "Flexible";
  const fullTimeDedication = dedicationTypeOptions[0];
  const partTimeDedication = dedicationTypeOptions[1];
  const flexibleDedication = dedicationTypeOptions[2];

  const handleDedicationTypeChange = (value: DedicationType) => {
    switch (value) {
      case flexibleDedication:
        setValue("availableHoursPerDay", "");
        setError("availableHoursPerDay", {
          message: "Debe ingresar una cantidad de horas",
        });
        break;
      case fullTimeDedication:
        setValue("availableHoursPerDay", "8", { shouldValidate: true });
        break;
      case partTimeDedication:
        setValue("availableHoursPerDay", "4", { shouldValidate: true });
        break;
      default:
        setValue("availableHoursPerDay", "4", { shouldValidate: true });
        break;
    }

    setValue("dedicationType", value, { shouldValidate: false });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
      <div className="space-y-4">
        <FormField
          control={control}
          name="dedicationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dedicacion horaria fija</FormLabel>
              <FormControl>
                <Select
                  onValueChange={handleDedicationTypeChange}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione tipo de dedicación" />
                  </SelectTrigger>
                  <SelectContent>
                    {dedicationTypeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isFlexibleDedication && (
          <FormField
            control={control}
            name="availableHoursPerDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dediacion horaria flexible</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    max="8"
                    placeholder="Horas disponibles (1-8)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div>
        <TypographyH3 className="text-lg font-medium mb-2">
          Proyectos en marcha
        </TypographyH3>
        <div className="space-y-4">
          <FormField
            control={control}
            name="compatibleProjects"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Proyectos compatibles{" "}
                  <span className="text-sm text-muted-foreground font-normal">
                    (Opcional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    placeholder="Ingrese cantidad"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="incompatibleProjects"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Proyectos incompatibles{" "}
                  <span className="text-sm text-muted-foreground font-normal">
                    (Opcional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    placeholder="Ingrese cantidad"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={isFirstStep || isLoading}
          >
            <ArrowLeftIcon size={20} />
            Volver
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size={20} /> : null}
            Siguiente
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};
