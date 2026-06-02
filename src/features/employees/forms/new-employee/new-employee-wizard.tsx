import { useRef, useState } from "react";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TypographyP } from "@/components/ui/typography/typography-p";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { toNumber, getFiles } from "../../utils/utils";
import {
  useCreateAvailability,
  useCreateEducation,
  useCreateEmployee,
  useCreateLocation,
  useCreateTech,
  useUser,
} from "../../hooks/useEmployee";
import { steps } from "./config";
import {
  AvailabilityFormValues,
  EducationFormValues,
  ExperienceFormValues,
  LocationFormValues,
  ResourcesFormValues,
} from "./schema";
import { AvailabilityForm } from "./steps/availability-form";
import { EducationForm } from "./steps/education-form";
import { ExperienceForm } from "./steps/experience-form";
import { LocationForm } from "./steps/location-form";
import { ResourcesForm } from "./steps/resources-form";

export const NewEmployeeWizard = () => {
  const [step, setStep] = useState(0);
  const submittedStepsRef = useRef(new Set<number>());
  const employeeCreatedRef = useRef(false);
  const { userId } = useAuth();
  const authUserId = userId === undefined ? undefined : Number(userId);
  const employeeQuery = useUser(authUserId);

  const createEmployeeMutation = useCreateEmployee();
  const createLocationMutation = useCreateLocation();
  const createTechMutation = useCreateTech();
  const createAvailabilityMutation = useCreateAvailability();
  const createEducationMutation = useCreateEducation();

  const currentStep = steps[step];
  const progress = (step / (steps.length - 1)) * 100;
  const isFirstStep = step === 0;
  const isLastStep = step === steps.length - 1;
  const isLoading =
    createEmployeeMutation.isPending ||
    createLocationMutation.isPending ||
    createTechMutation.isPending ||
    createAvailabilityMutation.isPending ||
    createEducationMutation.isPending ||
    employeeQuery.isFetching;

  const onNextStep = () => {
    setStep((currentStepIndex) =>
      Math.min(currentStepIndex + 1, steps.length - 1),
    );
  };

  const onPreviousStep = () => {
    setStep((currentStepIndex) => Math.max(currentStepIndex - 1, 0));
  };

  const getEmployeeID = async () => {
    const employee = employeeQuery.data ?? (await employeeQuery.refetch()).data;

    if (!employee?.id) {
      throw new Error("No se pudo obtener el ID del empleado");
    }

    return employee.id;
  };

  const onSubmitExperience = async (data: ExperienceFormValues) => {
    if (!employeeCreatedRef.current) {
      await createEmployeeMutation.mutateAsync({
        position: data.position,
        role: data.role,
        yearsOfExperience: data.yearsOfExperience,
        certifications: data.certifications ?? [],
        certificationFiles: getFiles(data.certificationFiles),
        portfolioUrl: data.portfolioUrl || null,
      });
      employeeCreatedRef.current = true;
      await employeeQuery.refetch();
    }

    submittedStepsRef.current.add(1);
    onNextStep();
  };

  const onSubmitLocation = async (data: LocationFormValues) => {
    if (!submittedStepsRef.current.has(2)) {
      const employeeID = await getEmployeeID();
      await createLocationMutation.mutateAsync({
        employeeID,
        internetConnections: data.internetConnections,
        timezoneCompatibility: data.timezoneCompatibility,
      });
      submittedStepsRef.current.add(2);
    }

    onNextStep();
  };

  const onSubmitResources = async (data: ResourcesFormValues) => {
    if (!submittedStepsRef.current.has(3)) {
      const employeeID = await getEmployeeID();
      await createTechMutation.mutateAsync({
        employeeID,
        operatingSystem:
          data.hasComputer === "Si" ? (data.operatingSystem ?? null) : null,
        paidSoftware: data.paidSoftware ?? [],
      });
      submittedStepsRef.current.add(3);
    }

    onNextStep();
  };

  const onSubmitAvailability = async (data: AvailabilityFormValues) => {
    if (!submittedStepsRef.current.has(4)) {
      const employeeID = await getEmployeeID();
      await createAvailabilityMutation.mutateAsync({
        employeeID,
        availableHoursPerDay: Number(data.availableHoursPerDay),
        compatibleProjects: toNumber(data.compatibleProjects),
        incompatibleProjects: toNumber(data.incompatibleProjects),
      });
      submittedStepsRef.current.add(4);
    }

    onNextStep();
  };

  const onSubmitEducation = async (data: EducationFormValues) => {
    if (!submittedStepsRef.current.has(5)) {
      const employeeID = await getEmployeeID();
      await createEducationMutation.mutateAsync({
        employeeID,
        educationTitles: data.educationTitles,
      });
      submittedStepsRef.current.add(5);
    }

    toast({ title: "Usuario creado" });
  };

  const renderCurrentStep = () => {
    switch (currentStep.id) {
      case 1:
        return (
          <ExperienceForm
            isLoading={isLoading}
            isFirstStep={isFirstStep}
            onPrevious={onPreviousStep}
            onSubmit={onSubmitExperience}
          />
        );
      case 2:
        return (
          <LocationForm
            isLoading={isLoading}
            isFirstStep={isFirstStep}
            onPrevious={onPreviousStep}
            onSubmit={onSubmitLocation}
          />
        );
      case 3:
        return (
          <ResourcesForm
            isLoading={isLoading}
            isFirstStep={isFirstStep}
            onPrevious={onPreviousStep}
            onSubmit={onSubmitResources}
          />
        );
      case 4:
        return (
          <AvailabilityForm
            isLoading={isLoading}
            isFirstStep={isFirstStep}
            onPrevious={onPreviousStep}
            onSubmit={onSubmitAvailability}
          />
        );
      case 5:
        return (
          <EducationForm
            isLoading={isLoading}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            onPrevious={onPreviousStep}
            onSubmit={onSubmitEducation}
          />
        );
      default:
        return null;
    }
  };

  return (
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
          <Progress value={progress} className="h-2" />
        </div>
        <CardTitle className="text-center text-2xl font-medium">
          {`${currentStep.id}. ${currentStep.title}`}
        </CardTitle>
      </CardHeader>

      {renderCurrentStep()}
    </Card>
  );
};
