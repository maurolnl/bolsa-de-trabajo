import { useSearchParams } from "react-router-dom";
import {
  useCreateAvailability,
  useCreateEducation,
  useCreateEmployee,
  useCreateLocation,
  useCreateTech,
  useTimezones,
  useEmployee,
  useUpdateAvailability,
  useUpdateEducation,
  useUpdateEmployee,
  useUpdateLocation,
  useUpdateTech,
} from "../../hooks/useEmployee";
import { steps } from "./config";

interface UseEmployeeWizardProps {
  userID: number;
}

export const useEmployeeWizard = ({ userID }: UseEmployeeWizardProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const stepParam = Number(searchParams.get("step"));
  const currentStepIndex = Math.min(
    Math.max(Number.isNaN(stepParam) ? 0 : stepParam - 1, 0),
    steps.length - 1,
  );
  const currentStep = steps[currentStepIndex];
  const progress = (currentStepIndex / (steps.length - 1)) * 100;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const { data: employee, isFetching: isFetchingEmployee } =
    useEmployee(userID);

  const { data: timezones = [], isLoading: isLoadingTimezones } =
    useTimezones();

  //steps callbacks
  const createEmployeeMutation = useCreateEmployee(userID);
  const createLocationMutation = useCreateLocation(userID);
  const createTechMutation = useCreateTech(userID);
  const createAvailabilityMutation = useCreateAvailability(userID);
  const createEducationMutation = useCreateEducation(userID);
  const updateEmployeeMutation = useUpdateEmployee(userID);
  const updateLocationMutation = useUpdateLocation(userID);
  const updateTechMutation = useUpdateTech(userID);
  const updateAvailabilityMutation = useUpdateAvailability(userID);
  const updateEducationMutation = useUpdateEducation(userID);

  const updateStepQueryParam = (stepIndex: number) => {
    const nextStepIndex = Math.min(Math.max(stepIndex, 0), steps.length - 1);
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("step", String(steps[nextStepIndex].id));
    setSearchParams(nextSearchParams);
  };

  const onNextStep = () => {
    updateStepQueryParam(currentStepIndex + 1);
  };

  const onPreviousStep = () => {
    updateStepQueryParam(currentStepIndex - 1);
  };

  return {
    currentStep,
    progress,
    isFirstStep,
    isLastStep,
    onNextStep,
    onPreviousStep,

    isLoading:
      createEmployeeMutation.isPending ||
      createLocationMutation.isPending ||
      createTechMutation.isPending ||
      createAvailabilityMutation.isPending ||
      createEducationMutation.isPending ||
      updateEmployeeMutation.isPending ||
      updateLocationMutation.isPending ||
      updateTechMutation.isPending ||
      updateAvailabilityMutation.isPending ||
      updateEducationMutation.isPending ||
      isLoadingTimezones ||
      isFetchingEmployee,
    employee: employee === null ? undefined : employee,
    timezones,
    createEmployee: createEmployeeMutation.mutateAsync,
    createLocation: createLocationMutation.mutateAsync,
    createTech: createTechMutation.mutateAsync,
    createAvailability: createAvailabilityMutation.mutateAsync,
    createEducation: createEducationMutation.mutateAsync,
    updateEmployee: updateEmployeeMutation.mutateAsync,
    updateLocation: updateLocationMutation.mutateAsync,
    updateTech: updateTechMutation.mutateAsync,
    updateAvailability: updateAvailabilityMutation.mutateAsync,
    updateEducation: updateEducationMutation.mutateAsync,
  };
};
