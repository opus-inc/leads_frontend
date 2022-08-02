/*
 *  Leads Ação
 */
/* eslint-disable no-unreachable */
import { useState, useEffect } from "react";
import styled from "styled-components";
import { Typography, Box } from "@material-ui/core";
import { FormComponent } from "../../src/components/index";
import {
  facilitaApi,
  getServerSidePropsApi,
  localApi,
  localApiRemote,
} from "../../src/services/api";
import Head from "next/head";
import { useRouter } from "next/router";
import appendRdScript from "../../src/helpers/appendRdScript";
import useWindowSize from "../../src/hooks/useWindowSize";

const initialForm = {
  cpf: "",
  nome: "",
  email: "",
  telefone: "",
  aceite: true,
}

const CadLeadAcoes = ({ acao }) => {
  const [loading, setLoading] = useState(false);
  const size = useWindowSize();
  const [form, setForm] = useState(initialForm);

  const campos = [
    {
      placeholder: "Insira o nome do cliente",
      label: "Nome ",
      name: "nome",
      type: "text",
      required: true,
    },
    {
      placeholder: "Insira o e-mail do cliente",
      label: "E-mail ",
      name: "email",
      type: "email",
      required: true,
    },
    {
      placeholder: "Insira o seu CPF",
      label: "CPF ",
      name: "cpf",
      type: "cpf",
      required: false,
    },
    {
      placeholder: "Insira o telefone do cliente",
      label: "Telefone ",
      name: "telefone",
      type: "tel",
      required: true,
    },
    {
      label: (
        <>
          Li e concordo com a{" "}
          <a href="https://opus.inc/politica-de-privacidade" target="_blank">
            Política de Privacidade da Opus
          </a>
          , que pode usar as informações aqui fornecidas por mim para entrar em
          contato comigo, via e-mail, telefone ou whatsapp, para ações de
          natureza comercial. Posso revogar meu consentimento a qualquer momento
          enviando um e-mail para dpo@opus.inc
        </>
      ),
      name: "aceite",
      type: "radio",
      required: true,
    },
  ];

  useEffect(() => {
    appendRdScript();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let temp = { ...form };
    temp.produto = acao.produto.id;

    temp.telefone = temp.telefone.match(/\d+/g).join("");

    temp = {
      ...temp,
      acao: acao.id,
      local: "Central de Decorados",
      tipo: "Ação",
    };
    delete temp.empreendimento;

    const { ok: baseLocalLeadOk, originalError: originalErrorLocalBase } =
      await localApiRemote.post("/leads", { ...temp, aceite: form.aceite ? "Sim" : "Não"});
    if (!baseLocalLeadOk) {
      alert(originalErrorLocalBase?.message);
      setLoading(false);
      return;
    }

    const translateFormIdAcoes = {
      "Opus Vendas": "form-opsvendas",
      Adão: "form-adao",
      "Adão Vida Nova": "form-adaovn",
      "Adão Talent": "form-adaot",
      "My Broker": "form-mybroker",
      "Urbs Connect": "form-urbsconnect",
      "Urbs One": "form-urbsone",
      R8: "form-r8",
      Nii3: "form-nii3",
      Vallus: "form-vallus",
    };

    temp = { ...form, acao: acao.nome };
    temp.facilita_custom_selector = translateFormIdAcoes[temp.acao];
    const { data, ok, originalError } = await facilitaApi.post("/trackerform", {
      ...temp,
      facilita_custom_page: "Formulário de Leads",
      facilita_custom_url: "http://app.opus.inc",
      name: "Formulário Lead",
      origem: "Ações",
    });

    if (!ok) {
      alert(originalError?.message);
      setLoading(false);
      return;
    }
    alert("Cadastrado com sucesso.");
    const a = document.createElement("a");
    a.href = "https://opus.inc";
    a.click();
    setLoading(false);
  };

  return (
    <Wrapper>
      <Head>
        <title>Cadastro Único - Ação</title>
      </Head>

      {/* <Box sx={{ marginBottom: 12, marginLeft: 12, marginRight: 12 }}>
        <Typography
          align="center"
          {...(size.width <= 425 && { variant: "h6" })}
          {...(size.width > 425 && { variant: "h4" })}
          // {...(size.width <= 325 && { variant: "h2" })}
          // variant="h4"
          component="div"
          gutterBottom
          color="#fff"
        >
          CADASTRO DE LEADS DE AÇÕES
        </Typography>
      </Box> */}
      <Typography
        variant="h5"
        component="div"
        gutterBottom
        style={{ marginBottom: "5vh" }}
      >
        REALIZE SEU CADASTRO
      </Typography>
      <FormComponent
        formId="form-cliente-cadastro"
        fields={campos}
        onSubmit={onSubmit}
        width={90}
        state={form}
        setState={setForm}
        buttonText="Cadastrar"
        loading={loading}
      />

    </Wrapper>
  );
};

export async function getServerSideProps({ params: { acao } }) {
  const { data, ok } = await getServerSidePropsApi.get(`/acao/${acao}`);
  
  return {
      props: {
      ...(ok ? { acao: data } : { acao: null })
      },
  };
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8vh;
  align-items: center;
  justify-content: center;
`;

export default CadLeadAcoes;
