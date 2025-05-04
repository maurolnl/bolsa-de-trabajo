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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const LocationForm = () => {
  const { control } = useFormContext<NewEmployeeProfileStepperFormValues>();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="internetConnection"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Conexión a internet</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione velocidad de conexión" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="< 10Mbps">&lt; 10Mbps</SelectItem>
                  <SelectItem value="20Mbps">20Mbps</SelectItem>
                  <SelectItem value="30Mbps">30Mbps</SelectItem>
                  <SelectItem value="40Mbps">40Mbps</SelectItem>
                  <SelectItem value="50Mbps">50Mbps</SelectItem>
                  <SelectItem value="> 50Mbps">&gt; 50Mbps</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
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
