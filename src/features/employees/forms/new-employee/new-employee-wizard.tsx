import { useRef } from "react";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TypographyP } from "@/components/ui/typography/typography-p";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { toNumber, getFiles } from "../../utils/utils";
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
import { useEmployeeWizard } from "./useWizard";

export const NewEmployeeWizard = () => {
  const employeeCreatedRef = useRef(false);

  const { user } = useAuth();
  const userID = typeof user.id === "string" ? Number(user.id) : user.id;
  const {
    currentStep,
    progress,
    isFirstStep,
    isLastStep,
    onNextStep,
    onPreviousStep,
    isLoading,
    employee,
    createEmployee,
    createLocation,
    createTech,
    createAvailability,
    createEducation,
  } = useEmployeeWizard({ userID });

  const employeeID = employee?.id;

  const onSubmitExperience = async (data: ExperienceFormValues) => {
    if (!employeeCreatedRef.current && employeeID) {
      await createEmployee({
        position: data.position,
        role: data.role,
        yearsOfExperience: data.yearsOfExperience,
        certifications: data.certifications ?? [],
        certificationFiles: getFiles(data.certificationFiles),
        portfolioUrl: data.portfolioUrl || null,
      });
      employeeCreatedRef.current = true;
      onNextStep();
    }
  };

  const onSubmitLocation = async (data: LocationFormValues) => {
    if (employeeID) {
      await createLocation({
        employeeID,
        internetConnections: data.internetConnections,
        timezoneCompatibility: data.timezoneCompatibility,
      });
      onNextStep();
    }
  };

  const onSubmitResources = async (data: ResourcesFormValues) => {
    if (employeeID) {
      await createTech({
        employeeID,
        operatingSystem:
          data.hasComputer === "Si" ? (data.operatingSystem ?? null) : null,
        paidSoftware: data.paidSoftware ?? [],
      });
      onNextStep();
    }
  };

  const onSubmitAvailability = async (data: AvailabilityFormValues) => {
    if (employeeID) {
      await createAvailability({
        employeeID,
        availableHoursPerDay: Number(data.availableHoursPerDay),
        compatibleProjects: toNumber(data.compatibleProjects),
        incompatibleProjects: toNumber(data.incompatibleProjects),
      });
      onNextStep();
    }
  };

  const onSubmitEducation = async (data: EducationFormValues) => {
    if (employeeID) {
      await createEducation({
        employeeID,
        educationTitles: data.educationTitles,
      });
      toast({ title: "Usuario creado" });
    }
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
