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
import {
  internetConnectionOptions,
  internetConnectionTypeOptions,
} from "../utils";
import { Progress } from "@/components/ui/progress";
import { useCreateEmployeeProgress } from "./useProgress";
import { TypographyP } from "@/components/ui/typography/typography-p";
import { LoadingSpinner } from "@/components/ui/loading-screen";

export type NewEmployeeProfileStepperFormValues = z.infer<
  typeof newEmployeeProfileSchema
>;

type NewEmployeeProfileStepperFormProps = {
  onSubmit: (data: NewEmployeeProfileStepperFormValues) => Promise<void>;
};

export const NewEmployeeProfileStepperForm = ({
  onSubmit,
}: NewEmployeeProfileStepperFormProps) => {
  const {
    currentStep,
    progress,
    handleAddProgress,
    handleSubtractProgress,
    firstStep,
    lastStep,
  } = useCreateEmployeeProgress();

  const isFirstStep = currentStep.id === firstStep.id;
  const isLastStep = currentStep.id === lastStep.id;

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
    const currentStepFields = Object.keys(currentStep.schema.shape);

    const isValid = await hf.trigger(
      currentStepFields as (keyof NewEmployeeProfileStepperFormValues)[],
    );

    if (isValid) {
      handleAddProgress();
    }
  };

  const handlePrevious = () => {
    handleSubtractProgress();
  };

  const handleSubmit = async (data: NewEmployeeProfileStepperFormValues) => {
    try {
      const validatedData = await newEmployeeProfileSchema.parseAsync(data);
      await onSubmit(validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors.forEach((validationError) => {
          if (validationError.path && validationError.path.length > 0) {
            hf.setError(
              validationError
                .path[0] as keyof NewEmployeeProfileStepperFormValues,
              { message: validationError.message },
            );
          }
        });
      }
    }
  };

  return (
    <FormProvider {...hf}>
      <Card className="w-full">
        <CardHeader className="gap-6">
          <div className="w-full md:w-96 mx-auto flex flex-col gap-1">
            <div className="flex flex-row justify-between">
              <TypographyP className="text-xs font-thin text-muted-foreground">
                0%
              </TypographyP>
              <TypographyP className="text-xs font-thin text-muted-foreground">
                100%
              </TypographyP>
            </div>
            <Progress value={progress} className="h-2 " />
          </div>
          <CardTitle className="text-center text-2xl font-medium">
            {`${currentStep.id}. ${currentStep.title}`}
          </CardTitle>
        </CardHeader>

        <Form {...hf}>
          <form
            onSubmit={hf.handleSubmit(handleSubmit)}
            encType="multipart/form-data"
          >
            <CardContent>{currentStep.component}</CardContent>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstStep}
              >
                Anterior
              </Button>

              {isLastStep ? (
                <Button type="button" onClick={hf.handleSubmit(handleSubmit)}>
                  {hf.formState.isSubmitting ? (
                    <LoadingSpinner size={18} />
                  ) : (
                    ""
                  )}
                  Enviar
                </Button>
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
