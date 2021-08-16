import * as React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { ThemeProvider, useTheme } from '@material-ui/core';

export default function KonfirmasiPilih(props) {

    const handleCancel = () => {
        props.onClose();
    };

    const handleOk = () => {
        props.onClose(props.terpilih);
    };

    const theme = useTheme();

    let terpilih;
    let customTheme = theme;

    if (props.terpilih) {
        terpilih = props.terpilih.nomor.toString().padStart(2, '0') + ' (' + props.terpilih.mahasiswa.nama + ')';
        customTheme = theme.createCustomTheme(theme, props.terpilih.warna);
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '90%', maxHeight: 435 } }}
            maxWidth="xs"
            open={props.terpilih !== null}
            {...props}
        >
            <DialogTitle>Pilih {terpilih}</DialogTitle>
            <DialogContent>
                Apakah Anda yakin ingin memilih calon nomor urut {terpilih} sebagai Ketua PUB baru?
            </DialogContent>
            <DialogActions sx={{ paddingInline: 24, pb: 3 }}>
                <ThemeProvider theme={customTheme}>
                    <Button autoFocus sx={{ minWidth: 96 }} onClick={handleCancel}>Batal</Button>
                    <Button variant="contained" sx={{ minWidth: 96 }} onClick={handleOk}>Pilih</Button>
                </ThemeProvider>
            </DialogActions>
        </Dialog>
    );
}