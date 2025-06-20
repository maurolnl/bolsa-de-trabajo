import { useState } from "react";
import { steps } from "./config";

export const useCreateEmployeeProgress = () => {
  const [step, setStep] = useState(0);
  const progress = (step / steps.length) * 100;

  const firstStep = steps[0];
  const lastStep = steps[steps.length - 1];

  const handleAddProgress = () => {
    const nextStep = Math.min(step + 1, steps.length - 1);
    setStep(nextStep);
  };

  const handleSubtractProgress = () => {
    const nextStep = Math.max(step - 1, 0);
    setStep(nextStep);
  };

  return {
    currentStep: steps[step],
    progress,
    firstStep,
    lastStep,
    handleAddProgress,
    handleSubtractProgress,
  };
};
