import { useFormContext } from "react-hook-form";
import { NewEmployeeProfileStepperFormValues } from "../new-employee-profile-stepper-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { roles, yearsOfExperienceOptions } from "../../utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

export const ExperienceForm = () => {
  const { control, formState, watch } =
    useFormContext<NewEmployeeProfileStepperFormValues>();

  console.log(formState.errors);

  const certifications = watch("certifications");

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <FormField
          control={control}
          name="role"
          render={() => (
            <FormItem className="space-y-3">
              <div className="mb-4">
                <FormLabel>Rol que llevó a cabo</FormLabel>
                <FormDescription>
                  Seleccione el rol que llevó a cabo
                </FormDescription>
              </div>
              {roles.map((title) => (
                <FormField
                  key={title}
                  control={control}
                  name="role"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={title}
                        className="flex items-center space-x-2 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(title)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                if (field.value) {
                                  field.onChange([...field.value, title]);
                                } else {
                                  field.onChange([title]);
                                }
                              } else {
                                field.onChange(
                                  field.value?.filter(
                                    (value) => value !== title
                                  )
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {title}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              {formState.errors.role && (
                <FormMessage className="text-red-500">
                  {formState.errors.role.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="yearsOfExperience"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <div className="mb-4">
                <FormLabel>Años de experiencia</FormLabel>
                <FormDescription>Seleccione solo una opción</FormDescription>
              </div>
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    className="flex flex-col space-y-1"
                  >
                    {yearsOfExperienceOptions.map((title) => (
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
              {formState.errors.yearsOfExperience && (
                <FormMessage className="text-red-500">
                  {formState.errors.yearsOfExperience.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
      </div>
      <Separator orientation="horizontal" />
      <FormField
        control={control}
        name="certifications"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <div className="space-y-2">
                <div className="space-y-1">
                  <FormLabel>Título de la certificación</FormLabel>
                  <FormDescription>
                    Escriba el Título de la certificación como palabras clave
                  </FormDescription>
                </div>
                <Input
                  {...field}
                  placeholder="Escriba el Título de la certificación"
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      {certifications && certifications.length > 0 ? (
        <FormField
          control={control}
          name="certificationsFile"
          render={({ field: { onChange, value, ...fieldProps } }) => (
            <FormItem>
              <FormControl>
                <div className="space-y-2 mb-4">
                  <FormDescription>
                    Suba los documentos de las certificaciones
                  </FormDescription>
                  <Input
                    {...fieldProps}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const files = e.target.files;
                      onChange(files);
                    }}
                    placeholder="Suba documentos de las certificaciones"
                  />
                  {value &&
                    Object.values(value).map((file: unknown) => (
                      <p
                        key={Math.random()}
                        className="text-sm text-muted-foreground"
                      >
                        Archivo seleccionado: {(file as File).name}
                      </p>
                    ))}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      ) : null}
      <Separator orientation="horizontal" />
      <FormField
        control={control}
        name="projectLinks"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <div className="space-y-2">
                <div className="space-y-1">
                  <FormLabel>Link a productos digitales</FormLabel>
                  <FormDescription>
                    Escriba el link a productos digitales
                  </FormDescription>
                </div>
                <Input
                  {...field}
                  placeholder="Escriba el link a productos digitales"
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
