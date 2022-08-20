import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";

export default function KonfirmasiHapus({ judul, onClose, ...rest }) {
  const [openBerhasil, setOpenBerhasil] = useState(false);

  const handleHapus = () => {
    onClose(true);
    setOpenBerhasil(true);
  };

  return (
    <>
      <Dialog
        sx={{ "& .MuiDialog-paper": { width: "90%", maxHeight: 435 } }}
        maxWidth="xs"
        open={judul}
        {...rest}
      >
        <DialogTitle>Hapus {judul}</DialogTitle>
        <DialogContent>
          Apakah Anda yakin ingin menghapus {judul}?
        </DialogContent>
        <DialogActions sx={{ paddingInline: 24, pb: 3 }}>
          <Button
            autoFocus
            sx={{ minWidth: 96 }}
            onClick={() => onClose(false)}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            sx={{ minWidth: 96 }}
            onClick={handleHapus}
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openBerhasil}
        autoHideDuration={6000}
        onClose={() => setOpenBerhasil(false)}
      >
        <Alert
          onClose={() => setOpenBerhasil(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Berhasil menghapus.
        </Alert>
      </Snackbar>
    </>
  );
}
