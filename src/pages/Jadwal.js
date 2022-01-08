import { useTheme } from "@emotion/react";
import { Container, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import EventIcon from '@material-ui/icons/Event';
import { useEffect, useState } from "react";
import { API_URL } from "../App";

export default function Jadwal(props) {

  const [daftarJadwal, setDaftarJadwal] = useState([]);

  useEffect(() => {
    fetch(API_URL + '/jadwal/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(daftarJadwal => {
        setDaftarJadwal(daftarJadwal);
      }).catch((error) => {
        console.error(error);
      });
  }, []);

  function formatTanggal(tanggal) {
    return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(tanggal));
  }

  const theme = useTheme();

  return (
    <Container component="main" maxWidth="md" sx={{ p: theme.padding }}>
      <Stack spacing={theme.padding}>

        <Stack direction="row" spacing={1} justifyContent="center">
          <EventIcon sx={{ fontSize: 32 }} />
          <Typography variant="h5" component="h1">
            Jadwal Pemilu PUB 2021
          </Typography>
        </Stack>

        {daftarJadwal.length > 0 ?
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Tanggal</TableCell>
                  <TableCell>Kegiatan</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {daftarJadwal.map((jadwal) => (
                  <TableRow
                    key={jadwal.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{formatTanggal(jadwal.tanggal_mulai) + (jadwal.tanggal_berakhir ? ' s.d. ' + formatTanggal(jadwal.tanggal_berakhir) : '')}</TableCell>
                    <TableCell>{jadwal.kegiatan}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          :
          <Stack spacing={1}>
            {[...Array(10)].map((x, i) => <Skeleton key={i} variant="rectangular" height={48} />)}
          </Stack>}

      </Stack>
    </Container>
  );
}
