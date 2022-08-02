import Head from "next/head";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { FormComponent } from "../../src/components/index";
import { localApiRemote } from "../../src/services/api";
import Typography from "@material-ui/core/Typography";
import translateLocal from "../../src/helpers/translateLocal";
import { useRouter } from "next/router";
import appendRdScript from "../../src/helpers/appendRdScript";

const CadLeadStand = (props) => {
  const router = useRouter();
  const { cliente } = router.query;
  const [form, setForm] = useState({
    cpf: "",
    nome: "",
    email: "",
    telefone: "",
    aceite: true,
  });
  const [loading, setLoading] = useState(false);

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
    document.title = "Cadastro Único";
    // appendRdScript();
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    let telefone = form.telefone.match(/\d+/g).join("");

    setLoading(true);
    const { ok, originalError } = await localApiRemote.post("/leads", {
      ...form,
      aceite: form.aceite ? "Sim" : "Não",
      local: translateLocal[cliente], //
      tipo: "Stand de Vendas",
      telefone: telefone,
    });
    console.log(ok);
    if (!ok) {
      alert(originalError.message);
      setLoading(false);
      return;
    }

    // let temp = {
    //   ...form,
    //   telefone: telefone,
    // };
    // await localApiRemote.post("/leads/salesforce", temp);

    alert("Registro criado com sucesso!");
    const temp = document.createElement("a");
    temp.href = "https://opus.inc";
    temp.click();
    setLoading(false);
  };

  return (
    <Wrapper>
      <Head>
        <title>Cadastro Único</title>
      </Head>
      <Typography
        variant="h5"
        component="div"
        gutterBottom
        style={{ marginBottom: "5vh" }}
      >
        REALIZE SEU CADASTRO
      </Typography>
      <FormComponent
        formId="form-cliente  -cadastro"
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8vh;
  align-items: center;
  justify-content: center;
`;

export default CadLeadStand;
