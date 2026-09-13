import { Card, CardContent } from "@/components/ui/card";
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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { EducationTitleFormValues, educationTitleSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { educationStatusLabels, educationTypeLabels } from "./constants";
import { TypographyP } from "@/components/ui/typography/typography-p";
import { Button } from "@/components/ui/button";
import { AnimatePresence } from "motion/react";
import {
  educationTypeOptions,
  getAvailableEducationTitles,
  hasHighSchoolOrientation,
} from "../../../utils";

const DEFAULT_EDUCATION_TITLE: EducationTitleFormValues = {
  title: "",
  type: "university",
  status: "in-progress",
};

interface EducationFormProps {
  open: boolean;
  initialValues?: EducationTitleFormValues;
  otherEducationTitles: EducationTitleFormValues[];
  onClose: () => void;
  onSave: (data: EducationTitleFormValues) => void;
}

export const EducationForm = ({
  open,
  initialValues,
  otherEducationTitles,
  onClose,
  onSave,
}: EducationFormProps) => {
  const isEditing = initialValues !== undefined;

  const educationTitleForm = useForm<EducationTitleFormValues>({
    mode: "onChange",
    resolver: zodResolver(educationTitleSchema),
    defaultValues: DEFAULT_EDUCATION_TITLE,
  });

  useEffect(() => {
    if (open) {
      educationTitleForm.reset(initialValues ?? DEFAULT_EDUCATION_TITLE);
    }
  }, [educationTitleForm, initialValues, open]);

  const selectedType = educationTitleForm.watch("type");
  const availableTitles = getAvailableEducationTitles(
    selectedType,
    otherEducationTitles,
  );
  const availableTypes = educationTypeOptions.filter(
    (type) =>
      type !== "high-school-orientation" ||
      !hasHighSchoolOrientation(otherEducationTitles),
  );

  return (
    <AnimatePresence>
      {open ? (
        <Card
          className="border-dashed bg-muted/20"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{
            duration: 0.3,
            scale: { type: "decay", visualDuration: 0.3, bounce: 0 },
          }}
          style={{ transformOrigin: "top" }}
        >
          <CardContent className="pt-6">
            <Form {...educationTitleForm}>
              <div className="space-y-4">
                <FormField
                  control={educationTitleForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione título" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableTitles.map((title) => (
                            <SelectItem key={title} value={title}>
                              {title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        <Select
                          onValueChange={(type) => {
                            if (type !== field.value) {
                              educationTitleForm.setValue("title", "", {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                            }
                            field.onChange(type);
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {educationTypeLabels[type]}
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(educationStatusLabels).map(
                              ([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ),
                            )}
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
                            accept=".pdf,application/pdf"
                            onChange={(event) =>
                              onChange(event.target.files?.[0])
                            }
                          />
                        </FormControl>
                        {selectedFile ? (
                          <TypographyP className="text-sm text-muted-foreground">
                            Archivo seleccionado:{" "}
                            {typeof selectedFile === "string"
                              ? selectedFile
                              : selectedFile.name}
                          </TypographyP>
                        ) : null}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={educationTitleForm.handleSubmit(onSave)}
                  >
                    {isEditing ? "Guardar" : "Agregar"}
                  </Button>
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>
      ) : null}
    </AnimatePresence>
  );
};
