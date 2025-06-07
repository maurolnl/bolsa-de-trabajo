import { useFormContext } from "react-hook-form";
import { NewEmployeeProfileStepperFormValues } from "../new-employee-profile-stepper-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  postgraduateTitlesOptions,
  schoolStudiesOrientationOptions,
  tertiaryStudies,
  universityTitlesOptions,
} from "../../utils";
import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";

export const EducationForm = () => {
  const {
    control,
    watch,
    formState: { errors },
    setError,
    setValue,
  } = useFormContext<NewEmployeeProfileStepperFormValues>();

  const handleTertiaryStudyChange = (value: string[]) => {
    if (value.includes("Otro")) {
      setValue("tertiaryStudyOther", "");
      setError("tertiaryStudyOther", {
        message: "Debe ingresar un título",
      });
      setValue("tertiaryStudies", value, { shouldValidate: false });
      return;
    }
    setValue("tertiaryStudies", value, { shouldValidate: false });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <FormField
          control={control}
          name="universityTitles"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Título Universitario</FormLabel>
                <FormDescription>
                  Seleccione el título universitario que posee
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {universityTitlesOptions.map((title) => (
                  <FormField
                    key={title.value}
                    control={control}
                    name="universityTitles"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={title.value}
                          className="flex items-center"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(title.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  if (field.value) {
                                    field.onChange([
                                      ...field.value,
                                      title.value,
                                    ]);
                                  } else {
                                    field.onChange([title.value]);
                                  }
                                } else {
                                  field.onChange(
                                    field.value?.filter(
                                      (value) => value !== title.value
                                    )
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal ml-2">
                            {title.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />
        {watch("universityTitles")?.length > 0 ? (
          <FormField
            control={control}
            name="universityTitleFiles"
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-2 mb-4">
                    <FormDescription>
                      Suba los documentos del título universitario
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
                      placeholder="Suba documentos del título"
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
        <FormField
          control={control}
          name="postgraduateTitles"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Título de Posgrado</FormLabel>
                <FormDescription>
                  Seleccione el título de posgrado que posee
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {postgraduateTitlesOptions.map((title) => (
                  <FormField
                    key={title.value}
                    control={control}
                    name="postgraduateTitles"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={title.value}
                          className="flex items-center"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(title.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  if (field.value) {
                                    field.onChange([
                                      ...field.value,
                                      title.value,
                                    ]);
                                  } else {
                                    field.onChange([title.value]);
                                  }
                                } else {
                                  field.onChange(
                                    field.value.filter(
                                      (value) => value !== title.value
                                    )
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal ml-2">
                            {title.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />
        {watch("postgraduateTitles")?.length > 0 ? (
          <FormField
            control={control}
            name="postgraduateTitleFiles"
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-2 mb-4">
                    <FormDescription>
                      Suba los documentos del título de posgrado
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
                      placeholder="Suba documentos del título"
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
        <FormField
          control={control}
          name="schoolStudiesOrientation"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Orientación de Estudios</FormLabel>
                <FormDescription>
                  Seleccione la orientación de estudios que posee
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {schoolStudiesOrientationOptions.map((title) => (
                  <FormField
                    key={title.value}
                    control={control}
                    name="schoolStudiesOrientation"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={title.value}
                          className="flex items-center"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(title.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  if (field.value) {
                                    field.onChange([
                                      ...field.value,
                                      title.value,
                                    ]);
                                  } else {
                                    field.onChange([title.value]);
                                  }
                                } else {
                                  field.onChange(
                                    field.value.filter(
                                      (value) => value !== title.value
                                    )
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal ml-2">
                            {title.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />
        {watch("schoolStudiesOrientation")?.length > 0 ? (
          <FormField
            control={control}
            name="schoolStudiesOrientationFiles"
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-2 mb-4">
                    <FormDescription>
                      Suba los documentos de la orientación de estudios
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
                      placeholder="Suba documentos del título"
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
        <FormField
          control={control}
          name="tertiaryStudies"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Título Terciario</FormLabel>
                <FormDescription>
                  Seleccione el título terciario que posee
                </FormDescription>
              </div>
              <FormField
                control={control}
                name="tertiaryStudies"
                render={({ field }) => {
                  return (
                    <MultiSelect
                      options={tertiaryStudies.map((study) => ({
                        label: study,
                        value: study,
                      }))}
                      onValueChange={handleTertiaryStudyChange}
                      value={field.value}
                    />
                  );
                }}
              />
            </FormItem>
          )}
        />
        {watch("tertiaryStudies")?.includes("Otro") && (
          <FormField
            control={control}
            name="tertiaryStudyOther"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div>
                    <Input {...field} placeholder="Escriba el título" />
                    {errors.tertiaryStudyOther && (
                      <p className="text-red-500 text-sm">
                        {errors.tertiaryStudyOther.message}
                      </p>
                    )}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        )}
        {watch("tertiaryStudies")?.length > 0 ? (
          <FormField
            control={control}
            name="tertiaryStudyFiles"
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-2 mb-4">
                    <FormDescription>
                      Suba los documentos del título terciario
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
                      placeholder="Suba documentos del título"
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
      </div>
    </div>
  );
};
