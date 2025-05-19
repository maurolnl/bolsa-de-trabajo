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
import { internetConnectionOptions } from "../../utils";
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

    // Find the first option that's not already selected
    const availableOption = internetConnectionOptions.find(
      (option) => !currentValues.includes(option)
    );

    // If we found an available option, add it to the array
    if (availableOption) {
      setValue("internetConnection", [...currentValues, availableOption], {
        shouldValidate: false,
      });
    }
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
              Presione el boton + para agregar más velocidades de conexión
            </FormDescription>
            <div className="space-y-2">
              {Array.isArray(field.value) && field.value.length > 0
                ? field.value.map((value, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-grow">
                        <Select
                          value={value}
                          onValueChange={(newValue) => {
                            const updatedValues = [...field.value];
                            updatedValues[index] = newValue as any;
                            field.onChange(updatedValues);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {internetConnectionOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                            <SelectItem value="> 50Mbps">
                              &gt; 50Mbps
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updatedValues = [...field.value];
                          updatedValues.splice(index, 1);
                          field.onChange(updatedValues);
                        }}
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
                  <SelectItem value="< 1h">&lt; 1h</SelectItem>
                  <SelectItem value="2hs">2hs</SelectItem>
                  <SelectItem value="3hs">3hs</SelectItem>
                  <SelectItem value="4hs">4hs</SelectItem>
                  <SelectItem value="> 5hs">&gt; 5hs</SelectItem>
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
