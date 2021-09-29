import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FormComponent } from "../../../Components/index";
import { localApi } from "../../../Services/api-config";

const CadAgendamento = () => {
  const [campos, setCampos] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    empreendimento: "",
    cpf: "",
    mensagem: "",
  });
  const [empreendimentos, setEmpreendimentos] = useState([]);

  useEffect(async () => {
    const {
      data: dataEmpreendimentos,
      ok: okEmpreendimentos,
      originalError: originalErrorEmpreendimentos,
    } = await localApi.get("/empreendimentos", {
      status: "Ativo",
    });
    if (!okEmpreendimentos) {
      alert(originalErrorEmpreendimentos.message);
      return;
    }
    const optionsEmpreendimentos = dataEmpreendimentos.map((item) => ({
      name: item.nome,
      value: item.id_facilita,
    }));
    setEmpreendimentos(dataEmpreendimentos);
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
        placeholder: "Insira o CPF do cliente",
        label: "CPF ",
        name: "cpf",
        type: "text",
        required: false,
      },
      {
        placeholder: "Insira a mensagem do cliente",
        label: "Mensagem ",
        name: "mensagem",
        type: "text",
        required: false,
      },
    ]);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formToLocalApi = {
      ...form,
      empreendimento: empreendimentos.find(
        (item) => item.id_facilita == form.empreendimento
      )._id,
    };
    const { ok, originalError } = await localApi.post(
      "/agendamentos",
      formToLocalApi
    );
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
      <FormComponent
        fields={campos}
        onSubmit={onSubmit}
        width={35}
        state={form}
        setState={setForm}
        buttonText="Cadastrar"
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

export default CadAgendamento;
