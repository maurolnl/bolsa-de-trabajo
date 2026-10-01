import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-screen";
import {
  getOperatingSystemLabel,
  haveComputerOptions,
  operatingSystemOptions,
} from "../../utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { resourcesSchema, ResourcesFormValues } from "../schema";
import { StepFormProps } from "./types";

export const ResourcesForm = ({
  defaultValues,
  isLoading,
  isFirstStep,
  onPrevious,
  onSubmit,
}: StepFormProps<ResourcesFormValues>) => {
  const form = useForm<ResourcesFormValues>({
    mode: "onChange",
    resolver: zodResolver(resourcesSchema),
    defaultValues: defaultValues,
    values: defaultValues,
  });

  const { control, watch } = form;
  const hasComputer = watch("hasComputer") === "Si";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="hasComputer"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <div className="mb-4">
                  <FormLabel>¿Hay una computadora disponible?</FormLabel>
                </div>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {haveComputerOptions.map((title) => (
                        <FormItem
                          key={title}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={title} />
                          </FormControl>
                          <FormLabel className="font-normal">{title}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              </FormItem>
            )}
          />

          {hasComputer && (
            <FormField
              control={control}
              name="operatingSystem"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="mb-4">
                    <FormLabel>Sistema operativo disponible</FormLabel>
                    <FormDescription>
                      Sistema operativo de la computadora
                    </FormDescription>
                  </div>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {operatingSystemOptions.map((option) => (
                        <FormItem
                          key={option}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={option} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {getOperatingSystemLabel(option)}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={control}
            name="paidSoftware"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <FormLabel>
                        Software relevante{" "}
                        <span className="text-sm text-muted-foreground font-normal">
                          (Opcional)
                        </span>
                      </FormLabel>
                      <FormDescription>
                        Programas que se saben utilizar y aportan al trabajo. Por
                        ejemplo: Excel, Photoshop, AutoCAD, Tango Gestión, Premiere o
                        Visual Studio Code.
                      </FormDescription>
                    </div>
                    <AutocompleteInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Ej. Excel"
                      addButtonLabel="Agregar"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
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
