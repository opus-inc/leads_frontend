/* eslint-disable no-unreachable */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import { FormComponent } from "../../../Components/index";
import { facilitaApi, localApi } from "../../../Services/api-config";
import useWindowDimensions from "../../../Helpers/Hooks/useWindowDimensions";
import getWidth from "../../../Helpers/getWidth";

const CadLeadAcoes = () => {
  const [campos, setCampos] = useState([]);
  const [produtos, setProdutos] = useState();
  const [acoes, setAcoes] = useState();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    empreendimento: "",
    acao: "",
  });
  const { width } = useWindowDimensions();

  useEffect(async () => {
    document.title = "Cadastro Único - Ação";
    const {
      data: dataEmpreendimentos,
      ok: okEmpreendimentos,
      originalError: originalErrorEmpreendimentos,
    } = await localApi.get("/empreendimentos", {
      status: "Ativo",
    });
    const {
      data: dataAcoes,
      ok: okAcoes,
      originalError: originalErrorAcoes,
    } = await localApi.get("/acao", {
      status: "Ativo",
    });
    if (!okEmpreendimentos) {
      alert(originalErrorEmpreendimentos.message);
      return;
    }
    if (!okAcoes) {
      alert(originalErrorAcoes.message);
      return;
    }
    setProdutos(dataEmpreendimentos);
    setAcoes(dataAcoes);
    const optionsEmpreendimentos = dataEmpreendimentos.map((item) => ({
      name: item.nome,
      value: item.id_facilita,
    }));
    const optionsAcoes = dataAcoes.map((item) => ({
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
      return;
    }
    alert(data?.message);
  };

  return (
    <Wrapper>
      <Typography variant="h4" component="div" gutterBottom color="#fff">
        CADASTRO DE LEADS DE AÇÕES
      </Typography>
      <FormComponent
        fields={campos}
        onSubmit={onSubmit}
        width={getWidth(width)}
        state={form}
        setState={setForm}
        buttonText="Cadastrar"
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

export default CadLeadAcoes;
