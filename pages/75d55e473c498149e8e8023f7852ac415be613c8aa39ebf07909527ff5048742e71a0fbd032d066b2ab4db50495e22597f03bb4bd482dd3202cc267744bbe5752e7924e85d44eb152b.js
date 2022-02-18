/*
 *  Treinamentos
 */
/* eslint-disable no-unreachable */
import { useState } from "react";
import { localApiRemote, getServerSidePropsApi } from "../src/services/api";

import styled from "styled-components";
import { Typography } from "@material-ui/core";
import FormComponent from "../src/components/FormComponent";
import Head from "next/head";

const CadTreinamentos = ({ empreendimentos }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    data: "",
    empreendimento: "",
  });

  const campos = [
    {
      placeholder: "Insira o nome do treinamento",
      label: "Nome ",
      name: "nome",
      type: "text",
      required: true,
    },
    {
      placeholder: "Insira a data do treinamento",
      label: "Data ",
      name: "data",
      type: "datetime-local",
      required: true,
    },
    {
      placeholder: "Selecione o empreendimento",
      label: "Empreendimento ",
      name: "empreendimento",
      type: "select",
      required: true,
      options: empreendimentos,
    },
  ];

  const local = "";

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const salesforceReq = localApiRemote.post("/treinamentos/salesforce", {
      ...form,
      empreendimento: empreendimentos.find(
        (i) => i.value === form.empreendimento
      ).name,
    });
    const createTreinamentoReq = localApiRemote.post("/treinamentos", form);

    Promise.allSettled([salesforceReq, createTreinamentoReq]).then(
      ([{ ok: salesforceOk }, { ok: createTreinamentoOk }]) => {
        console.log(salesforceOk);
        console.log(createTreinamentoOk);

        setLoading(false);
      }
    );
  };

  return (
    <Wrapper>
      <Head>
        <title>Cadastro Único - Treinamentos</title>
      </Head>
      <a
        href={`https://opus.inc/intra/qrcodecadastrounico${local}.pdf`}
        target="_blank"
        rel="noreferrer"
      >
        <Icon />
      </a>
      <Typography
        variant="h6"
        component="div"
        gutterBottom
        color="#fff"
        align="center"
      >
        Cadastrar Treinamentos
      </Typography>
      <FormComponent
        formId="form-cadastro-treinamento"
        fields={campos}
        onSubmit={onSubmit}
        //width={getWidth(width)}
        width={80}
        state={form}
        setState={setForm}
        buttonText="Cadastrar"
        loading={loading}
      />
    </Wrapper>
  );
};

export async function getServerSideProps() {
  const { data, ok } = await getServerSidePropsApi.get("/empreendimentos", {
    params: { status: "Ativo" },
  });

  const optionsEmpreendimentos = data.map((item) => ({
    name: item.nome,
    value: item.id,
  }));

  if (!ok) {
    return {
      props: {
        empreendimentos: [],
      },
    };
  }

  return {
    props: {
      empreendimentos: optionsEmpreendimentos,
    },
  };
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-top: 10vh;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.div`
  background-image: url("https://opus.inc/intra/qrcode_icon.png");
  background-repeat: no-repeat;
  height: 50px;
  width: 50px;
  position: absolute;
  z-index: 20;
  top: 0;
  right: 0;
  margin-right: 2px;
  margin-top: 2px;
`;

export default CadTreinamentos;
