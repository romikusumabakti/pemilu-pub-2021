import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import { Alert, Snackbar, ThemeProvider, useTheme } from "@mui/material";
import { useState } from "react";

export default function KonfirmasiPilih({ onClose, pilihan, ...rest }) {
  const handleCancel = () => {
    onClose(false);
  };

  const theme = useTheme();

  let p;
  let customTheme = theme;

  if (pilihan) {
    p =
      pilihan.nomor.toString().padStart(2, "0") +
      " (" +
      pilihan.anggota.nama +
      ")";
    customTheme = theme.createCustomTheme(theme, pilihan.warna);
  }

  const [openBerhasil, setOpenBerhasil] = useState(false);

  const handleOk = () => {
    onClose(true);
    setOpenBerhasil(true);
  };

  const handleCloseBerhasil = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenBerhasil(false);
  };

  return (
    <>
      <Dialog
        sx={{ "& .MuiDialog-paper": { width: "90%", maxHeight: 435 } }}
        maxWidth="xs"
        open={pilihan !== null}
        {...rest}
      >
        <DialogTitle>Pilih {p}</DialogTitle>
        <DialogContent>
          Apakah Anda yakin ingin memilih calon nomor urut {p} sebagai Ketua PUB
          baru?
        </DialogContent>
        <DialogActions sx={{ paddingInline: 24, pb: 3 }}>
          <ThemeProvider theme={customTheme}>
            <Button autoFocus sx={{ minWidth: 96 }} onClick={handleCancel}>
              Batal
            </Button>
            <Button
              variant="contained"
              sx={{ minWidth: 96 }}
              onClick={handleOk}
            >
              Pilih
            </Button>
          </ThemeProvider>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openBerhasil}
        autoHideDuration={6000}
        onClose={handleCloseBerhasil}
      >
        <Alert
          onClose={handleCloseBerhasil}
          severity="success"
          sx={{ width: "100%" }}
        >
          Berhasil memilih.
        </Alert>
      </Snackbar>
    </>
  );
}
