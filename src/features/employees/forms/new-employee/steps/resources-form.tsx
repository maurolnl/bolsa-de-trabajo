import { NewEmployeeProfileStepperFormValues } from "../new-employee-profile-stepper-form";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { haveComputerOptions, operatingSystemOptions } from "../../utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";

export const ResourcesForm = () => {
  const { control, watch } =
    useFormContext<NewEmployeeProfileStepperFormValues>();
  const hasComputer = watch("hasComputer") === "Si";

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="hasComputer"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <div className="mb-4">
              <FormLabel>¿Dispone de una computadora?</FormLabel>
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
                  Seleccione el sistema operativo de la computadora
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
                      <FormLabel className="font-normal">{option}</FormLabel>
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
                    Software de pago{" "}
                    <span className="text-sm text-muted-foreground font-normal">
                      (Opcional)
                    </span>
                  </FormLabel>
                  <FormDescription>
                    Agregue el software de pago que dispone
                  </FormDescription>
                </div>
                <AutocompleteInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Escriba el nombre del software"
                  addButtonLabel="Agregar"
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
