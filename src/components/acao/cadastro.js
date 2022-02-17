import React, { useState } from "react";
import styled from "styled-components";
import { FormComponent } from "../index";
import { localApiRemote } from "../../services/api";
import Typography from "@material-ui/core/Typography";

const CadAcoes = () => {
  const [form, setForm] = useState({
    nome: "",
    valor: "",
    equipe: "",
  });
  const campos = [
    {
      placeholder: "Insira o nome da ação",
      label: "Nome da ação",
      name: "nome",
      type: "text",
      required: true,
    },
    {
      placeholder: "Insira o valor da ação",
      label: "Valor da Ação",
      name: "valor",
      type: "number",
    },
    {
      placeholder: "Selecione a equipe responsável",
      label: "Equipe responsável",
      name: "equipe",
      type: "select",
      required: true,
      options: [
        { name: "Opus Vendas", value: "Opus Vendas" },
        { name: "Adão", value: "Adão" },
        { name: "Adão Vida Nova", value: "Adão Vida Nova" },
        { name: "Adão Talent", value: "Adão Talent" },
        { name: "My Broker", value: "My Broker" },
        { name: "Urbs Connect", value: "Urbs Connect" },
        { name: "Urbs One", value: "Urbs One" },
        { name: "R8", value: "R8" },
        { name: "Nii3", value: "Nii3" },
        { name: "Vallus", value: "Vallus" },
      ],
    },
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    const { ok, originalError } = await localApiRemote.post("/acao", {
      ...form,
      nome: `Ação - ${form.equipe} - ${form.nome}`,
      status: "Ativo",
    });
    if (!ok) {
      alert(originalError.message);
      return;
    }

    if (ok) {
      alert("Registro criado com sucesso.");
    }
  };

  return (
    <Wrapper>
      <Typography variant="h6" component="div" gutterBottom color="#fff">
        CADASTRAR
      </Typography>
      <FormComponent
        formId="form-acao-cadastro"
        fields={campos}
        onSubmit={onSubmit}
        width={95}
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
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export default CadAcoes;
