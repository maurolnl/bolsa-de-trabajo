import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
} from "react-i18next";
import i18nConfig, { defaultNS, fallbackLng, locales } from "./config";
import { Translatable } from "@/features/app/types";

i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (locale: string, namespace: string) =>
        import(`../../../public/locales/${locale}/${namespace}.json`)
    )
  )
  .init(i18nConfig());

const localize = (
  text?: Translatable | null,
  locale: string = fallbackLng
): string => (text && text[locale] ? text[locale] || "" : "");

const useTranslation = (ns?: string | string[], options = {}) =>
  useTranslationOrg(ns ?? defaultNS, options);

const changeLanguage = (lang: string) => {
  i18next.changeLanguage(lang);
};

const languageSelectorOptions = (defaultLanguage: string) => {
  return locales.map((locale) => ({
    isActive: locale === defaultLanguage,
    id: locale.toUpperCase(),
    name: locale.toUpperCase(),
    onClick: () => {
      changeLanguage(locale);
    },
  }));
};

export { localize, languageSelectorOptions };
export default useTranslation;
