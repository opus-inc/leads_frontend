import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FormComponent } from "../../../Components/index";
import { localApi } from "../../../Services/api-config";
import useWindowDimensions from "../../../Helpers/Hooks/useWindowDimensions";
import getWidth from "../../../Helpers/getWidth";
import Typography from "@material-ui/core/Typography";
import { useParams } from "react-router";
import translateLocal from "../../../Helpers/translateLocal";

const CadLeadStand = () => {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
  });
  const { width } = useWindowDimensions();
  const { param } = useParams();
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
      placeholder: "Insira o telefone do cliente",
      label: "Telefone ",
      name: "telefone",
      type: "tel",
      required: true,
    },
  ];
  useEffect(() => {
    document.title = "Cadastro Único";
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();

    const { ok, originalError } = await localApi.post("/leads", {
      ...form,
      local: translateLocal[param], //
      tipo: "Cliente",
    });
    if (!ok) {
      alert(originalError.message);
      return;
    }
    alert("Registro criado com sucesso!");
    const temp = document.createElement("a");
    temp.href = "https://opus.inc";
    temp.click();
  };

  return (
    <Wrapper>
      <Typography
        variant="h5"
        component="div"
        gutterBottom
        style={{ marginBottom: "140px" }}
      >
        REALIZE SEU CADASTRO
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
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

export default CadLeadStand;
