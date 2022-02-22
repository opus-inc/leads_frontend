/*
 *  Treinamento Corretores
 */
/* eslint-disable no-unreachable */
import { useState } from "react";
import { localApiRemote, getServerSidePropsApi } from "../../src/services/api";
import { useRouter } from "next/router";

import styled from "styled-components";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  CircularProgress,
} from "@material-ui/core";
import FormComponent from "../../src/components/FormComponent";
import Head from "next/head";

const perguntas = [
  "1. Fachada: De 1 a 5, qual a nota você classifica a fachada do empreendimento?",
  "2. Areas Comuns: De 1 a 5, qual nota você classifica as áreas comuns do empreendimento?",
  "3. Planta Baixa: De 1 a 5, qual nota você classifica a planta baixa/distribuição dos ambientes da unidade privativa?",
  "4. Diferenciais: De 1 a 5, qual nota você classifica os diferenciais do empreendimento apresentado?",
  "5. Decorado: De 1 a 5, qual a nota você classifica o decorado que visitou?",
];

const CadTreinamentos = ({ treinamentos }) => {
  const {
    query: { treinamento },
  } = useRouter();
  const [loading, setLoading] = useState(false);
  const [respostas, setRespostas] = useState([]);
  const [form, setForm] = useState({
    cpf: "",
    treinamento: treinamento,
    corretor: "",
    telefone: "",
    email: "",
  });

  const campos = [
    {
      placeholder: "Selecione o treinamento",
      label: "Treinamento ",
      name: "treinamento",
      type: "select",
      required: true,
      options: treinamentos,
      disabled: true,
    },
    {
      placeholder: "Insira o seu nome",
      label: "Nome ",
      name: "nome",
      type: "text",
      required: true,
    },
    {
      placeholder: "Insira seu CPF",
      label: "CPF ",
      name: "cpf",
      type: "cpf",
      required: true,
    },
    {
      placeholder: "Insira seu e-mail",
      label: "E-mail ",
      name: "email",
      type: "email",
      required: true,
    },
    {
      placeholder: "Insira seu telefone",
      label: "Telefone ",
      name: "telefone",
      type: "tel",
      required: true,
    },
  ];

  const local = "";

  const handleChange = (e, index) => {
    console.log(e.target.value);
    let temp;

    if (respostas.length > 0) {
      temp = [...respostas];
    } else {
      temp = [];
    }

    temp[index] = e.target.value;

    setRespostas(temp);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const salesforceReq = localApiRemote.post("/corretores/salesforce", {
      ...form,
      treinamento: treinamentos.find(
        (treinamento) => treinamento.value === form.treinamento
      ).name,
      resposta1: respostas[0],
      resposta2: respostas[1],
      resposta3: respostas[2],
      resposta4: respostas[3],
      resposta5: respostas[4],
    });
    const createTreinamentoReq = localApiRemote.post("/corretores", {
      ...form,
      questionario: respostas.map((resposta, index) => ({
        pergunta: perguntas[index],
        resposta: resposta,
      })),
    });

    Promise.allSettled([salesforceReq, createTreinamentoReq]).then(
      ([
        {
          value: { ok: salesforceOk },
        },
        {
          value: { ok: createTreinamentoOk },
        },
      ]) => {
        if (salesforceOk && createTreinamentoOk) {
          alert("Registrado com sucesso!\nVocê será direcionado agora.");
          const a = document.createElement("a");
          a.href = "https://opus.inc";
          a.click();
        } else {
          alert("Erro ao salvar o registro.");
        }
        setLoading(false);
      }
    );
  };

  return (
    <Wrapper>
      <Head>
        <title>Cadastro Único - Treinamentos</title>
      </Head>
      <FormComponent
        formId="form-cadastro-treinamento"
        fields={campos}
        // onSubmit={onSubmit}
        //width={getWidth(width)}
        width={80}
        state={form}
        setState={setForm}
        // buttonText="Cadastrar"
        loading={loading}
      />
      <StyledBox
        style={{
          padding: "0px 25px 25px 25px",
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "left",
            flexDirection: "column",
          }}
        >
          {perguntas.map((pergunta, index) => (
            <FormControl component="fieldset" style={{ margin: 16 }}>
              <FormLabel component="legend">{pergunta}</FormLabel>
              <RadioGroup
                aria-label={pergunta}
                name={pergunta}
                value={respostas[index]}
                onChange={(e) => handleChange(e, index)}
                style={{ flexDirection: "row" }}
              >
                {["1", "2", "3", "4", "5"].map((valor) => (
                  <FormControlLabel
                    value={valor}
                    control={<Radio />}
                    label={valor}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          ))}
        </Box>
        <Button
          type="submit"
          variant="contained"
          value="Ativar"
          color="primary"
          disabled={loading}
          style={{ width: "100%", marginTop: 25 }}
          onClick={(e) => onSubmit(e)}
        >
          {loading && <CircularProgress size="22px" color="white" />}
          {!loading && "Cadastrar"}
        </Button>
      </StyledBox>
    </Wrapper>
  );
};

export async function getServerSideProps() {
  const { data, ok, originalError } = await getServerSidePropsApi.get(
    "/treinamentos"
  );

  if (!ok) {
    return {
      props: {
        treinamentos: [],
      },
    };
  }

  const optionsTreinamentos = data.map((item) => ({
    name: item.nome,
    value: item.id,
  }));

  return {
    props: {
      treinamentos: optionsTreinamentos,
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
  background-color: white;
  border-radius: 8px;
`;

const StyledBox = styled(Box)`
  && {
    width: 80%;
    @media (max-width: 480px) {
      width: 80%;
    }

    @media (max-width: 625px) {
      width: 90%;
    }

    @media (max-width: 900px) {
      width: 100%;
    }
  }
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
