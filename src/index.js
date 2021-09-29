import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import CssBaseline from "@material-ui/core/CssBaseline";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import styled from "styled-components";

import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    secondary: {
      light: "#fa5455",
      main: "#890004",
      dark: "#c1162c",
    },
    primary: {
      light: "#2c2c2c",
      main: "#3a3a3a",
      dark: "#000000",
    },
  },
  //  typography: {
  //    button: {
  //      textTransform: "none",
  //    },
  //  },
});

const Image = styled.div`
  background-image: url("https://opus.inc/intra/opus_branco.png");
  background-repeat: no-repeat;
  height: 54px;
  width: 134px;
  margin-left: 10px;
  position: absolute;
  z-index: 10;
`;

const Wrapper = styled.div`
  display: flex;
  justify-items: center;
  background-color: #3a3a3a;
  height: 54px;
`;

ReactDOM.render(
  <React.Fragment>
    <MuiThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Image />
      <Wrapper />
      <App />
    </MuiThemeProvider>
  </React.Fragment>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
