import { createInstance, InitOptions } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import i18nConfig, { defaultNS } from './config';

const initI18next = async (lng: InitOptions['lng'], ns: InitOptions['ns']) => {
	const i18nInstance = createInstance();
	await i18nInstance
		.use(initReactI18next)
		.use(resourcesToBackend((language: string, namespace: string) => import(`../../../public/locales/${language}/${namespace}.json`)))
		.init(i18nConfig(lng, ns));
	return i18nInstance;
};

const useTranslation = async (
	ns = defaultNS,
	options: { keyPrefix?: string } = {},
	lng = 'en'
) => {
	const i18nextInstance = await initI18next(lng, ns);
	const namespace =  Array.isArray(ns) ? ns[0] : (ns ?? '');
	return {
		t: i18nextInstance.getFixedT(lng, namespace as string, options.keyPrefix),
		i18n: i18nextInstance
	};
};

export default useTranslation;
