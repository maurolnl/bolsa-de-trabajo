import { InitOptions } from 'i18next';

export const fallbackLng = 'en';
export const locales = ['ca', fallbackLng, 'es'];
export const defaultNS = ['common', 'error'];

const i18nConfig = (lng: InitOptions['lng'] = fallbackLng, ns: InitOptions['ns'] = defaultNS): InitOptions => ({
	supportedLngs: locales,
	fallbackLng,
	lng,
	fallbackNS: defaultNS,
	defaultNS,
	ns,
	returnNull: false
});

export default i18nConfig;
