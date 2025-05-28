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
import { z, ZodError } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { steps } from "./config";
import {
  internetConnectionOptions,
  internetConnectionTypeOptions,
} from "../utils";

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
    mode: "onChange",
    defaultValues: {
      internetConnection: [
        {
          type: internetConnectionTypeOptions[0],
          speed: internetConnectionOptions[0],
        },
      ],
    },
    resolver: zodResolver(newEmployeeProfileSchema),
    shouldUnregister: false,
  });

  const handleNext = async () => {
    const currentStepSchema = steps[currentStep].schema;

    try {
      const currentValues = methods.getValues();
      await currentStepSchema.parseAsync(currentValues);

      // Si la validación es exitosa, avanzamos al siguiente paso
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } catch (error) {
      // Si hay errores de validación, activamos la validación de RHF
      // para mostrar los errores en la UI
      try {
        currentStepSchema.parse({});
      } catch (zodError: unknown) {
        if (zodError instanceof ZodError) {
          zodError.errors.forEach((error) => {
            if (error.path && error.path.length > 0) {
              methods.trigger(
                error.path[0] as keyof NewEmployeeProfileStepperFormValues
              );
            }
          });
        }
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (data: NewEmployeeProfileStepperFormValues) => {
    console.log("submit");
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
          <form
            onSubmit={methods.handleSubmit(handleSubmit)}
            encType="multipart/form-data"
          >
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
