import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, FileTextIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-screen";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TypographyP } from "@/components/ui/typography/typography-p";
import {
  educationSchema,
  educationTitleSchema,
  EducationFormValues,
  EducationTitleFormValues,
} from "../schema";
import { StepFormProps } from "./types";

const DEFAULT_EDUCATION_TITLE: EducationTitleFormValues = {
  title: "",
  type: "university",
  status: "in-progress",
};

const educationTypeLabels: Record<EducationTitleFormValues["type"], string> = {
  university: "Universitario",
  postgraduate: "Posgrado",
  "high-school-orientation": "Orientación secundaria",
  tertiary: "Terciario",
};

const educationStatusLabels: Record<EducationTitleFormValues["status"], string> = {
  "in-progress": "En curso",
  completed: "Completado",
};

export const EducationForm = ({
  isLoading,
  isFirstStep,
  onPrevious,
  onSubmit,
}: StepFormProps<EducationFormValues>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<EducationFormValues>({
    mode: "onChange",
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educationTitles: [],
    },
  });

  const educationTitleForm = useForm<EducationTitleFormValues>({
    mode: "onChange",
    resolver: zodResolver(educationTitleSchema),
    defaultValues: DEFAULT_EDUCATION_TITLE,
  });

  const educationTitles = form.watch("educationTitles");

  const handleOpenCreate = () => {
    setEditingIndex(null);
    setIsEditing(true);
    educationTitleForm.reset(DEFAULT_EDUCATION_TITLE);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setIsEditing(true);
    educationTitleForm.reset(educationTitles[index]);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setIsEditing(false);
    educationTitleForm.reset(DEFAULT_EDUCATION_TITLE);
  };

  const handleSaveEducationTitle = (data: EducationTitleFormValues) => {
    const nextEducationTitles = [...educationTitles];

    if (editingIndex === null) {
      nextEducationTitles.push(data);
    } else {
      nextEducationTitles[editingIndex] = data;
    }

    form.setValue("educationTitles", nextEducationTitles, {
      shouldDirty: true,
      shouldValidate: true,
    });
    handleCancelEdit();
  };

  const handleDeleteEducationTitle = (index: number) => {
    form.setValue(
      "educationTitles",
      educationTitles.filter((_, titleIndex) => titleIndex !== index),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data">
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">Titulos academicos</h3>
              <TypographyP className="text-sm text-muted-foreground">
                Agrega un titulo universitario presionando el boton "+".
              </TypographyP>
            </div>
            <Button type="button" size="icon" onClick={handleOpenCreate}>
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>

          {isEditing ? (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="pt-6">
                <Form {...educationTitleForm}>
                  <div className="space-y-4">
                    <FormField
                      control={educationTitleForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Licenciatura en Sistemas" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={educationTitleForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(educationTypeLabels).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={educationTitleForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione estado" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(educationStatusLabels).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={educationTitleForm.control}
                      name="document"
                      render={({ field: { onChange, value, ...fieldProps } }) => {
                        const selectedFile = value;

                        return (
                          <FormItem>
                            <FormLabel>Certificación</FormLabel>
                            <FormDescription>
                              Suba un archivo si desea adjuntar documentación.
                            </FormDescription>
                            <FormControl>
                              <Input
                                {...fieldProps}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(event) =>
                                  onChange(event.target.files?.[0])
                                }
                              />
                            </FormControl>
                            {selectedFile ? (
                              <TypographyP className="text-sm text-muted-foreground">
                                Archivo seleccionado: {selectedFile.name}
                              </TypographyP>
                            ) : null}
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={handleCancelEdit}>
                        Cancelar
                      </Button>
                      <Button
                        type="button"
                        onClick={educationTitleForm.handleSubmit(handleSaveEducationTitle)}
                      >
                        {editingIndex === null ? "Agregar" : "Guardar"}
                      </Button>
                    </div>
                  </div>
                </Form>
              </CardContent>
            </Card>
          ) : null}

          {educationTitles.length === 0 ? (
            <Card className="border-dashed bg-muted/30">
              <CardContent className="flex items-start gap-4 py-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-muted-foreground">
                  <FileTextIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 rounded bg-muted" />
                  <div className="h-3 w-64 rounded bg-muted" />
                  <div className="flex gap-2 pt-1">
                    <div className="h-6 w-20 rounded-full bg-muted" />
                    <div className="h-6 w-24 rounded-full bg-muted" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {educationTitles.map((educationTitle, index) => (
                <Card key={`${educationTitle.title}-${index}`}>
                  <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-medium">{educationTitle.title}</h4>
                        {educationTitle.document ? (
                          <TypographyP className="text-sm text-muted-foreground">
                            {educationTitle.document.name}
                          </TypographyP>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          {educationStatusLabels[educationTitle.status]}
                        </Badge>
                        <Badge variant="outline">
                          {educationTypeLabels[educationTitle.type]}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenEdit(index)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteEducationTitle(index)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
            Crear Usuario
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};
