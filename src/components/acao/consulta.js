import { useState } from "react";
import { localApi } from "../../services/api";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Checkbox,
  Typography,
} from "@material-ui/core";
import styled from "styled-components";

const ConAcoes = (props) => {
  const [acoes, setAcoes] = useState(props.acoes);
  const [checkbox, setCheckbox] = useState([]);
  // eslint-disable-next-line no-unused-vars

  const handleCheckbox = (item, value, index) => {
    let temp = [...checkbox];
    temp[index] = {
      ...item,
      checked: value,
    };
    setCheckbox(temp);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let req = checkbox.filter(Boolean).filter((item) => item.checked);

    if (e.nativeEvent.submitter.value === "Ativar") {
      req = req.map((item) => {
        let temp = item;
        temp = { ...item, status: "Ativo", _id: item.id };
        delete temp.checked;
        delete temp.id;
        return temp;
      });
    }

    if (e.nativeEvent.submitter.value === "Inativar") {
      req = req.map((item) => {
        let temp = item;
        temp = { ...item, status: "Inativo", _id: item.id };
        delete temp.checked;
        delete temp.id;
        return temp;
      });
    }

    if (req.length <= 0) {
      alert("Selecione algum registro antes de enviar.");
      return;
    }

    const { ok, originalError } = await localApi.patch("/acao/updateMany", {
      data: req,
    });

    if (!ok) {
      alert(originalError.message);
      return;
    }

    if (ok) {
      alert("Registros atualizados com sucesso.");
      updateAcoes();
    }
  };

  const updateAcoes = async () => {
    const { data, ok, originalError } = await localApi.get("/acao", {
      status: "Ativo",
    });

    if (!ok) {
      alert(originalError.message);
      return;
    }

    setAcoes(data);
  };

  return (
    <Wrapper>
      <Typography variant="h6" component="div" gutterBottom color="#fff">
        INATIVAR
      </Typography>
      <form onSubmit={onSubmit}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ativar/Inativar</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Equipe</TableCell>
              <TableCell>Valor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {acoes &&
              acoes.map((item, index) => (
                <TableRow
                  key={item.id}
                  style={{ backgroundColor: "rgb(254, 254, 254, 0.9)" }}
                >
                  <TableCell style={{ textAlignLast: "center" }}>
                    <Checkbox
                      checked={checkbox[index]}
                      onChange={() =>
                        handleCheckbox(item, !checkbox[index], index)
                      }
                    />
                  </TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.equipe}</TableCell>
                  <TableCell>{formatMoney(item.valor)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <div
          id="buttons"
          style={{
            width: "100%",
            textAlignLast: "center",
            display: "flex",
            justifyContent: "space-around",
            margin: "6px",
          }}
        >
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

function formatMoney(money) {
  let formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
  return formatter.format(money);
}

export default ConAcoes;
