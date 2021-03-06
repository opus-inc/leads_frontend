/* eslint-disable no-unreachable */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FormComponent } from "../../../Components/index";
import { facilitaApi, localApi } from "../../../Services/api-config";
import Typography from "@material-ui/core/Typography";
import translateLocal from "../../../Helpers/translateLocal";
//import useWindowDimensions from "../../../Helpers/Hooks/useWindowDimensions";
//import getWidth from "../../../Helpers/getWidth";

const CadLeadStand = ({ local }) => {
  const [campos, setCampos] = useState([]);
  const [empreendimentos, setEmpreendimentos] = useState();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    empreendimento: "",
  });
  //const { width } = useWindowDimensions();

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
    ]);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    const { form_id, id } = empreendimentos.find(
      (item) => item.id_facilita == form.empreendimento
    );

    if (!form_id) {
      alert("Este empreendimento n??o possui um ID de fila do facilita.");
      return;
    }

    let temp = {
      ...form,
      produto: id,
      local: translateLocal[local],
      tipo: "Stand",
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
    temp = { ...form };

    const response = await facilitaApi.post("/trackerform", {
      ...temp,
      facilita_custom_selector: form_id,
      facilita_custom_page: "Formul??rio de Leads",
      facilita_custom_url: "http://app.opus.inc",
      name: "Formul??rio Lead",
      origem: "Stand",
    });
    if (!response.ok) {
      alert("Erro ao efetuar o cadastro.\nTente novamente.");
      return;
    }
    alert("Cadastro realizado com sucesso.");
    setForm({
      nome: "",
      email: "",
      telefone: "",
      empreendimento: "",
    });
  };

  return (
    <Wrapper>
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
        CADASTRAR
      </Typography>
      <FormComponent
        fields={campos}
        onSubmit={onSubmit}
        //width={getWidth(width)}
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
