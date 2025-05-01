import { locales } from "@/core/i18n/config";

export interface Translatable {
  [key: (typeof locales)[number]]: string;
}

export interface QueryProps {
  name: string;
  value: string;
}
