//TODO: update env vars
export const APP_PRODUCTION_URL = "app.production.com";
export const APP_STAGING_URL = "balcells-stg.vadiun.net";
// export const APP_STAGING_URL = 'crm-prueba.balcellsgroup.com';

export const isProduction = () =>
  window.location.href.includes(APP_PRODUCTION_URL);

export const isStaging = () => window.location.href.includes(APP_STAGING_URL);

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
  backEnd: "https://back.balcellsgroup.com/api",
  environment: "production",
  backEndBaseUrl: "https://back.balcellsgroup.com/",
};

const development: Env = {
  backEnd: "http://localhost:8080/",
  environment: "development",
  backEndBaseUrl: "https://balcells-back.vadiun.net/",
};

export const environment = isProduction()
  ? production
  : isStaging()
  ? staging
  : development;

