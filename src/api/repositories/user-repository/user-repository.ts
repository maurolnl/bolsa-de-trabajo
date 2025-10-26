import {
  internetConnectionOptions,
  internetConnectionTypeOptions,
} from "@/features/employees/forms/utils";
import { Moment } from "moment";

type Certifications = {
  titles: string[];
  files: string[];
};

type InternetConnection = {
  type: (typeof internetConnectionTypeOptions)[number];
  speed: (typeof internetConnectionOptions)[number];
};

type AvailableSoftware = {
  type: string;
  count: number;
};

type Dedication = {
  label: string;
  hours: number;
};

type Project = {
  compatible: number;
  incompatible: number;
};

type UniversityDegrees = {
  titles: string[];
  documents: string[];
};

type PostgraduateDegrees = {
  titles: string[];
  documents: string[];
};
type StudyOrientations = {
  titles: string[];
  documents: string[];
};
type TertiaryStudies = {
  titles: string[];
  documents: string[];
};

export type User = {
  id: number;
  role: string;
  years_of_experience: string;
  certifications: Certifications; //it can be null from backend
  project_links: string | null;
  internet_connections: InternetConnection[];
  time_zone: string;
  computer: boolean;
  available_software: AvailableSoftware;
  dedication: Dedication;
  projects: Project[];
  university_degrees: UniversityDegrees;
  postgraduate_degrees: PostgraduateDegrees;
  study_orientations: StudyOrientations;
  tertiary_studies: TertiaryStudies;
  created_at: Moment;
};

export type CreateUser = Omit<User, "id" | "created_at">;

export type UserRepository = {
  getAll: () => Promise<User[]>;
  getById(id: number): Promise<User | null>;
  create(user: CreateUser): Promise<void>;
};
