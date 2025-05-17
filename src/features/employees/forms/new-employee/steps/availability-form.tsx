import { useFormContext } from "react-hook-form";
import { NewEmployeeProfileStepperFormValues } from "../new-employee-profile-stepper-form";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TypographyH3 } from "@/components/ui/typography/typography-h3";

export const AvailabilityForm = () => {
  const { control } = useFormContext<NewEmployeeProfileStepperFormValues>();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormField
          control={control}
          name="dedicationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dedicacion horaria fija</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione tipo de dedicación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Time">Full Time</SelectItem>
                    <SelectItem value="Part time">Part time</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="flexibleHours"
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
                <FormLabel>Proyectos compatibles</FormLabel>
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
                <FormLabel>Proyectos incompatibles</FormLabel>
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
    </div>
  );
};
