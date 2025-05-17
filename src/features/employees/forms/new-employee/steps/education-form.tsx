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
import { Separator } from "@/components/ui/separator";

export const EducationForm = () => {
  const { control } = useFormContext<NewEmployeeProfileStepperFormValues>();

  return (
    <div className="space-y-4">
      <TypographyH3 className="text-lg font-medium mb-2">
        Nivel Universitario
      </TypographyH3>
      <div className="space-y-4">
        <FormField
          control={control}
          name="undergraduateDegree"
          render={({
            field: { onChange, value: undergraduateDegree, ...fieldProps },
          }) => (
            <FormItem>
              <FormLabel>Posee un titulo de pregrado</FormLabel>
              <FormControl>
                <div className="space-y-2">
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
                  {undergraduateDegree &&
                    Object.values(undergraduateDegree).map((file: unknown) => (
                      <p
                        key={Math.random()}
                        className="text-sm text-muted-foreground"
                      >
                        Archivo seleccionado: {(file as File).name}
                      </p>
                    ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="bachelorDegree"
          render={({
            field: { onChange, value: bachelorDegree, ...fieldProps },
          }) => (
            <FormItem>
              <FormLabel>Posee un titulo de grado</FormLabel>
              <FormControl>
                <div className="space-y-2">
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
                  {bachelorDegree &&
                    Object.values(bachelorDegree).map((file: unknown) => (
                      <p
                        key={Math.random()}
                        className="text-sm text-muted-foreground"
                      >
                        Archivo seleccionado: {(file as File).name}
                      </p>
                    ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator orientation="horizontal" />

        <TypographyH3 className="text-lg font-medium mb-2">
          Posgrado
        </TypographyH3>
        <FormField
          control={control}
          name="specializationDegree"
          render={({
            field: { onChange, value: specializationDegree, ...fieldProps },
          }) => (
            <FormItem>
              <FormLabel>Posee un titulo de especializacion</FormLabel>
              <FormControl>
                <div className="space-y-2">
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
                  {specializationDegree &&
                    Object.values(specializationDegree).map((file: unknown) => (
                      <p
                        key={Math.random()}
                        className="text-sm text-muted-foreground"
                      >
                        Archivo seleccionado: {(file as File).name}
                      </p>
                    ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="masterDegree"
          render={({
            field: { onChange, value: masterDegree, ...fieldProps },
          }) => (
            <FormItem>
              <FormLabel>Posee un titulo de maestría</FormLabel>
              <FormControl>
                <div className="space-y-2">
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
                  {masterDegree &&
                    Object.values(masterDegree).map((file: unknown) => (
                      <p
                        key={Math.random()}
                        className="text-sm text-muted-foreground"
                      >
                        Archivo seleccionado: {(file as File).name}
                      </p>
                    ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="phdDegree"
          render={({
            field: { onChange, value: phdDegree, ...fieldProps },
          }) => (
            <FormItem>
              <FormLabel>Posee un titulo de doctorado</FormLabel>
              <FormControl>
                <div className="space-y-2">
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
                  {phdDegree &&
                    Object.values(phdDegree).map((file: unknown) => (
                      <p
                        key={Math.random()}
                        className="text-sm text-muted-foreground"
                      >
                        Archivo seleccionado: {(file as File).name}
                      </p>
                    ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator orientation="horizontal" />

        <FormField
          control={control}
          name="tertiaryDegree"
          render={({
            field: { onChange, value: tertiaryDegree, ...fieldProps },
          }) => (
            <FormItem>
              <FormLabel>Posee un titulo terciario</FormLabel>
              <FormControl>
                <div className="space-y-2">
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
                  {tertiaryDegree &&
                    Object.values(tertiaryDegree).map((file: unknown) => (
                      <p
                        key={Math.random()}
                        className="text-sm text-muted-foreground"
                      >
                        Archivo seleccionado: {(file as File).name}
                      </p>
                    ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="highSchoolDegree"
          render={({
            field: { onChange, value: highSchoolDegree, ...fieldProps },
          }) => (
            <FormItem>
              <FormLabel>Posee un titulo de secundario</FormLabel>
              <FormControl>
                <div className="space-y-2">
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
                  {highSchoolDegree &&
                    Object.values(highSchoolDegree).map((file: unknown) => (
                      <p
                        key={Math.random()}
                        className="text-sm text-muted-foreground"
                      >
                        Archivo seleccionado: {(file as File).name}
                      </p>
                    ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="relevantAreaDegree"
          render={({
            field: { onChange, value: relevantAreaDegree, ...fieldProps },
          }) => (
            <FormItem>
              <FormLabel>
                Posee un titulo de un area de estudio relevante
              </FormLabel>
              <FormControl>
                <div className="space-y-2">
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
                  {relevantAreaDegree &&
                    Object.values(relevantAreaDegree).map((file: unknown) => (
                      <p
                        key={Math.random()}
                        className="text-sm text-muted-foreground"
                      >
                        Archivo seleccionado: {(file as File).name}
                      </p>
                    ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
