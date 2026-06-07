import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-screen";
import { roleOptions, yearsOfExperienceOptions } from "../../utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { experienceSchema, ExperienceFormValues } from "../schema";
import { StepFormProps } from "./types";

export const ExperienceForm = ({
  defaultValues,
  isLoading,
  isFirstStep,
  onPrevious,
  onSubmit,
}: StepFormProps<ExperienceFormValues>) => {
  const formDefaultValues = useMemo<ExperienceFormValues>(
    () => ({
      position: "",
      role: roleOptions[0],
      yearsOfExperience: yearsOfExperienceOptions[0],
      certifications: [],
      portfolioUrl: "",
      ...defaultValues,
    }),
    [defaultValues],
  );

  const form = useForm<ExperienceFormValues>({
    mode: "onChange",
    resolver: zodResolver(experienceSchema),
    defaultValues: formDefaultValues,
    values: formDefaultValues,
  });

  const { control, formState, watch } = form;

  const certifications = watch("certifications");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data">
        <CardContent className="space-y-4">
      <div className="space-y-4">
        <FormField
          control={control}
          name="position"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <FormLabel>Posición pretendida</FormLabel>
                    <FormDescription>
                      Ingrese el nombre de la posición que está buscando
                    </FormDescription>
                  </div>
                  <Input {...field} placeholder="FullStack Developer" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <div className="mb-4">
                <FormLabel>Rol que llevó a cabo</FormLabel>
                <FormDescription>
                  Seleccione el rol que llevó a cabo
                </FormDescription>
              </div>
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {roleOptions.map((title) => (
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
                <FormDescription>
                  Años de expereiencia en el rol seleccionado
                </FormDescription>
              </div>
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
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
                  <FormLabel>
                    Certificaciones profesionales{" "}
                    <span className="text-sm text-muted-foreground font-normal">
                      (Opcional)
                    </span>
                  </FormLabel>
                  <FormDescription>
                    Agregue las certificaciones profesionales que posee
                  </FormDescription>
                </div>
                <AutocompleteInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Escriba el título de la certificación"
                  addButtonLabel="Agregar"
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      {certifications && certifications.length > 0 ? (
        <FormField
          control={control}
          name="certificationFiles"
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
        name="portfolioUrl"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <div className="space-y-2">
                <div className="space-y-1">
                  <FormLabel>
                    Portafolio{" "}
                    <span className="text-sm text-muted-foreground font-normal">
                      (Opcional)
                    </span>
                  </FormLabel>
                  <FormDescription>
                    Ingrese el link a su portafolio que muestre sus productos
                    digitales
                  </FormDescription>
                </div>
                <Input {...field} placeholder="https://www.my-portfolio.com" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={isFirstStep || isLoading}
          >
            <ArrowLeftIcon size={20} />
            Volver
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size={20} /> : null}
            Siguiente
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};
