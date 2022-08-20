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

export default function Kandidat() {
  const { adminToken } = useContext(AdminAuthContext);

  const [rows, setRows] = useState([]);
  const [daftarAnggota, setDaftarAnggota] = useState([]);

  const [membuat, setMembuat] = useState(false);
  const [editId, setEditId] = useState();
  const [edit, setEdit] = useState({});
  const [akanDihapus, setAkanDihapus] = useState();

  const columns = [
    { field: "palsu", headerName: "Hanya simulasi", width: 128 },
    { field: "nomor", headerName: "Nomor", width: 128 },
    {
      field: "anggota",
      headerName: "Nama",
      width: 256,
      valueFormatter: ({ value }) => {
        if (value) {
          const anggota = daftarAnggota.find(
            (anggota) => anggota.nim === value
          );
          return anggota?.nama;
        } else {
          return "Tidak ada";
        }
      },
    },
    {
      field: "foto",
      headerName: "Foto",
      width: 128,
    },
    {
      field: "warna",
      headerName: "Warna",
      width: 128,
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
              fetch(API_URL + `/admin/kandidat/${params.row.nomor}/`, {
                headers: {
                  Authorization: `Bearer ${adminToken}`,
                },
              })
                .then((response) => response.json())
                .then((json) => {
                  setEditId(json.nomor);
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
    fetch(API_URL + "/admin/kandidat/", {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })
      .then((response) => response.json())
      .then((json) => setRows(json));

    fetch(API_URL + "/admin/anggota/", {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })
      .then((response) => response.json())
      .then((json) => setDaftarAnggota(json));
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
        onClick={() => {
          setMembuat(true);
          setEdit({ nomor: rows[rows.length-1].nomor + 1 });
        }}
      >
        Buat kandidat
      </Button>
      <DataGrid
        rows={rows}
        getRowId={(row) => row.nomor}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
      />
      <Dialog open={editId || membuat} onClose={handleClose}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetch(API_URL + `/admin/kandidat/${membuat ? "" : `${editId}/`}`, {
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
                      if (row.nomor === json.nomor) {
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
          <DialogTitle>{membuat ? "Buat" : "Edit"} kandidat</DialogTitle>
          <DialogContent>
            <TextField
              type="number"
              autoFocus
              margin="dense"
              label="Nomor"
              fullWidth
              variant="outlined"
              disabled
              value={edit?.nomor}
              onChange={(e) => setEdit({ ...edit, nomor: e.target.value })}
              required
            />
            <FormControl margin="dense" fullWidth>
              <InputLabel id="anggota-select-label" required>
                Kandidat
              </InputLabel>
              <Select
                labelId="anggota-select-label"
                label="Anggota"
                value={edit?.anggota}
                onChange={(e) => setEdit({ ...edit, anggota: e.target.value })}
                required
              >
                {daftarAnggota.map((anggota) => (
                  <MenuItem value={anggota.nim}>{anggota.nama}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              label="Warna"
              fullWidth
              variant="outlined"
              value={edit?.warna}
              onChange={(e) => setEdit({ ...edit, warna: e.target.value })}
              required
            />
            <TextField
              autoFocus
              margin="dense"
              label="Visi"
              fullWidth
              variant="outlined"
              value={edit?.visi}
              onChange={(e) => setEdit({ ...edit, visi: e.target.value })}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Batal</Button>
            <Button type="submit">Simpan</Button>
          </DialogActions>
        </form>
      </Dialog>
      <KonfirmasiHapus
        keepMounted
        onClose={(hapus) => {
          if (hapus) {
            fetch(API_URL + `/admin/kandidat/${akanDihapus.nomor}/`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`,
              },
            }).then(() => {
              setRows(rows.filter((row) => row.nomor !== akanDihapus.nomor));
              setAkanDihapus();
            });
          } else {
            setAkanDihapus();
          }
        }}
        judul={
          akanDihapus &&
          `kandidat ${
            daftarAnggota.find(
              (anggota) => anggota.nim === akanDihapus?.anggota
            )?.nama
          }`
        }
      />
    </Stack>
  );
}
