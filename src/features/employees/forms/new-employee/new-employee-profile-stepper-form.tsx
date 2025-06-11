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
  const hf = useForm<NewEmployeeProfileStepperFormValues>({
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
    const currentStepFields = Object.keys(steps[currentStep].schema.shape);
    
    // Trigger validation only for current step fields
    const isValid = await hf.trigger(
      currentStepFields as (keyof NewEmployeeProfileStepperFormValues)[]
    );
    

    if (isValid) {
      // Si la validación es exitosa, avanzamos al siguiente paso
      const nextStep = Math.min(currentStep + 1, steps.length - 1);
      setCurrentStep(nextStep);
    }
    // Los errores se muestran automáticamente por React Hook Form
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (data: NewEmployeeProfileStepperFormValues) => {
    try {
      console.log(data, "data");
      const validatedData = await newEmployeeProfileSchema.parseAsync(data);
      console.log("submit");
      await onSubmit(validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors.forEach((validationError) => {
          if (validationError.path && validationError.path.length > 0) {
            hf.setError(
              validationError.path[0] as keyof NewEmployeeProfileStepperFormValues,
              { message: validationError.message }
            );
          }
        });
      }
    }
  };

  // Función para saltar a un paso específico
  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <FormProvider {...hf}>
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

        <Form {...hf}>
          <form
            onSubmit={hf.handleSubmit(handleSubmit)}
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
                <Button type="button" onClick={hf.handleSubmit(handleSubmit)}>Enviar</Button>
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
