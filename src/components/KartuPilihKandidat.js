import * as React from 'react';
import { Button, Card, CardActions, CardContent, Stack, Typography } from '@material-ui/core';
import { CardHeader, colors, ThemeProvider, useTheme } from '@material-ui/core';
import FotoKandidat from './FotoKandidat';

export default function KartuPilihKandidat(props) {
    const customTheme = useTheme().createCustomTheme(useTheme(), props.warna);
    return (
        <Card sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, textAlign: 'center' }}>
            <CardHeader title={props.nomor.toString().padStart(2, '0')} titleTypographyProps={{ variant: 'h4', fontWeight: 'bold' }} sx={{ color: colors[props.warna][500] }} />
            <FotoKandidat nama={props.foto} warna={props.warna} width={{ xs: '25%', sm: '100%' }} />
            <Stack flexGrow={1}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', pb: { xs: 0, sm: 1 } }}>
                    <Typography fontWeight="bold" fontSize={{ xs: 16, sm: 20 }} component="h2">
                        {props.mahasiswa.nama}
                    </Typography>
                    <Typography color="text.secondary">
                        Calon Ketua/Keamanan
                    </Typography>
                </CardContent>
                <CardActions sx={{ alignSelf: 'center', pr: { xs: 2, sm: 0 }, pb: { xs: 2, sm: 3 } }}>
                    <ThemeProvider theme={customTheme}>
                        <Button onClick={props.onClick} variant="contained" sx={{ minWidth: 128 }}>Pilih</Button>
                    </ThemeProvider>
                </CardActions>
            </Stack>
        </Card>
    )
}