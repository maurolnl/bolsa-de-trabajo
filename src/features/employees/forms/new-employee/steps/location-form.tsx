import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, PlusIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectValue,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-screen";
import {
  internetConnectionOptions,
  internetConnectionTypeOptions,
} from "../../utils";
import { locationSchema, LocationFormValues } from "../schema";
import { StepFormProps } from "./types";
import { Timezone } from "@/features/employees/repo/types";

export const LocationForm = ({
  defaultValues,
  isLoading,
  isFirstStep,
  onPrevious,
  onSubmit,
  timezones,
}: StepFormProps<LocationFormValues> & { timezones: Timezone[] }) => {
  const form = useForm<LocationFormValues>({
    mode: "onChange",
    resolver: zodResolver(locationSchema),
    defaultValues: defaultValues,
    values: defaultValues,
  });

  const { control, watch, setValue } = form;

  const handleAddInternetConnection = () => {
    // Add new internet connection to the form
    const internetConns = watch("internetConnections");
    const currentValues = Array.isArray(internetConns) ? internetConns : [];

    // Default values for new connection
    const newConnection = {
      type: internetConnectionTypeOptions[0],
      speed: internetConnectionOptions[0],
    };

    // Add the new connection to the array
    setValue("internetConnections", [...currentValues, newConnection], {
      shouldValidate: false,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="internetConnections"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row justify-between items-center">
                  <FormLabel>Conexión a internet</FormLabel>
                  <Button
                    type="button"
                    onClick={handleAddInternetConnection}
                    variant="outline"
                    size="icon"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>
                <FormDescription>
                  Presione el boton + para agregar más conexiones
                </FormDescription>
                <div className="space-y-2">
                  {Array.isArray(field.value) && field.value.length > 0
                    ? field.value.map((connection, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex-grow flex gap-2">
                            <div className="flex-1">
                              <Select
                                value={connection.type}
                                onValueChange={(newValue) => {
                                  const updatedValues = Array.isArray(
                                    field.value,
                                  )
                                    ? [...field.value]
                                    : [];
                                  updatedValues[index] = {
                                    ...updatedValues[index],
                                    type: newValue as (typeof internetConnectionTypeOptions)[number],
                                  };
                                  field.onChange(updatedValues);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  {internetConnectionTypeOptions.map(
                                    (option) => (
                                      <SelectItem key={option} value={option}>
                                        {option}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex-1">
                              <Select
                                value={connection.speed}
                                onValueChange={(newValue) => {
                                  const updatedValues = Array.isArray(
                                    field.value,
                                  )
                                    ? [...field.value]
                                    : [];
                                  updatedValues[index] = {
                                    ...updatedValues[index],
                                    speed:
                                      newValue as (typeof internetConnectionOptions)[number],
                                  };
                                  field.onChange(updatedValues);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Velocidad" />
                                </SelectTrigger>
                                <SelectContent>
                                  {internetConnectionOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const updatedValues = Array.isArray(field.value)
                                ? [...field.value]
                                : [];
                              updatedValues.splice(index, 1);
                              field.onChange(updatedValues);
                            }}
                            disabled={index === 0}
                          >
                            <XIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    : null}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="timezoneCompatibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zona horaria acorde</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione diferencia horaria" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((option) => (
                        <SelectItem key={option.name} value={option.name}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
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
