import { ExperienceFormValues } from "./schema";
import { Employee } from "../../models/Employee";
import {
  dedicationTypeOptions,
  internetConnectionOptions,
  internetConnectionTypeOptions,
  roleOptions,
  yearsOfExperienceOptions,
} from "../utils";
import { Timezone } from "../../repo/types";

export const experienceDefaultValues = (employee?: Employee) => {
  if (!employee) return undefined;

  return {
    position: employee.position ?? "",
    role: roleOptions.includes(employee.role as ExperienceFormValues["role"])
      ? (employee.role as ExperienceFormValues["role"])
      : roleOptions[0],
    yearsOfExperience: yearsOfExperienceOptions.includes(
      employee.yearsOfExperience as ExperienceFormValues["yearsOfExperience"],
    )
      ? (employee.yearsOfExperience as ExperienceFormValues["yearsOfExperience"])
      : yearsOfExperienceOptions[0],
    certifications: employee.certifications ?? [],
    certificationFiles: employee.certificationFiles ?? [],
    portfolioUrl: employee.portfolioUrl ?? "",
  };
};

export const locationDefaultValues = (
  timezones: Timezone[],
  employee?: Employee,
) => {
  if (!employee) return undefined;

  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const browserTimezoneParts = browserTimezone.split("/");
  const browserRegion = browserTimezoneParts[0];
  const browserLocation = browserTimezoneParts[browserTimezoneParts.length - 1];
  const userTimezone = timezones.find((tz) => {
    if (tz.name === browserTimezone) return true;

    const timezoneParts = tz.name.split("/");
    return (
      timezoneParts[0] === browserRegion &&
      timezoneParts[timezoneParts.length - 1] === browserLocation
    );
  });

  const timezoneCompatibility = employee.timezoneCompatibility
    ? employee.timezoneCompatibility
    : (userTimezone?.name ?? timezones[0]?.name ?? "");

  return {
    internetConnections:
      employee.internetConnections?.length > 0
        ? employee.internetConnections
        : [
            {
              speed: internetConnectionOptions[0],
              type: internetConnectionTypeOptions[0],
            },
          ],
    timezoneCompatibility,
  };
};

export const resourcesDefaultValues = (employee?: Employee) => {
  if (!employee) return undefined;

  return {
    hasComputer: employee.operatingSystem ? "Si" : ("No" as "Si" | "No"),
    operatingSystem: employee.operatingSystem ?? undefined,
    paidSoftware: employee.paidSoftware ?? [],
  };
};

export const availabilityDefaultValues = (employee?: Employee) => {
  if (!employee || employee.availableHoursPerDay <= 0) return undefined;

  const availableHoursPerDay = String(employee.availableHoursPerDay);
  const dedicationType =
    employee.availableHoursPerDay === 8
      ? dedicationTypeOptions[0]
      : employee.availableHoursPerDay === 4
        ? dedicationTypeOptions[1]
        : dedicationTypeOptions[2];

  return {
    dedicationType,
    availableHoursPerDay,
    compatibleProjects:
      employee.compatibleProjects === null
        ? undefined
        : String(employee.compatibleProjects),
    incompatibleProjects:
      employee.incompatibleProjects === null
        ? undefined
        : String(employee.incompatibleProjects),
  };
};

export const educationDefaultValues = (employee?: Employee) => {
  return {
    educationTitles: employee?.educationTitles ?? [],
  };
};
