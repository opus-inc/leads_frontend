import { create } from "apisauce";

const localApi = create({
  baseURL: "http://app02.opus.inc/leads/api/v1",
  headers: { Accept: "*/*" },
});

const facilitaApi = create({
  baseURL: "https://opus.api.facilitavendas.com/public/",
  headers: { Accept: "*/*" },
});

export { localApi, facilitaApi };
