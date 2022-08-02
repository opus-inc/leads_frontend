/*
 *  Ações
 */
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import { AcaoCadastro, AcaoConsulta } from "../src/components/index";
import { localApi, getServerSidePropsApi } from "../src/services/api";
import Head from "next/head";
import { Fab } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';

const Acao = (props) => {
  return (
    <Wrapper>
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
      {/* <Head>
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
        <AcaoCadastro empreendimentos={props.empreendimentos} />
        <AcaoConsulta acoes={props.acoes} />
      </GridWrapper> */}
    </Wrapper>
  );
};

export async function getServerSideProps() {
  const { data: acoes, ok: acoesOk } = await getServerSidePropsApi.get("/acao", { status: "Ativo" });
  const { data: empreendimentos, ok: empreendimentosOk } = await getServerSidePropsApi.get("/empreendimentos", { status: "Ativo" });

  return {
    props: {
      ...(empreendimentosOk ? { empreendimentos } : { empreendimentos: [] }),
      ...(acoesOk ? { acoes } : { acoes: [] })
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
