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

export { localApi, facilitaApi, flaskApi };
