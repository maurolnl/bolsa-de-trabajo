import { useFormContext } from "react-hook-form";
import { NewEmployeeProfileStepperFormValues } from "../new-employee-profile-stepper-form";
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
} from "@/components/ui/form";
import {
  internetConnectionOptions,
  internetConnectionTypeOptions,
  timeZoneCompatibilityOptions,
} from "../../utils";
import { Button } from "@/components/ui/button";
import { XIcon, PlusIcon } from "lucide-react";

export const LocationForm = () => {
  const { control, watch, setValue } =
    useFormContext<NewEmployeeProfileStepperFormValues>();

  const handleAddInternetConnection = () => {
    // Add new internet connection to the form
    const currentValues = Array.isArray(watch("internetConnection"))
      ? watch("internetConnection")
      : [];

    // Default values for new connection
    const newConnection = {
      type: internetConnectionTypeOptions[0],
      speed: internetConnectionOptions[0],
    };

    // Add the new connection to the array
    setValue("internetConnection", [...currentValues, newConnection], {
      shouldValidate: false,
    });
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="internetConnection"
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-row justify-between items-center">
              <FormLabel>Conexión a internet</FormLabel>
              <Button
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
                              const updatedValues = [...field.value];
                              updatedValues[index] = {
                                ...updatedValues[index],
                                type: newValue as any,
                              };
                              field.onChange(updatedValues);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {internetConnectionTypeOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <Select
                            value={connection.speed}
                            onValueChange={(newValue) => {
                              const updatedValues = [...field.value];
                              updatedValues[index] = {
                                ...updatedValues[index],
                                speed: newValue as any,
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
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updatedValues = [...field.value];
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
        name="timeZoneCompatibility"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Zona horaria acorde</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione diferencia horaria" />
                </SelectTrigger>
                <SelectContent>
                  {timeZoneCompatibilityOptions.map((option) => (
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
    </div>
  );
};
