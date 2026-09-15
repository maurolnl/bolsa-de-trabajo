export type EmployerResponse = {
  id: number;
  user_id: number;
  name: string;
  industry: string;
  location: string;
  hiring_modalities: string[];
  created_at: string;
  updated_at: string;
};

export type CreateEmployerRequest = Pick<
  EmployerResponse,
  "name" | "industry" | "location" | "hiring_modalities"
>;
