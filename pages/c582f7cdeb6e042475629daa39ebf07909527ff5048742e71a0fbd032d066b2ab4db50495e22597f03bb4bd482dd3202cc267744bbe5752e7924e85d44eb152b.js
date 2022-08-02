/*
 *  Ações
 */
import * as React from "react";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import { AcaoCadastro, AcaoConsulta } from "../src/components/index";
import { localApi, getServerSidePropsApi, localApiRemote } from "../src/services/api";
import Head from "next/head";
import { Fab, Box } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';

import { Snackbar, Alert, Modal } from "@mui/material"

const Acao = (props) => {
  const [isEditing, setIsEditing] = React.useState(true);
  const [toast, setToast] = React.useState({
    open: false,
    message: '',
    variant: '',
    vertical: 'top',
    horizontal: 'center',
  });
  const [openModal, setOpenModal] = React.useState(false);
  const [currentAcao, setCurrentAcao] = React.useState();
  const [acoes, setAcoes] = React.useState(props.acoes);
  const [loading, setLoading] = React.useState(false);
  
  React.useEffect(() => {
    setToast({
      ...toast,
      open: true,
      message: 'Ao editar uma ação, esta será inativada automaticamente.',
      variant: 'info'
    });
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setToast({
      ...toast,
      open: false,
      // message: '',
      // variant: ''
    });
  };

  const handleOpenModal = (acao) => {
    setCurrentAcao(acao);
    setOpenModal(true);
  }

  const handleNewAcao = () => {
    setIsEditing(false);
    handleOpenModal()
  }

  const onSubmit = async (acao) => {
    setLoading(true);
    
    if(isEditing) {
      const { ok, originalError } = await localApiRemote.patch(`/acao/${acao.id}`, {
        valor_real: acao.valor_real,
        status: "Inativo",
      });

      if(!ok) {
        setToast({
          ...toast,
          open: true,
          message: originalError,
          variant: 'error'
        })
        return;
      }
    } else {
      const { ok, originalError } = await localApiRemote.post("/acao", {
        ...acao,
        nome: `Ação - ${acao.equipe} - ${acao.nome}`,
        status: "Ativo",
        acao_cliente: true
      });

      if(!ok) {
        setToast({
          ...toast,
          open: true,
          message: originalError,
          variant: 'error'
        })
        return;
      }
    }
    
    const { data: acoes, ok: acoesOk } = await localApiRemote.get("/acao", { status: "Ativo" });

    if(!acoesOk) {
      setAcoes([]);
      setToast({
        ...toast,
        open: true,
        message: 'Erro ao buscar as ações',
        variant: 'error'
      })
      return;
    }

    setAcoes([...acoes]);

    setToast({
      ...toast,
      open: true,
      message: isEditing ? 'Item editado com sucesso' : 'Item salvo com sucesso',
      variant: 'success'
    })

    setLoading(false);
    setOpenModal(false);
    
  }

  return (
    <Box>
       <Head>
        <title>Cadastro Único - Ações</title>
      </Head>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Box>
          <AcaoCadastro empreendimentos={props.empreendimentos} acao={currentAcao} isEditing={isEditing} onSubmit={onSubmit}/>
        </Box>
      </Modal>
      <Fab color="primary" aria-label="add" style={{
          margin: 0,
          top: 'auto',
          right: 20,
          bottom: 20,
          left: 'auto',
          position: 'fixed',
      }} onClick={() => handleNewAcao()}>
        <AddIcon />
      </Fab>
      <Snackbar open={toast.open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: toast.vertical, horizontal: toast.horizontal }}>
        <Alert onClose={handleClose} severity={toast.variant} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
      <AcaoConsulta acoes={acoes} loading={loading} handleEdit={(acao) => {
        setIsEditing(true);
        handleOpenModal(acao);
      }}/>
    </Box>
  );
};

export async function getServerSideProps() {
  const { data: acoes, ok: acoesOk } = await getServerSidePropsApi.get("/acao", { status: "Ativo" });
  const { data: empreendimentos, ok: empreendimentosOk } = await getServerSidePropsApi.get("/empreendimentos", { status: "Ativo" });

  return {
    props: {
      ...(empreendimentosOk ? { empreendimentos } : { empreendimentos: [] }),
      ...(acoesOk ? { acoes } : { acoes: [] })
    },
  };
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;
const GridWrapper = styled.div`
  display: flex;
  align-items: baseline;

  @media screen and (max-width: 600px) {
    flex-wrap: wrap;
  }
`;

export default Acao;
