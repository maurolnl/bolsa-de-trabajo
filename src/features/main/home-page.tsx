import { unparse } from "papaparse";

import NewEmployeeProfileStepperForm, {
  NewEmployeeProfileStepperFormValues,
} from "../employees/forms/new-employee/new-employee-profile-stepper-form";

const HomePage = () => {
  const sanitizeData = (data: NewEmployeeProfileStepperFormValues) => {
    return {
      ...data,
      certifications: data.certifications
        ? Object.values(data.certifications)
            .map((certification: any) => certification.name)
            .join(", ")
        : "",
      knownRegulations: data.knownRegulations
        ? Object.values(data.knownRegulations)
            ?.map((regulation: any) => regulation.name)
            .join(", ")
        : "",
      undergraduateDegree: data.undergraduateDegree
        ? Object.values(data.undergraduateDegree)
            ?.map((degree: any) => degree.name)
            .join(", ")
        : "",
      bachelorDegree: data.bachelorDegree
        ? Object.values(data.bachelorDegree)
            ?.map((degree: any) => degree.name)
            .join(", ")
        : "",
      specializationDegree: data.specializationDegree
        ? Object.values(data.specializationDegree)
            ?.map((degree: any) => degree.name)
            .join(", ")
        : "",
      masterDegree: data.masterDegree
        ? Object.values(data.masterDegree)
            ?.map((degree: any) => degree.name)
            .join(", ")
        : "",
      phdDegree: data.phdDegree
        ? Object.values(data.phdDegree)
            ?.map((degree: any) => degree.name)
            .join(", ")
        : "",
      tertiaryDegree: data.tertiaryDegree
        ? Object.values(data.tertiaryDegree)
            ?.map((degree: any) => degree.name)
            .join(", ")
        : "",
      highSchoolDegree: data.highSchoolDegree
        ? Object.values(data.highSchoolDegree)
            ?.map((degree: any) => degree.name)
            .join(", ")
        : "",
      relevantAreaDegree: data.relevantAreaDegree
        ? Object.values(data.relevantAreaDegree)
            ?.map((degree: any) => degree.name)
            .join(", ")
        : "",
      createdAt: new Date().toISOString(),
    };
  };

  // keys of NewEmployeeProfileStepperFormValues
  // const headers = [
  //   { label: "yearsLeadingProjects", key: "yearsLeadingProjects" },
  //   { label: "yearsAsAssistant", key: "yearsAsAssistant" },
  //   { label: "yearsAsApprentice", key: "yearsAsApprentice" },
  //   { label: "certifications", key: "certifications" },
  //   { label: "projectLinks", key: "projectLinks" },
  //   { label: "knownRegulations", key: "knownRegulations" },
  //   { label: "internetConnection", key: "internetConnection" },
  //   { label: "timeZoneCompatibility", key: "timeZoneCompatibility" },
  //   { label: "hasComputer", key: "hasComputer" },
  //   { label: "paidSoftwareCount", key: "paidSoftwareCount" },
  //   { label: "dedicationType", key: "dedicationType" },
  //   { label: "flexibleHours", key: "flexibleHours" },
  //   { label: "compatibleProjects", key: "compatibleProjects" },
  //   { label: "incompatibleProjects", key: "incompatibleProjects" },
  //   { label: "undergraduateDegree", key: "undergraduateDegree" },
  //   { label: "bachelorDegree", key: "bachelorDegree" },
  //   { label: "specializationDegree", key: "specializationDegree" },
  //   { label: "masterDegree", key: "masterDegree" },
  //   { label: "phdDegree", key: "phdDegree" },
  //   { label: "tertiaryDegree", key: "tertiaryDegree" },
  //   { label: "highSchoolDegree", key: "highSchoolDegree" },
  //   { label: "relevantAreaDegree", key: "relevantAreaDegree" },
  // ];

  function downloadCSV(csv: string, filename = "formulario.csv") {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    window.URL.revokeObjectURL(url);
  }

  const onSubmit = (data: NewEmployeeProfileStepperFormValues) => {
    const sanitizedData = sanitizeData(data);

    console.log(sanitizedData);
    // debugger;

    const csv = unparse([sanitizedData]);

    downloadCSV(csv);

    return Promise.resolve();
  };

  return <NewEmployeeProfileStepperForm onSubmit={onSubmit} />;
};

export default HomePage;
