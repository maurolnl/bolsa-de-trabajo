import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem,
} from "@/components/ui/select";
import { NewEmployeeProfileStepperFormValues } from "../new-employee-profile-stepper-form";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { haveComputerOptions, typeOfPaidSoftware } from "../../utils";
import { Input } from "@/components/ui/input";

export const ResourcesForm = () => {
  const { control, watch, formState } =
    useFormContext<NewEmployeeProfileStepperFormValues>();

  const isOtherSoftware = watch("paidSoftware.typeOfPaidSoftware") === "Otro";
  const isSoftwareSelected =
    watch("paidSoftware.typeOfPaidSoftware") &&
    watch("paidSoftware.typeOfPaidSoftware").length > 0;

  console.log(formState.errors);

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="hasComputer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Dispone de una computadora?</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione una opción" />
                </SelectTrigger>
                <SelectContent>
                  {haveComputerOptions.map((option) => (
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

      <FormField
        control={control}
        name="paidSoftware.typeOfPaidSoftware"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Software de pago que dispone</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una opción" />
                </SelectTrigger>
                <SelectContent>
                  {typeOfPaidSoftware.map((option) => (
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
      {isOtherSoftware && (
        <FormField
          control={control}
          name="paidSoftware.typeOfPaidSoftwareOther"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Otro software de pago</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ingrese el nombre del software"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {isSoftwareSelected && (
        <FormField
          control={control}
          name="paidSoftware.paidSoftwareCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad de software de pago</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={0}
                  placeholder="Ingrese la cantidad"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};
