/* eslint-disable no-unreachable */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FormComponent } from "../../index";
import { facilitaApi, localApi } from "../../../services/api";
import Typography from "@material-ui/core/Typography";
import translateLocal from "../../../helpers/translateLocal";

const CadLeadStand = (props) => {
  const [campos, setCampos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [empreendimentos, setEmpreendimentos] = useState(props.empreendimentos);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    empreendimento: "",
  });

  useEffect(async () => {
    const optionsEmpreendimentos = props.empreendimentos.map((item) => ({
      name: item.nome,
      value: item.id_facilita,
    }));

    setEmpreendimentos(props.empreendimentos);
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
    ]);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { form_id, id, nome } = empreendimentos.find(
      (item) => item.id_facilita == form.empreendimento
    );

    if (!form_id) {
      alert("Este empreendimento não possui um ID de fila do facilita.");
      setLoading(false);
      return;
    }

    let temp = {
      ...form,
      produto: id,
      local: translateLocal[props.local],
      tipo: "Stand",
    };

    delete temp.empreendimento;
    const localApiReq = localApi.post("/leads", temp);

    temp = { ...form };

    const facilitaApiReq = facilitaApi.post("/trackerform", {
      ...temp,
      facilita_custom_selector: form_id,
      facilita_custom_page: "Formulário de Leads",
      facilita_custom_url: "http://app.opus.inc",
      name: "Formulário Lead",
      origem: "Stand",
    });

    temp = {
      ...form,
      produto: nome,
      telefone: "55" + form.telefone,
    };

    delete temp.empreendimento;
    const salesforceApiReq = localApi.post("/leads/salesforce", temp);

    await Promise.all([localApiReq, facilitaApiReq, salesforceApiReq])
      .then(() => {
        alert("Cadastro realizado com sucesso.");
      })
      .catch((err) => {
        alert("Erro ao efetuar o cadastro.\nTente novamente.");
      });

    setForm({
      nome: "",
      email: "",
      telefone: "",
      empreendimento: "",
    });
    setLoading(false);
  };

  return (
    <Wrapper>
      <a
        href={`https://opus.inc/intra/qrcodecadastrounico${props.local}.pdf`}
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
        CADASTRAR
      </Typography>
      <FormComponent
        formId="form-recepcionista-cadastro"
        fields={campos}
        onSubmit={onSubmit}
        //width={getWidth(width)}
        width={95}
        state={form}
        setState={setForm}
        buttonText="Cadastrar"
        loading={loading}
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
export default CadLeadStand;
