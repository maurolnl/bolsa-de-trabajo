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
import {
  availabilityDefaultValues,
  educationDefaultValues,
  experienceDefaultValues,
  locationDefaultValues,
  resourcesDefaultValues,
} from "./initialValues";

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
    timezones,
    createEmployee,
    createLocation,
    createTech,
    createAvailability,
    createEducation,
    updateEmployee,
    updateLocation,
    updateTech,
    updateAvailability,
    updateEducation,
  } = useEmployeeWizard({ userID });

  const employeeID = employee?.id;
  const hasCreatedExperience = Boolean(employeeID);

  const hasCreatedLocation = Boolean(
    employee?.timezoneCompatibility || employee?.internetConnections?.length,
  );

  const hasCreatedTech = Boolean(
    employee &&
      (employee.operatingSystem !== null || employee.paidSoftware !== null),
  );
  const hasCreatedAvailability = Boolean(
    employee && employee.availableHoursPerDay > 0,
  );
  const hasCreatedEducation = Boolean(employee?.educationTitles?.length);

  const onSubmitExperience = async (data: ExperienceFormValues) => {
    const payload = {
      position: data.position,
      role: data.role,
      yearsOfExperience: data.yearsOfExperience,
      certifications: data.certifications ?? [],
      certificationFiles: getFiles(data.certificationFiles),
      portfolioUrl: data.portfolioUrl || null,
    };

    if (hasCreatedExperience && employeeID) {
      await updateEmployee({ employeeID, ...payload });
      onNextStep();
      return;
    }

    if (!employeeCreatedRef.current) {
      await createEmployee(payload);
      employeeCreatedRef.current = true;
    }

    onNextStep();
  };

  const onSubmitLocation = async (data: LocationFormValues) => {
    if (employeeID) {
      const payload = {
        employeeID,
        internetConnections: data.internetConnections ?? [],
        timezoneCompatibility: data.timezoneCompatibility,
      };

      if (hasCreatedLocation) {
        await updateLocation(payload);
      } else {
        await createLocation(payload);
      }

      onNextStep();
    }
  };

  const onSubmitResources = async (data: ResourcesFormValues) => {
    if (employeeID) {
      const payload = {
        employeeID,
        operatingSystem:
          data.hasComputer === "Si" ? (data.operatingSystem ?? null) : null,
        paidSoftware: data.paidSoftware ?? [],
      };

      if (hasCreatedTech) {
        await updateTech(payload);
      } else {
        await createTech(payload);
      }

      onNextStep();
    }
  };

  const onSubmitAvailability = async (data: AvailabilityFormValues) => {
    if (employeeID) {
      const payload = {
        employeeID,
        availableHoursPerDay: Number(data.availableHoursPerDay),
        compatibleProjects: toNumber(data.compatibleProjects),
        incompatibleProjects: toNumber(data.incompatibleProjects),
      };

      if (hasCreatedAvailability) {
        await updateAvailability(payload);
      } else {
        await createAvailability(payload);
      }

      onNextStep();
    }
  };

  const onSubmitEducation = async (data: EducationFormValues) => {
    if (employeeID) {
      const payload = {
        employeeID,
        educationTitles: data.educationTitles,
      };

      if (hasCreatedEducation) {
        await updateEducation(payload);
      } else {
        await createEducation(payload);
      }

      toast({ title: "Usuario creado" });
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep.id) {
      case 1:
        return (
          <ExperienceForm
            defaultValues={experienceDefaultValues(employee)}
            isLoading={isLoading}
            isFirstStep={isFirstStep}
            onPrevious={onPreviousStep}
            onSubmit={onSubmitExperience}
          />
        );
      case 2:
        return (
          <LocationForm
            defaultValues={locationDefaultValues(timezones, employee)}
            timezones={timezones}
            isLoading={isLoading}
            isFirstStep={isFirstStep}
            onPrevious={onPreviousStep}
            onSubmit={onSubmitLocation}
          />
        );
      case 3:
        return (
          <ResourcesForm
            defaultValues={resourcesDefaultValues(employee)}
            isLoading={isLoading}
            isFirstStep={isFirstStep}
            onPrevious={onPreviousStep}
            onSubmit={onSubmitResources}
          />
        );
      case 4:
        return (
          <AvailabilityForm
            defaultValues={availabilityDefaultValues(employee)}
            isLoading={isLoading}
            isFirstStep={isFirstStep}
            onPrevious={onPreviousStep}
            onSubmit={onSubmitAvailability}
          />
        );
      case 5:
        return (
          <EducationForm
            defaultValues={educationDefaultValues(employee)}
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
