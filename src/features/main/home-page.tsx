import { unparse } from "papaparse";

import NewEmployeeProfileStepperForm, {
  NewEmployeeProfileStepperFormValues,
} from "../employees/forms/new-employee/new-employee-profile-stepper-form";

const HomePage = () => {
  const sanitizeData = (data: NewEmployeeProfileStepperFormValues) => {
    return {
      ...data,
      // Convert arrays to comma-separated strings for CSV
      role: data.role.join(", "),
      universityTitles: data.universityTitles.join(", "),
      postgraduateTitles: data.postgraduateTitles.join(", "),
      schoolStudiesOrientation: data.schoolStudiesOrientation.join(", "),
      // Flatten internet connection array
      internetConnection: data.internetConnection
        .map((conn) => `${conn.type}: ${conn.speed}`)
        .join("; "),
      // Flatten paid software object
      paidSoftwareType: data.paidSoftware.typeOfPaidSoftware,
      paidSoftwareOther: data.paidSoftware.typeOfPaidSoftwareOther || "",
      paidSoftwareCount: data.paidSoftware.paidSoftwareCount || "",
      createdAt: new Date().toISOString(),
    };
  };

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
    console.log(data, "data");
    const sanitizedData = sanitizeData(data);
    const csv = unparse([sanitizedData]);

    downloadCSV(csv);

    return Promise.resolve();
  };

  return <NewEmployeeProfileStepperForm onSubmit={onSubmit} />;
};

export default HomePage;
