import { useTheme } from '@emotion/react';
import { Container, Grow, Stack, Typography } from '@material-ui/core';
import KartuCalon from '../components/KartuKandidat';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { useEffect, useState } from "react";
import { API_URL } from "../App";
import Loading from '../components/Loading';

export default function Kandidat(props) {

  const [daftarKandidat, setDaftarKandidat] = useState([]);

  useEffect(() => {
    fetch(API_URL + '/kandidat/')
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

  const theme = useTheme();

  if (daftarKandidat.length > 0) {
    return (
      <Container component="main" maxWidth="md" sx={{ p: theme.padding }}>
        <Stack spacing={theme.padding}>

          <Stack direction="row" spacing={1} justifyContent="center">
            <AccountBoxIcon sx={{ fontSize: 32 }} />
            <Typography variant="h5" component="h1">
              Informasi Calon Ketua/Keamanan PUB
            </Typography>
          </Stack>

          <Grow in={true} style={{ transformOrigin: '50% 0' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={theme.padding} justifyContent="space-between" alignItems={{ xs: 'center', sm: 'stretch' }}>
              {daftarKandidat.map((kandidat) => (
                <KartuCalon key={kandidat.nomor} {...kandidat} />
              ))}
            </Stack>
          </Grow>

        </Stack>
      </Container>
    );
  } else {
    return <Loading />
  }
}