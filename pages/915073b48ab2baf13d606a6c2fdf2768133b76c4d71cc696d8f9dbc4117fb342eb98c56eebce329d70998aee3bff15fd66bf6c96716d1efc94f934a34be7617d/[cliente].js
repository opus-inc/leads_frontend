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
    nome: "",
    email: "",
    telefone: "",
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
      placeholder: "Insira o telefone do cliente",
      label: "Telefone ",
      name: "telefone",
      type: "tel",
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
      local: translateLocal[cliente], //
      tipo: "Cliente",
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
    temp = document.createElement("a");
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
        style={{ marginBottom: "140px" }}
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
  margin-top: 16vh;
  align-items: center;
  justify-content: center;
`;

export default CadLeadStand;
