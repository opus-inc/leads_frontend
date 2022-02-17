import { create } from "apisauce";

const localApi = create({
  baseURL: "https://app02.opus.inc/leads/api/v1",
  headers: { Accept: "*/*" },
});

const localApiRemote = create({
  baseURL: "https://app02.opus.inc/leads/api/v1",
  headers: { Accept: "*/*" },
});

const getServerSidePropsApi = create({
  baseURL: "http://192.168.1.214:1339/v1",
  headers: { Accept: "*/*" },
});

const facilitaApi = create({
  baseURL: "https://opus.api.facilitavendas.com/public/",
  headers: { Accept: "*/*" },
});

const flaskApi = create({
  baseURL: "https://app02.opus.inc/leads/api/find-lead-excel",
  headers: { Accept: "*/*" },
});

export {
  localApi,
  facilitaApi,
  flaskApi,
  localApiRemote,
  getServerSidePropsApi,
};
