import { KeyboardEvent, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, Plus, X } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import { useEmployeeFileDownload } from "@/features/employees/hooks/use-employee-file-download";
import { UnassignedCertificate } from "@/features/employees/models/Employee";
import { experienceSchema, ExperienceFormValues } from "../schema";
import { StepFormProps } from "./types";

type ExperienceFormProps = StepFormProps<ExperienceFormValues> & {
  // Ausente hasta que el paso base se crea: sin empleado no hay PDF cargado que descargar.
  employeeId?: number;
  unassignedCertificates: UnassignedCertificate[];
};

export const ExperienceForm = ({
  employeeId,
  unassignedCertificates,
  defaultValues,
  isLoading,
  isFirstStep,
  onPrevious,
  onSubmit,
}: ExperienceFormProps) => {
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

  const { control, formState, watch, setValue } = form;
  const certificationFields = useFieldArray({ control, name: "certifications" });
  const certifications = watch("certifications") ?? [];
  const downloads = useEmployeeFileDownload();

  const [newCertification, setNewCertification] = useState("");
  const [newCertificationError, setNewCertificationError] = useState<
    string | null
  >(null);

  const addCertification = () => {
    const name = newCertification.trim();
    if (!name) return;

    const exists = certifications.some(
      (certification) =>
        certification.name.trim().toLowerCase() === name.toLowerCase(),
    );
    if (exists) {
      setNewCertificationError("La certificación ya fue agregada");
      return;
    }

    certificationFields.append({ name, documentId: null });
    setNewCertification("");
    setNewCertificationError(null);
  };

  const onNewCertificationKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      addCertification();
    }
  };

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
                      Nombre de la posición pretendida
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
                <FormLabel>Rol desempeñado</FormLabel>
                <FormDescription>
                  Rol desempeñado en la experiencia previa
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
                  Años de experiencia en el rol seleccionado
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
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="new-certification">
            Certificaciones profesionales{" "}
            <span className="text-sm text-muted-foreground font-normal">
              (Opcional)
            </span>
          </Label>
          <p className="text-[0.8rem] text-muted-foreground">
            Certificaciones profesionales obtenidas y, opcionalmente, el PDF de
            cada una (hasta 5 MB)
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            id="new-certification"
            value={newCertification}
            onChange={(event) => {
              setNewCertification(event.target.value);
              setNewCertificationError(null);
            }}
            onKeyDown={onNewCertificationKeyDown}
            placeholder="Título de la certificación"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={addCertification}
            disabled={!newCertification.trim()}
            size="sm"
          >
            <Plus className="h-3 w-3" />
            Agregar
          </Button>
        </div>
        {newCertificationError ? (
          <p className="text-sm font-medium text-destructive">
            {newCertificationError}
          </p>
        ) : null}
        {certificationFields.fields.length > 0 ? (
          <ul className="space-y-3">
            {certificationFields.fields.map((field, index) => {
              const certification = certifications[index];
              const documentId = certification?.documentId ?? null;
              const hasNewDocument = certification?.document instanceof File;
              // El PDF ya cargado solo se ofrece mientras no se lo reemplace ni se lo quite.
              const target =
                employeeId && documentId !== null && !hasNewDocument
                  ? ({
                      kind: "certificate",
                      employeeId,
                      fileId: documentId,
                    } as const)
                  : null;

              return (
                <li
                  key={field.id}
                  className="space-y-2 rounded-md border p-3"
                  data-testid="certification-item"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">
                      {certification?.name ?? field.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => certificationFields.remove(index)}
                    >
                      <X className="h-3 w-3" />
                      Quitar
                    </Button>
                  </div>
                  <FormField
                    control={control}
                    name={`certifications.${index}.name`}
                    render={() => <FormMessage />}
                  />
                  {target ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        PDF cargado
                      </span>
                      {/* Botón y nunca `<a href>`: la URL prefirmada no se deja en el DOM. */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={downloads.isDownloading(target)}
                        onClick={() => void downloads.download(target)}
                      >
                        {downloads.isDownloading(target)
                          ? "Abriendo…"
                          : "Descargar"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setValue(`certifications.${index}.documentId`, null)
                        }
                      >
                        Quitar PDF
                      </Button>
                      {downloads.hasFailed(target) ? (
                        <p className="w-full text-sm text-destructive">
                          No pudimos abrir este certificado.
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                  <FormField
                    control={control}
                    name={`certifications.${index}.document`}
                    render={({ field: { onChange, value, ...fieldProps } }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-2">
                            {/* Se remonta al descartar para que el input nativo también
                                olvide el archivo elegido. */}
                            <Input
                              {...fieldProps}
                              key={value ? "selected" : "empty"}
                              value={undefined}
                              type="file"
                              accept=".pdf,application/pdf"
                              aria-label={`PDF de ${certification?.name ?? field.name}`}
                              onChange={(event) =>
                                onChange(event.target.files?.[0])
                              }
                            />
                            {value ? (
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm text-muted-foreground">
                                  Archivo seleccionado: {value.name}
                                </p>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onChange(undefined)}
                                >
                                  Descartar
                                </Button>
                              </div>
                            ) : null}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </li>
              );
            })}
          </ul>
        ) : null}
        {unassignedCertificates.length > 0 && employeeId ? (
          <ul className="space-y-2">
            {unassignedCertificates.map((file) => {
              const target = {
                kind: "certificate",
                employeeId,
                fileId: file.id,
              } as const;

              return (
                <li
                  key={file.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-dashed p-3"
                >
                  <div className="space-y-1">
                    <span className="text-sm font-medium">
                      Certificado sin asociar
                    </span>
                    <p className="text-sm text-muted-foreground">{file.title}</p>
                    {downloads.hasFailed(target) ? (
                      <p className="text-sm text-destructive">
                        No pudimos abrir este archivo.
                      </p>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={downloads.isDownloading(target)}
                    onClick={() => void downloads.download(target)}
                  >
                    {downloads.isDownloading(target) ? "Abriendo…" : "Descargar"}
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
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
                    Link al portafolio con los productos digitales realizados
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
