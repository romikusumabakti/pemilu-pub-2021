import { useTheme } from '@emotion/react';
import { Container, Grow, Stack, Typography } from '@material-ui/core';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import React from 'react';
import KartuPilihKandidat from '../components/KartuPilihKandidat';
import KonfirmasiPilih from '../components/KonfirmasiPilih';
import { useEffect, useState } from "react";
import { API_URL, token } from "../App";
import Loading from '../components/Loading';

export default function Pemilihan(props) {

  const [daftarKandidat, setDaftarKandidat] = useState([]);

  useEffect(() => {
    fetch(API_URL + '/kandidat/')
      .then(response => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then(daftarKandidat => {
        setDaftarKandidat(daftarKandidat);
      }).catch((error) => {
        console.error(error);
      });
  }, []);

  const [pilihan, setPilihan] = React.useState(null);

  const handleClose = (pilih) => {
    if (pilih) {
      const formData = new FormData();
      formData.append('pilihan', pilihan.nomor);
      const pilihanBatal = localStorage.getItem('pilihan');
      if (pilihanBatal) {
        formData.append('pilihan_batal', pilihanBatal);
      }
      fetch(API_URL + '/pemilu/pilih/', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token.access,
        },
        body: formData,
      })
        .then(response => {
          if (!response.ok) {
            throw new Error();
          }
          window.location.href = '/';
          return response.json();
        })
        .then(data => {
          localStorage.setItem('pilihan', pilihan.nomor);
          setPilihan(null);
        }).catch((error) => {
          console.error(error);
        });
    } else {
      setPilihan(null);
    }
  };

  const theme = useTheme();

  if (daftarKandidat.length > 0) {
    return (
      <Container component="main" maxWidth="sm" sx={{ p: theme.padding }}>
        <Stack spacing={theme.padding}>
          <Stack direction="row" spacing={1} justifyContent="center">
            <HowToVoteIcon sx={{ fontSize: 32 }} />
            <Typography variant="h5" component="h1">
              Surat Suara Pemilihan Ketua PUB
            </Typography>
          </Stack>
          <Grow in={true} style={{ transformOrigin: '50% 0' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={theme.padding}>
              {daftarKandidat.map((kandidat) => (
                <KartuPilihKandidat key={kandidat.nomor} {...kandidat} onClick={() => setPilihan(kandidat)} />
              ))}
            </Stack>
          </Grow>
        </Stack>
        <KonfirmasiPilih
          keepMounted
          onClose={handleClose}
          pilihan={pilihan}
        />
      </Container>
    );
  } else {
    return <Loading />
  }
}