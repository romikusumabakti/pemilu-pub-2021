import { useTheme } from "@emotion/react";
import Loading from '../components/Loading';
import { Box, Container, Grow, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from "@material-ui/core";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import PeopleIcon from '@material-ui/icons/People';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import { useEffect, useState } from "react";
import { API_URL } from "../App";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

function TabelPemilih(props) {

  const [daftarDapil, setDaftarDapil] = useState([]);
  const [daftarAngkatan, setDaftarAngkatan] = useState([]);
  const [daftarMahasiswa, setDaftarMahasiswa] = useState([]);

  useEffect(() => {
    fetch(API_URL + '/dapil/')
      .then(response => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then(daftarDapil => {
        setDaftarDapil(daftarDapil);
      }).catch((error) => {
        console.error(error);
      });

    fetch(API_URL + '/angkatan/')
      .then(response => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then(daftarAngkatan => {
        setDaftarAngkatan(daftarAngkatan);
      }).catch((error) => {
        console.error(error);
      });

    fetch(API_URL + '/mahasiswa/')
      .then(response => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then(daftarMahasiswa => {
        setDaftarMahasiswa(daftarMahasiswa);
      }).catch((error) => {
        console.error(error);
      });
  }, []);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - daftarMahasiswa.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (daftarDapil.length > 0 && daftarAngkatan.length > 0 && daftarMahasiswa.length > 0) {
    return (
      <Grow in={true} style={{ transformOrigin: '50% 0' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell>NIM/NIDN</TableCell>
                <TableCell>Nama</TableCell>
                <TableCell>Dapil</TableCell>
                <TableCell>Angkatan</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? daftarMahasiswa.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : daftarMahasiswa
              ).map((mahasiswa) => (
                <TableRow key={mahasiswa.nim}>
                  <TableCell>{mahasiswa.nim}</TableCell>
                  <TableCell>{mahasiswa.nama}</TableCell>
                  <TableCell>{daftarDapil.filter(dapil => dapil.id === mahasiswa.dapil)[0].nama}</TableCell>
                  <TableCell>{ mahasiswa.angkatan ?
                  mahasiswa.angkatan + ' ' + daftarAngkatan.filter(angkatan => angkatan.nomor === mahasiswa.angkatan)[0].nama : ''
                  }</TableCell>
                  <TableCell>{mahasiswa.akun ? 'Sudah mendaftar' : 'Belum mendaftar'}</TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[8, 20, 30, { label: 'Semua', value: -1 }]}
                  labelRowsPerPage="Baris per halaman"
                  colSpan={3}
                  count={daftarMahasiswa.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Grow>
    );
  } else {
    return <Loading />
  }
}

export default function Pemilih(props) {
  const theme = useTheme();
  return (
    <Container component="main" maxWidth="md" sx={{ p: theme.padding }}>
      <Stack spacing={theme.padding}>

        <Stack direction="row" spacing={1} justifyContent="center">
          <PeopleIcon sx={{ fontSize: 32 }} />
          <Typography variant="h5" component="h1">
            Daftar Pemilih Tetap (DPT) Pemilu PUB 2021
          </Typography>
        </Stack>

        <TabelPemilih />
      </Stack>
    </Container>
  )
}