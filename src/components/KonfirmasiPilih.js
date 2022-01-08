import * as React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { Alert, Snackbar, ThemeProvider, useTheme } from '@material-ui/core';

export default function KonfirmasiPilih(props) {

    const handleCancel = () => {
        props.onClose(false);
    };

    const theme = useTheme();

    let pilihan;
    let customTheme = theme;

    if (props.pilihan) {
        pilihan = props.pilihan.nomor.toString().padStart(2, '0') + ' (' + props.pilihan.mahasiswa.nama + ')';
        customTheme = theme.createCustomTheme(theme, props.pilihan.warna);
    }

    const [openBerhasil, setOpenBerhasil] = React.useState(false);

    const handleOk = () => {
        props.onClose(true);
        setOpenBerhasil(true);
    };

    const handleCloseBerhasil = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenBerhasil(false);
    };

    return (
        <>
            <Dialog
                sx={{ '& .MuiDialog-paper': { width: '90%', maxHeight: 435 } }}
                maxWidth="xs"
                open={props.pilihan !== null}
                {...props}
            >
                <DialogTitle>Pilih {pilihan}</DialogTitle>
                <DialogContent>
                    Apakah Anda yakin ingin memilih calon nomor urut {pilihan} sebagai Ketua PUB baru?
                </DialogContent>
                <DialogActions sx={{ paddingInline: 24, pb: 3 }}>
                    <ThemeProvider theme={customTheme}>
                        <Button autoFocus sx={{ minWidth: 96 }} onClick={handleCancel}>Batal</Button>
                        <Button variant="contained" sx={{ minWidth: 96 }} onClick={handleOk}>Pilih</Button>
                    </ThemeProvider>
                </DialogActions>
            </Dialog>
            <Snackbar open={openBerhasil} autoHideDuration={6000} onClose={handleCloseBerhasil}>
                <Alert onClose={handleCloseBerhasil} severity="success" sx={{ width: '100%' }}>
                    Berhasil memilih.
                </Alert>
            </Snackbar>
        </>
    );
}