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
import { roleOptions, yearsOfExperienceOptions } from "../../utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useState } from "react";

// Custom component for certification input with badges
const CertificationInput = ({
  value = [],
  onChange,
}: {
  value?: string[];
  onChange: (value: string[]) => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  const addCertification = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeCertification = (certificationToRemove: string) => {
    onChange(value.filter((cert) => cert !== certificationToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCertification();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escriba el título de la certificación"
          className="flex-1"
        />
        <Button
          type="button"
          onClick={addCertification}
          disabled={!inputValue.trim()}
          size="sm"
        >
          <Plus className="h-3 w-3" />
          Agregar
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((certification, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {certification}
              <button
                type="button"
                onClick={() => removeCertification(certification)}
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export const ExperienceForm = () => {
  const { control, formState, watch } =
    useFormContext<NewEmployeeProfileStepperFormValues>();

  const certifications = watch("certifications");

  return (
    <div className="space-y-4">
      <div className="space-y-4">
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
                  <FormLabel>
                    Certificaciones profesionales{" "}
                    <span className="text-sm text-muted-foreground">
                      (opcional)
                    </span>
                  </FormLabel>
                  <FormDescription>
                    Agregue las certificaciones profesionales que posee
                  </FormDescription>
                </div>
                <CertificationInput
                  value={field.value}
                  onChange={field.onChange}
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
                  <FormLabel>Portafolio</FormLabel>
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
    </div>
  );
};
