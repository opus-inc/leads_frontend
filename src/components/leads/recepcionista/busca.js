import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { flaskApi } from "../../../services/api";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
} from "@material-ui/core";

const BuscaLeadRecepcionista = ({ leads, setLeads }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setLeads(null);
    setEmail("");
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await flaskApi.get("", {
      email,
    });

    console.log("linha 31 busca.js" + response.data);

    if (!response.ok) {
      alert(response?.data?.data || response.originalError.message.email);
      setLoading(false);
      setEmail("");
      return;
    }

    console.log(response);
    if (Array.isArray(response.data)) {
      setLeads(response.data);
    }
    if (!Array.isArray(response.data)) {
      setLeads([response.data]);
    }
    setEmail("");
    setLoading(false);
    return;
  };

  const handleClear = () => {
    setLeads(null);
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
        CONSULTAR CLIENTE
      </Typography>
      <form
        onSubmit={onSubmit}
        style={{ width: "100%", textAlignLast: "center" }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {!leads && (
            <>
              <TextField
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="E-mail"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{
                  margin: "12px 0px",
                }}
                disable={loading}
              >
                {loading && <CircularProgress size="22px" color="white" />}
                {!loading && "Buscar"}
              </Button>
            </>
          )}
        </div>
      </form>
      {leads && (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Nome do Negócio</TableCell>
                <TableCell>Validade</TableCell>
                <TableCell>Produto</TableCell>
                <TableCell>Última atualização</TableCell>
                <TableCell>Etapa do Funil</TableCell>
                <TableCell>Cadastrado por</TableCell>
                <TableCell>Equipe</TableCell>
              </TableRow>
            </TableHead>
            {leads.map(
              ({
                id_negocio,
                validade,
                nome_negocio,
                produto,
                dias_ultimo_atualizacao,
                etapa_funil,
                negocio_cadastrado_por,
                equipe,
              }) => (
                <TableRow key={id_negocio}>
                  <TableCell>{nome_negocio}</TableCell>
                  <TableCell>{validade}</TableCell>
                  <TableCell>{produto}</TableCell>
                  <TableCell>{dias_ultimo_atualizacao} dias atrás</TableCell>
                  <TableCell>{etapa_funil}</TableCell>
                  <TableCell>{negocio_cadastrado_por}</TableCell>
                  <TableCell>{equipe}</TableCell>
                </TableRow>
              )
            )}
          </Table>
          <Button
            variant="contained"
            color="primary"
            style={{
              margin: "12px 0px",
            }}
            onClick={(_) => handleClear()}
          >
            Buscar novamente
          </Button>
        </>
      )}
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

export default BuscaLeadRecepcionista;
