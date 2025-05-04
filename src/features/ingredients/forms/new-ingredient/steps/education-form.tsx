import { useFormContext } from "react-hook-form";
import { NewEmployeeProfileStepperFormValues } from "../new-employee-profile-stepper-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TypographyH3 } from "@/components/ui/typography/typography-h3";

export const EducationForm = () => {
  const { control } = useFormContext<NewEmployeeProfileStepperFormValues>();

  return (
    <div className="space-y-4">
      <TypographyH3 className="text-lg font-medium mb-2">
        Nivel educativo
      </TypographyH3>
      <div className="space-y-4">
        <FormField
          control={control}
          name="undergraduateDegree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Posee un titulo de pregrado</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingrese detalles del título" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="bachelorDegree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Posee un titulo de grado</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingrese detalles del título" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="specializationDegree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Posee un titulo de especializacion</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingrese detalles del título" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="masterDegree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Posee un titulo de maestría</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingrese detalles del título" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="phdDegree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Posee un titulo de doctorado</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingrese detalles del título" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="tertiaryDegree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Posee un titulo terciario</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingrese detalles del título" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="highSchoolDegree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Posee un titulo de secundario</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingrese detalles del título" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="relevantAreaDegree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Posee un titulo de un area de estudio relevante
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingrese detalles del título" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
