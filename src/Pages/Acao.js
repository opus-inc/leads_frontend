import React, { useEffect } from "react";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import { CadAcoes, ConAcao } from "./index";

const Recepcionista = () => {
  useEffect(() => {
    document.title = "Cadastro Único - Cadastro Ação";
  }, []);
  return (
    <Wrapper>
      <Typography
        variant="h4"
        component="div"
        gutterBottom
        color="#fff"
        style={{ marginBottom: "80px" }}
      >
        AÇÕES
      </Typography>
      <GridWrapper>
        <CadAcoes />
        <ConAcao />
      </GridWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;
const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media screen and (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export default Recepcionista;
