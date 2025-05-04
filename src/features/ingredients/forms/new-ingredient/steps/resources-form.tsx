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
import { Input } from "@/components/ui/input";

export const ResourcesForm = () => {
  const { control } = useFormContext<NewEmployeeProfileStepperFormValues>();

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
                  <SelectItem value="Yes">Sí</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="paidSoftwareCount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cantidad de software de pago que dispone</FormLabel>
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
  );
};
