/*
 *  Leads Ação
 */
/* eslint-disable no-unreachable */
import { useState, useEffect } from "react";
import styled from "styled-components";
import { Typography, Box } from "@material-ui/core";
import { FormComponent } from "../src/components/index";
import {
  facilitaApi,
  getServerSidePropsApi,
  localApi,
  localApiRemote,
} from "../src/services/api";
import Head from "next/head";
import { useRouter } from "next/router";
import appendRdScript from "../src/helpers/appendRdScript";
import useWindowSize from "../src/hooks/useWindowSize";

const initialForm = {
  nome: "",
  email: "",
  telefone: "",
  empreendimento: "",
  acao: "",
};

const CadLeadAcoes = (props) => {
  const router = useRouter();
  const { acao } = router.query;
  const [campos, setCampos] = useState([]);
  const [loading, setLoading] = useState(false);
  const size = useWindowSize();
  const [form, setForm] = useState(initialForm);
  const produtos = props.empreendimentos;
  const acoes = props.acoes;

  useEffect(() => {
    appendRdScript();
    const optionsEmpreendimentos = props.empreendimentos.map((item) => ({
      name: item.nome,
      value: item.id_facilita,
    }));
    const optionsAcoes = props.acoes.map((item) => ({
      name: item.nome,
      value: item.id,
    }));
    setCampos([
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
        placeholder: "Insira o telefone do cliente",
        label: "Telefone ",
        name: "telefone",
        type: "tel",
        required: true,
      },
      {
        placeholder: "Selecione o produto",
        label: "Produto ",
        name: "empreendimento",
        type: "select",
        required: true,
        options: optionsEmpreendimentos,
      },
      {
        placeholder: "Selecione a ação ",
        label: "Ação ",
        name: "acao",
        type: "select",
        required: true,
        options: optionsAcoes,
      },
    ]);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let temp = { ...form };
    temp.produto = produtos.find(
      (item) => temp.empreendimento == item.id_facilita
    ).id;

    temp.telefone = temp.telefone.match(/\d+/g).join("");

    const acao = acoes.find((item) => temp.acao == item.id);
    temp = {
      ...temp,
      acao: acao.id,
      local: "Central de Decorados",
      tipo: "Ação",
    };
    delete temp.empreendimento;

    const { ok: baseLocalLeadOk, originalErrorLocalBase } =
      await localApiRemote.post("/leads", temp);
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

    await localApiRemote.post("/leads/salesforce", {
      nome: temp.nome,
      email: temp.email,
      telefone: temp.telefone,
      produto: produtos.find((item) => form.empreendimento == item.id_facilita)
        .nome,
      stand: "Ação",
    });

    if (!ok) {
      alert(originalError?.message);
      setLoading(false);
      return;
    }
    alert("Cadastrado com sucesso.");
    setForm({
      ...initialForm,
      acao: form.acao,
      empreendimento: form.empreendimento,
    });
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
      <FormComponent
        formId="form-lead-acao"
        fields={campos}
        onSubmit={onSubmit}
        width={60}
        state={form}
        setState={setForm}
        buttonText="Cadastrar"
        loading={loading}
      />
    </Wrapper>
  );
};

export async function getServerSideProps() {
  const { data: empreendimentos, ok: empreendimentosOk } =
    await getServerSidePropsApi.get("/empreendimentos", { status: "Ativo" });

  const { data: acoes, ok: acoesOk } = await getServerSidePropsApi.get(
    "/acao",
    {
      status: "Ativo",
    }
  );

  if (!empreendimentosOk) {
    return {
      props: {
        empreendimentos: [],
        acoes: [],
      },
    };
  }

  if (!acoesOk) {
    return {
      props: {
        empreendimentos: empreendimentos,
        acoes: [],
      },
    };
  }

  return {
    props: {
      empreendimentos,
      acoes,
    },
  };
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  // height: 90vh;
  margin-top: 10vh;
  z-index: 1000;
  align-items: center;
  justify-content: center;
`;

export default CadLeadAcoes;
