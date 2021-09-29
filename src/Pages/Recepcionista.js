import React, { useEffect } from "react";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import { CadLeadStand, ConLeadRecepcionista } from "./index";
import { useParams } from "react-router-dom";
import translateLocal from "../Helpers/translateLocal";

const Recepcionista = () => {
  const { param } = useParams();
  useEffect(() => {
    document.title = "Cadastro Único - Stand";
  }, []);
  return (
    <>
      <Typography
        variant="h6"
        component="div"
        gutterBottom
        color="#fff"
        align="left"
        style={{
          position: "absolute",
          marginTop: "100px",
          marginLeft: "100px",
        }}
      >
        {translateLocal[param]}
      </Typography>
      <Wrapper>
        <Typography
          variant="h4"
          component="div"
          gutterBottom
          color="#fff"
          align="center"
          style={{ marginBottom: "80px" }}
        >
          CLIENTES STAND
        </Typography>
        <GridWrapper>
          <CadLeadStand local={param} />
          <ConLeadRecepcionista local={param} />
        </GridWrapper>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
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
