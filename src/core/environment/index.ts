//TODO: update env vars
export const APP_PRODUCTION_URL = "bolsa-de-trabajo-tesis.vercel.app";
export const APP_STAGING_URL = "balcells-stg.vadiun.net";
// export const APP_STAGING_URL = 'crm-prueba.balcellsgroup.com';

export const isProduction = () =>
  window.location.hostname === APP_PRODUCTION_URL;

export const isStaging = () => window.location.hostname === APP_STAGING_URL;

type Env = {
  backEnd: string;
  environment: "staging" | "production" | "development";
  backEndBaseUrl: string;
};

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

export const environment = isProduction()
  ? production
  : isStaging()
    ? staging
    : development;
