import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Tabs, TabsTrigger, TabsContent } from "./tabs";
import { useState } from "react";
import { Button } from "./button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
type StepperProps = {
  steps: {
    label: string;
    value: string;
    component: React.ReactNode;
  }[];
  onChange?: (value: string) => void;
  onBack?: () => void;
  onNext?: () => void;
} & TabsPrimitive.TabsProps;

export const Stepper = ({ steps, ...props }: StepperProps) => {
  const [step, setStep] = useState(steps[0].value);

  const currentIndex = steps.findIndex((_step) => _step.value === step);

  const handleBack = () => {
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1].value);
    }
  };

  // const handleNext = () => {
  //   if (currentIndex < steps.length - 1) {
  //     setStep(steps[currentIndex + 1].value);
  //   }
  // };

  return (
    <div className="flex flex-row gap-4">
      <Button variant="outline" onClick={handleBack}>
        <ArrowLeftIcon className="w-4 h-4" />
        Back
      </Button>

      <Tabs value={step} onValueChange={setStep} {...props}>
        {steps.map((step) => (
          <TabsTrigger key={step.label} value={step.value}>
            {step.label}
          </TabsTrigger>
        ))}
        <TabsContent value={step}>
          {steps.find((_step) => _step.value === step)?.component}
        </TabsContent>
      </Tabs>
    </div>
  );
};
