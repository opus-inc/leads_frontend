/*
 *  Ações
 */
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import { AcaoCadastro, AcaoConsulta } from "../src/components/index";
import { localApi } from "../src/services/api";
import Head from "next/head";

const Acao = (props) => {
  return (
    <Wrapper>
      <Head>
        <title>Cadastro Único - Cadastro Ação</title>
      </Head>
      <Typography
        variant="h4"
        component="div"
        gutterBottom
        color="#fff"
        style={{ marginBottom: "80px" }}
      >
        AÇÕES
      </Typography>
      <GridWrapper>
        <AcaoCadastro />
        <AcaoConsulta acoes={props.acoes} />
      </GridWrapper>
    </Wrapper>
  );
};

export async function getServerSideProps() {
  const { data, ok } = await localApi.get("/acao");

  if (!ok) {
    return {
      props: {
        checkbox: [],
        acoes: [],
      },
    };
  }

  return {
    props: {
      acoes: data,
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
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media screen and (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export default Acao;
