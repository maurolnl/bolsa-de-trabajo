import { useFormContext } from "react-hook-form";
import { NewEmployeeProfileStepperFormValues } from "../new-employee-profile-stepper-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TypographyH3 } from "@/components/ui/typography/typography-h3";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export const ExperienceForm = () => {
  const { control } = useFormContext<NewEmployeeProfileStepperFormValues>();

  return (
    <div className="space-y-6">
      <div>
        <TypographyH3 className="mb-2 text-lg font-medium">
          Años en el puesto
        </TypographyH3>
        <div className="space-y-4">
          <FormField
            control={control}
            name="yearsLeadingProjects"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Años liderando proyectos</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ingrese años de experiencia liderando proyectos"
                    type="number"
                    min="1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-2">
            <FormField
              control={control}
              name="yearsAsAssistant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Años como adjunto de proyectos</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ingrese años de experiencia como adjunto de proyectos"
                      type="number"
                      min="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-2">
            <FormField
              control={control}
              name="yearsAsApprentice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Años como aprendiz en proyectos</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ingrese años de experiencia"
                      type="number"
                      min="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <Separator orientation="horizontal" />

      <div>
        <TypographyH3 className="text-lg font-medium mb-2">
          Tareas relacionadas
        </TypographyH3>
        <div className="space-y-4">
          <div className="grid gap-2">
            <FormField
              control={control}
              name="certifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificaciones</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ingrese certificaciones relevantes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-2">
            <FormField
              control={control}
              name="projectLinks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link a proyectos</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ingrese enlaces a proyectos"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <Separator orientation="horizontal" />

      <div>
        <TypographyH3 className="text-lg font-medium mb-2">
          Normativas y estándares
        </TypographyH3>
        <div className="space-y-4">
          <div className="grid gap-2">
            <FormField
              control={control}
              name="knownRegulations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Cantidad de normativas relevantes conocidas
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ingrese cantidad de normativas"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
