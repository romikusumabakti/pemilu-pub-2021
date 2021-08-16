import { useTheme } from '@emotion/react';
import { Container, Grow, Stack, Typography } from '@material-ui/core';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import React from 'react';
import KartuPilihKandidat from '../components/KartuPilihKandidat';
import KonfirmasiPilih from '../components/KonfirmasiPilih';
import { useEffect, useState } from "react";
import { API_URL } from "../App";
import Loading from '../components/Loading';

export default function Simulasi(props) {

  const [daftarKandidat, setDaftarKandidat] = useState([]);

  useEffect(() => {
    fetch(API_URL + '/simulasi/kandidat/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(daftarKandidat => {
        setDaftarKandidat(daftarKandidat);
      }).catch((error) => {
        console.error(error);
      });
  }, []);

  const [terpilih, setTerpilih] = React.useState(null);

  const handleClose = (terpilih) => {
    if (terpilih) {
      console.log(terpilih);
    }
    setTerpilih(null);
  };

  const theme = useTheme();

  if (daftarKandidat.length > 0) {
    return (
      <Container component="main" maxWidth="md" sx={{ p: theme.padding }}>
        <Stack spacing={theme.padding}>
          <Stack direction="row" spacing={1} justifyContent="center">
            <HowToVoteIcon sx={{ fontSize: 32 }} />
            <Typography variant="h5" component="h1">
              Simulasi Pemilihan Ketua PUB
            </Typography>
          </Stack>
          <Grow in={true} style={{ transformOrigin: '50% 0' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={theme.padding}>
              {daftarKandidat.map((kandidat) => (
                <KartuPilihKandidat key={kandidat.nomor} {...kandidat} onClick={() => setTerpilih(kandidat)} />
              ))}
            </Stack>
          </Grow>
        </Stack>
        <KonfirmasiPilih
          keepMounted
          onClose={handleClose}
          terpilih={terpilih}
        />
      </Container>
    );
  } else {
    return <Loading />
  }
}