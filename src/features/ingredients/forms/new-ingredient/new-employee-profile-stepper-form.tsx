import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { newEmployeeProfileSchema } from "./schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { steps } from "./config";

export type NewEmployeeProfileStepperFormValues = z.infer<
  typeof newEmployeeProfileSchema
>;

type NewEmployeeProfileStepperFormProps = {
  onSubmit: (data: NewEmployeeProfileStepperFormValues) => Promise<void>;
};

const NewEmployeeProfileStepperForm = ({
  onSubmit,
}: NewEmployeeProfileStepperFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useForm<NewEmployeeProfileStepperFormValues>({
    mode: "onBlur",
    resolver: zodResolver(newEmployeeProfileSchema),
    // Mantiene todos los valores aunque cambies de paso
    shouldUnregister: false,
  });

  const handleNext = async () => {
    const currentStepSchema = steps[currentStep].schema;

    try {
      // Validar solo los campos del paso actual
      const currentValues = methods.getValues();
      const result = await currentStepSchema.parseAsync(currentValues);

      console.log("result", result);

      // Si la validación es exitosa, avanzamos al siguiente paso
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } catch (error) {
      // Si hay errores de validación, activamos la validación de RHF
      // para mostrar los errores en la UI
      const fields = Object.keys(currentStepSchema.shape);
      fields.forEach((field) => {
        methods.trigger(field as any);
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (data: NewEmployeeProfileStepperFormValues) => {
    console.log("Formulario enviado:", data);
    // Aquí puedes enviar los datos al servidor
    await onSubmit(data);
  };

  // Función para saltar a un paso específico
  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <FormProvider {...methods}>
      <Card className="w-full">
        <CardHeader className="gap-3">
          <div className="flex justify-center gap-2">
            {steps.map((step, index) => (
              <Button
                key={step.id}
                variant={index === currentStep ? "default" : "outline"}
                size="sm"
                onClick={() => goToStep(index)}
                className="mx-1"
              >
                {index + 1}
              </Button>
            ))}
          </div>
          <CardTitle className="text-center text-2xl font-medium">
            {`${currentStep + 1}. ${steps[currentStep].title}`}
          </CardTitle>
        </CardHeader>

        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <CardContent>{steps[currentStep].component}</CardContent>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Anterior
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button type="submit">Enviar</Button>
              ) : (
                <Button type="button" onClick={handleNext}>
                  Siguiente
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </FormProvider>
  );
};

export default NewEmployeeProfileStepperForm;
