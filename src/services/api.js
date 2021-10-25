import { create } from "apisauce";

const localApi = create({
  baseURL: "https://app02.opus.inc/leads/api/v1",
  headers: { Accept: "*/*" },
});

const facilitaApi = create({
  baseURL: "https://opus.api.facilitavendas.com/public/",
  headers: { Accept: "*/*" },
});

const flaskApi = create({
  baseURL: "https://app02.opus.inc/leads/api",
  headers: { Accept: "*/*" },
});

const salesforceApi = create({
  baseURL: "https://opus.my.salesforce.com/services/apexrest/",
  headers: {
    Authorization:
      "basic 00DA0000000aYZc!AQQAQNaObHYevIOUq_D945WRRh8wWYjLT.E4jXRuT2snCT2rNbn6tiX4nqTgQu9BJgGzIC_X_bCkB5S6dfvI0.bHy5A_bZN6",
  },
});

export { localApi, facilitaApi, flaskApi, salesforceApi };
