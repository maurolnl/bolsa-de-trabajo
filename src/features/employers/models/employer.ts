export type Employer = {
  id: number;
  userId: number;
  name: string;
  industry: string;
  location: string;
  hiringModalities: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateEmployer = Pick<
  Employer,
  "name" | "industry" | "location" | "hiringModalities"
>;
