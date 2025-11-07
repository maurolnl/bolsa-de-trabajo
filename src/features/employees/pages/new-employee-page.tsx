import {
  NewEmployeeProfileStepperForm,
  NewEmployeeProfileStepperFormValues,
} from "../forms/new-employee/new-employee-profile-stepper-form";
import { useCreateUser } from "../hooks/useUser";
import { useToast } from "@/components/ui/use-toast";
import { mapFormValuesToUser } from "../utils/map-user";

export const NewEmployeePage = () => {
  const { mutateAsync: createUser } = useCreateUser();
  const { toast } = useToast();

  const onSubmit = async (data: NewEmployeeProfileStepperFormValues) => {
    console.log(data, "data");
    const userData = mapFormValuesToUser(data);
    console.log(userData, "userData");
    await createUser(userData);
    toast({
      title: "Usuario creado",
    });

    return;
  };

  return <NewEmployeeProfileStepperForm onSubmit={onSubmit} />;
};
