import React from "react";
import App from "next/app";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import styled from "styled-components";
import theme from "../src/theme";

class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>My page</title>
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Image />
          <Wrapper />
          <Component {...pageProps} />
        </ThemeProvider>
      </>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  justify-items: center;
  background-color: #3a3a3a;
  height: 54px;
`;

const Image = styled.div`
  background-image: url("https://opus.inc/intra/opus_branco.png");
  background-repeat: no-repeat;
  height: 54px;
  width: 134px;
  margin-left: 10px;
  position: absolute;
  z-index: 10;
`;

export default MyApp;
