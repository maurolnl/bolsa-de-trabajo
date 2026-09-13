import { BadgeProps } from "@/components/ui/badge";
import { EducationTitleFormValues } from "../../schema";

export const educationTypeLabels: Record<
  EducationTitleFormValues["type"],
  string
> = {
  university: "Universitario",
  postgraduate: "Posgrado",
  "high-school-orientation": "Orientación secundaria",
  tertiary: "Terciario",
};

export const educationStatusLabels: Record<
  EducationTitleFormValues["status"],
  string
> = {
  "in-progress": "En curso",
  completed: "Completado",
};

export const BADGE_COLORS: Record<
  EducationTitleFormValues["status"],
  BadgeProps["variant"]
> = {
  "in-progress": "secondary",
  completed: "success",
};
