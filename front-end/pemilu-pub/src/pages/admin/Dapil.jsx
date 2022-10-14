import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { AdminAuthContext, API_URL } from "../../App";
import KonfirmasiHapus from "../../components/admin/KonfirmasiHapus";

export default function Dapil() {
  const { adminToken } = useContext(AdminAuthContext);

  const [rows, setRows] = useState([]);

  const [membuat, setMembuat] = useState(false);
  const [editId, setEditId] = useState();
  const [edit, setEdit] = useState({});
  const [akanDihapus, setAkanDihapus] = useState();

  const columns = [
    { field: "id", headerName: "ID", width: 128 },
    { field: "nama", headerName: "Nama", width: 256 },
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
              fetch(API_URL + `/admin/dapil/${params.row.id}/`, {
                headers: {
                  Authorization: `Bearer ${adminToken}`,
                },
              })
                .then((response) => response.json())
                .then((json) => {
                  setEditId(json.id);
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
    fetch(API_URL + "/admin/dapil/", {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })
      .then((response) => response.json())
      .then((json) => setRows(json));
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
        Buat dapil
      </Button>
      <DataGrid
        rows={rows}
        getRowId={(row) => row.id}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
      />
      <Dialog open={editId || membuat} onClose={handleClose}>
        <DialogTitle>{membuat ? "Buat" : "Edit"} dapil</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nama"
            fullWidth
            variant="outlined"
            value={edit?.nama}
            onChange={(e) => setEdit({ ...edit, nama: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button
            onClick={() => {
              fetch(API_URL + `/admin/dapil/${membuat ? "" : `${editId}/`}`, {
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
                        if (row.id === json.id) {
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
            fetch(API_URL + `/admin/dapil/${akanDihapus.id}/`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`,
              },
            }).then(() => {
              setRows(rows.filter((row) => row.id !== akanDihapus.id));
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
