import { useEffect, useState } from "react";
import styled from "styled-components";
import { Typography, Button } from "@material-ui/core";
import Head from "next/head";
import {
  RecepcionistaCadastro,
  RecepcionistaConsulta,
  RecepcionistaBusca,
} from "../../src/components/index";
import translateLocal from "../../src/helpers/translateLocal";
import { getServerSidePropsApi, localApi } from "../../src/services/api";
import { useRouter } from "next/router";
import appendRdScript from "../../src/helpers/appendRdScript";

const Recepcionista = (props) => {
  const router = useRouter();
  const [consultar, setConsultar] = useState(false);
  const [leads, setLeads] = useState(null);
  const { recepcionista } = router.query;

  useEffect(() => appendRdScript(), []);

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
          marginTop: "65px",
          marginLeft: "10px",
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
          style={{ margin: "100px 0 80px 0" }}
        >
          CLIENTES STAND
        </Typography>
        <GridWrapper consultar={consultar} leads={leads ? true : false}>
          <RecepcionistaCadastro
            local={recepcionista}
            empreendimentos={props.empreendimentos}
          />
          <GridWrapper
            style={{ gridTemplateColumns: "1fr", gridTemplateRows: "1fr 10fr" }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={(_) => {
                setConsultar(!consultar);
                setLeads(null);
              }}
            >
              {!consultar && "Consultar Cliente"}
              {consultar && "Leads Aguardando Envio"}
            </Button>
            {!consultar && (
              <RecepcionistaConsulta
                local={recepcionista}
                empreendimentos={props.empreendimentos}
                leads={props.leads}
              />
            )}
            {consultar && (
              <RecepcionistaBusca
                local={recepcionista}
                leads={leads}
                setLeads={setLeads}
              />
            )}
          </GridWrapper>
        </GridWrapper>
      </Wrapper>
    </>
  );
};

export async function getServerSideProps({ query: { recepcionista } }) {
  console.log(translateLocal[recepcionista]);
  // const data = await localApi.get("/empreendimentos", { status: "Ativo" });
  const {
    data: empreendimentos,
    ok: empreendimentosOk,
    originalError: empreendimentosOriginalError,
  } = await getServerSidePropsApi.get("/empreendimentos", { status: "Ativo" });

  console.log(empreendimentosOriginalError);

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

  const { data: leads, ok: leadsOk } = await getServerSidePropsApi.get(
    "/leads",
    {
      local: translateLocal[recepcionista],
      produto: "null",
    }
  );

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
  height: 100%;
  align-items: center;
  justify-content: center;
`;
const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media screen and (max-width: 600px) {
    grid-template-columns: 1fr;
    width: 90vw;
  }

  ${({ consultar }) =>
    consultar &&
    `
      grid-template-columns: 2fr 1fr;
  `}

  ${({ leads }) =>
    leads &&
    `
      grid-template-columns: 1fr 2fr;
  `}
`;

export default Recepcionista;
