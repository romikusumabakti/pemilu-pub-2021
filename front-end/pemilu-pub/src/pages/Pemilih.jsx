import { useTheme } from "@emotion/react";
import {
  Box,
  Container,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  InputLabel,
  Skeleton,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import PeopleIcon from "@mui/icons-material/People";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
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
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

function TabelPemilih(props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - props.daftarPemilih.length)
      : 0;

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell>NIM/NIDN</TableCell>
            <TableCell>Nama</TableCell>
            <TableCell>Dapil</TableCell>
            <TableCell>Angkatan</TableCell>
            <TableCell>Status pendaftaran</TableCell>
            <TableCell>Status pemilihan</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? props.daftarPemilih.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : props.daftarPemilih
          ).map((anggota) => (
            <TableRow key={anggota.nim}>
              <TableCell>{anggota.nim}</TableCell>
              <TableCell>{anggota.nama}</TableCell>
              <TableCell>
                {
                  props.daftarDapil.filter(
                    (dapil) => dapil.id === anggota.dapil
                  )[0].nama
                }
              </TableCell>
              <TableCell>
                {anggota.angkatan
                  ? anggota.angkatan +
                    " " +
                    props.daftarAngkatan.filter(
                      (angkatan) => angkatan.nomor === anggota.angkatan
                    )[0].nama
                  : ""}
              </TableCell>
              <TableCell>{anggota.akun ? "Sudah" : "Belum"}</TableCell>
              <TableCell>{anggota.sudah_memilih ? "Sudah" : "Belum"}</TableCell>
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
              rowsPerPageOptions={[5, 10, 20, { label: "Semua", value: -1 }]}
              labelRowsPerPage="Baris per halaman"
              colSpan={3}
              count={props.daftarPemilih.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
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
  );
}

export default function Pemilih() {
  const theme = useTheme();

  const [daftarDapil, setDaftarDapil] = useState([]);
  const [daftarAngkatan, setDaftarAngkatan] = useState([]);
  const [daftarPemilih, setDaftarPemilih] = useState([]);
  const [daftarPemilihTerfilter, setDaftarPemilihTerfilter] = useState([]);

  const [status, setStatus] = useState("");
  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  useEffect(() => {
    if (status === "") {
      setDaftarPemilihTerfilter(daftarPemilih);
    } else if (status === false) {
      setDaftarPemilihTerfilter(
        daftarPemilih.filter((anggota) => anggota.akun === null)
      );
    } else {
      setDaftarPemilihTerfilter(
        daftarPemilih.filter((anggota) => anggota.akun !== null)
      );
    }
  }, [status, daftarPemilih]);

  useEffect(() => {
    fetch(API_URL + "/dapil/")
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((daftarDapil) => {
        setDaftarDapil(daftarDapil);
      })
      .catch((error) => {
        console.error(error);
      });

    fetch(API_URL + "/angkatan/")
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((daftarAngkatan) => {
        setDaftarAngkatan(daftarAngkatan);
      })
      .catch((error) => {
        console.error(error);
      });

    fetch(API_URL + "/anggota/")
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((daftarPemilih) => {
        setDaftarPemilih(daftarPemilih);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Container component="main" maxWidth="md" sx={{ p: theme.padding }}>
      <Stack spacing={theme.padding}>
        <Stack direction="row" spacing={1} justifyContent="center">
          <PeopleIcon sx={{ fontSize: 32 }} />
          <Typography variant="h5" component="h1">
            Daftar Pemilih Tetap (DPT) Pemilu PUB 2021
          </Typography>
        </Stack>

        <FormControl fullWidth>
          <InputLabel id="label-status-pendaftaran">
            Status pendaftaran
          </InputLabel>
          <Select
            labelId="label-status-pendaftaran"
            id="status-pendaftaran"
            value={status}
            label="Status pendaftaran"
            onChange={handleChange}
          >
            <MenuItem value="">Semua</MenuItem>
            <MenuItem value={false}>Belum mendaftar</MenuItem>
            <MenuItem value={true}>Sudah mendaftar</MenuItem>
          </Select>
        </FormControl>

        {daftarDapil.length > 0 &&
        daftarAngkatan.length > 0 &&
        daftarPemilih.length > 0 ? (
          <TabelPemilih
            daftarPemilih={daftarPemilihTerfilter}
            daftarDapil={daftarDapil}
            daftarAngkatan={daftarAngkatan}
          />
        ) : (
          <Stack spacing={1}>
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={48} />
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
