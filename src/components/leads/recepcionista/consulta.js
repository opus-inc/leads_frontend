import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { facilitaApi, localApi } from "../../../services/api";
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
  TextField,
} from "@material-ui/core";
import translateLocal from "../../../helpers/translateLocal";

const ConLeadRecepcionista = (props) => {
  const [leads, setLeads] = useState(props.leads);
  const [selectedProdutos, setSelectedProdutos] = useState([]);
  const [tempProdutos, setTempProdutos] = useState([]);
  const produtos = props.empreendimentos;

  useEffect(() => {
    if (selectedProdutos.length > 0) {
      const temp = selectedProdutos.map(JSON.parse);
      setTempProdutos(temp);
    }
  }, [selectedProdutos]);

  const pesquisarNovamente = async () => {
    const temp = translateLocal[props.local];
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

  const handleFormInput = (value, index) => {
    let temp = [...selectedProdutos];
    temp[index] = value;
    setSelectedProdutos(temp);
  };

  const onSubmitForms = (e) => {
    e.preventDefault();
  };

  const onSubmitEdit = async (e) => {
    e.preventDefault();

    const buttons = document.getElementsByClassName("btn-click");
    console.log(buttons);
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].click();
    }

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
      const { ok: facilitaOk, originalError } = await facilitaApi.post(
        "/trackerform",
        item
      );
      if (!facilitaOk) {
        alert(originalError?.message);
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
        {leads && leads.length > 0 && (
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
                    <TableCell name="nome">{nome}</TableCell>
                    <TableCell name="email">{email}</TableCell>
                    <TableCell name="telefone">{telefone}</TableCell>
                    <TableCell>
                      <InputLabel id="select-produto-label">
                        Produtos
                      </InputLabel>
                      <Select
                        id="select-produto"
                        name="produto"
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
                              key={item.nome}
                              name={item.nome}
                              value={JSON.stringify(item)}
                            >
                              {item.nome}
                            </MenuItem>
                          ))}
                      </Select>
                    </TableCell>
                    <TableCell>{formatDate(createdAt)}</TableCell>
                    <form
                      id="form-recepcionista-liberar"
                      style={{ display: "none" }}
                      onSubmit={onSubmitForms}
                    >
                      <TextField id={nome} name="nome" value={nome} />
                      <TextField id={email} name="email" value={email} />
                      <TextField
                        id={telefone}
                        name="telefone"
                        value={telefone}
                      />
                      <TextField
                        id={tempProdutos[index]?.id_facilita}
                        name="produto"
                        value={tempProdutos[index]?.nome}
                      />
                      <input className="btn-click" type="submit" />
                    </form>
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
            margin: "4px 4px 0px' 4px",
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
