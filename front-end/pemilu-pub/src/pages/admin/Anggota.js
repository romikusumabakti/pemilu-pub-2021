import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { AdminAuthContext, API_URL } from "../../App";
import KonfirmasiHapus from "../../components/admin/KonfirmasiHapus";

export default function Anggota() {
  const { adminToken } = useContext(AdminAuthContext);

  const [rows, setRows] = useState([]);
  const [daftarDapil, setDaftarDapil] = useState([]);
  const [daftarAngkatan, setDaftarAngkatan] = useState([]);

  const [membuat, setMembuat] = useState(false);
  const [editId, setEditId] = useState();
  const [edit, setEdit] = useState({});
  const [akanDihapus, setAkanDihapus] = useState();

  const columns = [
    { field: "nim", headerName: "NIM/NIDN", width: 128 },
    {
      field: "nama",
      headerName: "Nama",
      width: 256,
    },
    {
      field: "dapil",
      headerName: "Dapil",
      width: 128,
      valueFormatter: ({ value }) => {
        if (value) {
          const dapil = daftarDapil.find((dapil) => dapil.id === value);
          return dapil?.nama;
        } else {
          return "Tidak ada";
        }
      },
    },
    {
      field: "angkatan",
      headerName: "Angkatan",
      width: 128,
      valueFormatter: ({ value }) => {
        if (value) {
          const angkatan = daftarAngkatan.find(
            (angkatan) => angkatan.nomor === value
          );
          return `${angkatan?.nomor} (${angkatan?.nama})`;
        } else {
          return "Tidak ada";
        }
      },
    },
    {
      flex: 1,
      align: "right",
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              fetch(API_URL + `/admin/anggota/${params.row.nim}/`, {
                headers: {
                  Authorization: `Bearer ${adminToken}`,
                },
              })
                .then((response) => response.json())
                .then((json) => {
                  setEditId(json.nim);
                  setEdit(json);
                });
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setAkanDihapus(params.row)}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetch(API_URL + "/admin/anggota/", {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })
      .then((response) => response.json())
      .then((json) => setRows(json));

    fetch(API_URL + "/admin/dapil/", {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })
      .then((response) => response.json())
      .then((json) => setDaftarDapil(json));

    fetch(API_URL + "/admin/angkatan/", {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })
      .then((response) => response.json())
      .then((json) => setDaftarAngkatan(json));
  }, [adminToken]);

  function handleClose() {
    if (membuat) {
      setMembuat(false);
    } else {
      setEdit();
      setEditId();
    }
  }

  return (
    <Stack sx={{ flex: 1 }}>
      <Button
        sx={{ alignSelf: "start", m: 2 }}
        variant="outlined"
        onClick={() => setMembuat(true)}
      >
        Buat anggota
      </Button>
      <DataGrid
        rows={rows}
        getRowId={(row) => row.nim}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
      />
      <Dialog open={editId || membuat} onClose={handleClose}>
        <DialogTitle>{membuat ? "Buat" : "Edit"} anggota</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="NIM"
            fullWidth
            variant="outlined"
            value={edit?.nim}
            onChange={(e) => setEdit({ ...edit, nim: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Nama"
            fullWidth
            variant="outlined"
            value={edit?.nama}
            onChange={(e) => setEdit({ ...edit, nama: e.target.value })}
          />
          <FormControl margin="dense" fullWidth>
            <InputLabel id="dapil-select-label">Dapil</InputLabel>
            <Select
              labelId="dapil-select-label"
              label="Dapil"
              value={edit?.dapil}
              onChange={(e) => setEdit({ ...edit, dapil: e.target.value })}
            >
              {daftarDapil.map((dapil) => (
                <MenuItem key={dapil.id} value={dapil.id}>
                  {dapil.nama}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl margin="dense" fullWidth>
            <InputLabel id="angkatan-select-label">Angkatan</InputLabel>
            <Select
              labelId="angkatan-select-label"
              label="Angkatan"
              value={edit?.angkatan}
              onChange={(e) => setEdit({ ...edit, angkatan: e.target.value })}
            >
              {daftarAngkatan.map((angkatan) => (
                <MenuItem key={angkatan.nomor} value={angkatan.nomor}>
                  {angkatan.nomor} ({angkatan.nama})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button
            onClick={() => {
              fetch(API_URL + `/admin/anggota/${membuat ? "" : `${editId}/`}`, {
                method: membuat ? "POST" : "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify(edit),
              })
                .then((response) => response.json())
                .then((json) => {
                  if (membuat) {
                    setRows([...rows, json]);
                    setMembuat(false);
                  } else {
                    setRows(
                      rows.map((row) => {
                        if (row.nim === json.nim) {
                          return json;
                        } else {
                          return row;
                        }
                      })
                    );
                    handleClose();
                  }
                });
            }}
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
      <KonfirmasiHapus
        keepMounted
        onClose={(hapus) => {
          if (hapus) {
            fetch(API_URL + `/admin/anggota/${akanDihapus.nim}/`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`,
              },
            }).then(() => {
              setRows(rows.filter((row) => row.nim !== akanDihapus.nim));
              setAkanDihapus();
            });
          } else {
            setAkanDihapus();
          }
        }}
        judul={akanDihapus?.nama}
      />
    </Stack>
  );
}
