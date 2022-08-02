import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FormComponent } from "../index";
import { localApiRemote } from "../../services/api";
import Typography from "@material-ui/core/Typography";
import { useRouter } from 'next/router'
import { Box } from "@mui/material";

const CadAcoes = ({ empreendimentos, acao, isEditing, onSubmit, loading }) => {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    valor: "",
    valor_real: "",
    equipe: "",
    // acao_cliente: false,
    produto: "",
    corretorId: ""
  });
  const [corretores, setCorretores] = React.useState([]);

  const campos = [
    {
      placeholder: "Insira o nome da ação",
      label: "Nome da ação",
      name: "nome",
      type: "text",
      required: true,
      disabled: isEditing
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
      disabled: isEditing
    },
    // {
    //   placeholder: "Ação para o cliente?",
    //   label: "Ação para o cliente?",
    //   name: "acao_cliente",
    //   type: "radio",
    //   disabled: isEditing
    // },
    {
      placeholder: "Produto",
      label: "Produto ",
      name: "produto",
      type: "select",
      required: true,
      options: empreendimentos.map(i => ({ name: i.nome, value: i.id })),
      // condition: () => form.acao_cliente,
      disabled: isEditing
    },
    {
      placeholder: "Escolha o corretor responsável",
      label: "Corretor Responsável",
      name: "corretorId",
      type: "autocomplete",
      required: true,
      disabled: isEditing,
      options: corretores
    },
    {
      placeholder: "Insira o valor orçado da ação",
      label: "Valor Orçado",
      name: "valor",
      type: "number",
      required: true,
      disabled: isEditing
    },
    {
      placeholder: "Insira o valor real da ação",
      label: "Valor Real",
      name: "valor_real",
      type: "number",
      required: true,
      condition: () => isEditing,
    },
  ];

  useEffect(() => {
    if(acao) {
      setForm(acao);
    } else {
      setForm({
        nome: "",
        valor: "",
        equipe: "",
        corretorId: "",
        produto: "",
      })
    }
  }, [])

  useEffect(() => {
    (async () => {
      const { data, ok } = await localApiRemote.get("/acao/corretores", {
        "Equipe": form.equipe,
      });
      setCorretores(
        data
          .sort((a, b) => {
            if (parseInt(a.ID_usuario) > parseInt(b.ID_usuario)) {
              return 1;
            }
            if (parseInt(a.ID_usuario) < parseInt(b.ID_usuario)) {
              return -1;
            }
            // a must be equal to b
            return 0;
          })
          .map(item => ({
            label: `${item.ID_usuario} - ${item.Equipe} - ${item.Nome}`,
            id: item.ID_usuario
          }))
      );
      // setCorretores(data);
    })();
  }, [form.equipe])

  // const onSubmit = async (e) => {
  //   e.preventDefault();
  //   let temp = {...form};
  //   if(!temp.acao_cliente) {
  //     delete temp.produto;
  //   }
    
  //   const { ok, originalError } = await localApiRemote.post("/acao", {
  //     ...temp,
  //     nome: `Ação - ${form.equipe} - ${form.nome}`,
  //     status: "Ativo",
  //   });
  //   if (!ok) {
  //     alert(originalError.message);
  //     return;
  //   }

  //   if (ok) {
  //     alert("Registro criado com sucesso.");
  //     router.reload(window.location.pathname);
  //   }
  // };

  return (
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: "70%",
      bgcolor: 'background.paper',
      // border: '2px solid #000',
      borderRadius: "4px",
      boxShadow: 24,
      p: 4,
    }}>
      <Typography variant="h6" component="div" gutterBottom color="#fff">
        {isEditing ? "EDITAR" : "CADASTRAR"}
      </Typography>
      <FormComponent
        formId="form-acao-cadastro"
        fields={campos}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
        width={95}
        state={form}
        setState={setForm}
        buttonText={isEditing ? "Editar" : "Cadastrar"}
        loading={loading}
      />
    </Box>
  );
};

export default CadAcoes;
