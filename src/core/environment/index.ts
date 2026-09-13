export const APP_STAGING_URL = "balcells-stg.vadiun.net";

export const isStaging = () => window.location.hostname === APP_STAGING_URL;

type Env = {
  backEnd: string;
  environment: "staging" | "production" | "development";
  backEndBaseUrl: string;
};

const configuredBackEnd = import.meta.env.VITE_BACKEND_URL;

const staging: Env = {
  backEnd: "https://back-prueba.balcellsgroup.com/api",
  environment: "staging",
  backEndBaseUrl: "https://back-prueba.balcellsgroup.com/",
};

const production: Env = {
  backEnd: "https://laburito-production.up.railway.app",
  environment: "production",
  backEndBaseUrl: "https://laburito-production.up.railway.app/",
};

const development: Env = {
  backEnd: "http://localhost:8081/",
  environment: "development",
  backEndBaseUrl: "http://localhost:8081/",
};

export const environment: Env = configuredBackEnd
  ? {
      backEnd: configuredBackEnd,
      backEndBaseUrl: configuredBackEnd,
      environment: import.meta.env.PROD ? "production" : "development",
    }
  : isStaging()
    ? staging
    : import.meta.env.PROD
      ? production
      : development;
