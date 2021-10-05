/* eslint-disable no-unreachable */
import { useState, useEffect } from "react";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import { FormComponent } from "../../src/components/index";
import { facilitaApi, localApi } from "../../src/services/api";
import Head from "next/head";
import { useRouter } from "next/router";

const CadLeadAcoes = (props) => {
  const router = useRouter();
  const { acao } = router.query;
  const [campos, setCampos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    empreendimento: "",
    acao: "",
  });
  const produtos = props.empreendimentos;
  const acoes = props.acoes;

  useEffect(() => {
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

    const acao = acoes.find((item) => temp.acao == item.id);
    temp = {
      ...temp,
      acao: acao.id,
      local: "Central de Decorados",
      tipo: "Ação",
    };
    delete temp.empreendimento;

    const { ok: baseLocalLeadOk, originalError } = await localApi.post(
      "/leads",
      temp
    );
    if (!baseLocalLeadOk) {
      alert(originalError.message);
      setLoading(false);
      return;
    }

    const translateFormIdAcoes = {
      "Opus Vendas": "form-opsvendas",
      "Adão Vida Nova": "form-adaovn",
      "Adão Talent": "form-adaot",
      URBS: "form-urbs",
    };

    temp = { ...form, acao: acao.equipe };
    temp.facilita_custom_selector = translateFormIdAcoes[temp.acao];
    const {
      data,
      ok,
      originalError: { message },
    } = await facilitaApi.post("/trackerform", {
      ...temp,
      facilita_custom_page: "Formulário de Leads",
      facilita_custom_url: "http://app.opus.inc",
      name: "Formulário Lead",
      origem: "Ações",
    });
    if (!ok) {
      alert(message);
      setLoading(false);
      return;
    }
    alert(data?.message);
    setLoading(false);
  };

  return (
    <Wrapper>
      <Head>
        <title>Cadastro Único - Ação</title>
      </Head>
      <Typography variant="h4" component="div" gutterBottom color="#fff">
        CADASTRO DE LEADS DE AÇÕES
      </Typography>
      <FormComponent
        formId="form-lead-acao"
        fields={campos}
        onSubmit={onSubmit}
        width={100}
        state={form}
        setState={setForm}
        buttonText="Cadastrar"
        loading={loading}
      />
    </Wrapper>
  );
};

export async function getServerSideProps() {
  const { data: empreendimentos, ok: empreendimentosOk } = await localApi.get(
    "/empreendimentos",
    { status: "Ativo" }
  );

  const { data: acoes, ok: acoesOk } = await localApi.get("/acao", {
    status: "Ativo",
  });

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
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

export default CadLeadAcoes;
