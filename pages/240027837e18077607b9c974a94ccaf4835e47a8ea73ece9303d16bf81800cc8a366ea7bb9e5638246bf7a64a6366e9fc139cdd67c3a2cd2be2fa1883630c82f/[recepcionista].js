import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import Head from "next/head";
import {
  RecepcionistaCadastro,
  RecepcionistaConsulta,
} from "../../src/components/index";
import translateLocal from "../../src/helpers/translateLocal";
import { localApi } from "../../src/services/api";
import { useRouter } from "next/router";

const Recepcionista = (props) => {
  const router = useRouter();
  const { recepcionista } = router.query;
  return (
    <>
      <Head>
        <title>Cadastro Único - Stand</title>
      </Head>
      <Typography
        variant="h6"
        component="div"
        gutterBottom
        color="#fff"
        align="left"
        style={{
          position: "absolute",
          marginTop: "100px",
          marginLeft: "100px",
        }}
      >
        {translateLocal[recepcionista]}
      </Typography>
      <Wrapper>
        <Typography
          variant="h4"
          component="div"
          gutterBottom
          color="#fff"
          align="center"
          style={{ marginBottom: "80px" }}
        >
          CLIENTES STAND
        </Typography>
        <GridWrapper>
          <RecepcionistaCadastro
            local={recepcionista}
            empreendimentos={props.empreendimentos}
          />
          <RecepcionistaConsulta
            local={recepcionista}
            empreendimentos={props.empreendimentos}
            leads={props.leads}
          />
        </GridWrapper>
      </Wrapper>
    </>
  );
};

export async function getServerSideProps({ query: { recepcionista } }) {
  console.log(translateLocal[recepcionista]);
  const { data: empreendimentos, ok: empreendimentosOk } = await localApi.get(
    "/empreendimentos",
    { status: "Ativo" }
  );

  if (!empreendimentosOk) {
    return {
      props: {
        empreendimentos: [],
        leads: [],
      },
    };
  }

  if (!translateLocal[recepcionista]) {
    return {
      props: {
        empreendimentos: empreendimentos,
        leads: [],
      },
    };
  }

  const { data: leads, ok: leadsOk } = await localApi.get("/leads", {
    local: translateLocal[recepcionista],
    produto: "null",
  });

  if (!leadsOk) {
    return {
      props: {
        empreendimentos: empreendimentos,
        leads: [],
      },
    };
  }

  return {
    props: {
      empreendimentos,
      leads,
    },
  };
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
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

export default Recepcionista;
