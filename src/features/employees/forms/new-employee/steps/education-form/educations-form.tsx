import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-screen";
import { TypographyP } from "@/components/ui/typography/typography-p";
import {
  educationSchema,
  EducationFormValues,
  EducationTitleFormValues,
} from "../../schema";
import { StepFormProps } from "../types";
import { EducationCard } from "./education-card";
import { EmptyEducation } from "./empty-education";
import { EducationForm } from "./education-form";

export const EducationsForm = ({
  defaultValues,
  isLoading,
  isFirstStep,
  onPrevious,
  onSubmit,
}: StepFormProps<EducationFormValues>) => {
  const [openEducationForm, setOpenEducationForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const isEditing = editingIndex !== null;

  const form = useForm<EducationFormValues>({
    mode: "onChange",
    resolver: zodResolver(educationSchema),
    defaultValues: defaultValues,
    values: defaultValues,
  });

  const educationTitles = form.watch("educationTitles");

  const handleOpenCreate = () => {
    setOpenEducationForm(true);
    setEditingIndex(null);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setOpenEducationForm(true);
  };

  const handleCancelEdit = () => {
    setOpenEducationForm(false);
    setEditingIndex(null);
  };

  const handleSaveEducationTitle = (data: EducationTitleFormValues) => {
    const nextEducationTitles = [...educationTitles];

    if (!isEditing) {
      nextEducationTitles.push(data);
    } else {
      nextEducationTitles[editingIndex] = data;
    }

    form.setValue("educationTitles", nextEducationTitles, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setOpenEducationForm(false);
    setEditingIndex(null);
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">Titulos academicos</h3>
              <TypographyP className="text-sm text-muted-foreground">
                Agrega un titulo universitario presionando el boton "+".
              </TypographyP>
            </div>
            <Button type="button" size="default" onClick={handleOpenCreate}>
              <PlusIcon className="h-4 w-4" />
              Agregar
            </Button>
          </div>

          <EducationForm
            open={openEducationForm}
            onSave={handleSaveEducationTitle}
            onClose={handleCancelEdit}
            initialValues={
              editingIndex === null ? undefined : educationTitles[editingIndex]
            }
          />

          {educationTitles.length === 0 ? (
            <EmptyEducation />
          ) : (
            <EducationCard
              onDelete={handleDeleteEducationTitle}
              onEdit={handleOpenEdit}
              titles={educationTitles}
            />
          )}
          {form.formState.errors.educationTitles?.root?.message ? (
            <TypographyP className="text-sm text-destructive">
              {form.formState.errors.educationTitles.root.message}
            </TypographyP>
          ) : null}
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
            Guardar
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};
