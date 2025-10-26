import {
  NewEmployeeProfileStepperForm,
  NewEmployeeProfileStepperFormValues,
} from "../employees/forms/new-employee/new-employee-profile-stepper-form";
import { CreateUser } from "@/api/repositories/user-repository/user-repository";
import { useCreateUser } from "../employees/hooks/useUser";
import { useToast } from "@/components/ui/use-toast";

const HomePage = () => {
  const { mutateAsync: createUser } = useCreateUser();
  const { toast } = useToast();
  // const sanitizeData = (data: NewEmployeeProfileStepperFormValues) => {
  //   return {
  //     ...data,
  //     // Convert arrays to comma-separated strings for CSV
  //     role: data.role,
  //     certifications: data.certifications?.join(", ") || "",
  //     universityTitles: data.universityTitles?.join(", ") || "",
  //     postgraduateTitles: data.postgraduateTitles?.join(", ") || "",
  //     schoolStudiesOrientation: data.schoolStudiesOrientation?.join(", ") || "",
  //     // Flatten internet connection array
  //     internetConnection: data.internetConnection
  //       .map((conn) => `${conn.type}: ${conn.speed}`)
  //       .join("; "),
  //     // Flatten paid software object
  //     paidSoftwareType: data.paidSoftware.typeOfPaidSoftware,
  //     paidSoftwareOther: data.paidSoftware.typeOfPaidSoftwareOther || "",
  //     paidSoftwareCount: data.paidSoftware.paidSoftwareCount || "",
  //     createdAt: new Date().toISOString(),
  //   };
  // };

  // function downloadCSV(csv: string, filename = "formulario.csv"): void {
  //   const blob = new Blob([csv], { type: "text/csv" });
  //   const url = window.URL.createObjectURL(blob);
  //
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = filename;
  //   link.click();
  //
  //   window.URL.revokeObjectURL(url);
  // }

  function mapFormValuesToUser(
    data: NewEmployeeProfileStepperFormValues,
  ): CreateUser {
    return {
      role: data.role,
      years_of_experience: data.yearsOfExperience,
      certifications: {
        titles: data.certifications || [],
        files: data.certificationsFile || [],
      },
      project_links: data.projectLinks || null,
      internet_connections: data.internetConnection.map((conn) => ({
        type: conn.type,
        speed: conn.speed,
      })),
      time_zone: data.timeZoneCompatibility,
      computer: data.hasComputer === "Si",
      available_software: {
        type: data.paidSoftware.typeOfPaidSoftware || "",
        count: Number(data.paidSoftware.paidSoftwareCount) || 0,
      },
      dedication: {
        label: data.dedicationType,
        hours: Number(data.dedication.hours),
      },
    };
  }

  const onSubmit = async (data: NewEmployeeProfileStepperFormValues) => {
    console.log(data, "data");
    const userData = mapFormValuesToUser(data);
    await createUser(userData);
    toast({
      title: "Usuario creado",
    });

    // const sanitizedData = sanitizeData(data);
    // const csv = unparse([sanitizedData]);

    // downloadCSV(csv);

    return;
  };

  return <NewEmployeeProfileStepperForm onSubmit={onSubmit} />;
};

export default HomePage;
