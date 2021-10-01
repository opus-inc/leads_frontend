/*
 *  Empreendimentos
 */
/* eslint-disable no-unreachable */
import { useState } from "react";
import { localApi } from "../src/services/api";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TextField,
  Button,
  Checkbox,
} from "@material-ui/core";
import styled from "styled-components";
import Head from "next/head";

const ConEmpreendimentos = (props) => {
  const [empreendimentos, setEmpreendimentos] = useState(props.empreendimentos);
  const [checkbox, setCheckbox] = useState(props.checkbox);

  const handleCheckbox = (item, value, formItem, index) => {
    let temp = [...checkbox];
    temp[index] = {
      ...item,
      ...formItem,
      checked: value,
    };
    setCheckbox(temp);
  };

  const handleFormIdInput = (item, value, formItem, index) => {
    let temp = [...checkbox];
    temp[index] = {
      ...item,
      ...formItem,
      form_id: value,
    };
    setCheckbox(temp);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let req = checkbox.filter(Boolean).filter((item) => item.checked);

    if (req.length <= 0) {
      alert("Selecione algum registro antes de enviar.");
      return;
    }

    if (
      req
        .map((item) => {
          if (item.form_id === "") return item;
          return undefined;
        })
        .filter(Boolean).length > 0
    ) {
      alert("Preencha o ID da fila");
      return;
    }

    if (e.nativeEvent.submitter.value === "Ativar") {
      req = req.map((item) => {
        let temp = item;
        temp._id = temp.id;
        delete temp.id;
        delete temp.checked;
        return { ...item, status: "Ativo" };
      });
    }

    if (e.nativeEvent.submitter.value === "Inativar") {
      req = req.map((item) => {
        let temp = item;
        temp._id = temp.id;
        delete temp.id;
        delete temp.checked;
        return { ...item, status: "Inativo" };
      });
    }

    const { ok, originalError } = await localApi.patch(
      "/empreendimentos/updateMany",
      {
        data: req,
      }
    );

    if (!ok) {
      alert(originalError.message);
      return;
    }

    if (ok) {
      alert("Registros atualizados com sucesso.");
      updateEmpreendimentos();
    }
  };

  const updateEmpreendimentos = async () => {
    const { data, ok, originalError } = await localApi.get("/empreendimentos");

    if (!ok) {
      alert(originalError.message);
      return;
    }

    const temp = data.map(({ form_id }) => ({
      checked: false,
      form_id: form_id || "",
    }));
    setCheckbox(temp);
    setEmpreendimentos(data);
  };

  return (
    <Wrapper>
      <Head>
        <title>Cadastro Único - Empreendimentos</title>
      </Head>
      <form onSubmit={onSubmit}>
        <div id="buttons" style={{ width: "100%", textAlignLast: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            value="Ativar"
          >
            Ativar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            value="Inativar"
          >
            Inativar
          </Button>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Ativar/Inativar</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>ID da fila responsável</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {empreendimentos &&
              empreendimentos.map((item, index) => (
                <TableRow
                  key={item.id}
                  style={{ backgroundColor: "rgb(254, 254, 254, 0.8)" }}
                >
                  <TableCell style={{ textAlignLast: "center" }}>
                    <Checkbox
                      checked={checkbox[index].checked}
                      onChange={() =>
                        handleCheckbox(
                          item,
                          !checkbox[index].checked,
                          checkbox[index],
                          index
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      value={checkbox[index].form_id}
                      onChange={(e) =>
                        handleFormIdInput(
                          item,
                          e.target.value,
                          checkbox[index],
                          index
                        )
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <div id="buttons" style={{ width: "100%", textAlignLast: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            value="Ativar"
          >
            Ativar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            value="Inativar"
          >
            Inativar
          </Button>
        </div>
      </form>
    </Wrapper>
  );
};

export async function getServerSideProps() {
  const { data, ok } = await localApi.get("/empreendimentos");

  if (!ok) {
    return {
      props: {
        checkbox: [],
        empreendimentos: [],
      },
    };
  }

  const temp = data.map(({ form_id }) => ({
    checked: false,
    form_id: form_id || "",
  }));

  return {
    props: {
      checkbox: temp,
      empreendimentos: data,
    },
  };
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default ConEmpreendimentos;
