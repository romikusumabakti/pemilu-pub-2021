import * as React from 'react';
import CardMedia from '@material-ui/core/CardMedia';
import { colors } from '@material-ui/core';
import pubLogo from '../assets/img/pub-logo-background.svg';

export default function FotoKandidat(props) {
    return (
        <CardMedia
            component="img"
            sx={{
                backgroundColor: colors[props.warna][100],
                backgroundImage: `url(${pubLogo})`,
                backgroundRepeat: 'no-repeat',
                width: props.width,
            }}
            src={'/gambar/foto_kandidat/' + props.nama}
        />
    );
}
