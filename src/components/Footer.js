import * as React from 'react';
import { Link, Typography } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { Stack } from '@material-ui/core';
import { useTheme } from '@emotion/react';

function Copyright() {
    return (
        <Typography variant="subtitle2" align="center">
            {'© '}
            {new Date().getFullYear()}
            {' '}
            <Link component={RouterLink} to="/">
                Pemberdayaan Umat Berkelanjutan
            </Link>
        </Typography>
    );
}

function Footer(props) {
    return (
        <Stack align="center" spacing={1.5} p={3} component="footer" {...props}>
            <img src={'/gambar/logo_kabinet/kjn_logo' + (useTheme().palette.mode === 'light' ? '' : '_dark') + '.svg'} alt="Logo Kabinet Jarvis-Neophyte 2021/2022" height={96} />
            <Typography component="p" fontStyle="italic">
                Berani melakukan perubahan, untuk PUB yang lebih baik.
            </Typography>
            <Copyright />
        </Stack>
    );
}

export default Footer;