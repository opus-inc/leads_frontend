import React from "react";
import {
  CadLeadCliente,
  CadLeadAcoes,
  ConEmpreendimentos,
  Recepcionista,
  Acao,
} from "../Pages/index";

export default [
  {
    //  /consulta/empreendimentos
    path: "/55e1babd9b976178f3360434c9e0f05c29fa59db865f4ccb5921150f33b91755ee9b12a96febf11d5da76ee822f19c9a0cbb4adf443dcc3be40cee1c73bc1825", // 55e1babd9b976178f3360434c9e0f05c29fa59db865f4ccb5921150f33b91755ee9b12a96febf11d5da76ee822f19c9a0cbb4adf443dcc3be40cee1c73bc1825
    component: <ConEmpreendimentos />,
  },
  {
    //  /cadastro/leads/cliente
    path: "/915073b48ab2baf13d606a6c2fdf2768133b76c4d71cc696d8f9dbc4117fb342eb98c56eebce329d70998aee3bff15fd66bf6c96716d1efc94f934a34be7617d/:param", // 915073b48ab2baf13d606a6c2fdf2768133b76c4d71cc696d8f9dbc4117fb342eb98c56eebce329d70998aee3bff15fd66bf6c96716d1efc94f934a34be7617d
    component: <CadLeadCliente />,
  },
  {
    //  /cadastro/leads/recepcionista
    path: "/240027837e18077607b9c974a94ccaf4835e47a8ea73ece9303d16bf81800cc8a366ea7bb9e5638246bf7a64a6366e9fc139cdd67c3a2cd2be2fa1883630c82f/:param", // 240027837e18077607b9c974a94ccaf4835e47a8ea73ece9303d16bf81800cc8a366ea7bb9e5638246bf7a64a6366e9fc139cdd67c3a2cd2be2fa1883630c82f
    component: <Recepcionista />,
  },
  {
    //  /cadastro/acoes
    path: "/c582f7cdeb6e042475629daa39ebf07909527ff5048742e71a0fbd032d066b2ab4db50495e22597f03bb4bd482dd3202cc267744bbe5752e7924e85d44eb152b", // c582f7cdeb6e042475629daa39ebf07909527ff5048742e71a0fbd032d066b2ab4db50495e22597f03bb4bd482dd3202cc267744bbe5752e7924e85d44eb152b
    component: <Acao />,
  },

  {
    //  /cadastro/leads/acoes
    path: "/cc7aed381db37bdb3383c2a0c9bf98e50e30f1efcbe30b960eb0257000fedc7a74b54e5226c576b27e5dd839479b8d09945865d384074597d2e24321a2aca3ea/:param", // cc7aed381db37bdb3383c2a0c9bf98e50e30f1efcbe30b960eb0257000fedc7a74b54e5226c576b27e5dd839479b8d09945865d384074597d2e24321a2aca3ea
    component: <CadLeadAcoes />,
  },
];
