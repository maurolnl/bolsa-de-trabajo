import NewEmployeeProfileStepperForm, {
  NewEmployeeProfileStepperFormValues,
} from "../ingredients/forms/new-ingredient/new-employee-profile-stepper-form";

const HomePage = () => {
  const onSubmit = (data: NewEmployeeProfileStepperFormValues) => {
    console.log(data);
    return Promise.resolve();
  };

  return <NewEmployeeProfileStepperForm onSubmit={onSubmit} />;
};

export default HomePage;
