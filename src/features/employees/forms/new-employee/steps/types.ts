export interface StepFormProps<TValues> {
  isLoading: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  onPrevious: () => void;
  onSubmit: (data: TValues) => Promise<void>;
}
