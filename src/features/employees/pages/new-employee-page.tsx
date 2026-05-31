import {
  NewEmployeeProfileStepperForm,
  NewEmployeeProfileStepperFormValues,
} from "../forms/new-employee/new-employee-profile-stepper-form";
import { useCreateEmployee } from "../hooks/useEmployee";
import { useToast } from "@/components/ui/use-toast";

export const NewEmployeePage = () => {
  const { mutateAsync: createEmployee } = useCreateEmployee();
  const { toast } = useToast();

  const onSubmit = async (data: NewEmployeeProfileStepperFormValues) => {
    await createEmployee(data);
    toast({
      title: "Usuario creado",
    });

    return;
  };

  return <NewEmployeeProfileStepperForm onSubmit={onSubmit} />;
};
