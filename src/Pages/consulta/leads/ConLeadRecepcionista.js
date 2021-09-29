import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { facilitaApi, localApi } from "../../../Services/api-config";
//import useWindowDimensions from "../../../Helpers/Hooks/useWindowDimensions";
//import getWidth from "../../../Helpers/getWidth";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  MenuItem,
  Select,
  InputLabel,
  Typography,
} from "@material-ui/core";
import translateLocal from "../../../Helpers/translateLocal";

const ConLeadRecepcionista = ({ local }) => {
  const [leads, setLeads] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [selectedProdutos, setSelectedProdutos] = useState([]);
  //const { width } = useWindowDimensions();

  useEffect(() => {
    getProdutos();
    pesquisarNovamente();
  }, []);

  const pesquisarNovamente = async () => {
    console.log(local);
    const temp = translateLocal[local];
    if (!temp) {
      setLeads([
        {
          id: "",
          tipo: "",
          local: "",
          cliente: {
            status: "",
            _id: "",
            email: "",
            __v: "",
            createdAt: "",
            nome: "",
            telefone: "",
            updatedAt: "",
          },
          createdAt: "",
        },
      ]);
      setSelectedProdutos([]);
      return;
    }
    const { data } = await localApi.get("/leads", {
      local: temp,
      produto: "null",
    });
    setLeads(data);
    setSelectedProdutos([]);
  };
  const getProdutos = async () => {
    const { data, ok, originalError } = await localApi.get("/empreendimentos", {
      status: "Ativo",
    });
    if (!ok) {
      alert(originalError.message);
      return;
    }
    setProdutos(data);
  };

  const handleFormInput = (value, index) => {
    let temp = [...selectedProdutos];
    temp[index] = value;
    setSelectedProdutos(temp);
  };

  const onSubmitEdit = async (e) => {
    e.preventDefault();
    if (selectedProdutos.filter(Boolean).length === 0) {
      alert("Pelo menos um registro deve ser atualizado");
      return;
    }
    let temp = leads.map((lead, index) => ({
      ...lead,
      produto: selectedProdutos[index],
    }));
    temp = temp
      .filter((item) => item.produto)
      .map((item) => ({
        ...item,
        produto: JSON.parse(item.produto).id,
        cliente: item.cliente._id,
      }));

    const { ok, originalError } = await localApi.patch("/leads/updateMany", {
      data: temp,
    });

    if (!ok) {
      alert(originalError.message);
      return;
    }

    temp = leads.map((lead, index) => ({
      ...lead,
      empreendimento: selectedProdutos[index],
    }));
    temp = temp
      .filter((item) => item.empreendimento)
      .map((item) => ({
        empreendimento: JSON.parse(item.empreendimento).id_facilita,
        nome: item.cliente.nome,
        email: item.cliente.email,
        telefone: item.cliente.telefone,
        facilita_custom_selector: JSON.parse(item.empreendimento).form_id,
        facilita_custom_page: "Formulário de Leads",
        facilita_custom_url: "http://app.opus.inc",
        name: "Formulário Lead",
        origem: "Cliente",
      }));
    temp.forEach(async (item) => {
      const {
        ok: facilitaOk,
        originalError: { message },
      } = await facilitaApi.post("/trackerform", item);
      if (!facilitaOk) {
        alert(message);
        return;
      }
    });

    alert("Cadastrado com sucesso.");
    setLeads([]);
    setSelectedProdutos([]);
  };

  return (
    <Wrapper>
      <Typography
        variant="h6"
        component="div"
        gutterBottom
        color="#fff"
        align="center"
      >
        AGUARDANDO ENVIO
      </Typography>
      <form
        onSubmit={onSubmitEdit}
        style={{ width: "100%", textAlignLast: "center" }}
      >
        {leads.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Empreendimento</th>
                <th>Data/Hora de Criação</th>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map(
                (
                  { id, cliente: { nome, email, telefone, createdAt } },
                  index
                ) => (
                  <TableRow
                    key={id}
                    style={{ backgroundColor: "rgb(254, 254, 254, 0.9)" }}
                  >
                    <TableCell>{nome}</TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell>{telefone}</TableCell>
                    <TableCell>
                      <InputLabel id="select-produto-label">
                        Produtos
                      </InputLabel>
                      <Select
                        id="select-produto"
                        value={selectedProdutos[index]}
                        onChange={(e) => handleFormInput(e.target.value, index)}
                        variant="standard"
                        required
                      >
                        <MenuItem selected value>
                          Selecione o produto
                        </MenuItem>
                        {produtos &&
                          produtos.map((item) => (
                            <MenuItem
                              key={item._id}
                              value={JSON.stringify(item)}
                            >
                              {item.nome}
                            </MenuItem>
                          ))}
                      </Select>
                    </TableCell>
                    <TableCell>{formatDate(createdAt)}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        )}
        {leads.length === 0 && (
          <div>
            <Typography
              variant="h5"
              component="div"
              gutterBottom
              color="#fff"
              align="center"
            >
              NENHUM LEAD AGUARDANDO ENVIO
            </Typography>
          </div>
        )}
        <Button
          type="submit"
          value="Enviar"
          variant="contained"
          color="primary"
          style={{
            margin: "4px 4px 0px 4px",
          }}
        >
          Enviar
        </Button>
        <Button
          color="primary"
          onClick={() => pesquisarNovamente()}
          variant="contained"
          value="Ativar"
          style={{
            margin: "4px 4px 0px 4px",
          }}
        >
          Pesquisar novamente
        </Button>
      </form>
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

const formatDate = (date) => {
  let data = new Date(date);

  let day = data.getDate() > 9 ? data.getDate() : `0${data.getDate()}`;
  let month =
    data.getMonth() + 1 > 9 ? data.getMonth() + 1 : `0${data.getMonth() + 1}`;
  let year = data.getFullYear();
  let hours = data.getHours() > 9 ? data.getHours() : `0${data.getHours()}`;
  let minutes =
    data.getMinutes() + 1 > 9
      ? data.getMinutes() + 1
      : `0${data.getMinutes() + 1}`;

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export default ConLeadRecepcionista;
