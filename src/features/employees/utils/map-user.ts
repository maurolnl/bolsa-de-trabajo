import { CreateUser } from "@/api/repositories/user-repository/user-repository";
import { NewEmployeeProfileStepperFormValues } from "../forms/new-employee/new-employee-profile-stepper-form";

export function mapFormValuesToUser(
  data: NewEmployeeProfileStepperFormValues,
): CreateUser {
  return {
    position: data.position,
    role: data.role,
    years_of_experience: data.yearsOfExperience,
    certifications: {
      titles: data.certifications || [],
      files: data.certificationsFile
        ? filesMapper(data.certificationsFile)
        : [],
    },
    project_links: data.projectLinks || null,
    internet_connections: data.internetConnection.map((conn) => ({
      type: conn.type,
      speed: conn.speed,
    })),
    time_zone: data.timeZoneCompatibility,
    computer: data.hasComputer === "Si",
    available_software: data.paidSoftware || [],
    dedication: {
      label: data.dedicationType,
      hours: Number(data.flexibleHours),
    },
    projects: {
      compatible: data.compatibleProjects ? Number(data.compatibleProjects) : 0,
      incompatible: data.incompatibleProjects
        ? Number(data.incompatibleProjects)
        : 0,
    },
    university_degrees: {
      titles: data.universityTitles || [],
      documents: data.universityTitleFiles
        ? filesMapper(data.universityTitleFiles)
        : [],
    },
    postgraduate_degrees: {
      titles: data.postgraduateTitles || [],
      documents: data.postgraduateTitleFiles
        ? filesMapper(data.postgraduateTitleFiles)
        : [],
    },
    study_orientation: {
      titles: data.schoolStudiesOrientation || [],
      documents: data.schoolStudiesOrientationFiles
        ? filesMapper(data.schoolStudiesOrientationFiles)
        : [],
    },
    tertiary_studies: {
      titles: data.tertiaryStudies || [],
      documents: data.tertiaryStudyFiles
        ? filesMapper(data.tertiaryStudyFiles)
        : [],
    },
  };
}

function filesMapper(files: FileList): string[] {
  return Array.from(files).map((file) => file.name);
}
