/*
 *  QR Code Ação
 */
import styled from "styled-components";
import { localApi, getServerSidePropsApi } from "../../src/services/api";
import Head from "next/head";
import {
  Box,
  Typography,
} from "@material-ui/core";
import QRCode from "react-qr-code";

const Acao = ({ acao }) => {
  if(!acao) {
    return (<></>)
  }

  return ( 
    <>
      <Head>
        <title>Cadastro Único - QR Code</title>
      </Head>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography style={{ margin: 24 }}>
          Imprima este QR Code de visualização única da Ação
        </Typography>
        <QRCode
          size={280}
          value={`https://app02.opus.inc/738857258e/FEA963D6EB3A300A7B796D6663671C61FE8A72D10A02E315FAB8E1655D0770FBADEED0767A33227B62EE81D8A3AC99C25CEC16693FC58366EA18136307859AF6/${acao.id}`}
        />
      </Box>
    </>
  );
};

export async function getServerSideProps({ params: { acao } }) {
  const { data, ok, originalError } = await getServerSidePropsApi.get(
    `/acao/${acao}`
  );

  console.log(acao)
  console.log(data)

  return {
    props: {
      ...(ok ? { acao: data } : { acao: null })
    },
  };
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;
const GridWrapper = styled.div`
  display: flex;
  align-items: baseline;

  @media screen and (max-width: 600px) {
    flex-wrap: wrap;
  }
`;

export default Acao;
